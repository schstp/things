from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from django.utils import timezone
from django.http import JsonResponse

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
    print(request.POST.get('test_data'))
    data = {
        'flag':True,
    }
    return JsonResponse(data)
