from rest_framework import serializers
from .models import User
from rest_framework.response import Response
from django.core.files.base import ContentFile
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
        avatar = validated_data.get('avatar', instance.avatar)
        if username:
            user = User.objects.filter(username=username).first()
            if user and user.id != instance.id:
                return Response({"message": "Username already exist"})
            else:
                instance.username = username
        if nickname:
            user = User.objects.filter(nickname=nickname).first()
            if user and user.id != instance.id:
                return Response({"message": "Nickname already exist"})
            else:
                instance.nickname = nickname
        if avatar:
            avatar_content = ContentFile(avatar.read(), name="avatar.JPG")
            instance.avatar = avatar_content
            # instance.avatar.save(avatar_content.name, avatar_content)
        instance.save()
        return instance

        


    # def validate_username(self, value):
    #     if User.objects.filter(username=value).exists():
    #         raise serializers.ValidationError("Username Already Exists")
    #     return value
    # check password in serializer create function if remote pass it if user hashe it 
    # check if you can validate username if already exist and in case of remote change it here and send him message

    # def validate(self, data):
    #     if not self.instance and 'password' not in data:
    #         raise serializers.ValidationError({"password": "This field is required for new users."})
    #     return data

    # def create(self, validated_data):
    #     password = validated_data.pop('password', None)
    #     user = super().create(validated_data)
    #     if password:
    #         user.set_password(password)
    #         user.save()
    #     return user


    # def create(self, validated_data):
    #     password = validated_data.pop('password', None)
    #     instance = self.Meta.model(**validated_data)
    #     if password is not None:
    #         instance.set_password(password)
    #     instance.save()
    #     return instance


    # def validate_username(self, value):
    #     if User.objects.filter(username=value).exists():
    #         raise serializers.ValidationError("Username Already Exists")
    #     return value
