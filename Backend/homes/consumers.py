import json

from channels.db import database_sync_to_async
from channels.generic.websocket import AsyncWebsocketConsumer
from django.core.cache import cache

from .models import Chat, Message,User
from .service import has_blocked_chat_participant

    


class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.user = self.scope["user"]
        self.room_id = self.scope["url_route"]["kwargs"]["room_id"]
        self.room_group_name = f"chat_{self.room_id}"
        self.chat = None

        if self.user.is_anonymous:
            await self.close(code=4401)
            return

        self.chat = await self.get_chat()
        if self.chat is None:
            await self.close(code=4403)
            return
        if await self.has_blocked_participant():
            await self.accept()
            await self.send_blocked_error()
            await self.close(code=4403)
            return

        await self.channel_layer.group_add(self.room_group_name, self.channel_name)
        await self.accept()
        self.counted = True
        await self.adjust_connections(1)
        await self.set_profile(self.user.id, True)
        await self.channel_layer.group_send(
            self.room_group_name,
            {"type": "presence", "user_id": self.user.id, "status": "online", "reply": True},
        )

    async def disconnect(self, close_code):
        if self.chat is None:
            return
        try:
            if getattr(self, "counted", False):
                remaining = await self.adjust_connections(-1)
                # Only the last open socket of this user marks them offline.
                if remaining <= 0:
                    await self.set_profile(self.user.id, False)
                    await self.channel_layer.group_send(
                        self.room_group_name,
                        {"type": "presence", "user_id": self.user.id, "status": "offline"},
                    )
        finally:
         await self.channel_layer.group_discard(self.room_group_name, self.channel_name)

    async def receive(self, text_data):
        if await self.has_blocked_participant():
            await self.send_blocked_error()
            await self.close(code=4403)
            return

        try:
            data = json.loads(text_data)
        except json.JSONDecodeError:
            return

        if data.get("type") == "typing":
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    "type": "typing",
                    "user_id": self.user.id,
                    "is_typing": bool(data.get("is_typing", True)),
                },
            )
            return
        if data.get("type") == "seen":
            message_id = data.get("message_id")
            is_seen = data.get("is_seen", True)
            if not isinstance(is_seen, bool):
                return

            updated = await self.set_message_seen(message_id, is_seen)
            if updated:
                await self.channel_layer.group_send(
                    self.room_group_name,
                    {
                        "type": "message_seen",
                        "user_id": self.user.id,
                        "message_id": message_id,
                        "is_seen": is_seen,
                    },
                )
            return

        content = (data.get("message") or "").strip()
        if not content:
            return

        message = await self.save_message(content)
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                "type": "chat_message",
                "id": message.id,
                "message": message.content,
                "author_id": self.user.id,
                "author": self.user.username,
                "created_at": message.created_at.isoformat(),
                "is_seen": message.is_seen,
            },
        )

    async def chat_message(self, event):
        await self.send(text_data=json.dumps({
            "type": "message",
            "id": event["id"],
            "message": event["message"],
            "author_id": event["author_id"],
            "author": event["author"],
            "created_at": event["created_at"],
            "is_seen": event["is_seen"],
        }))


    async def chat_deleted(self, event):
        await self.send(text_data=json.dumps({
            "type": "chat_deleted",
            "room_id": event["room_id"],
        }))


    async def message_deleted(self, event):
        await self.send(text_data=json.dumps({
            "type": "message_deleted",
            "room_id": event["room_id"],
            "message_id": event["message_id"],
        }))



    async def send_blocked_error(self):
        await self.send(text_data=json.dumps({
            "type": "error",
            "code": "messaging_blocked",
            "error": "Messaging is unavailable because one user has blocked the other.",
        }))
    async def presence(self, event):
        if event["user_id"] == self.user.id:
            return
        await self.send(text_data=json.dumps({
            "type": "presence",
            "user_id": event["user_id"],
            "status": event["status"],
        }))
        # Let a peer who just joined learn that we are already online.
        if event.get("reply") and event["status"] == "online":
            await self.channel_layer.group_send(
                self.room_group_name,
                {"type": "presence", "user_id": self.user.id, "status": "online"},
            )

    async def message_seen(self,event):
        print(f"Message seen event received: {event}")
        if event['user_id'] == self.user.id:
            return
        await self.send(text_data=json.dumps({
            "type": "message_seen",
            "user_id": event.get("user_id"),
            'message_id': event.get("message_id"),
            "is_seen": event["is_seen"],
        }))

    async def typing(self, event):
        print(f"Typing event received: {event}")
        if event["user_id"] == self.user.id:
            return
        await self.send(text_data=json.dumps({
            "type": "typing",
            "user_id": event["user_id"],
            "is_typing": event["is_typing"],
        }))

    @database_sync_to_async
    def get_chat(self):
        return Chat.objects.filter(room_id=self.room_id, participants=self.user).first()

    @database_sync_to_async
    def has_blocked_participant(self):
        participant_ids = self.chat.participants.exclude(pk=self.user.pk).values_list('pk', flat=True)
        return has_blocked_chat_participant(self.user, participant_ids)

    


    @database_sync_to_async
    def save_message(self, content):
        return Message.objects.create(chat=self.chat, author=self.user, content=content)


    
    @database_sync_to_async
    def adjust_connections(self, delta):
        key = f"ws_connections_{self.user.id}"
        cache.add(key, 0, timeout=None)
        count = cache.incr(key, delta)
        return max(count, 0)

    @database_sync_to_async
    def set_profile(self,user_id,is_online):
        User.objects.filter(pk=user_id).update(is_online=is_online)
        return True

    
    @database_sync_to_async
    def set_message_seen(self, message_id, is_seen):
        if not isinstance(message_id, int) or isinstance(message_id, bool):
            return False
        message = Message.objects.filter(
            pk=message_id,
            chat=self.chat,
        ).exclude(author=self.user).first()
        if message is None:
            return False
        if message.is_seen != is_seen:
            message.is_seen = is_seen
            message.save(update_fields=["is_seen"])
        return True

