from django.shortcuts import render
from django.http import HttpResponse, HttpRequest
from rest_framework import status

from shop.models import ShopUser


# Create your views here.
def index(request: HttpRequest) -> HttpResponse:
    if request.path.startswith('/accounts/profile'):
        if not request.user.is_authenticated:
            return HttpResponse('', status=status.HTTP_403_FORBIDDEN)
    return render(request, 'index.html')
