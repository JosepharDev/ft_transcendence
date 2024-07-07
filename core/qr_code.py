from .jwt import generate_jwt, decode_jwt, decode
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

class twofa(APIView):
    def get(self, request):
        token = request.COOKIES.get('jwt')
        if not token:
            return Response({"message": "jwt messing"}, status=400)
        try:
            user  = decode_jwt(token)
        except jwt.ExpiredSignatureError:
            return Response({"message": "expired Signature"}, status=400)
        
        users = User.objects.filter(username=user.username).first()
        if not users:
            return Response({"message": "User Not Found"}, status=404)

        k = base64.b32encode(settings.OTP_SECRET_KEY).decode('utf-8')
        otp_url = f"otpauth://totp/localhost:{users.username}?secret={k}&issuer=localhost"
        qr = qrcode.QRCode(
        version=1,
        error_correction=qrcode.constants.ERROR_CORRECT_L,
        box_size=10,
        border=4,
        )
        qr.add_data(otp_url)
        qr.make(fit=True)
        buffer = BytesIO()
        img = qr.make_image(fill='black', back_color='white')
        img.save(buffer, format='PNG')
        buffer.seek(0)
        return HttpResponse(buffer, content_type='image/png')
    def post(self, request):
        token = request.COOKIES.get('jwt')
        if not token:
            return Response({"message": "jwt messing"}, status=400)
        try:
            user  = decode_jwt(token)
        except jwt.ExpiredSignatureError:
            return Response({"message": "expired Signature"}, status=400)
        if not user:
            return Response({"message": "User Not Found"}, status=404)
        code = request.POST['code']
        if not code:
            return Response({"message": "code messing"}, status=401)
        k = base64.b32encode(settings.OTP_SECRET_KEY).decode('utf-8')

        tp = pyotp.TOTP(k)
        print("------------------------------------")
        print(code)
        print(tp.now())
        print("------------------------------------")
        if tp.now() == code:
            user.is_2fa = True
            user.save()
            response = Response({"message": "success"})
            token = generate_jwt(user, True)
            response.set_cookie(key='jwt', value=token, httponly=True)
            return response
        else:
            return Response({"message": "invalid code"}, status=401)

class twofa_process(twofa):
    def post(self, request):
        token = request.COOKIES.get('jwt')
        if not token:
            return Response({"message": "jwt messing"}, status=400)
        try:
            user  = decode_jwt(token)
        except jwt.ExpiredSignatureError:
            return Response({"message": "expired Signature"}, status=400)
        token_code = decode(token)
        if request.POST['qrcode'] == 'enable':
            return self.get(request)
        elif request.POST["qrcode"] == 'disable':
            if user.is_2fa == False:
                return Response({'message': "already desactivated"}, status=200)
            elif user.is_2fa == True:
                print("#O#O#OO#O#O#OOOOOOOOOOO#O#O#O#O#O#O")
                user.is_2fa = False
                user.save()
                token_code['code'] = False
                response = Response({"message": "desactive"}, status=200)
                token_code = generate_jwt(user, False)
                response.set_cookie(key='jwt', value=token_code, httponly=True)
                return response
        else:
            return Response({"message": "bad request"}, status=400)