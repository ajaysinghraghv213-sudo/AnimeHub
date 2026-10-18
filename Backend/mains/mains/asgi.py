"""
ASGI config for mains project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/6.1/howto/deployment/asgi/
"""

import os
from channels.routing import ProtocolTypeRouter,URLRouter
from django.core.asgi import get_asgi_application
from django.urls import path
from homes.consumers import ChatConsumer
from homes.middleware import  JWTAuthMiddleware
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'mains.settings')

django_asgi_app = get_asgi_application()
ws_pattern=[path('ws/chat/<str:room_id>/',ChatConsumer.as_asgi())]

application=ProtocolTypeRouter({
    'http':django_asgi_app,
    'websocket': JWTAuthMiddleware(URLRouter(ws_pattern
    )
    )
})
