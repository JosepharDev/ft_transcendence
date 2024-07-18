import jwt, datetime
from django.conf import settings
import jwt.exceptions

def generate_jwt(user, code):
    payload = {
        "user_id": user.id,
        "username": user.username,
        "2fa": user.is_2fa,
        "code": code,
        "exp": datetime.datetime.now(datetime.UTC) + datetime.timedelta(minutes=10)
    }
    return jwt.encode(payload, settings.SECRET_KEY, algorithm='HS256')