from django.urls import re_path

from . import pc2
from . import onlineConsumer
from . import multiple
from . import tournament


websocket_urlpatterns = [
    re_path(r"ws/pongTest/(?P<room_name>\w+)/$", pc2.PongConsumerTest.as_asgi()),
    re_path(r"ws/onlineUser/(?P<room_name>\w+)/$", onlineConsumer.OnlineConsumer.as_asgi()),
    re_path(r"ws/multiple/(?P<room_name>\w+)/$", multiple.multipleConsumeTest.as_asgi()),
    re_path(r"ws/tournament/(?P<room_name>\w+)/$", tournament.TournamentConsumer.as_asgi()),
]
