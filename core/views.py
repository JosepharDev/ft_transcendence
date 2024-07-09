from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.decorators import api_view
from .serializer import UserSerializer
from django.shortcuts import render, redirect
from .models import User
from django.http import HttpResponse, JsonResponse
from django.contrib.auth import decorators
from django.views import View
from django.views.decorators.http import require_http_methods
from django.http import HttpResponse
from django import forms
from django.contrib import messages
# from .jwt import generate_jwt, decode_jwt
import jwt
from django.conf import settings
import json












# Create your views here.

# @login_required(login_url=)
# def signin(request):
#     if request.method == 'POST':
        

# def signup(request):

# @require_http_methods(["POST", "GET"])


# def signup(request):
#     if request.method == 'POST':
#         username = request.POST['username']
#         email = request.POST['email']
#         password = request.POST['password']
#         password2 = request.POST['password2']
#         if password == password2:
#             if User.objects.filter(email=email).exists():
#                 messages.info(request, 'Email Taken')
#                 return redirect('signup')
#             elif User.objects.filter(username=username).exists():
#                 messages.info(request, 'username Taken')
#                 return redirect('signup')
#             else:
#                 user = User.objects.create_user(username=username, email=email, password=password)
#                 user.save()
#                 #Log user in and redirect to settings page
#                 # user_login = auth.authenticate(username=username, password=password)
#                 # auth.login(request, user_login)
#                 #create a Profile object for the new user
#                 user_model = User.objects.get(username=username)
#                 return redirect('settings')
#         else:
#             messages.info(request, 'Password Not Matching')
#             return redirect('signup')
#     else:
#         return render(request, 'signup.html')



# class signin(View):
#     def get(self, request):
#         token = request.COOKIES.get('jwt')
#         if not token:
#             return render(request, 'signin.html')
#         try:
#             user = decode_jwt(token)
#         except jwt.ExpiredSignatureError:
#             return render(request, 'signin.html')
#         # user = User.objects.filter(id=payload['id']).first()
#         serializer = UserSerializer(user)
#         response = (User.objects.filter(id=user.id).values(
#             "id",
#             "username",
#             "email",
#             "loses",
#             "wins"
#         ).first())
#         # return JsonResponse(response)
#         return render(request, "home.html")
#     def post(self, request):
#         print(request.body)
#         username = request.POST['username']
#         password = request.POST['password']
#         print("----------------")
#         print(request.POST)
#         print("----------------")
#         user = User.objects.filter(username=username).first()
#         if user is None:
#             return HttpResponse('User Not found', status=404)
#         if not user.check_password(password):
#             return HttpResponse('invalid password')
#         payload = generate_jwt(user)
#         response = JsonResponse({"jwt": payload})
#         response.set_cookie(key='jwt', value=payload, httponly=True)
#         print('payload')
#         print(payload)
#         return response

