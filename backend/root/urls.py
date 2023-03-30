from django.contrib import admin
from django.shortcuts import render
from django.urls import path, include, re_path


def test(request):
    return render(request, 'test.html')


app_name = 'Root'
urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/v1/', include('rest.urls', namespace='Rest')),
    path(r'api/v1/api-auth/', include('rest_framework.urls', namespace='rest_framework')),
    re_path(r'^.*', include('shop.urls')),
    # path('', test)
]
