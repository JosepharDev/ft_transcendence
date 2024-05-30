
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

canvasWidth__ = 800
canvasHeight__ = 450

def vec2(x, y):
    return {'x': x, 'y': y}

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
        global canvasWidth__
        global canvasHeight__
        global curr_room

        print("88888888888888888888888888888888888888888888888888888888888888888888888888888888888888888")
        print(self.scope['cookies'].get('jwt'))
        print("88888888888888888888888888888888888888888888888888888888888888888888888888888888888888888")
        token = self.scope['cookies'].get('jwt')
        if not token:
            print({"message": "unauthorized"})
            return
        try:
            self.scope['user'] =  await decode_jwt(token)
        except jwt.ExpiredSignatureError:
            print({"message": "Expired Signature"})
            return

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

        # i should check the user if he is playing or waiting if so he cant play 2 matches at same time

        self.id_in_queue  = len(queue)
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
        stats = await self.checkUserStatus(self.scope['user'].id)
        if (stats != 'no_game'):
            await self.accept()
            await self.channel_layer.group_send(
                        self.user_group_name,
                        {"type": "send.message", "message": {'action': 'NA'}} )
            # print("=======================================================================================")

            # print(self.checkUserStatus(self.scope['user'].id))
            self.update_to_nogame = True
            # await self.close(1000)
            return


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

            paddle_1 = Paddle(vec2(0,70), vec2(40,40), 10 , 90, 1,  queue[0]['id'])
            paddle_2 = Paddle(vec2(canvasWidth__ - 10, 20), vec2(40, 40), 10 ,90, 2,  self.scope['user'].id)
            ball = Ball(vec2(20,20), vec2(10,10), 10)

            rooms[self.room_room] = roomData(paddle_1, paddle_2, ball, queue[0]['id'], self.scope['user'].id)


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
            await self.update_userStatus(self.scope['user'].id, 'waiting')
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
                print ("hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh")
                u1 = await database_sync_to_async (User.objects.get)(pk=rooms[self.room_room].user1_id)
                u2 = await database_sync_to_async (User.objects.get)(pk=rooms[self.room_room].user2_id)
                ###################################3

                if rooms[self.room_room].paddle_1.score >= 7 or rooms[self.room_room].paddle_2.score >= 7:
                        if rooms[self.room_room].paddle_1.score >= 7:
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
                        rooms[self.room_room].paddle_2.score = 7
                        usernamee = await self.getUsername(rooms[self.room_room].user2_id)
                        dta = {
                            "action": "finish",
                            "winner" : usernamee
                        }
                    else :
                        rooms[self.room_room].paddle_1.score = 7
                        rooms[self.room_room].paddle_2.score = 0
                        usernamee = await self.getUsername(rooms[self.room_room].user1_id)
                        dta = {
                            "action": "finish",
                            "winner" : usernamee
                        }
                    await self.channel_layer.group_send(
                                self.room_room, {"type": "send.message", "message": dta}
                        )

                ######################################
                match_ = await database_sync_to_async (Match)(player1=u1, player2=u2, winner=u1, loser=u2, plr1_count=rooms[self.room_room].paddle_1.score,
                    plr2_count=rooms[self.room_room].paddle_2.score)
                await database_sync_to_async (match_.save)()

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
                messageSend = 0
                print ("------------------------------------")
                if (rooms[self.room_room].paddle_1.id == self.scope['user'].id):
                    await rooms[self.room_room].paddle_1.update(message['code'])
                else:
                    await rooms[self.room_room].paddle_2.update(message['code'])
        except:
            pass 

    async def send_message(self, event):
        message = event["message"]

        if message['action'] == "play":
            self.iam_playing = True
            await self.update_userStatus(self.scope['user'].id, 'in_game')
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
        
        
        await asyncio.sleep(2)
        async def gameLoop():
            try:
                while True:

                    if (self.room_room not in rooms):
                        break
                    
                    if rooms[self.room_room].paddle_1.score >= 7 or rooms[self.room_room].paddle_2.score >= 7:
                        if rooms[self.room_room].paddle_1.score >= 7:
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

                    await paddleCollisionWithEdges(rooms[self.room_room].paddle_1, canvasHeight__)
                    await paddleCollisionWithEdges(rooms[self.room_room].paddle_2, canvasHeight__)

                    await ballCollisionWithEdges(rooms[self.room_room].ball, canvasHeight__)

                    await ballPaddleCollision(rooms[self.room_room].ball, rooms[self.room_room].paddle_1)
                    await ballPaddleCollision(rooms[self.room_room].ball, rooms[self.room_room].paddle_2)
                    await increaseScore(rooms[self.room_room].ball, rooms[self.room_room].paddle_1, rooms[self.room_room].paddle_2, canvasWidth__, canvasHeight__)
                    await rooms[self.room_room].ball.update()


                    await self.channel_layer.group_send(
                        self.room_room, {"type": "send.message", "message": rooms[self.room_room].json()}
                    )
                    await asyncio.sleep(0.016)
            except:
                pass

        asyncio.create_task(gameLoop())


async def paddleCollisionWithEdges(paddle, canvasHeight):
    if paddle.pos['y'] < 0:
        paddle.pos['y'] = 0
    if paddle.pos['y'] + paddle.height > canvasHeight:
        paddle.pos['y'] = canvasHeight - paddle.height


async def ballCollisionWithEdges(ball, canvasHeight):
    if ball.pos['y'] + ball.radius >= canvasHeight :
        ball.velocity['y'] = abs (ball.velocity['y']) * (-1)
    elif ball.pos['y'] - ball.radius <= 0 :
        ball.velocity['y'] = abs (ball.velocity['y'])
        # await ball.update()
    #print(f"ball collision-------------{ball.pos['x']}  {ball.pos['y']}    {ball.pos['y'] + ball.radius >= canvasHeight}------------------")



async def ballPaddleCollision(ball, paddle):

    dx = abs(ball.pos['x'] - paddle.getCenter()['x'])
    dy = abs(ball.pos['y'] - paddle.getCenter()['y'])

    if dx < (ball.radius + paddle.getHalfWidth()) and dy < (paddle.getHalfHeight() + ball.radius) \
            and  ball.pos['y'] >= paddle.pos['y'] and ball.pos['y'] <= paddle.pos['y'] + paddle.height:
        if paddle.s == 1:
            ball.pos['x'] = (paddle.pos['x'] + paddle.width) + 5 # // if ball gets stuck
        else:
            ball.pos['x'] = paddle.pos['x'] - paddle.width - 5 #// if ball gets stuck
        deltay = ball.pos['y'] - (paddle.pos['y'] + paddle.height/2)
        ball.velocity['y'] = deltay * 0.25
        ball.velocity['x'] *= -1
        j = 1
        if ((ball.velocity['x'] < 0)):
            j = -1

        ball.velocity['x'] = (abs(ball.velocity['x']) + 0.06) * j

async def respawnBall(ball, canvasWidth, canvasHeight):
    if (ball.velocity['x'] > 0):
        ball.pos['x'] = canvasWidth - 150
        ball.pos['y'] = random.uniform(100, canvasHeight - 100)

    if (ball.velocity['x'] < 0):
        ball.pos['x'] = 150
        ball.pos['y'] = random.uniform(100, canvasHeight - 100)

    ball.velocity['x'] *= -1
    ball.velocity['y'] *= -1
    j = 1
    if ((ball.velocity['x'] < 0)):
        j = -1

    ball.velocity['x'] = 10 * j



async def increaseScore(ball, paddle_1, paddle_2, canvasWidth, canvasHeight):
    if ball.pos['x'] <= -ball.radius:
        paddle_2.score += 1
        await respawnBall(ball, canvasWidth, canvasHeight)
    if ball.pos['x'] >= canvasWidth + ball.radius:
        paddle_1.score += 1
        await respawnBall(ball, canvasWidth, canvasHeight)


class Paddle:
    def __init__(self, pos , velocity, width, height, leftOrRight, id):
        self.s = leftOrRight
        self.pos = pos
        self.velocity = velocity
        self.width = width
        self.height = height
        self.score = 0
        self.id = id
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


