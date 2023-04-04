from django.contrib import admin
from django.contrib.auth.admin import UserAdmin

from shop.models import *


class CustomUserAdmin(UserAdmin):
    model = ShopUser
    list_display = ["email", "username", 'balance']
    fieldsets = UserAdmin.fieldsets + (
        ("Shop Specific", {'fields': ('balance', 'phone_number')}),
    )


admin.site.register(ShopUser, CustomUserAdmin)
admin.site.register(Product)
admin.site.register(Transaction)
