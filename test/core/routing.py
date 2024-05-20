from django.urls import re_path

from . import pc2
from . import onlineConsumer

websocket_urlpatterns = [
    re_path(r"ws/pongTest/(?P<room_name>\w+)/$", pc2.PongConsumerTest.as_asgi()),
    re_path(r"ws/onlineUser/(?P<room_name>\w+)/$", onlineConsumer.OnlineConsumer.as_asgi()),
]
