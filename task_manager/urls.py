from django.urls import path, re_path
from django.conf.urls import url
from . import views

urlpatterns = [
    path('', views.calendar, name='calendar'),
    path('add_new_event/', views.add_new_event, name='add_new_event'),
    re_path(r'^get_day_events/$', views.get_day_events, name='get_day_events'),
    re_path(r'^get_week_events/$', views.get_week_events, name='get_week_events'),
    re_path(r'^get_month_events/$', views.get_month_events, name='get_month_events'),
    re_path(r'^get_search_res/$', views.get_search_res, name='get_search_res'),
    path('update_event/', views.update_event, name='update_event'),
    path('save_user_view_settings/', views.save_user_view_settings, name='save_user_view_settings'),
    path('push_new_event_data/', views.push_new_event_data, name='push_new_event_data'),
    path('get_id_by_doubleclick/', views.get_id_by_doubleclick, name='get_id_by_doubleclick'),
    path('update_double_clicked_event/', views.update_double_clicked_event, name='update_double_clicked_event'),
    path('delete_event/', views.delete_event, name='delete_event'),
]