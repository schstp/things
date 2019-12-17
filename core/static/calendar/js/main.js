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

window.TIME_STEP = 15;
window.BASE_DATE = new Date();
window.CURRENT_DATE = new Date();

window.clickTimer = 0;
window.clickDelay = 200;
window.preventClick = false;

window.RESDND = false;
/* AUXILIARY FUNCTIONS */


function updateTimemark() {
    if (VIEW_MODE === 0 || VIEW_MODE === 1) {
        let timemark = $($('.timemark')[0]);
        let currTime = CURRENT_DATE.getHours() * TIME_STEP * 4 + CURRENT_DATE.getMinutes();

        timemark.css('top', currTime - 7);
    }
}


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


function getCurrMonthDates(date) {
    let auxDate = new Date(date.getFullYear(), date.getMonth(), 1);

    while (auxDate.getDay() !== 1) {
        auxDate.setDate(auxDate.getDate() - 1);
    }

    let currMonthDates = [6];

    for (let i=0; i < 6; i++) {
        currMonthDates[i] = [];
        for (let j=0; j < 7; j++) {
            currMonthDates[i][j] = new Date(auxDate.getTime());
            auxDate.setDate(auxDate.getDate() + 1);
        }
    }

    return currMonthDates;
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

    let startHours, startMinutes, endHours, endMinutes;

    startHours =  Math.floor(topOffset / 60);
    startMinutes = topOffset % 60;
    endHours = Math.floor((topOffset + height) / 60);
    endMinutes = (topOffset + height) % 60;

    if (endHours === 24 && endMinutes === 0) {
        endHours = 23;
        endMinutes = 59;
    }

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

    if (endHours === 23 && endMinutes === 59) {
        endHours = 0;
        endMinutes = 0;
    }

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
                dateInfo = MONTHS[weekFirstDate.getMonth()][0] + " " + weekFirstDate.getFullYear();
                break;
        }

    document.getElementById('dateInfo').innerText = dateInfo;
}


function createNewEvent({topOffset, height = 0,
                            title = "(No Title)", color = "#7587C7",
                            id = ""}) {

    let newEvent = document.createElement('div');
    newEvent.setAttribute("data-event-id", id);
    let eventTitle = document.createElement('div');
    eventTitle.innerText = title;
    eventTitle.classList.add('event-content', 'event-title');

    let eventTimenote = document.createElement('div');
    eventTimenote.classList.add('event-content', 'event-timenote');

    newEvent.appendChild(eventTitle);
    newEvent.appendChild(eventTimenote);


    let stretchBox = document.createElement('div');
    stretchBox.classList.add('stretch-box');
    newEvent.appendChild(stretchBox);



    newEvent.classList.add('event');
    newEvent.addEventListener('click', handleClickOnEvent);
    newEvent.addEventListener('dblclick', handleDblClickOnEvent);
    newEvent.style.height = height + 'px';
    newEvent.style.top = topOffset + 'px';
    newEvent.style.backgroundColor = color;

    addEventListenersForResizing(newEvent);
    addEventListenersForDragAndDrop(newEvent);
    addEventListenerForContextMenu(newEvent);

    return newEvent;
}


function addEventListenersForResizing(eventObj) {
    let stretchBox = eventObj.getElementsByClassName('stretch-box')[0];
    let isMousedown = false;
    let eventTimeNote, eventStartPoint, prevY, topPanelHeight, scrollTopPos, scrollTopPos_delta;

    $(stretchBox).on({
        mousedown: function (e) {
            if (e.target === stretchBox) {
                if (e.which === 1) {
                    RESDND = true;
                    isMousedown = true;
                    prevY = e.pageY; // aux.variable for identifying mouse movement direction
                    eventStartPoint = Math.round(parseFloat(eventObj.style.top) / TIME_STEP) * TIME_STEP; // event start point (always starts from the point that is multiple of 15 min)
                    topPanelHeight = e.pageY - parseFloat(eventObj.style.height) - eventStartPoint; // have to consider the offset of working area

                    // scrolling offset
                    var currViewBody = document.getElementById('content').childNodes[1];
                    scrollTopPos = currViewBody.scrollTop;
                    scrollTopPos_delta = 0;

                    eventTimeNote = eventObj.getElementsByClassName('event-timenote')[0];

                    let isSaved = eventObj.getAttribute('data-event-id') !== "";

                    if (isSaved) {
                        eventObj.classList.toggle('event');
                        eventObj.classList.toggle('event-modifying');
                    }// during event creation the user has decided to replace event
                    currViewBody.classList.toggle('cursor-resize');

                } // interested only in left mouse key down
            } // free working area was a target of mousedown event

             $(currViewBody).on({
        mousemove: function (e) {

            if (isMousedown) {

                if (Math.abs(prevY - e.pageY) >= TIME_STEP) {

                    scrollTopPos_delta = currViewBody.scrollTop - scrollTopPos;

                    if (e.pageY + scrollTopPos_delta - topPanelHeight > eventStartPoint) {

                        if (eventObj.style.top !== eventStartPoint) eventObj.style.top = eventStartPoint + 'px'; // direction was changed

                        if (Math.round((e.pageY - topPanelHeight - eventStartPoint + scrollTopPos_delta) / TIME_STEP) >= 3) {
                            eventObj.style.height = Math.round((e.pageY - topPanelHeight - eventStartPoint + scrollTopPos_delta) / TIME_STEP) * TIME_STEP + 'px';
                        } else {
                            eventObj.style.height = TIME_STEP * 3 + 'px';
                        } // event can not be shorter than 45 minutes

                    } // resizing after breakpoint
                    else {

                        if (Math.round((Math.abs(e.pageY - topPanelHeight - eventStartPoint + scrollTopPos_delta)) / TIME_STEP) >= 3) {
                            eventObj.style.top = Math.round((Math.abs(e.pageY - topPanelHeight + scrollTopPos_delta)) / TIME_STEP) * TIME_STEP + 'px';
                            eventObj.style.height = Math.round((Math.abs(e.pageY - topPanelHeight - eventStartPoint + scrollTopPos_delta)) / TIME_STEP) * TIME_STEP + 'px';
                        } // event can not be shorter than 45 minutes

                    } // resizing before breakpoint

                    // save previous cursor position
                    prevY = e.pageY;

                    // update event time note
                    eventTimeNote.innerText = getTimeNote(eventObj);
                } // movement is reasonable
            } // changing a new event duration only if left mouse key is down
        }
    });

    $('#content').on({
        mouseup: function (e) {
            if (isMousedown) {
                isMousedown = false;
                currViewBody.classList.toggle('cursor-resize');
                let isSaved = eventObj.getAttribute('data-event-id') !== "";
                if (isSaved) {
                    eventObj.classList.toggle('event-modifying');
                    eventObj.classList.toggle('event');

                    updateEvent(eventObj);
                }
                else {
                    showEventCreationDialog(e);
                }
            } // the mousedown event was generated in free working area
        },
    });


        },
    });
}


function addEventListenersForDragAndDrop(eventObj) {

    // prevent embedded browser behavior for drag&drop
    eventObj.ondragstart = function () {
        return false;
    };

    let wasMovedHorizontally = false;

    $(eventObj).on({
        mousedown: function (e) {
            if (e.target !== eventObj.lastChild && e.which === 1) {

                let currViewBody = document.getElementById('content').childNodes[1];
                let eventStartPoint, eventTimeNote, prevY, topPanelHeight, scrollTopPos, scrollTopPos_delta;
                eventStartPoint = Math.round(parseFloat(eventObj.style.top) / TIME_STEP) * TIME_STEP; // event start point (always starts from the point that is multiple of 15 min)
                topPanelHeight = e.pageY - parseFloat(eventObj.style.height) - eventStartPoint; // have to consider the offset of working area
                eventTimeNote = eventObj.getElementsByClassName('event-timenote')[0];

                prevY = e.pageY;
                // scrolling offset
                scrollTopPos = currViewBody.scrollTop;
                scrollTopPos_delta = 0;

                let isSaved = eventObj.getAttribute('data-event-id') !== "";

                if (isSaved) {
                    eventObj.classList.toggle('event');
                    eventObj.classList.toggle('event-modifying');
                } // during event creation the user has decided to replace event
                eventObj.classList.toggle('cursor-grab');

                function moveAt(pageY) {
                    scrollTopPos_delta = currViewBody.scrollTop - scrollTopPos;
                    let top = Math.round((pageY - topPanelHeight
                        + scrollTopPos_delta - eventObj.offsetHeight / 2
                        - parseFloat(eventObj.style.height) / 2) / TIME_STEP) * TIME_STEP;
                    eventObj.style.top = top >= 0 && top <= (1440 - parseInt(eventObj.style.height)) ? top + 'px' : eventObj.style.top;
                    eventTimeNote.innerText = getTimeNote(eventObj);
                }

                function onMouseMove(e) {
                    if (Math.abs(prevY - e.pageY) >= TIME_STEP) {
                        RESDND = true;
                        prevY = e.pageY;
                        moveAt(e.pageY);
                    }
                }

                document.addEventListener('mousemove', onMouseMove);

                function onMouseLeave(e) {
                    if (e.target !== e.relatedTarget) {
                        if (e.relatedTarget.classList.contains('week-view-body-col')) {
                            e.relatedTarget.appendChild(eventObj);
                        }
                        else if (e.relatedTarget.parentNode.classList.contains('week-view-body-col')) {
                            e.relatedTarget.parentNode.appendChild(eventObj);
                        }
                        else if (e.relatedTarget.parentNode.parentNode.classList.contains('week-view-body-col')) {
                            e.relatedTarget.parentNode.parentNode.appendChild(eventObj);
                        }
                        RESDND = true;
                        wasMovedHorizontally = true;
                    }
                }

                $('.week-view-body-col').on('mouseleave', onMouseLeave);

                function onMouseUp (e) {
                    document.removeEventListener('mousemove', onMouseMove);
                    document.removeEventListener('mouseup', onMouseUp);
                    $('.week-view-body-col').unbind('mouseleave', onMouseLeave);

                    if (isSaved) {
                        eventObj.classList.toggle('event');
                        eventObj.classList.toggle('event-modifying');
                    } // during event creation the user has decided to replace event
                    eventObj.classList.toggle('cursor-grab');

                    if (isSaved) {
                        if (RESDND) updateEvent(eventObj);
                    }
                    else {
                        showEventCreationDialog(e);
                    }
                    if (wasMovedHorizontally) {
                        RESDND = false;
                        wasMovedHorizontally = false;
                    } // if was moved hor-lly --> 'click' event for eventObj doesn't appear --> issues with next click
                }

                document.addEventListener('mouseup', onMouseUp);
            }
        }
    })
}


function addEventListenerForContextMenu(eventObj) {
    eventObj.addEventListener('contextmenu', function (e) {
        let isSaved = eventObj.getAttribute('data-event-id') !== "";
        e.preventDefault();
        if (isSaved) {
            let contextMenu = document.querySelector('.context-menu');
            contextMenu.style.left = e.pageX + 'px';
            contextMenu.style.top = e.pageY + 'px';
            contextMenu.style.display = 'block';
        }
    });

    document.addEventListener('mousedown', function (e) {
        // hide context menu
        let contextMenu = $('.context-menu');
        if (contextMenu.css('display') !== 'none' && !contextMenu.is(e.target)
            && contextMenu.has(e.target).length === 0) {

            contextMenu.hide();
        }
    });

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


function showEventCreationDialog(e) {
    let eventCreationDialog = $('#eventCreationDialog');
    let {startDate, endDate} = createTimestampsForGeneratedEvent(newEvent);
    startDate.toLocaleDateString('en-CA') + " ---- " + endDate.toLocaleDateString('en-CA');
    newEvent.classList.toggle('cursor-pointer');

    // timer pikers preparation
    let currDate = new Date(startDate.getTime());
    currDate.setHours(0);
    currDate.setMinutes(0);
    let startTimeOptions = $('#eventCreationDialog .time-selectors #fromSelector option');
    let endTimeOptions = $('#eventCreationDialog .time-selectors #toSelector option');
    let startSelectedIndex = 96, endSelectedIndex = 96;

    for (var i=0; i < 96; i++) {
        startTimeOptions[i].value = currDate.toString();
        endTimeOptions[i].value = currDate.toString();

        if (currDate.getTime() === startDate.getTime()) startSelectedIndex = i;
        if (currDate.getTime() === endDate.getTime()) endSelectedIndex = i;
        currDate.setMinutes(currDate.getMinutes() + 15);
    }

    currDate.setMinutes(currDate.getMinutes() - 1);
    startTimeOptions[i].value = currDate.toString();
    endTimeOptions[i].value = currDate.toString();
    $('#fromSelector')[0].selectedIndex = startSelectedIndex;
    $('#toSelector')[0].selectedIndex = endSelectedIndex;

    // event handlers

    $('#eventCreationDialog .date-picker input').val(startDate.toLocaleDateString('en-CA'));

    $('#eventCreationDialog .color-picker span').on('click', function (e) {
        $('#eventCreationDialog .color-picker .active-color').removeClass('active-color');
            this.classList.add('active-color');
            newEvent.style.backgroundColor = $(this).css('background-color');
        }
    );

    $('#eventCreationDialog .date-picker input').on('change', function (e) {
        let chosenDate = this.value;
        let currentDate = new Date($(newEvent.parentNode).attr('data-date-info')).toLocaleDateString('en-CA');

        if (chosenDate !== currentDate) {
            if (VIEW_MODE === 1) {
                let inserted = false;
                for (let weekDay of $('#weekViewBody .week-view-body-col')) {
                    if (inserted) break;
                    if (new Date(weekDay.getAttribute('data-date-info')).toLocaleDateString('en-CA') === chosenDate) {
                        weekDay.appendChild(newEvent);
                        inserted = true;
                    }
                }


                if (!inserted) {
                    eventCreationDialog.hide();
                    BASE_DATE.setTime(new Date(chosenDate).getTime());
                    content.innerHTML = "";
                    buildWeekView(content, 'weekViewHeader', 'weekViewBody', BASE_DATE);

                    for (let weekDay of $('#weekViewBody .week-view-body-col')) {
                        if (inserted) break;
                        if (new Date(weekDay.getAttribute('data-date-info')).toLocaleDateString('en-CA') === chosenDate) {
                            weekDay.appendChild(newEvent);
                            inserted = true;
                        }
                    }
                    newEvent.scrollIntoView();
                    eventCreationDialog.show();
                }
            }
            else if (VIEW_MODE === 0) {
                eventCreationDialog.hide();
                BASE_DATE.setTime(new Date(chosenDate).getTime());
                content.innerHTML = "";
                buildDayView(content, 'dayViewHeader', 'dayViewBody', BASE_DATE);
                $('#dayViewBody .day-view-body-col')[0].appendChild(newEvent);
                newEvent.scrollIntoView();
                eventCreationDialog.show();
            }

            changeEventCreationDialogPosition();
        }

    });

    $('#closeBtn').on('click', function () {
        eventCreationDialog.hide();
        eventCreationDialog.css({'top': innerHeight / 2, 'left': innerWidth / 2});
        cleanEventCreationDialog();
        newEvent.remove();
    });


    eventCreationDialog.show();

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
                console.log("NOT IMPLEMENTED");
                break;
        }

    }
}


function cleanEventCreationDialog() {
    $('#eventCreationDialog .title input').val("");
    $('#eventCreationDialog .color-picker .active-color').removeClass('active-color');
    $('#eventCreationDialog .color-picker .lavender').addClass('active-color');
}


function saveNewEvent() {
    $('#eventCreationDialog').hide();
    newEvent.classList.toggle('event');
    newEvent.classList.toggle('event-modifying');

    let dates = createTimestampsForGeneratedEvent(newEvent);

    let title = document.querySelector('#eventCreationDialog .title input').value;
    title = title.length !== 0 ? title : "(No title)";
    newEvent.querySelector(".event-title").innerText = title;

    let color = $('#eventCreationDialog .color-picker .active-color').css('background-color');

    $.ajax({
        type: 'POST',
        url: 'add_new_event/',
        data: {
            csrfmiddlewaretoken: $('input[name="csrfmiddlewaretoken"]').val(),
            start_date: JSON.stringify(dates.startDate.toString()),
            end_date: JSON.stringify(dates.endDate.toString()),
            title: title,
            color: color,
        },
        dataType: 'json',
        success: function (data) {
            if (data.flag) {
                newEvent.setAttribute("data-event-id", data.eventId);
                console.log('SUCCESS! [new event has been added to DB, id - ' + data.eventId + ']');
            }
        }
    });

    cleanEventCreationDialog();
}


function updateEvent(eventObj) {
    let {startDate, endDate} = createTimestampsForGeneratedEvent(eventObj);

    $.ajax({
        type: 'POST',
        url: 'update_event/',
        data: {
            csrfmiddlewaretoken: $('input[name="csrfmiddlewaretoken"]').val(),
            id: eventObj.getAttribute("data-event-id"),
            start_date: JSON.stringify(startDate.toString()),
            end_date: JSON.stringify(endDate.toString()),
        },
        dataType: 'json',
        success: function (data) {
            if (data.flag) {
                console.log('SUCCESS! [changes have been saved]');
            }
        }
    })
}


function showEventPreview(e, eventObj) {
    if (!RESDND) {
        //eventObj.classList.toggle('cursor-grab');
        //eventObj.classList.toggle('cursor-pointer');

        alert(e.type);
    }
    else {
        RESDND = false;
    }
}

function showEventEditor(e) {
    alert(e.type);
}


function buildCalendar(id, year, month) {
    var Dlast = new Date(year,month+1,0).getDate(),
        D = new Date(year,month,Dlast),
    	DNlast = new Date(D.getFullYear(),D.getMonth(),Dlast).getDay(),
    	DNfirst = new Date(D.getFullYear(),D.getMonth(),1).getDay(),
    	calendar = '<tr>';

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
    document.querySelector('#'+id+' thead td:nth-child(2)').innerHTML = MONTHS[D.getMonth()][0] +' '+ D.getFullYear();
    document.querySelector('#'+id+' thead td:nth-child(2)').dataset.month = D.getMonth();
    document.querySelector('#'+id+' thead td:nth-child(2)').dataset.year = D.getFullYear();
    if (document.querySelectorAll('#'+id+' tbody tr').length < 6) {  // чтобы при перелистывании месяцев не "подпрыгивала" вся страница, добавляется ряд пустых клеток. Итог: всегда 6 строк для цифр
    	document.querySelector('#'+id+' tbody').innerHTML += '<tr><td>&nbsp;<td>&nbsp;<td>&nbsp;<td>&nbsp;<td>&nbsp;<td>&nbsp;<td>&nbsp;';
    }
}


function addInboxTask(e) {
    if ($("input[name='taskName']").val() !== "") {
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
    let eventObj = this;
    clickTimer = setTimeout(function() {
      if (!preventClick) {
          showEventPreview(e, eventObj);
      }
      preventClick = false;
    }, clickDelay);
}

function handleDblClickOnEvent(e) {
    let eventObj = this;
    clearTimeout(clickTimer);
    preventClick = true;
    showEventEditor(e, eventObj);
}


/* GENERAL EVENT HANDLERS */

$(document).ready(function () {

    // current date updating each 1 minute + timemark position updating
    setInterval(function () {
        CURRENT_DATE = new Date();
        updateTimemark();
    }, 1000);
    
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
        $('.timeline-item, .timemark').toggleClass('act');
        IS_SIDEBAR_ON = IS_SIDEBAR_ON === 1 ? 0 : 1;
        saveUserViewSettings();
    });

    // addTask button/"enter press" handler (inbox container)
    $('#addTask').click(addInboxTask);

    $('#taskName').keyup(function(e){
    	if(e.keyCode === 13) addInboxTask(e);
    });

    // event creation dialog is closed if the user clicks out it
    $(document).on({
        mousedown: function (e) {
            if (e.which === 1) {
                var eventCreationDialog = $('#eventCreationDialog');

                if (eventCreationDialog.css('display') !== 'none' && !eventCreationDialog.is(e.target)
                    && eventCreationDialog.has(e.target).length === 0) {
                    eventCreationDialog.hide();
                    eventCreationDialog.css({'top': innerHeight / 2, 'left': innerWidth / 2});
                    newEvent.classList.toggle('cursor-pointer');

                    // remove event and clean event creation dialog if eventObj is also misclicked
                    if (!$(newEvent).is(e.target) && $(newEvent).has(e.target).length === 0) {
                        newEvent.remove();
                        cleanEventCreationDialog();
                    }
                }
            }
            },
    });

    // event creation dialog is replaced if the browser window is resized
    $(window).on('resize', changeEventCreationDialogPosition);

    // saveEventBtn handler
    $('#saveEventBtn').on('click', saveNewEvent);
});