# from django.urls
from django.http import HttpResponse, JsonResponse
from rest_framework.response import Response
from django.conf import settings
from .models import User
import jwt
def check_auth(func):
    def wrapper(request, *args, **kwargs):
        token = request.COOKIES.get('jwt')
        if not token:
            return Response({"message": "not Signin"}, status=401)
        try:
            token = jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])
            user_id = token['user_id']
            if token['2fa'] :
                if token['code'] == False:
                    return Response({"message": "2fa"})
            try:
                user = User.objects.get(pk=user_id)
                request.user_id = token['user_id']
            except User.DoesNotExist:
                return Response({"message": "user Does Not Exist"})
            return func(request, *args, **kwargs)
        except jwt.ExpiredSignatureError:
            return Response({'message': 'Token has expired'})
        except jwt.InvalidTokenError:
            return Response({'message': 'Invalid token'})
    return wrapper     
