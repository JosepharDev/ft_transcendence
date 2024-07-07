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
import random
import string


def generate_random_string(length):
    characters = string.ascii_letters + string.digits
    random_string = ''.join(random.choices(characters, k=length))
    return random_string

queue = []
rooms = {}
curr_room = ""
async def decode_jwt(token):
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
        user_id = payload['user_id']
        return await database_sync_to_async (User.objects.get)(pk=user_id)
    except (jwt.DecodeError, User.DoesNotExist):
        return None
class PongConsumerTest(AsyncWebsocketConsumer):

    @database_sync_to_async
    def checkUserStatus(self, user_id):
        try:
            user = User.objects.get(pk=user_id)
            return user.game_status
        except User.DoesNotExist:
            # Handle the case where the user does not exist
            return "ERR"



    @database_sync_to_async
    def update_userStatus(self, user_id, status):
        try:
            user = User.objects.get(pk=user_id)
            user.game_status = status
            user.save()
        except User.DoesNotExist:
            # Handle the case where the user does not exist
            return "ERR"


    async def connect(self):

        global queue
        global curr_room


        token = self.scope['cookies'].get('jwt')
        if not token:
            print({"message": "unauthorized"})
            return
        try:
            self.scope['user'] =  await decode_jwt(token)
        except jwt.ExpiredSignatureError:
            print({"message": "Expired Signature"})
            return

        self.iam_player_1 = True
        self.iam_playing  = False
        self.update_to_nogame = False
        self.room_room = self.scope['user'].username

        self.user_group_name = f"user_{self.scope['user'].username}"

        if len(queue) == 0:
            curr_room = generate_random_string(5) + generate_random_string(8)
        
        if len(queue) < 2:
            self.room_room = curr_room


        await self.channel_layer.group_add(
            self.user_group_name, self.channel_name
        )
        # stats = await self.checkUserStatus(self.scope['user'].id)
        # if (stats != 'no_game'):
        #     await self.accept()
        #     await self.channel_layer.group_send(
        #                 self.user_group_name,
        #                 {"type": "send.message", "message": {'action': 'NA'}} )
        #     # print("=======================================================================================")

        #     # print(self.checkUserStatus(self.scope['user'].id))
        #     self.update_to_nogame = True
        #     # await self.close(1000)
        #     return


        await self.accept()

        print("=======================================================================================")
        print(self.scope['user'].username)
        print("=======================================================================================")

        userData = {
                        'userName' : self.scope['user'].username,
                        'id' : self.scope['user'].id,
                    }
        queue.append(userData)


        await self.channel_layer.group_send(
                    self.user_group_name,
                    {"type": "send.message", "message": {'action': 'id', 'message':f"{self.scope['user'].id}"}}
                )
        await self.channel_layer.group_add(
                self.room_room, self.channel_name
            )



        if len(queue) == 2:

            self.iam_player_1 = False
            await self.channel_layer.group_send(
                    self.room_room,
                    {
                        "type": "send.message",
                        "message": {'action': 'play', 'message':"start"}
                    }
                )

            rooms[self.room_room] = roomData(queue[0]['id'], self.scope['user'].id)

            await self.channel_layer.group_send(
                    self.user_group_name,
                    {"type": "send.message", "message": {'action': 'iam', 'iam': 2}}
                )

            await self.channel_layer.group_send(
                    self.room_room,
                    {"type": "send.message", "message": {'action': 'users', 'user1': queue[0]['userName'], 'user2':
                                                        self.scope['user'].username}}
                )

            queue.pop(0)
            queue.pop(0)
            await self.channel_layer.group_send(
                    self.room_room, 
                    {"type": "start.game", "message": {'action': 'play_game', 'message':"print once"}}
                )
        else:
            # await self.update_userStatus(self.scope['user'].id, 'waiting')
            await self.channel_layer.group_send(
                self.user_group_name,
                {"type": "send.message", "message": {'action': 'iam', 'iam': 1}}
            )


    async def disconnect(self, close_code):
        global queue

        try:
            if not self.update_to_nogame:
                await self.update_userStatus(self.scope['user'].id, 'no_game')

            if (self.iam_playing) and (self.room_room in rooms):
                del rooms[self.room_room]
            
            if (len(queue) == 1):
                if (queue[0]['userName'] == self.scope['user'].username):
                    queue.pop(0)
            await self.channel_layer.group_discard(
                self.room_room, self.channel_name
            )
        except:
            pass
        print (f"quite room {self.room_room}")




    async def receive(self, text_data):
        try:
            message = json.loads(text_data)
            print ("receievevvevevve")
            print (message)
            if (message['action'] == 'press' and self.iam_playing):
                if (message['code'] != "PA" and message['code'] != 'SC' and message['code'] != 'RO'):
                    return 
                if (rooms[self.room_room].paddle_1.id == self.scope['user'].id):
                    if (rooms[self.room_room].player1Choice == "")
                        rooms[self.room_room].player1Choice = message['code']
                else:
                    if (rooms[self.room_room].player2Choice == "")
                        rooms[self.room_room].player2Choice = message['code']
        except:
            pass 

    async def send_message(self, event):
        message = event["message"]

        if message['action'] == "play":
            self.iam_playing = True
            # await self.update_userStatus(self.scope['user'].id, 'in_game')
            # return #added this 05/30  11:15

        await self.send(text_data=json.dumps({"message": message}))



    @database_sync_to_async
    def getUsername(self, user_id):
        try:
            user = User.objects.get(pk=user_id)
            return user.username
        except User.DoesNotExist:
            return "Anonym"


    async def start_game(self, event):
        # Start the game loop
        message = event['message']
        
        
        if rooms[self.room_room].start == False:
            return
        else:
            rooms[self.room_room].start = False

        await asyncio.sleep(4)
        async def gameLoop():
            try:
                while True:

                    if (self.room_room not in rooms):
                        break
                    
                    if rooms[self.room_room].player1Score >= 7 or rooms[self.room_room].player1Score >= 7:
                        if rooms[self.room_room].player1Score >= 7:
                            usernamee = await self.getUsername(rooms[self.room_room].user1_id)
                        else:
                            usernamee = await self.getUsername(rooms[self.room_room].user2_id)
                        dta = {
                            "action": "finish",
                            "winner" : usernamee
                        }
                        await self.channel_layer.group_send(
                                self.room_room, {"type": "send.message", "message": dta}
                            )
                        break
                    #check winner round
                    if (rooms[self.room_room].player1Choice == rooms[self.room_room].player2Choice):
                        pass
                    elif ((rooms[self.room_room].player1Choice == "SC" and rooms[self.room_room].player2Choice == "PA")
                        or (rooms[self.room_room].player1Choice == "RO" and rooms[self.room_room].player2Choice == "SC")
                        or (rooms[self.room_room].player1Choice == "PA" and rooms[self.room_room].player2Choice == "RO")
                        ):
                        rooms[self.room_room].player1Score += 1
                    elif (rooms[self.room_room].player1Choice == ""):
                        rooms[self.room_room].player2Score += 1
                    elif (rooms[self.room_room].player2Choice == ""):
                        rooms[self.room_room].player1Score += 1
                    else:
                        rooms[self.room_room].player2Score += 1

                    await self.channel_layer.group_send(
                        self.room_room, {"type": "send.message", "message": rooms[self.room_room].json()}
                    )
                    await asyncio.sleep(4)
            except:
                pass

        asyncio.create_task(gameLoop())





class roomData:
    def __init__(self, id1, id2):
        self.round = 0
        self.player1Score = 0
        self.player2Score = 0
        self.player1Choice = ""
        self.player2Choice = ""
        self.start = True
        self.user1_id = id1
        self.user2_id = id2
    def json(self):
        message = {
                        "action": "data",
                        # "ball":
                        # {
                        #     'pos' : self.ball.pos , 
                        #     'velocity' : self.ball.velocity ,
                        #     'radius' : self.ball.radius
                        # }
                }
        return message


