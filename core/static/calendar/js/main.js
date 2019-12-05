'use strict';

/* GLOBALS */

window.WEEK_DAYS = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];

window.MONTHS = {
        0: {0: 'January', 1: 'Jan'}, 1: {0: 'February', 1: 'Feb'}, 2: {0: 'March', 1: 'Mar'},
        3: {0: 'April', 1: 'Apr'}, 4: {0: 'May', 1: 'May'}, 5: {0: 'June', 1: 'June'},
        6: {0: 'July', 1: 'July'}, 7: {0: 'August', 1: 'Aug'}, 8: {0: 'September', 1: 'Sep'},
        9: {0: 'October', 1: 'Oct'}, 10: {0: 'November', 1: 'Nov'}, 11: {0: 'December', 1: 'Dec'}
    };

window.TIMESTAMPS = [
            '01:00', '02:00', '03:00', '04:00', '05:00', '06:00', '07:00', '08:00',
            '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00',
            '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00'
        ];

window.VIEW_MODE = 1;
window.TIME_STEP = 30;
window.BASE_DATE = new Date();
window.CURRENT_DATE = new Date();

setInterval(function () {
    CURRENT_DATE = new Date();
}, 1000);

window.clickTimer = 0;
window.clickDelay = 200;
window.preventClick = false;

/* AUXILIARY FUNCTIONS */

function getWeekInfo(date) {
    let currWeekDates = [];
    let weekFirstDate = new Date();
    let weekLastDate = new Date();

    while (date.getDay() > 0) {
        date.setDate(date.getDate() - 1);
    }

    weekFirstDate.setTime(date.getTime());

    while (date.getDay() !== 6) {
        currWeekDates.push(new Date(date.getTime()));
        date.setDate(date.getDate() + 1);
    }

    currWeekDates.push(new Date(date.getTime()));
    currWeekDates.shift();
    date.setDate(date.getDate() + 1);
    currWeekDates.push(new Date(date.getTime()));

    weekLastDate.setTime(date.getTime());

    return {
        'weekFirstDate': weekFirstDate,
        'weekLastDate': weekLastDate,
        'currWeekDates': currWeekDates,
    }
}

function setHeaderDateInfo(weekFirstDate, weekLastDate) {
    let dateInfo;

    if (weekFirstDate.getMonth() === weekLastDate.getMonth() &&
        weekFirstDate.getFullYear() === weekLastDate.getFullYear()) {

        dateInfo = MONTHS[weekFirstDate.getMonth()][0] + " " + weekFirstDate.getFullYear();
    }
    else if (!(weekFirstDate.getFullYear() === weekLastDate.getFullYear())) {
        dateInfo = MONTHS[weekFirstDate.getMonth()][1] + " " + weekFirstDate.getFullYear() + " - "
            + MONTHS[weekLastDate.getMonth()][1] + " " + weekLastDate.getFullYear();
    }
    else {
        dateInfo = MONTHS[weekFirstDate.getMonth()][1] + " - " + MONTHS[weekLastDate.getMonth()][1] + " " +
            weekFirstDate.getFullYear();
    }

    document.getElementById('dateInfo').innerText = dateInfo;
}

function createNewEvent(topOffset) {
    let newEvent = document.createElement('div');

    newEvent.classList.add('event');
    newEvent.addEventListener('click', handleClickOnEvent);
    newEvent.addEventListener('dblclick', handleDblClickOnEvent);
    newEvent.style.height = 0;
    newEvent.style.top = topOffset + 'px';

    return newEvent;
}

function showEventPreview(e) {
    alert('click');
}

function showEventEditor(e) {
    alert(('double click'));
}

/* COMMON EVENT HANDLERS */

function handleClickOnEvent(e) {
    clickTimer = setTimeout(function() {
      if (!preventClick) {
        showEventPreview(e);
      }
      preventClick = false;
    }, clickDelay);
}

function handleDblClickOnEvent(e) {
    clearTimeout(clickTimer);
    preventClick = true;
    showEventEditor(e);
}


/* GENERAL EVENT HANDLERS */

$(document).ready(function () {

    // sidebar button click
    $('#sidebarCollapse').on('click', function () {
        $('#sidebar, #content').toggleClass('active');
        $('.timeline-item').toggleClass('act');
    });

});