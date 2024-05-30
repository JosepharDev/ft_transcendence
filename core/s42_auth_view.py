from .serializer import UserSerializer
from .jwt import generate_jwt, decode_jwt
from .models import User
from rest_framework.decorators import api_view
from django.conf import settings
from django.shortcuts import redirect
import requests
import urllib.parse
from datetime import datetime, timedelta
from .models import User
import jwt
from django.http import JsonResponse
from rest_framework.response import Response
from django.core.files.base import ContentFile
from django.http import HttpResponse, HttpResponseRedirect
import requests
from rest_framework import status


@api_view(['POST'])
def auth_42_api(request):
    params = {
        'client_id': settings.UID,
        'redirect_uri': settings.REDIRECT_INTRA,
        'response_type': 'code',
    }
    url = f"https://api.intra.42.fr/oauth/authorize?{urllib.parse.urlencode(params)}"
    return redirect(url)

@api_view(['GET'])
def auth_42_api_callback(request):
    code = request.GET.get('code')
    if not code:
        return Response({'error': 'No code provided'}, status=status.HTTP_400_BAD_REQUEST)

    token_url = 'https://api.intra.42.fr/oauth/token'
    token_data = {
        'grant_type': 'authorization_code',
        'client_id': settings.UID,
        'client_secret': settings.INTRA_SECRET,
        'code': code,
        'redirect_uri': settings.REDIRECT_INTRA,
    }

    token_response = requests.post(token_url, data=token_data)
    if token_response.status_code != 200:
        return Response({'error': 'Failed to retrieve token'}, status=token_response.status_code)
    
    token_json = token_response.json()
    if 'access_token' not in token_json:
        return Response({'error': 'Invalid token response'}, status=status.HTTP_400_BAD_REQUEST)
    user_info_url = 'https://api.intra.42.fr/v2/me'
    headers = {'Authorization': f"Bearer {token_json['access_token']}"}
    user_info_response = requests.get(user_info_url, headers=headers)
    if user_info_response.status_code != 200:
        return Response({'error': 'Failed to retrieve user info'}, status=user_info_response.status_code)

    user_info = user_info_response.json()

    user_data = {
        're': user_info['id'],
        'username': user_info['login'],
        'email': user_info.get('email', ''), 
        'status': 'active',  
    }
    avatar_link = user_info.get('image', {}).get('link', '')
    if avatar_link:
        avatar_response = requests.get(avatar_link)
        if avatar_response.status_code == 200:
            avatar_content = ContentFile(avatar_response.content, name="avatar.JPG")
            user_data['avatar'] = avatar_content
    try:
        u = User.objects.get(re=user_info['id'])
    except:
        u = None
    if u:
        jwt_payload = {
            'user_id': u.id,
            'username': u.username,
            'exp': datetime.now() + timedelta(hours=24),
        }
        jwt_token = jwt.encode(jwt_payload, settings.SECRET_KEY, algorithm='HS256')
    else:
        user_serializer = UserSerializer(data=user_data)
        if user_serializer.is_valid(raise_exception=True):
            user = user_serializer.save() 
            user.intra = True
            user.save()
            jwt_payload = {
                'user_id': user.id,
                'username': user.username,
                'exp': datetime.now() + timedelta(hours=24),
            }
            jwt_token = jwt.encode(jwt_payload, settings.SECRET_KEY, algorithm='HS256')


    r = HttpResponseRedirect('/api/spa/')
    r.set_cookie(key="jwt", value=jwt_token, httponly=True, secure=True)
    return r

