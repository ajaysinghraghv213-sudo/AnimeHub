import json
from unittest.mock import AsyncMock, Mock, call

from asgiref.sync import async_to_sync
from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from rest_framework_simplejwt.tokens import RefreshToken
from .consumers import ChatConsumer
from .models import BlockedUser, Chat, Follow, Message, Post


class LogoutViewTests(APITestCase):
	def setUp(self):
		self.user = get_user_model().objects.create_user(
			username="logout-user",
			email="logout@example.com",
			password="test-password",
		)
		self.refresh = RefreshToken.for_user(self.user)
		self.client.force_authenticate(user=self.user)

	def test_logout_blacklists_refresh_token(self):
		response = self.client.post(
			reverse("logout"),
			{"refresh": str(self.refresh)},
			format="json",
		)

		self.assertEqual(response.status_code, status.HTTP_200_OK)
		self.assertTrue(response.data["message"])
		with self.assertRaises(Exception):
			RefreshToken(str(self.refresh))

	def test_logout_requires_refresh_token(self):
		response = self.client.post(reverse("logout"), {}, format="json")

		self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
		self.assertEqual(response.data["error"], "Refresh token is required.")

	def test_logout_requires_authentication(self):
		self.client.force_authenticate(user=None)

		response = self.client.post(
			reverse("logout"),
			{"refresh": str(self.refresh)},
			format="json",
		)

		self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)


class CommentCreateViewTests(APITestCase):
	def setUp(self):
		self.user = get_user_model().objects.create_user(
			username="comment-user",
			email="comment@example.com",
			password="test-password",
		)
		self.post = Post.objects.create(
			author=self.user,
			title="Test post",
			content="Test content",
		)

	def test_authenticated_user_can_create_comment_with_content_only(self):
		self.client.force_authenticate(user=self.user)

		response = self.client.post(
			f"/comments/{self.post.id}/",
			{"content": "Useful article."},
			format="json",
		)

		self.assertEqual(response.status_code, status.HTTP_201_CREATED)
		self.assertEqual(response.data["content"], "Useful article.")
		self.assertEqual(response.data["author"], self.user.id)
		self.assertEqual(response.data["post"], self.post.id)

	def test_comment_creation_requires_authentication(self):
		response = self.client.post(
			f"/comments/{self.post.id}/",
			{"content": "Anonymous comment."},
			format="json",
		)

		self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)


class UserFollowViewTests(APITestCase):
	def setUp(self):
		user_model = get_user_model()
		self.user = user_model.objects.create_user(username="follower-user", password="test-password")
		self.target = user_model.objects.create_user(username="target-user", password="test-password")
		self.client.force_authenticate(user=self.user)

	def test_can_fetch_another_users_followers_and_following(self):
		user_model = get_user_model()
		profile = user_model.objects.create_user(username="profile-user", password="test-password")
		following_user = user_model.objects.create_user(username="following-user", password="test-password")
		follower_user = user_model.objects.create_user(username="follower-user", password="test-password")
		Follow.objects.create(follower=profile, following=following_user)
		Follow.objects.create(follower=follower_user, following=profile)

		response = self.client.get(reverse("user-follow-lists", args=[profile.id]))

		self.assertEqual(response.status_code, status.HTTP_200_OK)
		self.assertEqual(response.data["following"][0]["following"]["id"], following_user.id)
		self.assertEqual(response.data["follower"][0]["follower"]["id"], follower_user.id)

	def test_authenticated_user_can_follow_profile(self):
		response = self.client.post(reverse("user-follow-lists", args=[self.target.id]))

		self.assertEqual(response.status_code, status.HTTP_201_CREATED)
		self.assertTrue(Follow.objects.filter(follower=self.user, following=self.target).exists())

	def test_repeating_follow_does_not_create_duplicate(self):
		url = reverse("user-follow-lists", args=[self.target.id])

		first_response = self.client.post(url)
		second_response = self.client.post(url)

		self.assertEqual(first_response.status_code, status.HTTP_201_CREATED)
		self.assertEqual(second_response.status_code, status.HTTP_200_OK)
		self.assertEqual(Follow.objects.filter(follower=self.user, following=self.target).count(), 1)

	def test_user_cannot_follow_themselves(self):
		response = self.client.post(reverse("user-follow-lists", args=[self.user.id]))

		self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

	def test_unknown_user_returns_404(self):
		response = self.client.get(reverse("user-follow-lists", args=[999999]))

		self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)


class BlockedMessagingTests(APITestCase):
	def setUp(self):
		user_model = get_user_model()
		self.user = user_model.objects.create_user(username="message-user", password="test-password")
		self.other = user_model.objects.create_user(username="message-other", password="test-password")
		self.chat = Chat.objects.create(room_id=f"{self.user.id}_{self.other.id}")
		self.chat.participants.add(self.user, self.other)
		self.client.force_authenticate(user=self.user)

	def test_get_returns_current_users_blocked_users(self):
		third_user = get_user_model().objects.create_user(
			username="message-third",
			password="test-password",
		)
		BlockedUser.objects.create(blocker=self.user, blocked=self.other)
		BlockedUser.objects.create(blocker=self.other, blocked=third_user)

		response = self.client.get(reverse("blocked-users"))

		self.assertEqual(response.status_code, status.HTTP_200_OK)
		self.assertEqual(len(response.data), 1)
		self.assertEqual(response.data[0]["blocked"]["id"], self.other.id)
		self.assertEqual(response.data[0]["blocker"]["id"], self.user.id)

	def test_deleted_chat_hides_old_messages_but_shows_new_ones(self):
		url = reverse("chat-messages", args=[self.chat.room_id])
		Message.objects.create(chat=self.chat, author=self.other, content="old")

		self.assertEqual(self.client.delete(url).status_code, status.HTTP_204_NO_CONTENT)
		self.assertEqual(self.client.get(url).data, [])

		Message.objects.create(chat=self.chat, author=self.other, content="new")
		response = self.client.get(url)

		self.assertEqual(response.status_code, status.HTTP_200_OK)
		self.assertEqual([m["content"] for m in response.data], ["new"])

	def test_delete_missing_chat_returns_404(self):
		response = self.client.delete(reverse("chat-messages", args=["missing-room"]))

		self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
		self.assertEqual(response.data["error"], "Chat not found.")

	def test_cannot_start_chat_when_either_user_blocked(self):
		url = reverse("chat-start", args=[self.other.id])

		for blocker, blocked in ((self.user, self.other), (self.other, self.user)):
			with self.subTest(blocker=blocker.username):
				BlockedUser.objects.create(blocker=blocker, blocked=blocked)
				response = self.client.post(url)
				self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
				self.assertEqual(
					response.data["error"],
					"Messaging is unavailable because one user has blocked the other.",
				)
				BlockedUser.objects.all().delete()

	def test_cannot_post_message_when_either_user_blocked(self):
		url = reverse("chat-messages", args=[self.chat.room_id])

		for blocker, blocked in ((self.user, self.other), (self.other, self.user)):
			with self.subTest(blocker=blocker.username):
				BlockedUser.objects.create(blocker=blocker, blocked=blocked)
				response = self.client.post(url, {"content": "Hello"}, format="json")
				self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
				self.assertEqual(
					response.data["error"],
					"Messaging is unavailable because one user has blocked the other.",
				)
				self.assertFalse(Message.objects.exists())
				BlockedUser.objects.all().delete()

	def test_blocked_websocket_send_emits_error_before_closing(self):
		consumer = ChatConsumer()
		consumer.has_blocked_participant = AsyncMock(return_value=True)
		consumer.send = AsyncMock()
		consumer.close = AsyncMock()
		events = Mock()
		events.attach_mock(consumer.send, "send")
		events.attach_mock(consumer.close, "close")
		error_payload = {
			"type": "error",
			"code": "messaging_blocked",
			"error": "Messaging is unavailable because one user has blocked the other.",
		}

		async_to_sync(consumer.receive)(json.dumps({"message": "Hello"}))

		self.assertEqual(events.mock_calls, [
			call.send(text_data=json.dumps(error_payload)),
			call.close(code=4403),
		])

	def test_blocked_websocket_connect_emits_error_before_closing(self):
		consumer = ChatConsumer()
		consumer.scope = {
			"user": self.user,
			"url_route": {"kwargs": {"room_id": self.chat.room_id}},
		}
		consumer.get_chat = AsyncMock(return_value=self.chat)
		consumer.has_blocked_participant = AsyncMock(return_value=True)
		consumer.accept = AsyncMock()
		consumer.send = AsyncMock()
		consumer.close = AsyncMock()
		events = Mock()
		events.attach_mock(consumer.accept, "accept")
		events.attach_mock(consumer.send, "send")
		events.attach_mock(consumer.close, "close")
		error_payload = {
			"type": "error",
			"code": "messaging_blocked",
			"error": "Messaging is unavailable because one user has blocked the other.",
		}

		async_to_sync(consumer.connect)()

		self.assertEqual(events.mock_calls, [
			call.accept(),
			call.send(text_data=json.dumps(error_payload)),
			call.close(code=4403),
		])
