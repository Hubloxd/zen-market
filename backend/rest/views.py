from django.contrib.auth import login

from rest_framework import status, viewsets, permissions, views
from rest_framework.decorators import action
from rest_framework.response import Response

from rest.serializers import ProductSerializer, UserSerializer, BasicUserSerializer, LoginSerializer, \
    UpdateUserSerializer
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
        Optionally restricts the returned products, by filtering
        against a `name` or/and `tag` query parameter in the URL.
        """
        queryset = super().get_queryset()
        name = self.request.query_params.get('name')
        tag = self.request.query_params.get('tag')

        if name:
            queryset = queryset.filter(name__contains=name)
        if tag:
            match tag:
                case 'sale':
                    queryset = queryset.filter(sale=True)
                case _:
                    queryset = queryset.none()

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
        unauthenticated ones) can access it. For the `create` action, any user can create a new user, but if the user
        creating the user is not a superuser, the BasicUserSerializer serializer is used instead of the default
        UserSerializer. For all other actions, only admin users are allowed to access them.
        """
        if not self.request.user.is_superuser:
            self.serializer_class = BasicUserSerializer

        if self.action in ['list', 'retrieve', 'change']:
            permission_classes = [permissions.IsAuthenticated]
            if self.action == 'change':
                self.serializer_class = UpdateUserSerializer
        elif self.action == ['create', 'metadata']:
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
        This method handles the `create` action. It first creates a new instance of the serializer class with the data
        from the request, and then checks if the data is valid. If it is, the new user is saved to the database and a
        success response is returned. If the data is not valid, an error response is returned.
        """
        user = self.serializer_class(data=self.request.data)
        if user.is_valid():
            user.save()
            return Response(user.data)
        return Response(user.errors)

    @action(detail=False, methods=['get', 'post'])
    def change(self, request):
        user = self.request.user

        if user and user.is_authenticated:
            user = self.serializer_class(instance=user, data=self.request.data, partial=True)
            if not user.is_valid():
                return Response(user.errors)
            user.save()
            return Response(user.data)

        return Response('', status=status.HTTP_401_UNAUTHORIZED)


class LoginView(views.APIView):
    permission_classes = [permissions.AllowAny]
    serializer_class = LoginSerializer

    def post(self, request):
        serializer = LoginSerializer(data=self.request.data, context={'request': self.request})
        if not serializer.is_valid():
            return Response(None, status=status.HTTP_401_UNAUTHORIZED)

        user = serializer.validated_data['user']
        login(request, user)

        return Response(None, status=status.HTTP_202_ACCEPTED)
