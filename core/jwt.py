import jwt, datetime
from .models import User
from django.conf import settings

def generate_jwt(user):
    payload = {
        "user_id": user.id,
        "username": user.username,
        "2fa": user.twofa,
        "code": False
    }
    return jwt.encode(payload, settings.SECRET_KEY, algorithm='HS256')

def decode_jwt(token):
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
        user_id = payload['user_id']
        return User.objects.get(pk=user_id)
    except (jwt.DecodeError, User.DoesNotExist):
        return None