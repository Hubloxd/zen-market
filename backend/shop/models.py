from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils.datetime_safe import datetime


# Create your models here.
class Product(models.Model):
    name = models.CharField(max_length=128)
    description = models.TextField(null=True, blank=True)
    price = models.FloatField(default=0.)
    discount_price = models.FloatField(blank=True, null=True)
    image_src = models.CharField(max_length=1024, null=True, blank=True)
    sale = models.BooleanField(default=False)

    def __str__(self):
        return self.name


class ShopUser(AbstractUser):
    phone_number = models.PositiveIntegerField(blank=True, null=True)
    balance = models.FloatField(default=100.0)
    email = models.EmailField(blank=False, null=False, unique=True)

    REQUIRED_FIELDS = ['email', 'password']

    def __str__(self):
        return self.email


class Transaction(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    owner = models.ForeignKey(ShopUser, on_delete=models.CASCADE)
    date = models.DateField(default=datetime.today)
    payment_method = models.CharField(max_length=11, choices=[
        ('balace', 'Balance'),
        ('credit_card', 'Credit Card'),
    ])
