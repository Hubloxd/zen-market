# from django.db import IntegrityError
from abc import ABCMeta

from django.contrib.auth import authenticate
from rest_framework import serializers, permissions
from rest_framework.utils.model_meta import get_field_info
from rest_framework.validators import UniqueValidator

from shop.models import *


class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        # fields = ['pk', 'name', 'description', 'price', 'image_src']
        fields = '__all__'


class UserSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(
        validators=[UniqueValidator(queryset=ShopUser.objects.all(), message='Email already exists')]
    )

    class Meta:
        model = ShopUser
        # fields = ['id', 'email', 'password', 'username', 'groups']
        fields = '__all__'
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = ShopUser()

        password = validated_data.pop('password')
        validated_data.pop('user_permissions')
        validated_data.pop('groups')

        user.set_password(password)

        for key, val in validated_data.items():
            setattr(user, key, val)

        user.save()
        return user


class BasicUserSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(
        validators=[UniqueValidator(queryset=ShopUser.objects.all(), message='Email already exists')]
    )

    class Meta:
        model = ShopUser
        fields = ['username', 'email', 'password']

        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        password = validated_data.pop('password')
        user = ShopUser(**validated_data)
        user.set_password(password)
        user.save()
        return user


class LoginSerializer(serializers.Serializer):
    username = serializers.CharField(label='Username', write_only=True)
    password = serializers.CharField(label='Password', write_only=True,
                                     style={'input_type': 'password'}, trim_whitespace=False)

    def validate(self, attrs):
        username = attrs.get('username')
        password = attrs.get('password')

        if username and password:
            user = authenticate(request=self.context.get('request'), username=username, password=password)

            if not user:
                # If we don't have a regular user, raise a ValidationError
                msg = 'Access denied: wrong username or password.'
                raise serializers.ValidationError(msg, code='authorization')

        else:
            msg = 'Both "username" and "password" are required.'
            raise serializers.ValidationError(msg, code='authorization')

        attrs['user'] = user
        return attrs
