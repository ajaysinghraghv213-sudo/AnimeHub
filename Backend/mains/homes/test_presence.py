from types import SimpleNamespace
from unittest.mock import AsyncMock

from asgiref.sync import async_to_sync
from django.test import SimpleTestCase

from .consumers import ChatConsumer


class PresenceDisconnectTests(SimpleTestCase):
	def make_consumer(self, remaining):
		consumer = ChatConsumer()
		consumer.user = SimpleNamespace(id=7)
		consumer.chat = object()
		consumer.counted = True
		consumer.room_group_name = "chat_1_7"
		consumer.channel_name = "channel"
		consumer.channel_layer = SimpleNamespace(group_send=AsyncMock(), group_discard=AsyncMock())
		consumer.adjust_connections = AsyncMock(return_value=remaining)
		consumer.set_profile = AsyncMock()
		return consumer

	def test_closing_last_socket_marks_user_offline(self):
		consumer = self.make_consumer(remaining=0)

		async_to_sync(consumer.disconnect)(1000)

		consumer.adjust_connections.assert_awaited_once_with(-1)
		consumer.set_profile.assert_awaited_once_with(7, False)
		consumer.channel_layer.group_send.assert_awaited_once_with(
			"chat_1_7", {"type": "presence", "user_id": 7, "status": "offline"},
		)
		consumer.channel_layer.group_discard.assert_awaited_once_with("chat_1_7", "channel")

	def test_closing_one_of_several_sockets_keeps_user_online(self):
		consumer = self.make_consumer(remaining=1)

		async_to_sync(consumer.disconnect)(1000)

		consumer.set_profile.assert_not_awaited()
		consumer.channel_layer.group_send.assert_not_awaited()
		consumer.channel_layer.group_discard.assert_awaited_once_with("chat_1_7", "channel")
