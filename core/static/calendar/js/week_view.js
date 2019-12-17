'use strict';

function buildWeekViewHeader(headerID, currWeekDates) {

    // view header initialization
    let viewHeader = document.createElement('div');
    viewHeader.id = headerID;
    viewHeader.classList.add('view-header');

    //view header building
    setHeaderDateInfo(currWeekDates[0], currWeekDates[6]);

    for (let i = 0; i < 7; i++) {
        let headerItem = document.createElement('div');
        headerItem.classList.add('view-header-item');
        headerItem.appendChild(document.createElement('p'));
        headerItem.firstChild.innerText = WEEK_DAYS[i];
        headerItem.appendChild(document.createElement('span'));
        headerItem.lastChild.innerText = currWeekDates[i].getDate();
        headerItem.lastChild.setAttribute('data-date-info', currWeekDates[i].toString());

        if (currWeekDates[i].getDate() === CURRENT_DATE.getDate() &&
            currWeekDates[i].getMonth() === CURRENT_DATE.getMonth() &&
            currWeekDates[i].getFullYear() === CURRENT_DATE.getFullYear()) {

            headerItem.firstChild.classList.add('currDay');
            headerItem.lastChild.classList.add('td');

        } // mark current date

        viewHeader.appendChild(headerItem);
    }

    return viewHeader;
}

function buildWeekViewBody(viewBodyID, currWeekDates) {

    // view body and view timeline initialization
    let viewBody = document.createElement('div');
    viewBody.id = viewBodyID;
    viewBody.classList.add('view-body');

    let viewTimeline = document.createElement('div');
    viewTimeline.classList.add('timeline');

    // view timeline building
    for (let i = 0; i < 23; i++) {
        let timeline_item = document.createElement('div');
        timeline_item.classList.add('timeline-item');
        if ($('#sidebar').attr("class") === "active") timeline_item.classList.add("act"); // to keep right width of time lines
        timeline_item.appendChild(document.createElement('span'));
        timeline_item.firstChild.innerHTML = TIMESTAMPS[i];
        viewTimeline.appendChild(timeline_item);
    }

    // view timeline insertion
    viewBody.appendChild(viewTimeline);

    // view body building
    let weekDays = [];
    for (let i = 0; i < 7; i++) {
        let weekDay = document.createElement('div');
        weekDay.classList.add('week-view-body-col');
        weekDay.setAttribute('data-date-info', currWeekDates[i].toString());
        viewBody.appendChild(weekDay);
        weekDays[i] = weekDay;
    }

    // events insertion
    let currWeekDatesStr = [];
    for (let i=0; i < 7; i++) currWeekDatesStr[i] = currWeekDates[i].toString();

    $.ajax({
        type: 'GET',
        url: 'get_week_events/',
        data: {
            dates: JSON.stringify(currWeekDatesStr),
        },
        dataType: 'json',
        success: function (data) {

            for (let i=0; i < 7; i++) {

                for (let eventData of data[i]) {
                    let eventParameters = converTimeToPosition(eventData.startDate, eventData.endDate);
                    eventParameters.id = eventData.id;
                    eventParameters.title = eventData.title;
                    eventParameters.color = eventData.color;
                    let eventElement = createNewEvent(eventParameters);
                    let eventTimenote = eventElement.getElementsByClassName('event-timenote')[0];
                    eventTimenote.innerText = getTimeNote(eventElement);
                    weekDays[i].appendChild(eventElement);
                }
            }
        }
    });

    return viewBody;
}

function buildWeekView (parentElement, weekViewHeaderID, weekViewBodyID, baseDate) {

    let currWeekDates = getCurrWeekDates(new Date(baseDate.getTime()));
    let viewHeader = buildWeekViewHeader(weekViewHeaderID, currWeekDates);
    let viewBody = buildWeekViewBody(weekViewBodyID, currWeekDates);

    parentElement.appendChild(viewHeader);
    parentElement.appendChild(viewBody);

    if (getWeekNumber(baseDate) === getWeekNumber(CURRENT_DATE) &&
        baseDate.getFullYear() === CURRENT_DATE.getFullYear()) {

        let timemark = document.createElement('span');
        timemark.classList.add('timemark');
        timemark.classList.add('timemark');
        viewBody.appendChild(timemark);
        updateTimemark(); // init timemark position immediately
        timemark.scrollIntoView(); // move to current time

        if (!IS_SIDEBAR_ON) {
            $(timemark).toggleClass('act');
        } // line width depends on sidebar state

    } // add timemark if current day or week is active

    // scrollbar width computing to consider it for the view header width
    let scrollbarWidth = viewBody.offsetWidth - viewBody.clientWidth;
    viewHeader.style.marginRight = scrollbarWidth + 'px';

    let isMousedown = false;
    let eventTimeNote, eventStartPoint, prevY, topPanelHeight, scrollTopPos, scrollTopPos_delta;


    $('.week-view-body-col').on({
        mousedown: function (e) {
            if (e.target.className === 'week-view-body-col'
                && $('#eventCreationDialog').css('display') === 'none'
                && $('.context-menu').css('display') === 'none') {

                if (e.which === 1) {

                    isMousedown = true;
                    prevY = e.pageY; // aux.variable for identifying mouse movement direction
                    eventStartPoint = Math.round(e.offsetY / TIME_STEP) * TIME_STEP; // event start point (always starts from the point that is multiple of 15 min)
                    topPanelHeight = e.pageY - eventStartPoint; // have to consider the offset of working area

                    // scrolling offset
                    scrollTopPos = document.getElementById('weekViewBody').scrollTop;
                    scrollTopPos_delta = 0;

                    // new DOM item
                    newEvent = createNewEvent(eventStartPoint);
                    newEvent.classList.toggle('event');
                    newEvent.classList.toggle('event-modifying');
                    content.classList.toggle('cursor-grab');
                    eventTimeNote = newEvent.getElementsByClassName('event-timenote')[0];
                    this.appendChild(newEvent);
                } // interested only in left mouse key down
            } // free working area was a target of mousedown event
        },
        mouseup: function (e) {
            if (isMousedown) {

                if (newEvent.style.height === '0px') {

                    if (eventStartPoint === 1440) eventStartPoint -= TIME_STEP * 4;

                    newEvent.style.top = eventStartPoint - eventStartPoint % 60 + 'px';
                    newEvent.style.height = TIME_STEP * 4 + 'px'; // default duration is an hour

                    // update event time note
                    eventTimeNote.innerText = getTimeNote(newEvent);

                } // user just clicked on the area, no duration was stated

                isMousedown = false;

                // event creation dialog call
                showEventCreationDialog(e);
                content.classList.toggle('cursor-grab');
            } // the mousedown event was generated in free working area
        },
        mousemove: function (e) {

            if (isMousedown) {
                if (Math.abs(prevY - e.pageY) >= TIME_STEP) {

                    scrollTopPos_delta = document.getElementById('weekViewBody').scrollTop - scrollTopPos;

                    if (e.pageY + scrollTopPos_delta - topPanelHeight > eventStartPoint) {

                        if (newEvent.style.top !== eventStartPoint) newEvent.style.top = eventStartPoint + 'px'; // direction was changed

                        if (Math.round((e.pageY - topPanelHeight - eventStartPoint + scrollTopPos_delta) / TIME_STEP) >= 3)
                        {
                            newEvent.style.height = Math.round((e.pageY - topPanelHeight - eventStartPoint + scrollTopPos_delta) / TIME_STEP) * TIME_STEP + 'px';
                        }
                        else {
                            newEvent.style.height = TIME_STEP * 3 + 'px';
                        } // event can not be shorter than 45 minutes

                    } // resizing after breakpoint (initClickY)
                    else {

                        if (Math.round((Math.abs(e.pageY - topPanelHeight - eventStartPoint + scrollTopPos_delta)) / TIME_STEP)  >= 3) {
                            newEvent.style.top = Math.round((Math.abs(e.pageY - topPanelHeight + scrollTopPos_delta)) / TIME_STEP) * TIME_STEP + 'px';
                            newEvent.style.height = Math.round((Math.abs(e.pageY - topPanelHeight - eventStartPoint + scrollTopPos_delta)) / TIME_STEP) * TIME_STEP + 'px';
                        } // event can not be shorter than 45 minutes

                    } // resizing before breakpoint (initClickY)

                    // save previous cursor position
                    prevY = e.pageY;

                    // update event time note
                    eventTimeNote.innerText = getTimeNote(newEvent);

                } // movement is reasonable
            } // changing a new event duration only if left mouse key is down
        }
    });

    $('#content').on({
        mouseup: function (e) {
            if (isMousedown) {

                if (newEvent.style.height === '0px') {

                    if (eventStartPoint === 1440) eventStartPoint -= TIME_STEP * 4;

                    newEvent.style.top = eventStartPoint - eventStartPoint % 60 + 'px';
                    newEvent.style.height = TIME_STEP * 4 + 'px'; // default duration is an hour

                    // update event time note
                    eventTimeNote.innerText = getTimeNote(newEvent);

                } // user just clicked on the area, no duration was stated

                isMousedown = false;

                // event creation dialog call
                showEventCreationDialog(e);
                content.classList.toggle('cursor-grab');
            } // the mousedown event was generated in free working area
        },
    });

    $('.view-header-item > span').on({
        click: function (e) {
            let date = new Date(e.target.getAttribute('data-date-info'));
            BASE_DATE.setTime(date.getTime());
            VIEW_MODE = 0;
            renderCurrentMode(content);
            saveUserViewSettings();
        }
    });
}