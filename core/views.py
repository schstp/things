from django.shortcuts import render_to_response
from django.utils.translation import ugettext_lazy as _
from django.utils import timezone
from datetime import datetime

def index(request):
    request.session['django_timezone'] = request.GET.get('timezone')
    title = _('Things')
    context = {
        'title': title,
        'time': timezone.now(),
    }
    return render_to_response('core/index.html', context)
