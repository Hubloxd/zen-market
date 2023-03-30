from django.urls import path, include, re_path

from shop.views import index

app_name = 'Shop'
urlpatterns = [
    path('', index),
]