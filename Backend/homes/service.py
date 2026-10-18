from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.response import Response
from django.db.models import Q
from .models import BlockedUser, EmailUs, Follow, User


def has_blocked_chat_participant(user, participant_ids):
    return BlockedUser.objects.filter(
        Q(blocker=user, blocked_id__in=participant_ids)
        | Q(blocked=user, blocker_id__in=participant_ids)
    ).exists()

def login_user(username_or_email, password):


    if '@' in username_or_email:
        try:
            user = User.objects.get(email=username_or_email)
        except User.DoesNotExist:
            return None
    else:
        try:
            user = User.objects.get(username=username_or_email)
        except User.DoesNotExist:
            return None
    # The above block handles fetching the user based on email or username

    if not user.check_password(password):
        return None

    refresh = RefreshToken.for_user(user)
    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
        'user_id': user.id
    }

def delete_follow_response(user,following):
    try:
        follow_instance = Follow.objects.get(follower=user, following=following)
        follow_instance.delete()
        return Response({"success": True})
    except Follow.DoesNotExist:
        return Response({"error": "Follow relationship does not exist."})
    except Exception as e:
        return Response({"error": "Unable to unfollow, please try again later."})

