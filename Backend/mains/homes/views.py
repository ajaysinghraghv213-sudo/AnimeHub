import logging

from django.shortcuts import get_object_or_404, render
from django.http import Http404
from django.utils import timezone

from .service import has_blocked_chat_participant, login_user
from .models import *
from .serializers import *
from rest_framework.views import  APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework import generics,mixins
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.exceptions import TokenError
from rest_framework_simplejwt.tokens import RefreshToken
from .tasks import send_otp_email, send_email_us, send_get_new_updates
from rest_framework import status
from django.core.cache import cache
from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer
from .service import delete_follow_response
from rest_framework.throttling import ScopedRateThrottle
from django.core import signing
from django.urls import reverse
from django.core.validators import validate_email
from django.core.exceptions import ValidationError as DjangoValidationError

UPDATES_CONFIRM_SALT = 'get-new-updates-confirm'
UPDATES_CONFIRM_MAX_AGE = 60 * 60 * 24
logger = logging.getLogger(__name__)
# Create your views here.

class RegisterView(APIView):
    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            pending_registration = serializer.save()
            otp = pending_registration.otp
            send_otp_email.delay(
                subject="Your OTP Code",
                message=f"Your OTP code is {otp}",
                from_email="ajaysinghraghv213@gmail.com",
                recipient_list=[pending_registration.email]
            )
            return Response({"message": "OTP sent successfully.", "otp": pending_registration.otp}, status=status.HTTP_201_CREATED)
        return Response({'error': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

class VerifyOTPView(APIView):
    def post(self, request):
        email = request.data.get('email')
        otp = request.data.get('otp')
        try:
            pending_registration = PendingRegistration.objects.get(email=email, otp=otp)

            if User.objects.filter(email=email).exists():
                return Response({"error": "User with this email already exists."}, status=status.HTTP_400_BAD_REQUEST)
            else:
                user = User.objects.create(
                username=pending_registration.username,
                email=pending_registration.email,
                password=pending_registration.password
            )
                pending_registration.delete()
                return Response({"message": "User registered successfully."}, status=status.HTTP_201_CREATED)
        except PendingRegistration.DoesNotExist:
            return Response({"error": "Invalid OTP or email."}, status=status.HTTP_400_BAD_REQUEST)




class LoginView(APIView):
    def post(self, request):
        username_or_email = request.data.get('username_or_email')

        password = request.data.get('password')

        if not username_or_email or not password:
            return Response({"error": "Username/email and password are required."}, status=status.HTTP_400_BAD_REQUEST)


        user_data = login_user(username_or_email, password)
        if user_data is None:
            print("Invalid login attempt for username_or_email:", username_or_email)
            return Response({"error": "Invalid credentials."}, status=status.HTTP_400_BAD_REQUEST)
        return Response(user_data, status=status.HTTP_200_OK)


class CategoryListView(generics.ListAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer

    def list(self, request, *args, **kwargs):
        try:
            queryset = self.get_queryset()
            cached_data = cache.get('categories')
            if cached_data:
                return Response(cached_data)
            serializer = self.get_serializer(queryset, many=True)
            cache.set('categories', serializer.data, timeout=60*3)  # Cache for 180 seconds
            return Response(serializer.data)
        except Exception as e:
            logger.exception("Unable to fetch categories")
            return Response({"error": "Unable to fetch categories."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        

class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        refresh_token = request.data.get("refresh")
        if not refresh_token:
            return Response(
                {"error": "Refresh token is required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            RefreshToken(refresh_token).blacklist()
        except TokenError:
            return Response(
                {"error": "Invalid or expired refresh token."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        return Response({"message": "Logged out successfully."}, status=status.HTTP_200_OK)


class CommentCreateView(mixins.CreateModelMixin, mixins.ListModelMixin, generics.GenericAPIView):
    serializer_class = CommentSerializer
    permission_classes = [IsAuthenticated]
   

    def get_queryset(self):
        post_id = self.kwargs.get('post_id')
        if not post_id:
            raise serializers.ValidationError({"error": "Post ID is required."})
        post = get_object_or_404(Post, id=post_id)
        return Comment.objects.filter(post=post)

    def post(self, request, *args, **kwargs):
        return self.create(request, *args, **kwargs)

    def perform_create(self, serializer):
        post = get_object_or_404(Post, id=self.kwargs['post_id'])
        serializer.save(author=self.request.user, post=post)

    def get(self, request, *args, **kwargs):

        try:
            queryset = self.get_queryset()
            serializer = self.get_serializer(queryset, many=True)
            post = get_object_or_404(Post, id=self.kwargs['post_id'])
            total_comments = Comment.objects.filter(post=post).count() + Reply.objects.filter(comment__post=post).count()
           
            return Response({"total_comments": total_comments, "comments": serializer.data})
        except Exception as e:
            return Response({"error": "Sign up to see the comments."}, status=status.HTTP_400_BAD_REQUEST)


class LikeCreateView(APIView):
    def post(self, request, *args, **kwargs):
        user = self.request.user
        post_id = self.kwargs.get("post_id")
        if not post_id:
            return Response({"error": "Post ID is required."}, status=status.HTTP_400_BAD_REQUEST)
        post = get_object_or_404(Post, id=post_id)
        like, created = Like.objects.get_or_create(user=user, post=post)
        if not created:
            return Response({"error": "You have already liked this post."}, status=status.HTTP_400_BAD_REQUEST)
        serializer = LikeSerializer(like)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

class UnlikeView(APIView):
    def post(self, request, *args, **kwargs):
        user = self.request.user
        post_id = self.kwargs.get("post_id")
        if not post_id:
            return Response({"error": "Post ID is required."}, status=status.HTTP_400_BAD_REQUEST)
        post = get_object_or_404(Post, id=post_id)
        try:
            like = Like.objects.get(user=user, post=post)
            like.delete()
            return Response({"message": "Post unliked successfully."}, status=status.HTTP_200_OK)
        except Like.DoesNotExist:
            return Response({"error": "You have not liked this post."}, status=status.HTTP_400_BAD_REQUEST)

class RemoveComment(APIView):
         def post(self,request,*args,**kwargs):

            try:
                user = self.request.user
                comment_id = self.kwargs.get('comment_id')

                if not comment_id:
                    return Response({'error':'comment ID is required.'}, status=status.HTTP_400_BAD_REQUEST)

                comment = get_object_or_404(Comment,id=comment_id)
                
                if comment.author != user:
                    return Response({'error': 'You are not authorized to delete this comment.'}, status=status.HTTP_403_FORBIDDEN)

                comment.delete()
                return Response({'message': 'Comment deleted successfully.'}, status=status.HTTP_200_OK)
            except Exception as e:
                return Response({"error": "Unable to delete comment, please try again later."}, status=status.HTTP_400_BAD_REQUEST)


class CreatePostView(APIView):
    def post(self, request, *args, **kwargs):
        user = self.request.user

        if not request.data.get('title') or not request.data.get('content'):
            return Response({"error": "Title and content are required."}, status=status.HTTP_400_BAD_REQUEST)
        if not request.data.get('category'):
            return Response({"error": "Category is required."}, status=status.HTTP_400_BAD_REQUEST)
        if user.is_anonymous:
            return Response({"error": "Authentication is required."}, status=status.HTTP_401_UNAUTHORIZED)
        
        serializer = ArticleSerializer(data=request.data)
        
        if serializer.is_valid():
            post = serializer.save(author=user)
            RecentPost.objects.create(post=post,user=user)
            print(post)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



class AllPostView(APIView):
    def get(self, request, *args, **kwargs):
        try :
            posts = Post.objects.all()
            serializer = ArticleSerializer(posts, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            logger.exception("Unable to fetch posts")
            return Response({"error": "Unable to fetch posts."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class ProfileView(APIView):
    def get(self, request, *args, **kwargs):
        try:
            user = self.request.user
            print(user)

            if user.is_anonymous:
                return Response({"error": "Authentication is required."}, status=status.HTTP_401_UNAUTHORIZED)
            cached_data = cache.get(f'profile_{user.id}')
            if cached_data:
                return Response(cached_data)
            
            serializer = ProfileSerializer(user)
            cache.set(f'profile_{user.id}', serializer.data, timeout=60*3)  # Cache for 180 seconds
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


class RecentPostView(APIView):
    def get(self, request, *args, **kwargs):
        try:
            recent_posts = RecentPost.objects.all().order_by('-created_at')[:3]
            serializer = RecentPostSerializer(recent_posts, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            logger.exception("Unable to fetch recent posts")
            return Response({"error": "Unable to fetch recent posts."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class FeaturedPostView(APIView):
    def get(self, request, *args, **kwargs):
        try:
            featured_posts = Post.objects.filter(is_featured=True)
            serializer = FeaturedPostSerializer(featured_posts, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            logger.exception("Unable to fetch featured posts")
            return Response({"error": "Unable to fetch featured posts."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class HomeCategoryView(APIView):
    def get(self, request, *args, **kwargs):
        try:
            cached_data = cache.get('categories4')
            if cached_data:
                return Response(cached_data)

            categories = Category.objects.prefetch_related('posts').order_by('name')[:4]
            serializer = CategorySerializer(categories, many=True)
            cache.set('categories4', serializer.data, timeout=60*3)  # Cache for 180 seconds
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            logger.exception("Unable to fetch home categories")
            return Response({"error": "Unable to fetch categories."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class LikedPostView(APIView):
    def get(self, request, *args, **kwargs):
        try:
            user = self.request.user
            if user.is_anonymous:
                return Response({"error": "Authentication is required."}, status=status.HTTP_401_UNAUTHORIZED)
            
            liked_posts = Like.objects.filter(user=user).order_by('-created_at')
            cached_data = cache.get(f'liked_posts_{user.id}')
            if cached_data:
                return Response(cached_data)
            
            serializer = LikedPostSerializer(liked_posts, many=True)
            cache.set(f'liked_posts_{user.id}', serializer.data, timeout=60*3)  # Cache for 180 seconds
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": "Unable to fetch liked posts, please try again later."}, status=status.HTTP_400_BAD_REQUEST)


def create_follow_response(follower, following):
    if follower == following:
        return Response({"error": "You cannot follow yourself."}, status=status.HTTP_400_BAD_REQUEST)

    follow, created = Follow.objects.get_or_create(follower=follower, following=following)
    if not created:
        return Response({"message": "You are already following this user."}, status=status.HTTP_400_BAD_REQUEST)
    serializer = FollowSerializer(follow)
    response_status = status.HTTP_201_CREATED if created else status.HTTP_200_OK
    return Response(serializer.data, status=response_status)


class FollowView(APIView):
    def get(self, request, *args, **kwargs):
        try:
            user = self.request.user
            if user.is_anonymous:
                return Response({"error": "Authentication is required."}, status=status.HTTP_401_UNAUTHORIZED)
            
            following = Follow.objects.filter(follower=user).order_by('-created_at')
            print(f"Following: {following}")
            follower = Follow.objects.filter(following=user).order_by('-created_at')
            print(f"Follower: {follower}")
            serializer = FollowSerializer(following, many=True)
            follower_serializer = FollowSerializer(follower, many=True)
            return Response({
                "following": serializer.data,
                "follower": follower_serializer.data
            }, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": "Unable to fetch following list, please try again later."}, status=status.HTTP_400_BAD_REQUEST)

    def post(self, request, *args, **kwargs):
        user = request.user
        if user.is_anonymous:
            return Response({"error": "Authentication is required."}, status=status.HTTP_401_UNAUTHORIZED)

        following_id = request.data.get("following")
        if isinstance(following_id, dict):
            following_id = following_id.get("id")
        if not following_id:
            return Response({"error": "A user ID to follow is required."}, status=status.HTTP_400_BAD_REQUEST)
        try:
            following = User.objects.get(id=following_id)
        except (User.DoesNotExist, ValueError, TypeError):
            return Response({"error": "User to follow was not found."}, status=status.HTTP_404_NOT_FOUND)

        return create_follow_response(user, following)



class UserFollowView(APIView):
    def get(self, request, user_id, *args, **kwargs):
        try:
            user = User.objects.get(id=user_id)
            following = Follow.objects.filter(follower=user).order_by('-created_at')
            followers = Follow.objects.filter(following=user).order_by('-created_at')
            return Response({
                "following": FollowSerializer(following, many=True).data,
                "follower": FollowSerializer(followers, many=True).data,
            }, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            return Response({"error": "Profile not found."}, status=status.HTTP_404_NOT_FOUND)
        except Exception:
            return Response({"error": "Unable to fetch follow lists, please try again later."}, status=status.HTTP_400_BAD_REQUEST)
    def post(self, request, user_id, *args, **kwargs):
        user = request.user
        if user.is_anonymous:
            return Response({"error": "Authentication is required."}, status=status.HTTP_401_UNAUTHORIZED)

        try:
            following = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return Response({"error": "User to follow was not found."}, status=status.HTTP_404_NOT_FOUND)

        return create_follow_response(user, following)

class ProfileDetailView(APIView):
    def get(self,request,*args,**kwargs):
        try:
            user_id = self.kwargs['user_id']
            user = User.objects.get(id=user_id)
            cached_data = cache.get(f'profile_{user.id}')
            if cached_data:
                return Response(cached_data)
            serializer = ProfileSerializer(user)
            cache.set(f'profile_{user.id}', serializer.data, timeout=60*3)  # Cache for 180 seconds
            return Response(serializer.data, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            return Response({"error": "Profile not found."}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": "Unable to fetch profile, please try again later."}, status=status.HTTP_400_BAD_REQUEST)



class ProfileUpdateView(APIView):
    def _update(self, request, partial):
        user = request.user
        if user.is_anonymous:
            return Response({"error": "Authentication is required."}, status=status.HTTP_401_UNAUTHORIZED)

        try:
            serializer = ProfileSerializer(user, data=request.data, partial=partial)
            if serializer.is_valid():
                print(serializer.validated_data)
                serializer.save()
                cache.delete(f'profile_{user.id}')
                cache.set(f'profile_{user.id}', serializer.data, timeout=60*3)  # Cache for 180 seconds
                print('username',request.user.username)
                return Response(serializer.data, status=status.HTTP_200_OK)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"error": "Unable to update profile, please try again later."}, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, *args, **kwargs):
        return self._update(request, partial=False)

    def patch(self, request, *args, **kwargs):
        return self._update(request, partial=True)





class UnfollowView(APIView):
    def post(self, request,user_id, *args, **kwargs):
        user = request.user
        if user.is_anonymous:
            return Response({"error": "Authentication is required."}, status=status.HTTP_401_UNAUTHORIZED)
        try:
            following = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return Response({"error": "User to unfollow was not found."}, status=status.HTTP_404_NOT_FOUND)

        return delete_follow_response(user, following)


class SelfPostView(APIView):
    def get(self, request, *args, **kwargs):
        user = request.user
        if user.is_anonymous:
            return Response({"error": "Authentication is required."}, status=status.HTTP_401_UNAUTHORIZED)

        try:
            posts = Post.objects.filter(author=user) 
            if not posts:
                return Response({"error": "No posts found."}, status=status.HTTP_404_NOT_FOUND)
            
            serializer = ArticleSerializer(posts, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": "Unable to fetch posts, please try again later."}, status=status.HTTP_400_BAD_REQUEST)


class DeletePostView(APIView):
    def delete(self, request, post_id, *args, **kwargs):
        user = request.user
        if user.is_anonymous:
            return Response({"error": "Authentication is required."}, status=status.HTTP_401_UNAUTHORIZED)

        try:
            post = Post.objects.get(id=post_id, author=user)
        except Post.DoesNotExist:
            return Response({"error": "Post not found."}, status=status.HTTP_404_NOT_FOUND)

        post.delete()
        return Response({"message": "Post deleted successfully."}, status=status.HTTP_200_OK)

class RelatedPostsView(APIView):
    def get(self, request, post_id, *args, **kwargs):
        try:
            post = Post.objects.get(id=post_id)
        except Post.DoesNotExist:
            return Response({"error": "Post not found."}, status=status.HTTP_404_NOT_FOUND)

        related_posts = Post.objects.filter(category=post.category).exclude(id=post.id).order_by('-created_at')[:4]
      
        
        if not related_posts:
            return Response({"error": "No related posts found."}, status=status.HTTP_404_NOT_FOUND)

        serializer = ArticleSerializer(related_posts, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
# this is for comment reply not chat reply

class ReplyView(APIView):
    def post(self,request, comment_id,*args,**kwargs):
        user=request.user
        if user.is_anonymous:
            return Response({'error': 'Authentication is required.'}, status=status.HTTP_401_UNAUTHORIZED)

        try:
            comment =  Comment.objects.get(id=comment_id)
        except Comment.DoesNotExist:
            return Response({'error': 'Comment not found.'}, status=status.HTTP_404_NOT_FOUND)

        content = request.data.get('content')
        if not content:
            return Response({'error': 'Content is required.'}, status=status.HTTP_400_BAD_REQUEST)

        reply = Reply.objects.create(comment=comment, author=user, content=content)
        serializer = ReplySerializer(reply)
        return Response(serializer.data, status=status.HTTP_201_CREATED)



class MessageView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, room_id):
        chat = get_object_or_404(Chat, room_id=room_id, participants=request.user)
        messages = chat.messages.select_related('author').order_by('created_at')
        deleted = DeletedChats.objects.filter(chat=chat, user=request.user).first()
        if deleted:
            messages = messages.filter(created_at__gt=deleted.created_at)
        return Response(MessageSerializer(messages, many=True).data)

    def post(self, request, room_id, *args, **kwargs):
        user = request.user
        chat = get_object_or_404(Chat, room_id=room_id, participants=user)

        content = request.data.get('content')
        if not content:
            return Response({'error': 'Content is required.'}, status=status.HTTP_400_BAD_REQUEST)
        participant_ids = chat.participants.exclude(pk=user.pk).values_list('pk', flat=True)
        if has_blocked_chat_participant(user, participant_ids):
            return Response({'error': 'Messaging is unavailable because one user has blocked the other.'}, status=status.HTTP_403_FORBIDDEN)

        message = Message.objects.create(chat=chat, author=user, content=content)
        async_to_sync(get_channel_layer().group_send)(
            f"chat_{chat.room_id}",
            {
                "type": "chat_message",
                "id": message.id,
                "message": message.content,
                "author_id": user.id,
                "author": user.username,
                "created_at": message.created_at.isoformat(),
                "is_seen": message.is_seen,
            },
        )
        return Response(MessageSerializer(message).data, status=status.HTTP_201_CREATED)

    def delete(self, request, room_id, *args, **kwargs):
        user = request.user
        message_id = request.data.get('message_id')
        
        if not message_id:
             try:
              chat = get_object_or_404(Chat, room_id=room_id, participants=user)
             except Http404:
              return Response({'error': 'Chat not found.'}, status=status.HTTP_404_NOT_FOUND) 
      
             DeletedChats.objects.update_or_create(chat=chat, user=user, defaults={'created_at': timezone.now()})
             async_to_sync(get_channel_layer().group_send)(
            f"chat_{chat.room_id}",
            {
                "type": "chat_deleted",
                "room_id": chat.room_id,
            },
        )
             return Response(status=status.HTTP_204_NO_CONTENT)
        if message_id:
            try:
                message = get_object_or_404(Message, pk=message_id, chat__room_id=room_id, chat__participants=user)
                message.delete()
                async_to_sync(get_channel_layer().group_send)(
                    f"chat_{room_id}",
                    {
                        "type": "message_deleted",
                        "room_id": room_id,
                        "message_id": message_id
                    },
                )
                return Response({'success': 'Message deleted.'}, status=status.HTTP_200_OK)
            except Http404:
                return Response({'error': 'Message not found.'}, status=status.HTTP_404_NOT_FOUND)

class StartChatView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, user_id):
        other = get_object_or_404(User, id=user_id)
        if other == request.user:
            return Response({'error': 'Cannot chat with yourself.'}, status=status.HTTP_400_BAD_REQUEST)
        if has_blocked_chat_participant(request.user, [other.pk]):
            return Response({'error': 'Messaging is unavailable because one user has blocked the other.'}, status=status.HTTP_403_FORBIDDEN)

        a, b = sorted([request.user.id, other.id])
        chat, created = Chat.objects.get_or_create(room_id=f"{a}_{b}")
        if created:
            chat.participants.add(request.user, other)
        return Response(
            ChatSerializer(chat).data,
            status=status.HTTP_201_CREATED if created else status.HTTP_200_OK,
        )


class ChatListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        chats = request.user.chats.prefetch_related('participants').order_by('-created_at')
        return Response(ChatSerializer(chats, many=True).data)


class ChatDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, room_id):
        chat = get_object_or_404(Chat, room_id=room_id, participants=request.user)
        return Response(ChatSerializer(chat).data)      

class EmailUsView(APIView):
    throttle_classes = [ScopedRateThrottle]
    throttle_scope = 'contact_form'

    def post(self, request):
        name = request.data.get('name')
        email = request.data.get('email')
        send_to = request.data.get('send_to', 'ajaysinghraghv213@gmail.com')
        subject = request.data.get('subject')
        message = request.data.get('message')

        if not all([name, email, subject, message]):
            return Response({'error': 'All fields are required.'}, status=status.HTTP_400_BAD_REQUEST)

        result =  send_email_us.delay(name, email, send_to, subject, message)
        if result:
            return Response({'success': 'Email sent successfully.'}, status=status.HTTP_200_OK)
        
        else:
            return Response({'error': 'Unable to send email, please try again later.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class GetNewUpdatesView(APIView):
    throttle_classes = [ScopedRateThrottle]
    throttle_scope = 'contact_form'

    def post(self, request):
        email = request.data.get('email')

        if not email:
            return Response({'error': 'Email is required.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            validate_email(email)
        except DjangoValidationError:
            return Response({'error': 'Enter a valid email address.'}, status=status.HTTP_400_BAD_REQUEST)

        if GetNewUpdates.objects.filter(email=email).exists():
            return Response({'success': 'This email is already subscribed.'}, status=status.HTTP_200_OK)

        token = signing.dumps(email,salt=UPDATES_CONFIRM_SALT)
        confirm_url = request.build_absolute_uri(reverse('get-new-updates-confirm', args=[token]))

        result = send_get_new_updates.delay(
            email,
            'Confirm your subscription',
            f'Click the link below to confirm your subscription to updates and features. '
            f'If you did not request this, ignore this email and nothing will be saved.\n\n{confirm_url}',
            'ajaysinghraghv213@gmail.com',
        )
        if result:
            return Response({'success': 'Confirmation email sent. Please confirm to complete the subscription.'}, status=status.HTTP_200_OK)
        else:
            return Response({'error': 'Unable to subscribe, please try again later.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class GetNewUpdatesConfirmView(APIView):
    def get(self, request, token):
        try:
            email = signing.loads(token, salt=UPDATES_CONFIRM_SALT, max_age=UPDATES_CONFIRM_MAX_AGE)
        except signing.BadSignature:
            return Response({'error': 'Invalid or expired confirmation link.'}, status=status.HTTP_400_BAD_REQUEST)

        GetNewUpdates.objects.get_or_create(email=email)
        return Response({'success': 'Subscription confirmed.'}, status=status.HTTP_200_OK)


class BlockedUserView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        blocked_users = BlockedUser.objects.filter(
            blocker=request.user
        ).select_related("blocked", "blocker")
        serializer = BlockedUserSerializer(blocked_users, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        blocker = request.user
        blocked_id = request.data.get('blocked_id')

        if not blocked_id:
            return Response({'error': 'Blocked user ID is required.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            blocked = User.objects.get(id=blocked_id)
        except User.DoesNotExist:
            return Response({'error': 'User not found.'}, status=status.HTTP_404_NOT_FOUND)

        if BlockedUser.objects.filter(blocker=blocker, blocked=blocked).exists():
            return Response({'success': 'User is already blocked.'}, status=status.HTTP_200_OK)

        BlockedUser.objects.create(blocker=blocker, blocked=blocked)
        return Response({'success': 'User blocked successfully.'}, status=status.HTTP_200_OK)

    def delete(self, request):
        blocker = request.user
        blocked_id = request.data.get('blocked_id')

        if not blocked_id:
            return Response({'error': 'Blocked user ID is required.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            blocked = User.objects.get(id=blocked_id)
        except User.DoesNotExist:
            return Response({'error': 'User not found.'}, status=status.HTTP_404_NOT_FOUND)

        try:
            blocked_user = BlockedUser.objects.get(blocker=blocker, blocked=blocked)
            blocked_user.delete()
            return Response({'success': 'User unblocked successfully.'}, status=status.HTTP_200_OK)
        except BlockedUser.DoesNotExist:
            return Response({'error': 'User is not blocked.'}, status=status.HTTP_400_BAD_REQUEST)