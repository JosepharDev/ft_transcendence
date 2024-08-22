
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
import jwt
import jwt
from .models import User
from django.conf import settings
from .pingPongUtils import decode_jwt


class OnlineConsumer(AsyncWebsocketConsumer):


    async def connect(self):

        self.justDisconnect = True
        await self.accept()

        token = self.scope['cookies'].get('jwt')
        if not token:
            return
    
        try:
            self.scope['user'] =  await decode_jwt(token)
            if (not self.scope['user']):
                return; 
        except jwt.ExpiredSignatureError:
            return

        self.justDisconnect = False
        await self.update_user_status(self.scope['user'].id, "online")



    @database_sync_to_async
    def update_user_status(self, user_id, status):
        try:
            user = User.objects.get(pk=user_id)
            if status == "online":
                user.profile_status = status
                user.status_count += 1
            else:
                if user.status_count > 0:
                    user.status_count -= 1
                if user.status_count == 0:
                    user.profile_status = status
            user.save()



        except User.DoesNotExist:
            pass

    async def disconnect(self, close_code):
        if (self.justDisconnect):
            return
        await self.update_user_status(self.scope['user'].id, "offline")




    async def receive(self, text_data):
        pass


