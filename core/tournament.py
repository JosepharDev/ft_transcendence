
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


class TournamentConsumer(AsyncWebsocketConsumer):

    @database_sync_to_async
    def checkUserStatus(self, user_id):
        try:
            user = User.objects.get(pk=user_id)
            return user.game_status
        except User.DoesNotExist:
            # Handle the case where the user does not exist
            return "ERR"

    @database_sync_to_async
    def getCurrentRoom(self, user_id):
        try:
            user = User.objects.get(pk=user_id)
            return user.current_room
        except User.DoesNotExist:
            # Handle the case where the user does not exist
            return "ERR"

    @database_sync_to_async
    def update_userStatus(self, user_id, status):
        try:
            user = User.objects.get(pk=user_id)
            user.game_status = status
            if (status == 'no_game'):
                user.game_type = 'N' #none
            else:
                user.game_type = 'T' #TOURNAMENT
            user.save()
        except User.DoesNotExist:
            # Handle the case where the user does not exist
            return "ERR"

    @database_sync_to_async
    def update_room(self, user_id, rm):
        try:
            user = User.objects.get(pk=user_id)
            user.current_room = rm
            user.save()
        except User.DoesNotExist:
            # Handle the case where the user does not exist
            return "ERR"


    async def connect(self):

        global queue
        global canvasWidth__
        global canvasHeight__
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

        await self.accept()

        self.iam_playing  = False
        self.update_to_nogame = False
        self.justDisconnect = False

        self.user_group_name = generate_random_string(20)

        if len(queue) == 0:
            curr_room = generate_random_string(23)
        
        if len(queue) < 4:
            self.room_room = curr_room


        #add user to his group
        await self.channel_layer.group_add(
            self.user_group_name, self.channel_name
        )
        


        stats = await self.checkUserStatus(self.scope['user'].id)
        if (stats == 'in_game' ):
            if self.scope['user'].game_type == 'T':
                self.iam_playing = True
                self.room_room = await self.getCurrentRoom(self.scope['user'].id)
                print(f"=============>{self.room_room}")
                await self.channel_layer.group_add(
                    self.room_room, self.channel_name
                )
            else:
                self.justDisconnect = True
                await self.channel_layer.group_send(
                            self.user_group_name,
                            {"type": "send.message", "message": {'action': 'NA'}} )

            #later send users data
            # await self.channel_layer.group_send(
            #         self.room_room,
            #         {"type": "send.message", "message": {'action': 'users', 'user1': queue[0]['username'], 'user2':
            #                                             self.scope['user'].username}}
            #     )


            return
        elif (stats == 'waiting'):
            self.justDisconnect = True
            await self.channel_layer.group_send(
                        self.user_group_name,
                        {"type": "send.message", "message": {'action': 'NA'}} )
            return


        print("=======================================================================================")
        print(self.scope['user'].username)
        print("=======================================================================================")


        userData = {
                        'id'       : self.scope['user'].id,
                        'username' : self.scope['user'].username,
                        'avatar'   : self.scope['user'].avatar.url,
                    }
        queue.append(userData)


        await self.channel_layer.group_send(
                    self.user_group_name,
                    {"type": "send.message", "message": {'action': 'id', 'message':f"{self.scope['user'].id}"}}
                )

        #user join room
        await self.channel_layer.group_add(
                self.room_room, self.channel_name
            )

        if len(queue) == 4:
            #to update player status he is playing
            await self.channel_layer.group_send(
                    self.room_room,
                    {
                        "type": "send.message",
                        "message": {'action': 'play', 'message':"start"}
                    }
                )

            random.shuffle(queue)
            rooms[self.room_room] = roomData(queue[0], queue[1], queue[2], queue[3])


            #send users data && starts counter in the client
            data_ = {
                'action': 'allusers',
                'user1': queue[0]['username'], #change to nickname
                'user2': queue[1]['username'],
                'user3': queue[2]['username'],
                'user4': queue[3]['username'],
                'avatar1': queue[0]['avatar'],
                'avatar2': queue[1]['avatar'],
                'avatar3': queue[2]['avatar'],
                'avatar4': queue[3]['avatar'],
            }

            await self.channel_layer.group_send(
                    self.room_room,
                    {"type": "send.message", "message": data_}
                )

            await self.update_room(queue[0]['id'], self.room_room)
            await self.update_room(queue[1]['id'], self.room_room)
            await self.update_room(queue[2]['id'], self.room_room)
            await self.update_room(queue[3]['id'], self.room_room)

            queue.pop(0)
            queue.pop(0)
            queue.pop(0)
            queue.pop(0)

            #start game
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

        # try:
        if self.justDisconnect:
            return

        if (self.iam_playing == False):
            await self.update_userStatus(self.scope['user'].id, 'no_game')

            for pl in queue:
                if pl["id"] == self.scope['user'].id:
                    queue.remove(pl)
                    break


        await self.channel_layer.group_discard(
            self.user_group_name, self.channel_name
        )

        await self.channel_layer.group_discard(
            self.room_room, self.channel_name
        )

        # except:
        #     pass
        print (f"quite room {self.room_room}")



    async def receive(self, text_data):
        # try:
            message = json.loads(text_data)
            print ("receievevvevevve")
            print (message)
            print (self.iam_playing)
            if (message['action'] == 'P' and self.iam_playing):
                if (rooms[self.room_room].paddle_1.id == self.scope['user'].id): 
                    rooms[self.room_room].isKeyPdPressed_1 = True
                    rooms[self.room_room].whichKeyPressed_1 = message['code']

                elif (rooms[self.room_room].paddle_2.id == self.scope['user'].id): 
                    rooms[self.room_room].isKeyPdPressed_2 = True
                    rooms[self.room_room].whichKeyPressed_2 = message['code']
    
            elif (message['action'] == 'U' and self.iam_playing):
                if (rooms[self.room_room].paddle_1.id == self.scope['user'].id):
                    rooms[self.room_room].isKeyPdPressed_1 = False
                    rooms[self.room_room].whichKeyPressed_1 = message['code']

                elif (rooms[self.room_room].paddle_2.id == self.scope['user'].id):
                    rooms[self.room_room].isKeyPdPressed_2 = False
                    rooms[self.room_room].whichKeyPressed_2 = message['code']
            
        # except:
        #     pass 

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
        

        # await asyncio.sleep(2)
        async def gameLoop():
            # try:

                if rooms[self.room_room].round == 0:
                    rooms[self.room_room].paddle_1 = Paddle(vec2(0,70), vec2(10,10), 10 , 90, 1, rooms[self.room_room].match1_1)
                    rooms[self.room_room].paddle_2 = Paddle(vec2(canvasWidth__ - 10, 20), vec2(10, 10), 10 ,90, 2,  rooms[self.room_room].match1_2)
                    rooms[self.room_room].ball = Ball(vec2(20,20), vec2(10,10), 10)

                    data_ = {
                                'action': 'users', 
                                'user1': rooms[self.room_room].mapiUsername[rooms[self.room_room].match1_1],
                                'user2': rooms[self.room_room].mapiUsername[rooms[self.room_room].match1_2],
                                'avatar1' : rooms[self.room_room].mapiAvatar[rooms[self.room_room].match1_1],
                                'avatar2' : rooms[self.room_room].mapiAvatar[rooms[self.room_room].match1_2],
                            }
                    
                    await self.channel_layer.group_send(
                        self.room_room,
                            {"type": "send.message", "message": data_} )

                    pass

                elif rooms[self.room_room].round == 1:
                    rooms[self.room_room].paddle_1 = Paddle(vec2(0,70), vec2(10,10), 10 , 90, 1, rooms[self.room_room].match2_1)
                    rooms[self.room_room].paddle_2 = Paddle(vec2(canvasWidth__ - 10, 20), vec2(10, 10), 10 ,90, 2,  rooms[self.room_room].match2_2)
                    
                    data_ = {
                                'action': 'users', 
                                'user1': rooms[self.room_room].mapiUsername[rooms[self.room_room].match2_1],
                                'user2': rooms[self.room_room].mapiUsername[rooms[self.room_room].match2_2],
                                'avatar1' : rooms[self.room_room].mapiAvatar[rooms[self.room_room].match2_1],
                                'avatar2' : rooms[self.room_room].mapiAvatar[rooms[self.room_room].match2_2],
                            }   

                    await self.channel_layer.group_send(
                        self.room_room,
                            {"type": "send.message", "message": data_} )


                elif rooms[self.room_room].round == 2:
                    rooms[self.room_room].paddle_1 = Paddle(vec2(0,70), vec2(10,10), 10 , 90, 1, rooms[self.room_room].win1)
                    rooms[self.room_room].paddle_2 = Paddle(vec2(canvasWidth__ - 10, 20), vec2(10, 10), 10 ,90, 2,  rooms[self.room_room].win2)
                    
                    data_ = {
                            'action': 'users', 
                            'user1': rooms[self.room_room].mapiUsername[rooms[self.room_room].win1],
                            'user2': rooms[self.room_room].mapiUsername[rooms[self.room_room].win2],
                            'avatar1' : rooms[self.room_room].mapiAvatar[rooms[self.room_room].win1],
                            'avatar2' : rooms[self.room_room].mapiAvatar[rooms[self.room_room].win2],
                        }   

                    await self.channel_layer.group_send(
                        self.room_room,
                            {"type": "send.message", "message": data_} )


                await asyncio.sleep(4)
                

                while True:

                    if (self.room_room not in rooms):
                        break
                    
                    if rooms[self.room_room].paddle_1.score >= 7 or rooms[self.room_room].paddle_2.score >= 7:
                        if rooms[self.room_room].paddle_1.score >= 7:
                            winn = rooms[self.room_room].paddle_1.id
                        else:
                            winn = rooms[self.room_room].paddle_2.id

                        if rooms[self.room_room].round == 0:
                            rooms[self.room_room].win1 = winn
                            typeMatch = 'round1'
                        elif rooms[self.room_room].round == 1:
                            rooms[self.room_room].win2 = winn
                            typeMatch = 'round2'
                        else:
                            typeMatch = 'final'

                            
                        dta = {
                            "action": typeMatch,
                            "winner" : rooms[self.room_room].mapiUsername[winn]
                        }
                        await self.channel_layer.group_send(
                                self.room_room, {"type": "send.message", "message": dta}
                            )

                        if typeMatch == 'final':
                            await self.finishMatch(self.room_room)
                        break



                    if  rooms[self.room_room].isKeyPdPressed_1:
                        await rooms[self.room_room].paddle_1.update(rooms[self.room_room].whichKeyPressed_1)
                    if  rooms[self.room_room].isKeyPdPressed_2:
                        await rooms[self.room_room].paddle_2.update(rooms[self.room_room].whichKeyPressed_2)


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

                if (self.room_room not in rooms):
                    return
                rooms[self.room_room].round += 1
                if rooms[self.room_room].round == 1 or rooms[self.room_room].round == 2:
                    await asyncio.sleep(4)
                    rooms[self.room_room].paddle_1.score = 0
                    rooms[self.room_room].paddle_2.score = 0
                    rooms[self.room_room].ball = Ball(vec2(20,20), vec2(10,10), 10)
                    rooms[self.room_room].isKeyPdPressed_1 = False
                    rooms[self.room_room].isKeyPdPressed_2 = False
                    await gameLoop()
            # except:
            #     pass

        asyncio.create_task(gameLoop())




    @database_sync_to_async
    def finishMatch(self, roomName):
        u1 = User.objects.get(pk=rooms[roomName].user1_id)
        u2 = User.objects.get(pk=rooms[roomName].user2_id)
        u3 = User.objects.get(pk=rooms[roomName].user3_id)
        u4 = User.objects.get(pk=rooms[roomName].user4_id)

        u1.game_status = "no_game"
        u2.game_status = "no_game"
        u3.game_status = "no_game"
        u4.game_status = "no_game"

        u1.save()
        u2.save()
        u3.save()
        u4.save()

        # match_ = Match(player1=u1, player2=u2, winner=u1, loser=u2, plr1_count=rooms[roomName].paddle_1.score,
                            # plr2_count=rooms[roomName].paddle_2.score)

        # match_.save()
        del rooms[roomName]


    
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
            # print(f"y ====:    {self.pos['y'] }")
            self.pos['y'] += self.velocity['y']
            # print(f"y ====:    {self.pos['y'] }")

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
    def __init__(self, user1Data, user2Data, user3Data, user4Data):

        self.paddle_1 = None
        self.paddle_2 = None
        self.ball = None
        self.round = 0
        self.start = True

        self.match1_1 = user1Data['id']
        self.match1_2 = user2Data['id']

        self.match2_1 = user3Data['id']
        self.match2_2 = user4Data['id']

        self.win1 = 0
        self.win2 = 0

        self.user1_id = user1Data['id']
        self.user2_id = user2Data['id']
        self.user3_id = user3Data['id']
        self.user4_id = user4Data['id']
        

        self.mapiUsername = {
            user1Data['id'] : user1Data['username'],
            user2Data['id'] : user2Data['username'],
            user3Data['id'] : user3Data['username'],
            user4Data['id'] : user4Data['username'],
        }

        self.mapiAvatar = {
            user1Data['id'] : user1Data['avatar'],
            user2Data['id'] : user2Data['avatar'],
            user3Data['id'] : user3Data['avatar'],
            user4Data['id'] : user4Data['avatar'],
        }
        

        self.isKeyPdPressed_1 = False
        self.whichKeyPressed_1 = 0

        self.isKeyPdPressed_2 = False
        self.whichKeyPressed_2 = 0

    def json(self):
        message = {
                        "action": "data",
                        "paddle_1" :
                        {
                            'pos' : self.paddle_1.pos,
                            'width' : self.paddle_1.width,
                            'height' : self.paddle_1.height,
                            'score' : self.paddle_1.score
                        },
                        "paddle_2" :
                        {
                            'pos' : self.paddle_2.pos,
                            'width' : self.paddle_2.width,
                            'height' : self.paddle_2.height,
                            'score' : self.paddle_2.score
                        },
                        "ball":
                        {
                            'pos' : self.ball.pos , 
                            'radius' : self.ball.radius

                        }
                }
        return message


