from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from django.utils import timezone
from django.http import JsonResponse
import json
from datetime import datetime

from .models import Event


@login_required
def calendar(request):
    request.session['django_timezone'] = request.GET.get('timezone')
    title = 'Calendar - Things'

    context = {
        'title': title,
        'time': timezone.now(),
    }
    return render(request, 'task_manager/calendar.html', context)


def add_new_event(request):
    print(request.POST.get('start_date')[5:25])
    print(request.POST.get('end_date')[5:25])
    data = {
        'flag':True,
    }
    return JsonResponse(data)


def get_events(request):
    user = request.user
    data = {0: [], 1: [], 2: [], 3: [], 4: [], 5: [], 6: []}

    for i, date in enumerate(json.loads(request.GET.get('dates'))):
        parsed_date = datetime.strptime(date[4:15], "%b %d %Y")
        events = list(Event.objects.filter(user=user, start_date__date=parsed_date.date()))
        for event in events:
            data[i].append({
                'title': event.title,
                'description': event.description,
                'startDate': event.start_date,
                'endDate': event.end_date,
                'importance': event.importance,
                'color': event.color,
            })

    return JsonResponse(data)


def get_event(request):
    user = request.user
    parsed_date = datetime.strptime(json.loads(request.GET.get('date'))[4:15], "%b %d %Y")
    print(parsed_date)
    events = list(Event.objects.filter(user=user, start_date__date=parsed_date.date()))
    data = {'events': []}

    for event in events:
        data['events'].append({
            'title': event.title,
            'description': event.description,
            'startDate': event.start_date,
            'endDate': event.end_date,
            'importance': event.importance,
            'color': event.color,
        })
    print(data)
    return JsonResponse(data)
