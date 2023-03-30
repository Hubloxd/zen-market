# from django.contrib.auth.forms import UserCreationForm
#
# from shop.models import ShopUser
#
#
# class ShopUserCreationForm(UserCreationForm):
#     def __init__(self, *args, **kwargs):
#         # first call parent's constructor
#         super(ShopUserCreationForm, self).__init__(*args, **kwargs)
#         # there's a `fields` property now
#         self.fields['password1'].required = False
#         self.fields['password2'].required = False
#         self.fields['email'].required = True
#
#     class Meta:
#         model = ShopUser
#         fields = ['username', 'email', 'password']
#
