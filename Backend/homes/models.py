from django.db import models
from django.contrib.auth.models import AbstractUser
# Create your models here.


class User(AbstractUser):
    profile_pic = models.ImageField(upload_to="profile_pics/", null=True, blank=True)
    bio = models.TextField(null=True, blank=True)
    is_online = models.BooleanField(default=False)


    def __str__(self):
        return self.username
class PendingRegistration(models.Model):
    username = models.CharField(max_length=150, unique=True)
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=128)
    otp = models.CharField(max_length=6, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Pending registration for {self.username}"

class Category(models.Model):
    name = models.CharField(max_length=255)
    slug = models.SlugField(unique=True,blank=True)

    def __str__(self):
        return self.name
class Post(models.Model):
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    title = models.CharField(max_length=255)
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, blank=True,related_name="posts")
    like = models.ManyToManyField(User, through="Like", related_name="liked_posts", blank=True)
    image = models.ImageField(upload_to="post_images/", null=True, blank=True)
    video = models.FileField(upload_to="post_videos/", null=True, blank=True)
    content = models.TextField()
    is_featured = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title



class RecentPost(models.Model):
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name="recent_posts")
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="recent_user")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["post", "user"],
                name="unique_recent_post"
            )
        ]

class Comment(models.Model):
    post = models.ForeignKey(Post, on_delete=models.CASCADE)
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Comment by {self.author.username} on {self.post.title}"


class Reply(models.Model):
    comment = models.ForeignKey(Comment, on_delete=models.CASCADE, related_name="replies")
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Reply by {self.author.username} on {self.comment.post.title}"

class Like(models.Model):
    post = models.ForeignKey(
        Post,
        on_delete=models.CASCADE,
        related_name="likes"
    )
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["post", "user"],
                name="unique_post_like"
            )
        ]    

class Follow(models.Model):
    follower = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="following"
    )
    following = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="followers"
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["follower", "following"],
                name="unique_follow"
            )
        ]

class Share(models.Model):
    post = models.ForeignKey(Post, on_delete=models.CASCADE,related_name="shares")
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="shares")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["post", "user"],
                name="unique_share"
            )
        ]

class Chat(models.Model):
    room_id = models.CharField(max_length=255, unique=True)
    participants = models.ManyToManyField(
        User,
        related_name="chats"
    )
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Chat room {self.room_id}"


class Message(models.Model):
    chat = models.ForeignKey(
        Chat,
        on_delete=models.CASCADE,
        related_name="messages"
    )
    author = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="sent_messages"
    )
    content = models.TextField()
    is_seen = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Message by {self.author.username} in chat room {self.chat.room_id}"

class EmailUs(models.Model):
    name = models.CharField(max_length=255)
    email = models.EmailField()
    send_to = models.EmailField(default="ajaysinghraghv213@gmail.com")
    subject = models.CharField(max_length=255)
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Email from {self.name} ({self.email})"

class GetNewUpdates(models.Model):
    email = models.EmailField(unique=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"New update subscription from {self.email}"


class BlockedUser(models.Model):
    blocker = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="blocked_users"
    )
    blocked = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="blocked_by"
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["blocker", "blocked"],
                name="unique_block"
            )
        ]

    def __str__(self):
        return f"{self.blocker.username} blocked {self.blocked.username}"

class DeletedChats(models.Model):
    chat = models.ForeignKey(
        Chat,
        on_delete=models.CASCADE,
        related_name="deleted_chats"
    )
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="deleted_chats"
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["chat", "user"],
                name="unique_deleted_chat"
            )
        ]

    def __str__(self):
        return f"{self.user.username} deleted chat room {self.chat.room_id}"