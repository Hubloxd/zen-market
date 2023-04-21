from django.contrib.auth import login
from django.db import DatabaseError, transaction as database_transaction

from rest_framework import status, viewsets, permissions, views
from rest_framework.decorators import action
from rest_framework.response import Response

from rest.serializers import ProductSerializer, UserSerializer, BasicUserSerializer, LoginSerializer, \
    UpdateUserSerializer, TransactionSerializer
from shop.models import Product, ShopUser, Transaction


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
        elif self.action in ['create', 'metadata']:
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
        user = request.user
        if not user:
            return Response('', status=status.HTTP_401_UNAUTHORIZED)
        serializer = self.serializer_class(user, data=request.data, partial=True)
        if serializer.is_valid():
            if 'email' in serializer.validated_data:
                user.email = serializer.validated_data['email']
            if 'password' in serializer.validated_data:
                user.set_password(serializer.validated_data['password'])
            user.save()
            return Response(serializer.data)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


def handle_balance_payment(user, product):
    try:
        with database_transaction.atomic():
            user.refresh_from_db()
            price = product.discount_price or product.price
            if price <= user.balance:
                user.balance -= price
                user.save(update_fields=['balance'])
            else:
                return Response({'error': "Insufficient funds"}, status=status.HTTP_403_FORBIDDEN)
    except DatabaseError:
        return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)


def handle_credit_card_payment(request, transaction):
    # HANDLE CREDIT CARD PAYMENT
    pass


class TransactionViewSet(viewsets.ModelViewSet):
    queryset = Transaction.objects.all()
    serializer_class = TransactionSerializer

    def get_queryset(self):
        user = self.request.user
        if user.is_superuser:
            return Transaction.objects.all()
        elif user.is_authenticated:
            return Transaction.objects.filter(shop_user_id=user.id)
        else:
            return Transaction.objects.none()

    def get_permissions(self):
        if self.action in ['list', 'retrieve', 'create']:
            permission_classes = [permissions.IsAuthenticated]
        else:
            permission_classes = [permissions.IsAdminUser]
        return [permission() for permission in permission_classes]

    def create(self, request, *args, **kwargs):
        transaction = self.serializer_class(data=request.data)
        transaction.is_valid(raise_exception=True)
        user = request.user

        product = transaction.validated_data['product']
        payment_method = transaction.validated_data['payment_method']

        transaction.save(shop_user=user)
        return Response(transaction.data)


class LoginView(views.APIView):
    permission_classes = [permissions.AllowAny]
    serializer_class = LoginSerializer

    def post(self, *args, **kwargs):
        serializer = LoginSerializer(data=self.request.data, context={'request': self.request})
        if not serializer.is_valid():
            return Response(None, status=status.HTTP_401_UNAUTHORIZED)

        user = serializer.validated_data['user']
        login(self.request, user)

        return Response(None, status=status.HTTP_202_ACCEPTED)
