from django.contrib.auth import login
from django.db.models import Q
from django.http import HttpRequest, HttpResponse, JsonResponse
from django.shortcuts import get_object_or_404
from django.contrib.auth.forms import UserCreationForm

from rest_framework import status, viewsets, permissions, views
from rest_framework.decorators import api_view, action
from rest_framework.response import Response

from rest.serializers import ProductSerializer, UserSerializer, BasicUserSerializer, LoginSerializer
from shop.models import Product, ShopUser


class ProductsViewSet(viewsets.ModelViewSet):
    """
    ViewSet allowing reading every product and altering products for admins
    """
    queryset = Product.objects.all()
    serializer_class = ProductSerializer

    def get_permissions(self):
        if self.action in ('list', 'retrieve', 'metadata'):
            permission_classes = [permissions.AllowAny]
        else:
            permission_classes = [permissions.IsAdminUser]
        return [permission() for permission in permission_classes]

    def get_queryset(self):
        """
        Optionally restricts the returned products to a given user,
        by filtering against a `name` query parameter in the URL.
        """
        queryset = super().get_queryset()
        name = self.request.query_params.get('name')
        if name is not None:
            queryset = queryset.filter(name__contains=name)

        return queryset


class UserViewSet(viewsets.ModelViewSet):
    """
    This viewset is responsible for handling CRUD operations on the ShopUser model, using the
    rest.serializers.UserSerializer and rest.serializers.BasicUserSerializer serializers.
    """
    queryset = ShopUser.objects.all()
    serializer_class = UserSerializer

    def get_permissions(self):
        """
        This method determines the permissions required for each action on this viewset. For the list and retrieve
        actions, only authenticated users are allowed to access the data. For the metadata action, any user (even
        unauthenticated ones) can access it. For the create action, any user can create a new user, but if the user
        creating the user is not a superuser, the BasicUserSerializer serializer is used instead of the default
        UserSerializer. For all other actions, only admin users are allowed to access them.
        """
        if self.action in ('list', 'retrieve',):
            permission_classes = [permissions.IsAuthenticated]
        elif self.action == 'metadata':
            permission_classes = [permissions.AllowAny]
        elif self.action == 'create':
            if not self.request.user.is_superuser:
                self.serializer_class = BasicUserSerializer
            permission_classes = [permissions.AllowAny]
        else:
            permission_classes = [permissions.IsAdminUser]
        return [permission() for permission in permission_classes]

    def get_queryset(self):
        """
        This method determines the queryset used for each action on this viewset. If the user making the request is a
        superuser, they can see all ShopUser objects in the database. If the user is authenticated but not a
        superuser, they can only see their own user object. If the user is unauthenticated, they cannot see any
        ShopUser objects.
        """
        queryset = ShopUser.objects.all()

        user: ShopUser = self.request.user

        if user.is_superuser:
            return queryset
        elif user.is_authenticated:
            return queryset.filter(pk=self.request.user.id)
        else:
            return queryset.none()

    def create(self, *args, **kwargs):
        """
        This method handles the create action. It first creates a new instance of the serializer class with the data
        from the request, and then checks if the data is valid. If it is, the new user is saved to the database and a
        success response is returned. If the data is not valid, an error response is returned.
        """
        user = self.serializer_class(data=self.request.data)
        if user.is_valid():
            user.save()
            return Response(user.data)
        return Response(user.errors)


class LoginView(views.APIView):
    permission_classes = [permissions.AllowAny]
    serializer_class = LoginSerializer

    def post(self, request, format=None):
        serializer = LoginSerializer(data=self.request.data, context={'request': self.request})
        serializer.is_valid(raise_exception=True)

        user = serializer.validated_data['user']
        login(request, user)

        return Response(None, status=status.HTTP_202_ACCEPTED)