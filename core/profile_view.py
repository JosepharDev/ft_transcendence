from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.decorators import api_view
from .serializer import UserSerializer, HistoryMatchSerializer
from rest_framework import status

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
            return Response({"message": "not signin"}, status=200)
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
            return Response({"message": "invalid password"}, status=403)
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
        # friends = usr.friends.all()
        friends = Friend.objects.filter(from_user=user)
        jj = []
        for friend in friends:
            jj.append({'username' : friend.to_user.username,
                'id':friend.to_user.id
            })


        # serializ = UserSerializer(friends, many=True)
        return Response(jj)
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
        is_friend = Friend.objects.filter(from_user=user, to_user=friend).exists()
        if (is_friend):
            jj = Friend.objects.get(from_user=user_obj, to_user=friend)
            jj.delete()
        else:
            Friend.objects.create(from_user=user_obj, to_user=friend)
        return Response({"message": "Friend added successfully"}, status=201)

class UserHistory(APIView):
    def get(self, request, id):
        user_history_matches = HistoryMatch.objects.filter(Q(player1=id) | Q(player2=id))
        his_serializer = HistoryMatchSerializer(user_history_matches, many=True)
        return Response(his_serializer.data)

class SearchUsers(APIView):
    def get(self, request):
        token = request.COOKIES.get('jwt')
        if not token:
            return Response({"message": "unauthorized"})
        try:
            user = decode_jwt(token)
        except jwt.ExpiredSignatureError:
                return Response({"message": "Expired Signature"})
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
    
class UpdateUser(APIView):
    def patch(self, request):
        token = request.COOKIES.get('jwt')
        if not token:
            return Response({"message": "unauthorized"})
        try:
            user = decode_jwt(token)
        except jwt.ExpiredSignatureError:
                return Response({"message": "Expired Signature"})
        user = User.objects.get(id=user.id)
        serializer = UserSerializer(user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            # print("88888888888888888888888******************************")
            # print(request.data)
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class Spa(APIView):
    def get(self, request):
        return render(request, 'spa/spa.html')

class Pong(APIView):
    def get(self, request):
        token = request.COOKIES.get('jwt')
        if not token:
            return render(request, 'signin.html')
        try:
            user = decode_jwt(token)
        except jwt.ExpiredSignatureError:
            return render(request, 'signin.html')
        return render(request, 'pong.html')


class AuthUser(APIView):
    def get(self, request):
        token = request.COOKIES.get('jwt')
        if not token:
            return Response({"message": "notfff"})
        try:
            user = decode_jwt(token)
        except jwt.ExpiredSignatureError:
            return Response({"message": "Expired Signature"})
        return Response({"message": "authenticated"})



# class SearchUsers(APIView):
#     def get(self, request):
#         print(request.query_params)
#         query = request.query_params.get('q', None)
#         if not query:
#             return HttpResponseBadRequest("Bad Request")
#         elif query:
#             users = User.objects.get(username__icontains=query)
#         else:
#             users = User.objects.all()
#         serializer = UserSerializer(users, many=True)
#         return Response(serializer.data)

class UserData(APIView):
    def get(self, request, id):
        token = request.COOKIES.get('jwt')
        if not token:
            return Response({"message": "unauthorized"})
        try:
            user = decode_jwt(token)
        except jwt.ExpiredSignatureError:
                return Response({"message": "Expired Signature"})
        users = User.objects.get(pk=id)
        serializer = UserSerializer(users)

        UserFriend = User.objects.get(id=id)
        is_friend = Friend.objects.filter(from_user=user, to_user=UserFriend).exists()
        # print(f"{serializer.data}")
        k = serializer.data
        k['friend'] = is_friend
        matches = Match.objects.filter(Q(player1=id) | Q(player2=id))
        mm = []
        for match in matches:
            lo = {
                'player1Email' : match.player1.email,
                'player2Email' : match.player2.email,
                'player1Score' : match.plr1_count,
                'player2Score' : match.plr2_count,
                'plr1img': match.player1.avatar.url,
                'plr2img': match.player2.avatar.url,
            }
            mm.append(lo)
        k['matches'] = mm
        # print(matches.player1.nickname)
        return Response(k)

class HistoMatch(APIView):
    def get(self, request, id):
        # user_history_matches = HistoryMatch.objects.filter(Q(player1=id) | Q(player2=id))
        matches = Match.objects.filter(Q(player1=id) | Q(player2=id))
        print(matches)
        # his_serializer = HistoryMatchSerializer(user_history_matches, many=True)
        return Response({'message': 'ok'})