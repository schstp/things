from django.urls import path, re_path
from django.conf.urls import url
from . import views

urlpatterns = [
    path('', views.calendar, name='calendar'),
    path('add_new_event/', views.add_new_event, name='add_new_event')
]