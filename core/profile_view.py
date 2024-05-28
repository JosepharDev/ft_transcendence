from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.decorators import api_view
from .serializer import UserSerializer, HistoryMatchSerializer
from rest_framework import status

from django.contrib.auth.decorators import login_required
from .models import User, Match, HistoryMatch, Friend
from django.shortcuts import render, redirect
from .jwt import generate_jwt, decode_jwt, decode
from django.http import HttpResponse, JsonResponse, HttpResponseRedirect, HttpResponseBadRequest
import jwt
from django.core.serializers import serialize
from django.db.models import Q

class signin(APIView):
    def get(self, request):
        token = request.COOKIES.get('jwt')
        if not token:
            # return Response({"message": "not signin"}, status=200)
            return render(request, 'signin.html')
        try:
            user = decode_jwt(token)
        except jwt.ExpiredSignatureError:
            return render(request, 'signin.html')
        token_code = decode(token)
        if user.is_2fa == True and token_code['code'] == False:
            return Response({"message": "2fa"})
        serializer = UserSerializer(user)
        return Response(serializer.data)
    def post(self, request):
        print("FFFFFFFFFFFFFFFF")
        username = request.POST['username']
        user = User.objects.filter(username=username).first()
        if user is None:
            response = Response({"message": "not found"}, status=404)
            return response
        if user.is_2fa == True:
            payload = generate_jwt(user, False)
        else:
            payload = generate_jwt(user, True)
        response = Response({"message": "Success"}, status=200)
        response.set_cookie(key='jwt', value=payload, httponly=True)
        return response

class logout(APIView):
    def get(self, request):
        token = request.COOKIES.get('jwt')
        if not token:
            return Response({"message": "not signin"}, status=403)
        try:
            user = decode_jwt(token)
        except jwt.ExpiredSignatureError:
            return Response({'message':"invalid signature"}, status=400)
        token_code = decode(token)
        if user.is_2fa == True and token_code['code'] == False:
            return Response({"message": "2fa"}, status=403)
        
        response = Response({"message": "success"})
        response.delete_cookie('jwt')
        return response

class UsersList(APIView):
    def get(self, request):
        token = request.COOKIES.get('jwt')
        if not token:
            return Response({"message": "unauthorized"}, status=403)
        try:
            user = decode_jwt(token)
        except jwt.ExpiredSignatureError:
            return Response({'message':"invalid signature"}, status=400)
        token_code = decode(token)
        if user.is_2fa == True and token_code['code'] == False:
            return Response({"message": "2fa"}, status=403)
        
        users = User.objects.all()
        serializer = UserSerializer(users, many=True)
        return Response(serializer.data)


############################yoyahya

# class UserFriends(APIView):
#     def get(self, request):
#         token = request.COOKIES.get('jwt')
#         if not token:
#             return Response({"message": "unauthorized"}, status=403)
#         try:
#             user = decode_jwt(token)
#         except jwt.ExpiredSignatureError:
#             return Response({'message':"invalid signature"}, status=400)
#         token_code = decode(token)
#         if user.is_2fa == True and token_code['code'] == False:
#             return Response({"message": "2fa"}, status=403)
        
#         usr = User.objects.get(pk=user.id)
#         # friends = usr.friends.all()
#         friends = Friend.objects.filter(from_user=user)
#         jj = []
#         for friend in friends:
#             jj.append({'username' : friend.to_user.username,
#                 'id':friend.to_user.id
#             })


#         # serializ = UserSerializer(friends, many=True)
#         return Response(jj)
#     def post(self, request, id):
#         token = request.COOKIES.get('jwt')
#         if not token:
#             return Response({"message": "unauthorized"}, status=403)
#         try:
#             user = decode_jwt(token)
#         except jwt.ExpiredSignatureError:
#             return Response({'message':"invalid signature"}, status=400)
#         token_code = decode(token)
#         if user.is_2fa == True and token_code['code'] == False:
#             return Response({"message": "2fa"}, status=403)
        
#         try:
#             user_obj = User.objects.get(pk=user.id)
#         except User.DoesNotExist:
#             return Response({"message": "User not found"}, status=404)
#         try:
#             friend = User.objects.get(pk=id)
#         except User.DoesNotExist:
#             return Response({"message": "Friend not found"}, status=404)
#         is_friend = Friend.objects.filter(from_user=user, to_user=friend).exists()
#         # print('&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&')
#         print(request.POST['data'] == "Unfollow")
#         # print('&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&')
#         if (is_friend):
#             jj = Friend.objects.get(from_user=user_obj, to_user=friend)
#             jj.delete()
#         else:
#             Friend.objects.create(from_user=user_obj, to_user=friend)
#         return Response({"message": "Friend added successfully"}, status=201)





#################################




class UserHistory(APIView):
    def get(self, request, id):
        token = request.COOKIES.get('jwt')
        if not token:
            return Response({"message": "unauthorized"}, status=403)
        try:
            user = decode_jwt(token)
        except jwt.ExpiredSignatureError:
            return Response({'message':"invalid signature"}, status=400)
        token_code = decode(token)
        if user.is_2fa == True and token_code['code'] == False:
            return Response({"message": "2fa"}, status=403)
    
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
        token_code = decode(token)
        if user.is_2fa == True and token_code['code'] == False:
            return Response({"message": "2fa code required"}, status=403)

        print(request.query_params)
        query = request.query_params.get('q', None)
        if not query:
            return HttpResponseBadRequest("bad Request")
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
        token_code = decode(token)
        if user.is_2fa == True and token_code['code'] == False:
            return Response({"message": "2fa code required"})

        user = User.objects.get(id=user.id)
        serializer = UserSerializer(user, data=request.data, partial=True)
        if serializer.is_valid():
            # if ('password' in request.data and request.data['password'] == ""):
            #     print("44488888888888888888888888******************************")
            #     return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            # print(request.data['email'])
            serializer.save()
            return Response(serializer.data)
        print("not")
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class Spa(APIView):
    def get(self, request):
        return render(request, 'newSpa/newSpa.html')
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

class Toto(APIView):
    def get(self, request):
        token = request.COOKIES.get('jwt')
        if not token:
            return render(request, 'signin.html')
        try:
            user = decode_jwt(token)
        except jwt.ExpiredSignatureError:
            return render(request, 'signin.html')
        return render(request, 'oneone.html')

class AuthUser(APIView):
    def get(self, request):
        token = request.COOKIES.get('jwt')
        if not token:
            return Response({"message": "notfff"})
        try:
            user = decode_jwt(token)
        except jwt.ExpiredSignatureError:
            return Response({"message": "Expired Signature"})
        token_code = decode(token)
        print('******************************')
        print('******************************')
        print('******************************')
        print(user.username)
        print('******************************')
        print('******************************')
        print('******************************')
        if user.is_2fa == True and token_code['code'] == False:
            return Response({"message": "2fa"})
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
            return Response({"message": "unauthorized"}, status=403)
        try:
            user = decode_jwt(token)
        except jwt.ExpiredSignatureError:
            return Response({'message':"invalid signature"}, status=400)
        token_code = decode(token)
        if user.is_2fa == True and token_code['code'] == False:
            return Response({"message": "2fa"}, status=403)
    
        users = User.objects.get(pk=id)
        serializer = UserSerializer(users)

        UserFriend = User.objects.get(id=id)
        is_friend = Friend.objects.filter(from_user=user, to_user=UserFriend).exists()
        # print(f"{serializer.data}")
        k = serializer.data
        k['friend'] = is_friend
        k['its_me'] = (id == user.id)
        k['is_online'] = UserFriend.profile_status == 'online'
        print("*@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@")
        print(user.profile_status)
        print("*@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@")
        matches = Match.objects.filter(Q(player1=id) | Q(player2=id))
        mm = []
        for match in matches:
            lo = {
                'player1Email' : match.player1.username,
                'player2Email' : match.player2.username,
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
        token = request.COOKIES.get('jwt')
        if not token:
            return Response({"message": "unauthorized"}, status=403)
        try:
            user = decode_jwt(token)
        except jwt.ExpiredSignatureError:
            return Response({'message':"invalid signature"}, status=400)
        token_code = decode(token)
        if user.is_2fa == True and token_code['code'] == False:
            return Response({"message": "2fa"}, status=403)

        # user_history_matches = HistoryMatch.objects.filter(Q(player1=id) | Q(player2=id))
        matches = Match.objects.filter(Q(player1=id) | Q(player2=id))
        print(matches)
        # his_serializer = HistoryMatchSerializer(user_history_matches, many=True)
        return Response({'message': 'ok'})

class Enable2fa(APIView):
    def get(self, request):
        token = request.COOKIES.get('jwt')
        if not token:
            return Response({"message": "notfff"})
        try:
            user = decode_jwt(token)
        except jwt.ExpiredSignatureError:
            return Response({"message": "Expired Signature"})
        token_code = decode(token)
        if user.is_2fa:
            return Response({"message": "yes"})
        else:
            return Response({"message": "no"})













class UserFriends(APIView):
    def get(self, request):
        token = request.COOKIES.get('jwt')
        if not token:
            return Response({"message": "unauthorized"}, status=403)
        try:
            user = decode_jwt(token)
        except jwt.ExpiredSignatureError:
            return Response({'message':"invalid signature"}, status=400)
        token_code = decode(token)
        if user.is_2fa == True and token_code['code'] == False:
            return Response({"message": "2fa"}, status=403)
        
        usr = User.objects.get(pk=user.id)
        # friends = usr.friends.all()
        friends = Friend.objects.filter(from_user=user)
        jj = []
        for friend in friends:
            jj.append({'username' : friend.to_user.username,
                'id':friend.to_user.id,
                'avatar' : friend.to_user.avatar.url
            })


        # serializ = UserSerializer(friends, many=True)
        return Response(jj)
    def post(self, request, id):
        token = request.COOKIES.get('jwt')
        if not token:
            return Response({"message": "unauthorized"}, status=403)
        try:
            user = decode_jwt(token)
        except jwt.ExpiredSignatureError:
            return Response({'message':"invalid signature"}, status=400)
        token_code = decode(token)
        if user.is_2fa == True and token_code['code'] == False:
            return Response({"message": "2fa"}, status=403)
        
        if (user.id == id):
            return Response({"message": "you cant follow yourself"}, status=403)
        
        try:
            user_obj = User.objects.get(pk=user.id)
        except User.DoesNotExist:
            return Response({"message": "User not found"}, status=404)

        try:
            friend = User.objects.get(pk=id)
        except User.DoesNotExist:
            return Response({"message": "Friend not found"}, status=404)

        is_friend = Friend.objects.filter(from_user=user, to_user=friend).exists()
        print('&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&')
        print(request.POST['data'] == "Unfollow")
        print('&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&')
        if (is_friend and request.POST['data'] == "Unfollow"):
            jj = Friend.objects.get(from_user=user_obj, to_user=friend)
            jj.delete()
            return Response({"message": "Friend removed successfully"}, status=201)
        elif (not is_friend and request.POST['data'] == "Follow"):
            Friend.objects.create(from_user=user_obj, to_user=friend)
            return Response({"message": "Friend added successfully"}, status=201)
        return Response({"message": "Nothing happened"}, status=200)
