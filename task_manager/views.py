from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
import json
from datetime import datetime

from .models import Event
from core.models import CustomUser


@login_required
def calendar(request):
    title = 'Calendar - Things'
    view_mode = request.user.view_mode
    is_sidebar_on = 1 if request.user.is_sidebar_on else 0

    context = {
        'title': title,
        'view_mode': view_mode,
        'is_sidebar_on': is_sidebar_on,
    }
    return render(request, 'task_manager/calendar.html', context)


def add_new_event(request):
    start_date = datetime.strptime(request.POST.get('start_date')[5:25], "%b %d %Y %H:%M:%S")
    end_date = datetime.strptime(request.POST.get('end_date')[5:25], "%b %d %Y %H:%M:%S")
    title = request.POST.get('title')
    color = request.POST.get('color')

    new_event = Event.objects.create(start_date=start_date, end_date=end_date,
                                     user=request.user, title=title, color=color)
    new_event.save()

    data = {
        'flag':True,
        'eventId': new_event.id,
    }
    return JsonResponse(data)


def get_day_events(request):
    user = request.user
    parsed_date = datetime.strptime(request.GET.get('date')[5:16], "%b %d %Y")
    events = list(Event.objects.filter(user=user, start_date__date=parsed_date.date()))
    data = {'events': []}

    for event in events:
        data['events'].append({
            'id': event.id,
            'title': event.title,
            'description': event.description,
            'startDate': event.start_date,
            'endDate': event.end_date,
            'importance': event.importance,
            'color': event.color,
        })

    return JsonResponse(data)


def get_week_events(request):
    user = request.user
    data = {0: [], 1: [], 2: [], 3: [], 4: [], 5: [], 6: []}

    for i, date in enumerate(json.loads(request.GET.get('dates'))):
        parsed_date = datetime.strptime(date[4:15], "%b %d %Y")
        events = list(Event.objects.filter(user=user, start_date__date=parsed_date.date()))
        for event in events:
            data[i].append({
                'id': event.id,
                'title': event.title,
                'description': event.description,
                'startDate': event.start_date,
                'endDate': event.end_date,
                'importance': event.importance,
                'color': event.color,
            })

    return JsonResponse(data)


def get_month_events(request):
    user = request.user
    data = {}
    print(request.GET.get('dates'))
    for i, dates_list in enumerate(json.loads(request.GET.get('dates'))):
        data.update({i: []})
        for j, date in enumerate(dates_list):
            parsed_date = datetime.strptime(date[4:15], "%b %d %Y")
            events = list(Event.objects.filter(user=user, start_date__date=parsed_date.date()))
            data[i].append([])
            for event in events:
                data[i][j].append({
                    'id': event.id,
                    'title': event.title,
                    'description': event.description,
                    'startDate': event.start_date,
                    'endDate': event.end_date,
                    'importance': event.importance,
                    'color': event.color,
                })

    return JsonResponse(data)


def update_event(request):
    user = request.user
    event_id = int(request.POST.get('id'))
    start_date = datetime.strptime(request.POST.get('start_date')[5:25], "%b %d %Y %H:%M:%S")
    end_date = datetime.strptime(request.POST.get('end_date')[5:25], "%b %d %Y %H:%M:%S")

    event = Event.objects.get(user=user, pk=event_id)
    event.start_date = start_date
    event.end_date = end_date
    event.save()

    data = {'flag': True}

    return JsonResponse(data)


def save_user_view_settings(request):
    view_mode = request.POST.get('view_mode')
    is_sidebar_on = request.POST.get('is_sidebar_on')
    user = CustomUser.objects.get(pk=request.user.pk)
    user.view_mode = view_mode
    user.is_sidebar_on = is_sidebar_on
    user.save()

    data = {'flag': True}
    return JsonResponse(data)
