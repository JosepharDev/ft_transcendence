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



#return 401
signInTwoFa = {"message": "2fa"}
signInFailed = {"message": "unauthorized"}
userNotfound = {"message": "notfound"}

#return 200
signInSucess = {"message": "success"}



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

        username = request.POST['username']
        user = User.objects.filter(username=username).first()
        if user is None:
            response = Response({"message": "notfound"}, status=404)
            return response

        if user.is_2fa == True:
            payload = generate_jwt(user, False)
        else:
            payload = generate_jwt(user, True)

        if user.is_2fa == True:
            response = Response({"message": "2fa"}, status=401)
        else:
            response = Response({"message": "success"}, status=200)

        response.set_cookie(key='jwt', value=payload, httponly=True, samesite='Lax', secure=True)
        return response


class logout(APIView):

    def get(self, request):
        token = request.COOKIES.get('jwt')
        if not token:
            return Response({"message": "unauthorized"}, status=401)
        
        try:
            user = decode_jwt(token)
        except jwt.ExpiredSignatureError:
            return Response({'message':"unauthorized"}, status=401)
        
        token_code = decode(token)
        if user.is_2fa == True and token_code['code'] == False:
            return Response({"message": "2fa"}, status=401)
        
        response = Response({"message": "success"})
        # response.delete_cookie('jwt')
        response.set_cookie('jwt', '', max_age=-1, samesite='Lax', secure=True)
        return response

class UsersList(APIView):
    def get(self, request):
        token = request.COOKIES.get('jwt')
        if not token:
            return Response({"message": "unauthorized"}, status=401)

        try:
            user = decode_jwt(token)
        except jwt.ExpiredSignatureError:
            return Response({'message':"unauthorized"}, status=401)

        token_code = decode(token)
        if user.is_2fa == True and token_code['code'] == False:
            return Response({"message": "2fa"}, status=403)
        
        users = User.objects.all()
        serializer = UserSerializer(users, many=True)
        return Response(serializer.data)


class UserHistory(APIView):
    def get(self, request, id):
        token = request.COOKIES.get('jwt')
        if not token:
            return Response({"message": "unauthorized"}, status=401)

        try:
            user = decode_jwt(token)
        except jwt.ExpiredSignatureError:
            return Response({'message':"unauthorized"}, status=401)

        token_code = decode(token)
        if user.is_2fa == True and token_code['code'] == False:
            return Response({"message": "2fa"}, status=401)
    
        user_history_matches = HistoryMatch.objects.filter(Q(player1=id) | Q(player2=id))
        his_serializer = HistoryMatchSerializer(user_history_matches, many=True)
        return Response(his_serializer.data)

class SearchUsers(APIView):
    def get(self, request):
        token = request.COOKIES.get('jwt')
        if not token:
            return Response({"message": "unauthorized"}, status=401)

        try:
            user = decode_jwt(token)
        except jwt.ExpiredSignatureError:
            return Response({'message':"unauthorized"}, status=401)

        token_code = decode(token)
        if user.is_2fa == True and token_code['code'] == False:
            return Response({"message": "2fa"}, status=401)

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
            return Response({"message": "unauthorized"}, status=401)

        try:
            user = decode_jwt(token)
        except jwt.ExpiredSignatureError:
            return Response({'message':"unauthorized"}, status=401)

        token_code = decode(token)
        if user.is_2fa == True and token_code['code'] == False:
            return Response({"message": "2fa"}, status=401)

        user = User.objects.get(id=user.id)
        serializer = UserSerializer(user, data=request.data, partial=True)
        if serializer.is_valid():
            # if ('password' in request.data and request.data['password'] == ""):
            #     print("44488888888888888888888888******************************")
            #     return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            # print(request.data['email'])
            serializer.save()
            return Response(serializer.data)

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
            return Response({"message": "unauthorized"}, status=401)

        try:
            user = decode_jwt(token)
        except jwt.ExpiredSignatureError:
            return Response({'message':"unauthorized"}, status=401)

        token_code = decode(token)
        if user.is_2fa == True and token_code['code'] == False:
            return Response({"message": "2fa"}, status=401)

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


# protect
class UserData(APIView):
    def get(self, request, id):
        token = request.COOKIES.get('jwt')
        if not token:
            return Response({"message": "unauthorized"}, status=401)

        try:
            user = decode_jwt(token)
        except jwt.ExpiredSignatureError:
            return Response({'message':"unauthorized"}, status=401)

        token_code = decode(token)
        if user.is_2fa == True and token_code['code'] == False:
            return Response({"message": "2fa"}, status=401)

    
        # users = User.objects.get(pk=id)

        try:
            userFriend = User.objects.get(id=id)
        except User.DoesNotExist:
            return Response({"message": "notfound"}, status=404)
        #here i need protection if user does not exist with this id

        serializer = UserSerializer(userFriend)

        is_friend = Friend.objects.filter(from_user=user, to_user=userFriend).exists()

        userRequestedData = serializer.data
        userRequestedData['friend'] = is_friend
        userRequestedData['its_me'] = (id == user.id)
        userRequestedData['is_online'] = userFriend.profile_status == 'online'

        matches = Match.objects.filter(Q(player1=id) | Q(player2=id))
        allUserRequestedMatches = []

        for match in matches:
            newMatch = {
                'player1Username' : match.player1.username,
                'player2Username' : match.player2.username,
                'player1Score' : match.plr1_count,
                'player2Score' : match.plr2_count,
                'plr1img': match.player1.avatar.url,
                'plr2img': match.player2.avatar.url,
            }
            print(f'---------->{match.match_date}')
            allUserRequestedMatches.append(newMatch)

        userRequestedData['matches'] = allUserRequestedMatches


        friends = Friend.objects.filter(from_user = userFriend)
        userFriends = []
        for friend in friends:
            userFriends.append({'username' : friend.to_user.username,
                'id':friend.to_user.id,
                'avatar' : friend.to_user.avatar.url
            })

        userRequestedData['friends'] = userFriends

        return Response(userRequestedData)

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
            return Response({"message": "unauthorized"}, status=401)

        try:
            user = decode_jwt(token)
        except jwt.ExpiredSignatureError:
            return Response({'message':"unauthorized"}, status=401)

        token_code = decode(token)
        if user.is_2fa == True and token_code['code'] == False:
            return Response({"message": "2fa"}, status=401)

        if user.is_2fa:
            return Response({"message": "yes"})
        else:
            return Response({"message": "no"})






class IsTwoEnabled(APIView):
    def get(self, request):
        token = request.COOKIES.get('jwt')
        if not token:
            return Response({"message": "unauthorized"}, status=401)

        try:
            user = decode_jwt(token)
        except jwt.ExpiredSignatureError:
            return Response({'message':"unauthorized"}, status=401)

        token_code = decode(token)
        if user.is_2fa == True and token_code['code'] == False:
            return Response({"message": "2fa"}, status=401)

        d = {"message": user.is_2fa == True}
        return Response(d)







class UserFriends(APIView):
    def get(self, request):
        token = request.COOKIES.get('jwt')
        if not token:
            return Response({"message": "unauthorized"}, status=401)

        try:
            user = decode_jwt(token)
        except jwt.ExpiredSignatureError:
            return Response({'message':"unauthorized"}, status=401)

        token_code = decode(token)
        if user.is_2fa == True and token_code['code'] == False:
            return Response({"message": "2fa"}, status=401)

        friends = Friend.objects.filter(from_user=user)
        userFriends = []
        for friend in friends:
            userFriends.append({'username' : friend.to_user.username,
                'id':friend.to_user.id,
                'avatar' : friend.to_user.avatar.url
            })


        userFriends.append({'username' : user.username,
            'id': user.id,
            'avatar' : user.avatar.url
                })
        
        return Response(userFriends)

    def post(self, request, id):
        token = request.COOKIES.get('jwt')
        if not token:
            return Response({"message": "unauthorized"}, status=401)

        try:
            user = decode_jwt(token)
        except jwt.ExpiredSignatureError:
            return Response({'message':"unauthorized"}, status=401)

        token_code = decode(token)
        if user.is_2fa == True and token_code['code'] == False:
            return Response({"message": "2fa"}, status=401)

        if (user.id == id):
            return Response({"message": "not allowed"}, status=401)#follow yourserlf ?
        
        try:
            user_obj = User.objects.get(pk=user.id)
        except User.DoesNotExist:
            return Response({"message": "notfound"}, status=404)

        try:
            friend = User.objects.get(pk=id)
        except User.DoesNotExist:
            return Response({"message": "notfound"}, status=404)

        is_friend = Friend.objects.filter(from_user=user, to_user=friend).exists()

        print('&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&')
        print(request.POST['data'] == "Unfollow")
        print('&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&')

        if (is_friend and request.POST['data'] == "Unfollow"):
            friendship = Friend.objects.get(from_user=user_obj, to_user=friend)
            friendship.delete()
            return Response({"message": "Friend removed successfully"}, status=201)
        elif (not is_friend and request.POST['data'] == "Follow" and user_obj.id != friend.id):
            Friend.objects.create(from_user=user_obj, to_user=friend)
            return Response({"message": "Friend added successfully"}, status=201)

        return Response({"message": "Nothing happened"}, status=200)




class ProfileData(APIView):
    def get(self, request):
        token = request.COOKIES.get('jwt')
        if not token:
            return Response({"message": "unauthorized"}, status=401)

        try:
            user = decode_jwt(token)
        except jwt.ExpiredSignatureError:
            return Response({'message':"unauthorized"}, status=401)

        token_code = decode(token)
        if user.is_2fa == True and token_code['code'] == False:
            return Response({"message": "2fa"}, status=401)


        serializer = UserSerializer(user)


        userRequestedData = serializer.data
        userRequestedData['friend'] = False
        userRequestedData['its_me'] = True
        userRequestedData['is_online'] = user.profile_status == 'online'

        matches = Match.objects.filter(Q(player1=user.id) | Q(player2=user.id))
        allUserRequestedMatches = []

        for match in matches:
            newMatch = {
                'player1Username' : match.player1.username,
                'player2Username' : match.player2.username,
                'player1Score' : match.plr1_count,
                'player2Score' : match.plr2_count,
                'plr1img': match.player1.avatar.url,
                'plr2img': match.player2.avatar.url,
            }
            print(f'---------->{match.match_date}')
            allUserRequestedMatches.append(newMatch)

        userRequestedData['matches'] = allUserRequestedMatches


        friends = Friend.objects.filter(from_user = user)
        userFriends = []
        for friend in friends:
            userFriends.append({'username' : friend.to_user.username,
                'id':friend.to_user.id,
                'avatar' : friend.to_user.avatar.url
            })

        userRequestedData['friends'] = userFriends

        return Response(userRequestedData)