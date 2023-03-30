from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils.datetime_safe import datetime


# Create your models here.
class Product(models.Model):
    name = models.CharField(max_length=128)
    description = models.TextField(null=True, blank=True)
    price = models.FloatField(default=0.)
    image_src = models.CharField(max_length=1024, null=True, blank=True)

    def to_dict(self) -> dict[str: str | float]:
        return {
            'id': self.pk,
            'name': self.name,
            'description': self.description,
            'price': self.price,
            'image_src': self.image_src
        }


class ShopUser(AbstractUser):
    phone_number = models.PositiveIntegerField(blank=True, null=True)
    balance = models.FloatField(default=100.0)
    email = models.EmailField(blank=False, null=False, unique=True)

    REQUIRED_FIELDS = ['email', 'password']

    def __str__(self):
        return self.username


class Offer(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    owner = models.ForeignKey(ShopUser, on_delete=models.CASCADE)
    date = models.DateField(default=datetime.today)
