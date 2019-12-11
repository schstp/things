'use strict';

/* GLOBALS */
window.newEvent = null; // during the new event creation it is available in the whole window

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

window.TIME_EDITS = {0: '00', 1: '01', 2: '02', 3: '03', 4: '04', 5: '05', 6: '06', 7: '07', 8: '08', 9: '09'};

window.VIEW_MODE = 1;
window.TIME_STEP = 15;
window.BASE_DATE = new Date();
window.CURRENT_DATE = new Date();

setInterval(function () {
    CURRENT_DATE = new Date();
}, 1000);

window.clickTimer = 0;
window.clickDelay = 200;
window.preventClick = false;


/* AUXILIARY FUNCTIONS */

function getCurrWeekDates(date) {
    let currWeekDates = [];


    if (date.getDay() === 0) {
        date.setDate(date.getDate() - 6);

        do {
            currWeekDates.push(new Date(date.getTime()));
            date.setDate(date.getDate() + 1);
        }
        while (date.getDay() !== 1)
    }
    else {
        while (date.getDay() > 0) {
            date.setDate(date.getDate() - 1);
        }
        while (date.getDay() !== 6) {
            currWeekDates.push(new Date(date.getTime()));
            date.setDate(date.getDate() + 1);
        }

        currWeekDates.push(new Date(date.getTime()));
        currWeekDates.shift();
        date.setDate(date.getDate() + 1);
        currWeekDates.push(new Date(date.getTime()));
    }
    return currWeekDates;

}


function timeToDays(time) {
    return time/1000/60/60/24;
}


function getWeekNumber(date) {
    var weekNumber;
    var yearStart;
    var ts;

    if (date instanceof Date) {
        ts = new Date(date);
    } else {
        ts = date ? new Date(date) : new Date();
    }

    ts.setHours(0, 0, 0);
    ts.setDate(ts.getDate() + 4 - (ts.getDay()||7));

    yearStart = new Date(ts.getFullYear(), 0, 1);

    weekNumber = Math.floor((timeToDays(ts - yearStart) + 1) / 7);

    return weekNumber;
}


function getLocalDay(date) {

    let day = date.getDay();

    if (day === 0) { // день недели 0 (воскресенье) в европейской нумерации будет 7
      day = 7;
    }

    return day - 1;
}


function convertPositionToTime(newEvent) {
    let topOffset = parseInt(newEvent.style.top);
    let height = parseInt(newEvent.style.height);

    let startHours, startMinutes, endHours, endMinutes, timenote;

    startHours =  Math.floor(topOffset / 60);
    startMinutes = topOffset % 60;
    endHours = Math.floor((topOffset + height) / 60);
    endMinutes = (topOffset + height) % 60;

    return {
        'startHours': startHours,
        'startMinutes': startMinutes,
        'endHours': endHours,
        'endMinutes': endMinutes,
    }
}


function converTimeToPosition(startDate, endDate) {
    startDate = new Date(startDate);
    endDate = new Date(endDate);

    let topOffset = startDate.getHours() * TIME_STEP * 4 + startDate.getMinutes();
    let height = endDate.getHours() * TIME_STEP * 4 + endDate.getMinutes() -
        (startDate.getHours() * TIME_STEP * 4 + startDate.getMinutes());

    return {
        'topOffset': topOffset,
        'height': height,
    }
}


function getTimeNote(eventElement) {

    let {startHours, startMinutes, endHours, endMinutes} = convertPositionToTime(eventElement);

    let startHoursStr = startHours < 10 ? TIME_EDITS[startHours] : startHours;
    let startMinutesStr = startMinutes < 10 ? TIME_EDITS[startMinutes] : startMinutes;
    let endHoursStr = endHours < 10 ? TIME_EDITS[endHours] : endHours;
    let endMinutesStr = endMinutes < 10 ? TIME_EDITS[endMinutes] : endMinutes;

    return startHoursStr + ":" + startMinutesStr + " - " + endHoursStr + ":" + endMinutesStr;
}


function setHeaderDateInfo(weekFirstDate, weekLastDate) {
    let dateInfo;

    switch (VIEW_MODE) {
            case 0:

                dateInfo = MONTHS[weekFirstDate.getMonth()][0] + " " + weekFirstDate.getFullYear();

                break;
            case 1:

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

                break;
            case 2:
                dateInfo = "NOT IMPLEMENTED";
                console.log('at 2');
                break;
            case 3:
                dateInfo = "NOT IMPLEMENTED";
                console.log('at 3');
                break;
        }

    document.getElementById('dateInfo').innerText = dateInfo;
}


function createNewEvent({topOffset, height = 0, title = "(No Title)", color = "#7587C7" }) {
    let newEvent = document.createElement('div');

    let eventTitle = document.createElement('div');
    eventTitle.innerText = title;
    eventTitle.classList.add('event-content', 'event-title');

    let eventTimenote = document.createElement('div');
    eventTimenote.classList.add('event-content', 'event-timenote');

    newEvent.appendChild(eventTitle);
    newEvent.appendChild(eventTimenote);
    newEvent.classList.add('event');
    newEvent.addEventListener('click', handleClickOnEvent);
    newEvent.addEventListener('dblclick', handleDblClickOnEvent);
    newEvent.style.height = height + 'px';
    newEvent.style.top = topOffset + 'px';
    newEvent.style.backgroundColor = color;

    return newEvent;
}


function createTimestampsForGeneratedEvent(newEvent) {
    let date = newEvent.parentElement.getAttribute('data-date-info');
    let startDate = new Date(date);
    let endDate = new Date(date);

    let {startHours, startMinutes, endHours, endMinutes} = convertPositionToTime(newEvent);

    startDate.setHours(startHours);
    startDate.setMinutes(startMinutes);
    startDate.setSeconds(0);
    startDate.setMilliseconds(0);
    endDate.setHours(endHours);
    endDate.setMinutes(endMinutes);
    endDate.setSeconds(0);
    endDate.setMilliseconds(0);

    return {'startDate': startDate, 'endDate': endDate}
}


function showEventCreationDialog(newEvent, e) {
    let eventCreationDialog = document.getElementById('eventCreationDialog');
    let {startDate, endDate} = createTimestampsForGeneratedEvent(newEvent);
    document.getElementById('duration').innerText = startDate + " ---- " + endDate;

    $(eventCreationDialog).show();

    changeEventCreationDialogPosition();
    e.stopPropagation(); // to prevent immediate event creation dialog closing
}


function changeEventCreationDialogPosition() {
    let eventCreationDialog = document.getElementById('eventCreationDialog');

    if ($(eventCreationDialog).css('display') !== 'none') {
        let ECDHeight = parseInt($(eventCreationDialog).css('height'));
        let ECDWidth = parseInt($(eventCreationDialog).css('width'));
        let eventHeight = parseInt(newEvent.style.height);
        let eventWidth = parseInt($(newEvent).css('width'));
        let eventOffset = $(newEvent).offset();

        switch (VIEW_MODE) {
            case 0:
                if (eventOffset.top + ECDHeight > innerHeight) {
                    eventCreationDialog.style.top = eventOffset.top - ECDHeight + eventHeight +  'px';

                    if (parseInt(eventCreationDialog.style.top) > innerHeight) {
                        eventCreationDialog.style.top = innerHeight - ECDHeight - 5 + 'px';
                    }
                }
                else if (eventOffset.top > 0) {
                    eventCreationDialog.style.top = eventOffset.top + 'px';
                }

                eventCreationDialog.style.left = eventOffset.left + eventWidth / 2 - ECDWidth / 2 + 'px';
                break;
            case 1:

                if (eventOffset.top + ECDHeight > innerHeight) {
                    eventCreationDialog.style.top = eventOffset.top - ECDHeight + eventHeight +  'px';

                    if (parseInt(eventCreationDialog.style.top) > innerHeight) {
                        eventCreationDialog.style.top = innerHeight - ECDHeight - 5 + 'px';
                    }
                }
                else if (eventOffset.top > 0) {
                    eventCreationDialog.style.top = eventOffset.top + 'px';
                }

                if (eventOffset.left < ECDWidth + 10) {
                    eventCreationDialog.style.left = eventOffset.left + eventWidth + 10 + 'px';
                }
                else {
                    eventCreationDialog.style.left = eventOffset.left - ECDWidth - 10 + 'px';
                }
                break;
            case 2:

                break;
            case 3:

                break;
        }

    }
}


function saveNewEvent() {
    $('#eventCreationDialog').hide();
    newEvent.style.opacity = 1;
    let dates = createTimestampsForGeneratedEvent(newEvent);

    $.ajax({
        type: 'POST',
        url: 'add_new_event/',
        data: {
            csrfmiddlewaretoken: $('input[name="csrfmiddlewaretoken"]').val(),
            start_date: JSON.stringify(dates.startDate.toString()),
            end_date: JSON.stringify(dates.endDate.toString()),
        },
        dataType: 'json',
        success: function (data) {
            if (data.flag) {
                console.log('SUCCESS!');
            }
        }
    })
}


function showEventPreview(e) {
    alert('click');
}

function showEventEditor(e) {
    alert(('double click'));
}


function buildCalendar(id, year, month) {
    var Dlast = new Date(year,month+1,0).getDate(),
        D = new Date(year,month,Dlast),
    	DNlast = new Date(D.getFullYear(),D.getMonth(),Dlast).getDay(),
    	DNfirst = new Date(D.getFullYear(),D.getMonth(),1).getDay(),
    	calendar = '<tr>',
        month = ["January","February","March","April","May","June","July","August","September","October","November","December"];

    if (DNfirst !== 0) {
        for(let i = 1; i < DNfirst; i++) calendar += '<td>';
    }
    else {
        for(let i = 0; i < 6; i++) calendar += '<td>';
    }

    for (let i = 1; i <= Dlast; i++) {
        if (i === new Date().getDate() &&
            D.getFullYear() === new Date().getFullYear() &&
            D.getMonth() === new Date().getMonth()) {
    		calendar += '<td class="today">' + i;
        }
  		else {
    		calendar += '<td>' + i;
  		}
  		if (new Date(D.getFullYear(),D.getMonth(),i).getDay() === 0) {
    		calendar += '<tr>';
  		}
    }

    for(var  i = DNlast; i < 7; i++) calendar += '<td>&nbsp;';

    document.querySelector('#'+id+' tbody').innerHTML = calendar;
    document.querySelector('#'+id+' thead td:nth-child(2)').innerHTML = month[D.getMonth()] +' '+ D.getFullYear();
    document.querySelector('#'+id+' thead td:nth-child(2)').dataset.month = D.getMonth();
    document.querySelector('#'+id+' thead td:nth-child(2)').dataset.year = D.getFullYear();
    if (document.querySelectorAll('#'+id+' tbody tr').length < 6) {  // чтобы при перелистывании месяцев не "подпрыгивала" вся страница, добавляется ряд пустых клеток. Итог: всегда 6 строк для цифр
    	document.querySelector('#'+id+' tbody').innerHTML += '<tr><td>&nbsp;<td>&nbsp;<td>&nbsp;<td>&nbsp;<td>&nbsp;<td>&nbsp;<td>&nbsp;';
    }
}


function addInboxTask(e) {
    if ($("input[name='taskName']").val() !== 0) {
        let inboxTask = document.createElement('div');
        $(inboxTask).attr("id", "inboxTask");
        $(inboxTask).attr("class", 'row');
        let taskLabel = document.createElement('div');
        $(taskLabel).addClass("col-sm-8");
        var text = $("input[name='taskName']").val();
        $(taskLabel).text(text);

        let inboxButton = document.createElement('button');
        $(inboxButton).attr("class", "col-sm-1");
        $(inboxButton).attr("type", "button");
        $(inboxButton).attr("id", "deleteTask");
        $(inboxButton).on('click', function(e) {
            this.parentElement.remove(e.target.parentElement);
        });

        let inboxButtonIcon = document.createElement('img');
        $(inboxButtonIcon).attr("src", "https://img.icons8.com/ios/24/000000/close-window.png");
        $(inboxButtonIcon).attr("heigth", "18");
        $(inboxButtonIcon).attr("width", "18");

        $(inboxButton).append(inboxButtonIcon);

        $(inboxTask).append(taskLabel);
        $(inboxTask).append(inboxButton);
        $('#taskInbox').append(inboxTask);
    }
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

    // sidebar calendar building
    buildCalendar("calendar2", new Date().getFullYear(), new Date().getMonth());

    // переключатель минус месяц
	document.querySelector('#calendar2 thead tr:nth-child(1) td:nth-child(1)').onclick = function() {
  	buildCalendar("calendar2", document.querySelector('#calendar2 thead td:nth-child(2)').dataset.year,
        parseFloat(document.querySelector('#calendar2 thead td:nth-child(2)').dataset.month)-1);
	};
	// переключатель плюс месяц
	document.querySelector('#calendar2 thead tr:nth-child(1) td:nth-child(3)').onclick = function() {
  	buildCalendar("calendar2", document.querySelector('#calendar2 thead td:nth-child(2)').dataset.year,
        parseFloat(document.querySelector('#calendar2 thead td:nth-child(2)').dataset.month)+1);
	};

    // sidebar button click
    $('#sidebarCollapse').on('click', function () {
        $('#sidebar, #content').toggleClass('active');
        $('.timeline-item').toggleClass('act');
    });

    // addTask button/"enter press" handler (inbox container)
    $('#addTask').click(addInboxTask);

    $('#taskName').keyup(function(e){
    	if(e.keyCode === 13) addInboxTask(e);
    });

    // event creation dialog is closed if the user clicks out it
    $(document).on({
        mouseup: function (e) {
            var eventCreationDialog = $('#eventCreationDialog');

            if (eventCreationDialog.css('display') !== 'none' && !eventCreationDialog.is(e.target)
                && eventCreationDialog.has(e.target).length === 0) {
                eventCreationDialog.hide();
                eventCreationDialog.css({'top': innerHeight / 2, 'left': innerWidth / 2});

                if (!$(newEvent).is(e.target) && $(newEvent).has(e.target).length === 0) newEvent.remove();
            }},
    });

    // event creation dialog is replaced if the browser window is resized
    $(window).on('resize', changeEventCreationDialogPosition);

    // saveEventBtn handler
    $('#saveEventBtn').on('click', saveNewEvent);

    var searchMode = false;

    // search button click event
    $('#searchButton').on('click', function() 
    {
        if (!searchMode)
        {
            searchMode = true;
            //hiding panel
            var hideElem = document.getElementById("hideElem");
            hideElem.style.display = "none";

            //creating search field
            var searchField = document.getElementById("searchField");
            var searchItem = document.createElement("input");
            searchItem.id = "searchItem";
            searchItem.type = "text";
            searchItem.placeholder = "Type name of task";

            //appending search field
            searchField.appendChild(searchItem)
        }
        else
        {
            searchMode = false;
            //removing search field
            var searchField = document.getElementById("searchField");
            while (searchField.firstChild)
                searchField.removeChild(searchField.firstChild);

            //showing panel
            var hideElem = document.getElementById("hideElem");
            hideElem.style.display = "flex";
        }

    });
});