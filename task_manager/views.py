from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from django.utils import timezone

@login_required
def index(request):
    request.session['django_timezone'] = request.GET.get('timezone')
    title = 'Calendar - Things'

    context = {
        'title': title,
        'time': timezone.now(),
    }
    return render(request, 'task_manager/calendar.html', context)
