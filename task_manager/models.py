from django.db import models
from core.models import CustomUser


class Event(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    title = models.TextField(default="(No title)")
    description = models.TextField(default="")
    start_date = models.DateTimeField()
    end_date = models.DateTimeField()
    importance = models.IntegerField(default=0)
    color = models.CharField(default="#7587C7", max_length=10)

    def __str__(self):
        return self.title + " date: " + str(self.start_date)

    class Meta:
        ordering = ['start_date']


class Notification(models.Model):
    event = models.ForeignKey(Event, on_delete=models.CASCADE)
    date = models.DateTimeField()

    class Meta:
        ordering = ['date']