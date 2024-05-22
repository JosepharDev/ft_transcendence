
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

canvasWidth__ = 1000
canvasHeight__ = 600

def vec2(x, y):
    return {'x': x, 'y': y}



queue = []
rooms = {}

async def decode_jwt(token):
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
        user_id = payload['user_id']
        return await database_sync_to_async (User.objects.get)(pk=user_id)
    except (jwt.DecodeError, User.DoesNotExist):
        return None
class PongConsumerTest(AsyncWebsocketConsumer):


    async def connect(self):

        global queue
        global canvasWidth__
        global canvasHeight__


        print("88888888888888888888888888888888888888888888888888888888888888888888888888888888888888888")
        print(self.scope['cookies'].get('jwt'))
        print("88888888888888888888888888888888888888888888888888888888888888888888888888888888888888888")
        token = self.scope['cookies'].get('jwt')
        if not token:
            print({"message": "unauthorized"})
        try:
            self.scope['user'] =  await decode_jwt(token)
        except jwt.ExpiredSignatureError:
            print({"message": "Expired Signature"})

        # if cookie_jwt:
        #     try:
        #         decoded_token = jwt.decode(cookie_jwt, 'your_secret_key', algorithms=['HS256'])
        #         user_id = decoded_token['user_id']

        #         # Do something with the user_id
        #     except jwt.ExpiredSignatureError:
        #         # Handle expired token
        #         pass
        #     except jwt.InvalidTokenError:
        #         # Handle invalid token
        #         pass
        self.id_in_queue  = len(queue)
        self.iam_player_1 = True
        self.iam_playing  = False
        self.room_room = self.scope['user'].username

        self.user_group_name = f"user_{self.scope['user'].username}"
        await self.channel_layer.group_add(
            self.user_group_name, self.channel_name
        )
        print("=======================================================================================")
        print(self.scope['user'].username)
        print("=======================================================================================")

        await self.accept()
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
                queue[0]['userName'], self.channel_name
            )



        if len(queue) == 2:
            self.room_room = queue[0]['userName']
            self.iam_player_1 = False

            paddle_1 = Paddle(vec2(0,70), vec2(40,40), 20 ,100, 1)
            paddle_2 = Paddle(vec2(canvasWidth__ - 20, 20), vec2(40, 40), 20 ,100, 2)
            ball = Ball(vec2(20,20), vec2(8,8), 10)

            rooms[self.room_room] = roomData(paddle_1, paddle_2, ball, queue[0]['id'], self.scope['user'].id)
            # i need to push them in same room
            await self.channel_layer.group_send(
                    self.user_group_name,
                    {"type": "send.message", "message": {'action': 'iam', 'iam': 2}}
                )

            await self.channel_layer.group_send(
                    queue[0]['userName'],
                    {
                        "type": "send.message",
                        "message": {'action': 'play', 'message':"start"}
                    }
                )


            queue.pop(0)
            queue.pop(0)
            await self.channel_layer.group_send(
                    self.room_room, 
                    {"type": "start.game", "message": {'action': 'play_game', 'message':"print once"}}
                )
        else:
            await self.channel_layer.group_send(
                self.user_group_name,
                {"type": "send.message", "message": {'action': 'iam', 'iam': 1}}
            )
        # print ("rooms:")
        # print (rooms)

    async def disconnect(self, close_code):
        global queue
        await self.channel_layer.group_discard(
            self.room_room, self.channel_name
        )
        if (self.iam_playing) and (self.room_room in rooms):
            print ("hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh")
            u1 =await database_sync_to_async (User.objects.get)(pk=rooms[self.room_room].user1_id)
            u2 = await database_sync_to_async (User.objects.get)(pk=rooms[self.room_room].user2_id)
            ###################################3

            if rooms[self.room_room].paddle_1.score >= 5 or rooms[self.room_room].paddle_2.score >= 5:
                    if rooms[self.room_room].paddle_1.score >= 5:
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
            else:
                if rooms[self.room_room].user1_id == self.scope['user'].id :
                    rooms[self.room_room].paddle_1.score = 0
                    rooms[self.room_room].paddle_2.score = 5
                else :
                    rooms[self.room_room].paddle_1.score = 5
                    rooms[self.room_room].paddle_2.score = 0

            ######################################
            match_ = await database_sync_to_async (Match)(player1=u1, player2=u2, winner=u1, loser=u2, plr1_count=rooms[self.room_room].paddle_1.score,
                plr2_count=rooms[self.room_room].paddle_2.score)
            await database_sync_to_async (match_.save)()
            # HistoryMatch.create(match=match_)
            # 
            del rooms[self.room_room]
        if (len(queue) == 1):
            if (queue[0]['userName'] == self.scope['user'].username):
                queue.pop(0)
        print (f"quite room {self.room_room}")




    async def receive(self, text_data):
        message = json.loads(text_data)
        print ("receievevvevevve")
        print (message)
        if (message['action'] == 'press' and self.iam_playing):
            messageSend = 0
            print ("------------------------------------")

            if (message['user'] == 1):
                await rooms[self.room_room].paddle_1.update(message['code'])
                # messageSend = rooms[self.room_room].paddle_1.json()
            else:
                if (message['user'] == 2):
                    await rooms[self.room_room].paddle_2.update(message['code'])


    async def send_message(self, event):
        message = event["message"]
        # print("---------------")
        # print(message['action'])
        if message['action'] == "play":
            self.iam_playing = True
        

        # print("**************************************")
        # print(message)
        # print(self.iam_playing)
        # print("**************************************")

        await self.send(text_data=json.dumps({"message": message}))


    async def send_message_2(self, event):
        message = event["message"]
        print("---------------")
        print(message['action'])
        if message['action'] == "play":
            self.iam_playing = True
        

        print("**************************************")
        print(message)
        print(self.iam_playing)
        print("**************************************")

        await self.send(text_data=json.dumps({"message": message}))



    @database_sync_to_async
    def getUsername(self, user_id):
        try:
            user = User.objects.get(pk=user_id)
            return user.username
        except User.DoesNotExist:
            # Handle the case where the user does not exist
            pass

    async def start_game(self, event):
        # Start the game loop
        message = event['message']
        if rooms[self.room_room].start == False:
            return
        else:
            rooms[self.room_room].start = False
        await asyncio.sleep(2)
        async def gameLoop():

            while True:

                if (self.room_room not in rooms):
                    break
                
                if rooms[self.room_room].paddle_1.score >= 5 or rooms[self.room_room].paddle_2.score >= 5:
                    if rooms[self.room_room].paddle_1.score >= 5:
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
                    # await self.close()
                    break
                print (rooms[self.room_room].start)
                print ("--")
                print("HH")
                await rooms[self.room_room].ball.update()
                await paddleCollisionWithEdges(rooms[self.room_room].paddle_1, canvasHeight__)
                await paddleCollisionWithEdges(rooms[self.room_room].paddle_2, canvasHeight__)

                await ballCollisionWithEdges(rooms[self.room_room].ball, canvasHeight__)

                await ballPaddleCollision(rooms[self.room_room].ball, rooms[self.room_room].paddle_1)
                await ballPaddleCollision(rooms[self.room_room].ball, rooms[self.room_room].paddle_2)
                await increaseScore(rooms[self.room_room].ball, rooms[self.room_room].paddle_1, rooms[self.room_room].paddle_2, canvasWidth__, canvasHeight__)


                await self.channel_layer.group_send(
                    self.room_room, {"type": "send.message", "message": rooms[self.room_room].json()}
                )
                await asyncio.sleep(0.016)
        # await gameLoop()
        asyncio.create_task(gameLoop())


async def paddleCollisionWithEdges(paddle, canvasHeight):
    if paddle.pos['y'] < 0:
        paddle.pos['y'] = 0
    if paddle.pos['y'] + paddle.height > canvasHeight:
        paddle.pos['y'] = canvasHeight - paddle.height


async def ballCollisionWithEdges(ball, canvasHeight):
    if ball.pos['y'] + ball.radius >= canvasHeight or ball.pos['y'] - ball.radius <= 0 :
        ball.velocity['y'] *= -1
        # await ball.update()
        print(f"ball collision-------------{ball.pos['x']}  {ball.pos['y']}    {ball.pos['y'] + ball.radius >= canvasHeight}------------------")


async def ballPaddleCollision(ball, paddle):

    dx = abs(ball.pos['x'] - paddle.getCenter()['x'])
    dy = abs(ball.pos['y'] - paddle.getCenter()['y'])

    if dx < (ball.radius + paddle.getHalfWidth()) and dy < (paddle.getHalfHeight() + ball.radius):
        if paddle.s == 1:
            ball.pos['x'] = (paddle.pos['x'] + paddle.width) + ball.radius; # // if ball gets stuck
        else:
            ball.pos['x'] = paddle.pos['x'] - paddle.width - ball.radius; #// if ball gets stuck

        ball.velocity['x'] *= -1

async def respawnBall(ball, canvasWidth, canvasHeight):
    if (ball.velocity['x'] > 0):
        ball.pos['x'] = canvasWidth - 150
        ball.pos['y'] = random.uniform(100, canvasHeight - 100)

    if (ball.velocity['x'] < 0):
        ball.pos['x'] = 150
        ball.pos['y'] = random.uniform(100, canvasHeight - 100)

    ball.velocity['x'] *= -1
    ball.velocity['y'] *= -1



async def increaseScore(ball, paddle_1, paddle_2, canvasWidth, canvasHeight):
    if ball.pos['x'] <= -ball.radius:
        paddle_2.score += 1
        await respawnBall(ball, canvasWidth, canvasHeight)
    if ball.pos['x'] >= canvasWidth + ball.radius:
        paddle_1.score += 1
        await respawnBall(ball, canvasWidth, canvasHeight)


class Paddle:
    def __init__(self, pos , velocity, width, height, leftOrRight):
        self.s = leftOrRight
        self.pos = pos
        self.velocity = velocity
        self.width = width
        self.height = height
        self.score = 0

    async def update (self ,key):
        if (key == 38):
            self.pos['y'] -= self.velocity['y']
        if (key == 40):
            print(f"y ====:    {self.pos['y'] }")
            self.pos['y'] += self.velocity['y']
            print(f"y ====:    {self.pos['y'] }")

    def json(self):
        message = {
            'action' : 'paddle',
            'pos' : self.pos,
            'width' : self.width,
            'height' : self.height,
        }
        return message
    
    def getHalfWidth(self):
        return self.width / 2

    def getHalfHeight(self):
        return self.height / 2


    def getCenter (self):
        return vec2(self.pos['x'] + self.getHalfWidth(), self.pos['y'] + self.getHalfHeight())


class Ball():
    def __init__(self, pos , velocity, radius):
        self.pos = pos
        self.velocity = velocity
        self.radius = radius

    async def update(self):
        self.pos['x'] += self.velocity['x']
        self.pos['y'] += self.velocity['y']

class roomData:
    def __init__(self, paddle_1, paddle_2, ball, id1, id2):
        self.paddle_1 = paddle_1
        self.paddle_2 = paddle_2
        self.ball = ball
        self.size = 0
        self.start = True
        self.user1_id = id1
        self.user2_id = id2
    def json(self):
        message = {
                        "action": "data",
                        "paddle_1" :
                        {
                            's': self.paddle_1.s,
                            'pos' : self.paddle_1.pos,
                            'velocity' : self.paddle_1.velocity,
                            'width' : self.paddle_1.width,
                            'height' : self.paddle_1.height,
                            'score' : self.paddle_1.score
                        },
                        "paddle_2" :
                        {
                            's': self.paddle_2.s,
                            'pos' : self.paddle_2.pos,
                            'velocity' : self.paddle_2.velocity,
                            'width' : self.paddle_2.width,
                            'height' : self.paddle_2.height,
                            'score' : self.paddle_2.score
                        },
                        "ball":
                        {
                            'pos' : self.ball.pos , 
                            'velocity' : self.ball.velocity ,
                            'radius' : self.ball.radius
                        }
                }
        return message


