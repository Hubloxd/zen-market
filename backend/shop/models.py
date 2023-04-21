from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils.translation import gettext_lazy as _


# Create your models here.
class Product(models.Model):
    name = models.CharField(max_length=128)
    description = models.TextField(null=True, blank=True)
    price = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    discount_price = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    image_src = models.ImageField(upload_to='static/img/', null=True, blank=True)
    sale = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name


class ShopUser(AbstractUser):
    phone_number = models.PositiveIntegerField(blank=True, null=True, unique=True)
    balance = models.DecimalField(max_digits=10, decimal_places=2, default=100.00)
    email = models.EmailField(blank=False, null=False, unique=True, max_length=254)

    def __str__(self):
        return self.email


class Transaction(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='transactions')
    shop_user = models.ForeignKey(ShopUser, on_delete=models.CASCADE, related_name='transactions')
    date = models.DateTimeField(auto_now_add=True)
    payment_method = models.CharField(max_length=11, choices=[
        ('balance', _('Balance')),
        ('credit_card', _('Credit Card')),
    ])
    status = models.CharField(max_length=11, choices=[
        ('processing', _('Processing')),
        ('shipped', _('Shipped')),
        ('canceled', _('Canceled')),
    ], default='processing')

    class Meta:
        ordering = ['-date']

    def __str__(self):
        return f'{self.shop_user.username} purchased {self.product.name} on {self.date.strftime("%Y-%m-%d %H:%M:%S")}'
