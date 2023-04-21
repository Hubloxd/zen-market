from django.contrib import admin
from django.urls import path, include, re_path

from .views import logout_view

app_name = 'Root'
urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/v1/', include('rest.urls', namespace='Rest')),
    path(r'api/v1/api-auth/', include('rest_framework.urls', namespace='rest_framework')),
    path(r'account/logout/', logout_view),
    re_path(r'^.*', include('shop.urls')),
]
