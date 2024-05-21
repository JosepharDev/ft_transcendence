from .jwt import generate_jwt, decode_jwt
import jwt
import qrcode
import pyotp
import base64
from io import BytesIO
from rest_framework.views import APIView
from rest_framework.decorators import api_view
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
        users = User.objects.filter(username=user.username)
        if not users:
            return Response({"message": "User Not Found"}, status=404)
        code = request.POST['code']
        if not code:
            return Response({"message": "code messing"}, status=401)
        k = base64.b32encode(settings.OTP_SECRET_KEY).decode('utf-8')
        print("------------------------------------")
        print(k)
        print("------------------------------------")

        tp = pyotp.TOTP(k)
        if tp.now() == code:
            return Response({"message": "success"}, status=200)
        else:
            return Response({"message": "invalid code"}, status=401)

class prosecc(twofa):
    def post(self, request):
        if request.POST['qrcode'] == 'active':
            return self.get(request)
        elif request.POST["qrcode"] == 'desactive':
            return Response({'message': "desactive"}, status=200)
        else:
            return Response({"message": "not valid keyword"}, status=400)