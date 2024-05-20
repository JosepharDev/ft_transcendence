from django.contrib import admin
from . import models
# Register your models here.
admin.site.register(models.User)
admin.site.register(models.Match)
admin.site.register(models.HistoryMatch)
admin.site.register(models.Friend)

