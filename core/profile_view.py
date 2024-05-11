from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.decorators import api_view
from .serializer import UserSerializer, HistoryMatchSerializer

from django.contrib.auth.decorators import login_required
from .models import User, Match, HistoryMatch, Friend
from django.shortcuts import render, redirect
from .jwt import generate_jwt, decode_jwt
from django.http import HttpResponse, JsonResponse, HttpResponseRedirect, HttpResponseBadRequest
import jwt
from django.core.serializers import serialize
from django.db.models import Q

class signin(APIView):
    def get(self, request):
        token = request.COOKIES.get('jwt')
        if not token:
            return render(request, 'signin.html')
        try:
            user = decode_jwt(token)
        except jwt.ExpiredSignatureError:
            return render(request, 'signin.html')
        serializer = UserSerializer(user)
        response = (User.objects.filter(id=user.id).values(
            "id",
            "username",
            "email",
            "loses",
            "wins"
        ).first())
        return Response(serializer.data)
    def post(self, request):
        username = request.POST['username']
        password = request.POST['password']
        user = User.objects.filter(username=username).first()
        if user is None:
            response = Response({"message": "not found"}, status=404)
            return response
        if not user.check_password(password):
            return HttpResponse('invalid password')
        payload = generate_jwt(user)
        response = Response({"message": "Success"}, status=200)
        response.set_cookie(key='jwt', value=payload, httponly=True)
        return response


class signup(APIView):
    def get(self, request):
        token = request.COOKIES.get('jwt')
        if not token:
            return render(request, 'signup.html')
        try:
            paylod = decode_jwt(token)
        except jwt.ExpiredSignatureError:
            return render(request, 'signup.html')
        user = User.objects.filter(id=paylod['id']).first()
        serializer = UserSerializer(user)
        return Response(serializer.data)
    def post(self, request):
        serializer = UserSerializer(data=request.POST)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return redirect('signin')

class logout(APIView):
    def get(self, request):
        response = Response({"message": "success"})
        response.delete_cookie('jwt')
        return response

class UsersList(APIView):
    def get(self, request):
        users = User.objects.all()
        serializer = UserSerializer(users, many=True)
        return Response(serializer.data)

class UserFriends(APIView):
    def get(self, request):
        token = request.COOKIES.get('jwt')
        if not token:
            return Response({"message": "unauthorized"})
        try:
            user = decode_jwt(token)
        except jwt.ExpiredSignatureError:
                return Response({"message": "Expired Signature"})
        usr = User.objects.get(pk=user.id)
        friends = usr.friends.all()
        serializ = UserSerializer(friends, many=True)
        return Response({"Friends": serializ.data})
    def post(self, request, id):
        token = request.COOKIES.get('jwt')
        if not token:
            return Response({"message": "unauthorized"}, status=401)
        try:
            user = decode_jwt(token)
        except jwt.ExpiredSignatureError:
            return Response({"message": "Expired Signature"}, status=401)
        try:
            user_obj = User.objects.get(pk=user.id)
        except User.DoesNotExist:
            return Response({"message": "User not found"}, status=404)
        try:
            friend = User.objects.get(pk=id)
        except User.DoesNotExist:
            return Response({"message": "Friend not found"}, status=404)
        Friend.objects.create(from_user=user_obj, to_user=friend)
        return Response({"message": "Friend added successfully"}, status=201)

class UserHistory(APIView):
    def get(self, request, id):
        user_history_matches = HistoryMatch.objects.filter(Q(player1=id) | Q(player2=id))
        his_serializer = HistoryMatchSerializer(user_history_matches, many=True)
        return Response(his_serializer.data)

class SearchUsers(APIView):
    def get(self, request):
        print(request.query_params)
        query = request.query_params.get('q', None)
        if not query:
            return HttpResponseBadRequest("Bad Request")
        elif query:
            users = User.objects.filter(username__icontains=query)
        else:
            users = User.objects.all()
        serializer = UserSerializer(users, many=True)
        return Response(serializer.data)
    
# class update(APIView):

class Spa(APIView):
    def get(self, request):
        return render(request, 'spa/spa.html')
