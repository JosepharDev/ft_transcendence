from django.urls import re_path

from . import pc2

websocket_urlpatterns = [
    re_path(r"ws/pongTest/(?P<room_name>\w+)/$", pc2.PongConsumerTest.as_asgi()),
]
