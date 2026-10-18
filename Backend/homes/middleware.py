from urllib.parse import parse_qs

from channels.db import database_sync_to_async
from channels.middleware import BaseMiddleware
from django.contrib.auth.models import AnonymousUser
from rest_framework_simplejwt.tokens import AccessToken


@database_sync_to_async
def get_user(token):
    from .models import User

    try:
        access_token = AccessToken(token)
        user_id = access_token["user_id"]

        print("JWT user_id:", user_id)

        user = User.objects.get(id=user_id)

        print("Authenticated user:", user)

        return user

    except Exception as e:
        print("JWT ERROR:", type(e).__name__, str(e))
        return AnonymousUser()


class JWTAuthMiddleware(BaseMiddleware):

    async def __call__(self, scope, receive, send):

        query = parse_qs(
            scope.get("query_string", b"").decode()
        )

        token = query.get("token", [None])[0]

        print("TOKEN RECEIVED:", bool(token))

        if token:
            scope["user"] = await get_user(token)
        else:
            scope["user"] = AnonymousUser()

        print("SCOPE USER:", scope["user"])

        return await super().__call__(
            scope,
            receive,
            send
        )