from rest_framework import serializers
from .models import User
from django.core.files.base import ContentFile
from rest_framework.serializers import ValidationError
import pyotp
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'
        extra_kwargs = {'password': {'write_only': True}, 'otp_secret':{'write_only':True}}
    def create(self, validated_data):
        remote = validated_data.pop('remote', None)
        if remote == False:
            user = super().create(validated_data)
        else:
            user = super().create(validated_data)
            user.set_unusable_password()
        user.otp_secret = pyotp.random_base32()
        user.save()
        return user
    
    def update(self, instance, validated_data):
        username = validated_data.get('username')
        nickname = validated_data.get('nickname')
        avatar = validated_data.get('avatar')
        if not username and not nickname and not avatar:
            raise ValidationError("Not Updated", code=200)
        if username:
            user = User.objects.filter(username=username).first()
            if user and user.id != instance.id:
                raise ValidationError("Username already exist", code=200)
            else:
                instance.username = username
        if nickname:
            user = User.objects.filter(nickname=nickname).first()
            if user and user.id != instance.id:
                raise ValidationError("Nickname already exist", code=200)
            else:
                instance.nickname = nickname
        if avatar:
            avatar_content = ContentFile(avatar.read(), name="avatar.JPG")
            instance.avatar = avatar_content
        instance.save()
        return instance