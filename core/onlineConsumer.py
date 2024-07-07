
import json
import random

from channels.generic.websocket import WebsocketConsumer

from channels.generic.websocket import AsyncWebsocketConsumer

from asgiref.sync import async_to_sync
import asyncio
from channels.db import database_sync_to_async
from .jwt import generate_jwt
from django.http import HttpResponse, JsonResponse, HttpResponseRedirect, HttpResponseBadRequest
import jwt
from django.core.serializers import serialize
from django.db.models import Q
import jwt, datetime
from .models import User, Match, HistoryMatch
from django.conf import settings


async def decode_jwt(token):
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
        user_id = payload['user_id']
        return await database_sync_to_async (User.objects.get)(pk=user_id)
    except (jwt.DecodeError, User.DoesNotExist):
        return None


class OnlineConsumer(AsyncWebsocketConsumer):


    async def connect(self):
        token = self.scope['cookies'].get('jwt')
        if not token:
            print({"message": "unauthorized"})
        try:
            self.scope['user'] =  await decode_jwt(token)
        except jwt.ExpiredSignatureError:
            print({"message": "Expired Signature"})
            return 
        await self.accept()
        await self.update_user_status(self.scope['user'].id, "online")
    @database_sync_to_async
    def update_user_status(self, user_id, status):
        try:
            user = User.objects.get(pk=user_id)
            if status == "online":
                user.profile_status = status
                user.status_count += 1
            else:
                user.status_count -= 1
                if user.status_count == 0:
                    user.profile_status = status
            user.save()
            print("cccccccccccccccccccccccccccccccccccccccccccddddddddddddccccccc")
            # print(user.status)
        except User.DoesNotExist:
            # Handle the case where the user does not exist
            pass

    async def disconnect(self, close_code):
        await self.update_user_status(self.scope['user'].id, "offline")


    async def receive(self, text_data):
        pass


