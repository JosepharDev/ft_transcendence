
import random
import jwt
import string
from channels.db import database_sync_to_async
from .models import User
from django.conf import settings

def vec2(x, y):
    return {'x': x, 'y': y}

def generate_random_string(length):
    characters = string.ascii_letters + string.digits
    random_string = ''.join(random.choices(characters, k=length))
    return random_string

async def decode_jwt(token):
    try:
        token = jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])
        user_id = token['user_id']
        if token['2fa'] == True:
            if token['code'] == False:
                return None
        try:
            user = await database_sync_to_async (User.objects.get)(pk=user_id)
            return user
        except User.DoesNotExist:
            return None
    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        return None