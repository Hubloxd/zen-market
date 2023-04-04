from django.urls import path, include
from rest_framework import routers

from rest import views

app_name = 'Rest'
router = routers.DefaultRouter()
router.register(r'products', views.ProductsViewSet)
router.register(r'users', views.UserViewSet)

# Wire up our API using automatic URL routing.
# Additionally, we include login URLs for the browsable API.
urlpatterns = [
    path('', include(router.urls)),
    path('auth/login/', views.LoginView.as_view()),
]
