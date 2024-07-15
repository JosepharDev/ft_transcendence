from .jwt import generate_jwt
import jwt
import qrcode
import pyotp
import base64
from io import BytesIO
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import User
from django.conf import settings
from django.http import HttpResponse
from django.utils.decorators import method_decorator
from .utils import check_auth, check_auth1

class twofa(APIView):
    @method_decorator(check_auth1)
    def get(self, request):
        user = User.objects.get(id=request.user_id)
        otp_url = f"otpauth://totp/localhost:{user.username}?secret={user.otp_secret}&issuer=localhost"
        img = qrcode.make(otp_url)
        buffer =  BytesIO()
        img.save(buffer, format='PNG')
        buffer.seek(0)
        return HttpResponse(buffer, content_type='image/png')

    @method_decorator(check_auth1)
    def post(self, request):
        user = User.objects.get(id=request.user_id)
        if "code" in request.POST:
            code = request.POST['code']
            if not code:
                return Response({"message": "code messing"}, status=401)
            else:
                tp = pyotp.TOTP(user.otp_secret)
                if tp.now() == code:
                    user.is_2fa = True
                    user.save()
                    response = Response({"message": "success"}, status=200)
                    token = generate_jwt(user, True)
                    response.set_cookie(key='jwt', value=token, httponly=True, samesite='Lax', secure=True)
                    return response
                else:
                    return Response({"message": "invalid code"}, status=401)
                
        else:
            return Response({"message": "Code Not Found"}, status=400)

class twofa_process(twofa):
    @method_decorator(check_auth1)
    def post(self, request):
        user = User.objects.get(id=request.user_id)
        qrcode = request.POST.get("qrcode")
        if not qrcode:
            return Response({"message": "qrcode parameter required"}, status=400)
        if qrcode == 'enable':
            if user.is_2fa == True:
                return Response({"message": "two factor authentication already activated"})
            else:
                return self.get(request)
        elif qrcode == 'disable':
            if user.is_2fa == False:
                return Response({'message': "already desactivated"}, status=200)
            elif user.is_2fa == True:
                user.is_2fa = False
                user.save()
                response = Response({"message": "desactive"}, status=200)
                token_code = generate_jwt(user, False)
                response.set_cookie(key='jwt', value=token_code, httponly=True, samesite='Lax', secure=True)
                return response
        else:
            return Response({"message": "invalid value"}, status=400)
