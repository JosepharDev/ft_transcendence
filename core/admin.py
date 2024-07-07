from django.contrib import admin
from core import models
from django.contrib.auth.admin import UserAdmin
# Register your models here.

# class UAdmin(UserAdmin):
#     # The forms to add and change user instances
#     # The fields to be used in displaying the User model.
#     # These override the definitions on the base UserAdmin
#     # that reference specific fields on auth.User.
#     list_display = ["username", "remote", "nickname"]
#     fieldsets = [
#         (None, {"fields": ["email", "password"]})
#     ]
#     # add_fieldsets is not a standard ModelAdmin attribute. UserAdmin
#     # overrides get_fieldsets to use this attribute when creating a user.
#     add_fieldsets = [
#         (
#             None,
#             {
#                 "classes": ["wide"],
#                 "fields": ["password1"],
#             },
#         ),
#     ]
#     search_fields = ["username"]
#     ordering = ["username"]
#     filter_horizontal = []

admin.site.register(models.User) # , UAdmin
admin.site.register(models.Match)
admin.site.register(models.HistoryMatch)
admin.site.register(models.Friend)

