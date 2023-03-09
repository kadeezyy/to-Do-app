from django.db import models
# from django.contrib.auth.models import User
from django.conf import settings
from django.utils import timezone




# from models import User
# Create your models here.

class Note(models.Model): 
    User = settings.AUTH_USER_MODEL
    title = models.CharField(max_length=50, unique=True)
    description = models.TextField(max_length=300)
    done = models.BooleanField(default=False, null=True, blank=True)

    user = models.ForeignKey(User, on_delete=models.CASCADE)
