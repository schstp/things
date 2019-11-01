from django.shortcuts import render, redirect
from django.contrib.auth import login, authenticate
from django.utils import timezone

from .models import CustomUser


def index(request):
    request.session['django_timezone'] = request.GET.get('timezone')
    title = 'Things'

    context = {
        'title': title,
        'time': timezone.now(),

    }
    return render(request, 'index.html', context)