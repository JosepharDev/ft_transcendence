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
from django.db.models import Q
# from django.core.exceptions import User

from .utils import check_auth
from django.utils.decorators import method_decorator
#return 401
signInTwoFa = {"message": "2fa"}
signInFailed = {"message": "unauthorized"}
userNotfound = {"message": "notfound"}

#return 200
signInSucess = {"message": "success"}


class SignUp(APIView):
    def post(self, request):
        if 'username' in request.POST and 'password' in request.POST:
            username = request.POST['username']
            password = request.POST['password']
            if not username or not password:
                return Response({"message": "Please Provide Both username and password"})
            if User.objects.filter(username=username).exists():
                return Response({"message": "there is already user with this name"})
            else:
                print("++++++++", username, "+++++++", password)
                user = User.objects.create(username=username, password=password, remote=True, p_username=username)
                user.set_password(password)
                user.save()
                response = Response({"message": "success"})
                response.set_cookie(key='jwt', value=generate_jwt(user, True), httponly=True)
                return response
        else:
            return Response({"message": "Please Provide Both username and password"})


class SignIn(APIView):
    @method_decorator(check_auth)
    def get(self, request):
        user = User.objects.get(request.user_id)
        serializer = UserSerializer(user)
        return Response(serializer.data, status=status.HTTP_200_OK)    

    def post(self, request):
        if 'username' in request.POST and 'password' in request.POST:
            username = request.POST['username']
            password = request.POST['password']
            try:
                user = User.objects.get(username=username)
                if user.check_password(password):
                    if user.is_2fa == True:
                        payload = generate_jwt(user, False)
                    else:
                        payload = generate_jwt(user, True)
                else:
                    return Response({"message":"username or password not correct"})
            except User.DoesNotExist:
                return Response({"message":"username or password not correct"})
        else:
            return Response({"message": "Please Provide Both username and password"})

        if user.is_2fa == True:
            response = Response({"message": "2fa"}, status=401)
        else:
            response = Response({"message": "success"}, status=200)

        response.set_cookie(key='jwt', value=payload, httponly=True, samesite='Lax', secure=True)
        return response


# may use @login_required and use login(request, user) and logout(request) 
class Logout(APIView):
    @method_decorator(check_auth)
    def get(self, request):
        response = Response({"message": "success"})
        # response.delete_cookie('jwt')
        response.set_cookie('jwt', '', max_age=-1, samesite='Lax', secure=True)
        return response

class SearchUsers(APIView):
    @method_decorator(check_auth)
    def get(self, request):
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
    @method_decorator(check_auth)
    def patch(self, request):
        user = User.objects.get(id=request.user_id)
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

class AuthUser(APIView):
    def get(self, request):
        # token = request.COOKIES.get('jwt')
        # if not token:
        #     return Response({"message": "unauthorized"}, status=401)

        # try:
        #     user = decode_jwt(token)
        # except jwt.ExpiredSignatureError:
        #     return Response({'message':"unauthorized"}, status=401)

        # token_code = decode(token)
        # if user.is_2fa == True and token_code['code'] == False:
        #     return Response({"message": "2fa"}, status=401)

        return Response({"message": "authenticated"})

class UserData(APIView):
    @method_decorator(check_auth)
    def get(self, request, id):
        try:
            userFriend = User.objects.get(id=id)
            user = User.objects.get(id=request.user_id)
        except User.DoesNotExist:
            return Response({"message": "notfound"}, status=404)

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



# import jwt
# from django.http import JsonResponse
# from django.utils.deprecation import MiddlewareMixin

# class JWTMiddleware(MiddlewareMixin):
#     def process_request(self, request):
#         token = request.COOKIES.get('jwt_token')
        
    
# class UsersList(APIView):
#     @method_decorator(check_auth)
#     def get(self, request): 
#         users = User.objects.all()
#         serializer = UserSerializer(users, many=True)
#         return Response(serializer.data)

# class UserHistory(APIView):
#     @method_decorator(check_auth)
#     def get(self, request, id):    
#         user_history_matches = HistoryMatch.objects.filter(Q(player1=id) | Q(player2=id))
#         his_serializer = HistoryMatchSerializer(user_history_matches, many=True)
#         return Response(his_serializer.data)

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
