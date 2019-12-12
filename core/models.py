from django.contrib.auth.models import AbstractUser
from django.db import models

class CustomUser(AbstractUser):
    view_mode = models.IntegerField(default=1)
    is_sidebar_on = models.BooleanField(default=True)
    def __str__(self):
        return self.email
