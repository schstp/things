from django.urls import path, re_path
from django.conf.urls import url
from . import views

urlpatterns = [
    path('', views.calendar, name='calendar'),
    path('add_new_event/', views.add_new_event, name='add_new_event'),
    re_path(r'^get_events/$', views.get_events, name='get_events'),
    re_path(r'^get_event/$', views.get_event, name='get_event')
]