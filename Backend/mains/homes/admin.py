from django.contrib import admin
from .models import BlockedUser, DeletedChats, EmailUs, GetNewUpdates, Message, Chat, PendingRegistration, RecentPost, User, Post, Comment, Like, Follow, Share, Category, Reply  

admin.site.register(User)
admin.site.register(Post)
admin.site.register(Comment)
admin.site.register(Like)
admin.site.register(Follow)
admin.site.register(Share)
admin.site.register(PendingRegistration)
admin.site.register(RecentPost)
admin.site.register(Category)
admin.site.register(Reply)
admin.site.register(Message)
admin.site.register(Chat)
admin.site.register(EmailUs)
admin.site.register(GetNewUpdates)
admin.site.register(BlockedUser)
admin.site.register(DeletedChats)
# Register your models here.
