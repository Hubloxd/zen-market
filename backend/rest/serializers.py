from django.contrib.auth import authenticate
from rest_framework import serializers
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
        fields = ['username', 'first_name', 'last_name', 'email', 'password', 'phone_number', 'balance']

        extra_kwargs = {'password': {'write_only': True}, 'balance': {'read_only': True}}

    def create(self, validated_data):
        password = validated_data.pop('password')
        user = ShopUser(**validated_data)
        user.set_password(password)
        user.save()
        return user


class UpdateUserSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(
        validators=[UniqueValidator(queryset=ShopUser.objects.all(), message='This email is already registered')],
        required=False
    )
    phone_number = serializers.IntegerField(
        validators=[
            UniqueValidator(queryset=ShopUser.objects.all(), message='This phone number is already registered')
        ],
        required=False
    )
    password = serializers.CharField(write_only=True, required=False)

    class Meta:
        model = ShopUser
        fields = ['username', 'first_name', 'last_name', 'password', 'phone_number', 'email']
        extra_kwargs = {
            'username': {'required': False},
            'first_name': {'required': False},
            'last_name': {'required': False},
            'phone_number': {'required': False},
        }

    def update(self, instance, validated_data):
        for key in validated_data:
            if value := validated_data[key]:
                value = '' if value == '_null' else value
                instance.__setattr__(key, value)

        password = validated_data.get('password')
        if password:
            instance.set_password(password)

        instance.save()
        return instance


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


class TransactionSerializer(serializers.ModelSerializer):
    name = serializers.SerializerMethodField()
    price = serializers.SerializerMethodField()

    class Meta:
        model = Transaction
        fields = '__all__'
        extra_kwargs = {'shop_user': {'read_only': True},
                        'name': {'read_only': True},
                        'price': {'read_only': True},
                        'status': {'read_only': True},
                        }

    def get_name(self, obj):
        return obj.product.name

    def get_price(self, obj):
        return obj.product.discount_price or obj.product.price
