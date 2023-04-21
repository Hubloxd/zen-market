from django.shortcuts import render
from django.http import HttpResponse, HttpRequest
from rest_framework import status


# Create your views here.
def index(request: HttpRequest) -> HttpResponse:
    if request.path.startswith('/account/profile'):
        if not request.user.is_authenticated:
            return HttpResponse('', status=status.HTTP_403_FORBIDDEN)
    return render(request, 'index.html')
