from os import read

from rest_framework import serializers
from .models import *
from django.contrib.auth.hashers import make_password
import random

class UserSerializer(serializers.ModelSerializer):
    confirm_password = serializers.CharField(write_only=True)
    class Meta:
        model = User
        fields = ['id', 'username', 'email','password','confirm_password']
    def create(self,validated_data):
        password = validated_data.pop('password')
        confirm_password = validated_data.pop('confirm_password')
        if not password or not confirm_password or not validated_data.get('username') or not validated_data.get('email'):
            raise serializers.ValidationError({"error": "fields cannot be empty."})
        if password != confirm_password:
            raise serializers.ValidationError({"password": "Passwords do not match."})
        email = validated_data.get('email')
        if PendingRegistration.objects.filter(email=email).exists():
            PendingRegistration.objects.filter(email=email).delete()
        username = validated_data.get('username')
        if PendingRegistration.objects.filter(username=username).exists():
            PendingRegistration.objects.filter(username=username).delete()
            
        otp=random.randint(100000, 999999)
        PendingRegistration.objects.create(
            username=validated_data.get('username'),
            email=validated_data.get('email'),
            password=make_password(password),
            otp=otp
        )
        return PendingRegistration.objects.get(username=validated_data.get('username'))


        
class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'bio', 'profile_pic', 'is_online']
        read_only_fields = ['id', 'is_online']

class ParentCommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = ['id','content']

class ReplySerializer(serializers.ModelSerializer):
    comment = ParentCommentSerializer(read_only=True)
    author = ProfileSerializer(read_only=True)
    class Meta:
        model = Reply
        fields = ['id', 'comment', 'author', 'content', 'created_at', 'updated_at']
        read_only_fields = ['id', 'author', 'comment', 'created_at', 'updated_at']


class CommentSerializer(serializers.ModelSerializer):
    replies = ReplySerializer(many=True, read_only=True)
    author = ProfileSerializer(read_only=True)
    class Meta:
        model = Comment
        fields = ['id', 'content', 'author', 'post', 'created_at','updated_at', 'replies']
        read_only_fields = ['id', 'author', 'post', 'created_at', 'updated_at', 'replies']

class LikeSerializer(serializers.ModelSerializer):

    class Meta:
        model = Like
        fields = ['id', 'user', 'post', 'created_at']

    




class ArticleSerializer(serializers.ModelSerializer):
    likes = LikeSerializer(many=True, read_only=True)
    author = ProfileSerializer(read_only=True)
    class Meta:
        model = Post
        fields = ['id', 'title', 'content', 'author', 'category','is_featured', 'image','video', 'created_at', 'likes']
        read_only_fields = ['id', 'author', 'created_at', 'likes', 'is_featured']

    def create(self,validated_data):
        return Post.objects.create(**validated_data)


class CategorySerializer(serializers.ModelSerializer):
    posts = ArticleSerializer(many=True, read_only=True)
    class Meta:
        model = Category
        fields = ['id', 'name', 'posts']
    





class RecentPostSerializer(serializers.ModelSerializer):
    user = ProfileSerializer(read_only=True)
    post = ArticleSerializer(read_only=True)
    class Meta:
        model = RecentPost
        fields = ['id', 'post', 'user', 'created_at']
        read_only_fields = ['id', 'post', 'user', 'created_at']



class FeaturedPostSerializer(serializers.ModelSerializer):
    author = ProfileSerializer(read_only=True)
    class Meta:
        model = Post
        fields = ['id', 'title', 'content', 'author', 'category','is_featured', 'image','video', 'created_at', 'likes']
        read_only_fields = ['id', 'author', 'created_at', 'likes', 'is_featured']


class LikedPostSerializer(serializers.ModelSerializer):
    user = ProfileSerializer(read_only=True)
    post = ArticleSerializer(read_only=True)
    class Meta:
        model = Like
        fields = ['id', 'user', 'post', 'created_at']
        read_only_fields = ['id', 'user', 'post', 'created_at']


class FollowSerializer(serializers.ModelSerializer):
    follower = ProfileSerializer(read_only=True)
    following = ProfileSerializer(read_only=True)
    class Meta:
        model = Follow
        fields = ['id', 'follower', 'following', 'created_at']
        read_only_fields = ['id', 'follower', 'following', 'created_at']


class MessageSerializer(serializers.ModelSerializer):
    author = ProfileSerializer(read_only=True)
    class Meta:
        model = Message
        fields = ['id', 'chat', 'author', 'content', 'is_seen', 'created_at']
        read_only_fields = ['id', 'chat', 'author', 'is_seen', 'created_at']



class ChatSerializer(serializers.ModelSerializer):
    participants = ProfileSerializer(many=True, read_only=True)
    class Meta:
        model = Chat
        fields = ['id', 'room_id', 'participants', 'messages', 'created_at']
        read_only_fields = ['id', 'room_id', 'participants', 'messages', 'created_at']

class EmailUsSerializer(serializers.ModelSerializer):
    class Meta:
        model = EmailUs
        fields = ['id', 'name', 'email', 'send_to', 'subject', 'message', 'created_at']
        read_only_fields = ['id', 'created_at','email']

class GetNewUpdatesSerializer(serializers.ModelSerializer):
    class Meta:
        model = GetNewUpdates
        fields = ['id', 'email', 'created_at']
        read_only_fields = ['id', 'created_at']
      
class BlockedUserSerializer(serializers.ModelSerializer):
    blocker = ProfileSerializer(read_only=True)
    blocked = ProfileSerializer(read_only=True)
    class Meta:
        model = BlockedUser
        fields = ['id', 'blocker', 'blocked', 'created_at']
        read_only_fields = ['id', 'blocker', 'created_at']
