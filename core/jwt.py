import jwt, datetime
from .models import User
from django.conf import settings
import jwt.exceptions

def generate_jwt(user, code):
    payload = {
        "user_id": user.id,
        "username": user.username,
        "2fa": user.is_2fa,
        "code": code
    }
    return jwt.encode(payload, settings.SECRET_KEY, algorithm='HS256')

def decode_jwt(token):
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
        user_id = payload['user_id']
        return User.objects.get(pk=user_id)
    except (jwt.DecodeError, User.DoesNotExist):
        return None

def decode(token):
    try:
        return jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
    except jwt.DecodeError:
        return None