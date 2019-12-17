'use strict';

function buildDayViewHeader(headerID, date) {

    // view header initialization
    let viewHeader = document.createElement('div');
    viewHeader.id = headerID;
    viewHeader.classList.add('view-header');

    //view header building
    setHeaderDateInfo(date);

    let headerItem = document.createElement('div');
    headerItem.classList.add('view-header-item');
    headerItem.appendChild(document.createElement('p'));
    headerItem.firstChild.innerText = WEEK_DAYS[getLocalDay(date)];
    headerItem.appendChild(document.createElement('span'));
    headerItem.lastChild.innerText = date.getDate();

    if (date.getDate() === CURRENT_DATE.getDate() &&
        date.getMonth() === CURRENT_DATE.getMonth() &&
        date.getFullYear() === CURRENT_DATE.getFullYear()) {

        headerItem.lastChild.classList.add('td');

    } // mark current date

    viewHeader.appendChild(headerItem);

    return viewHeader;
}

function buildDayViewBody(viewBodyID, date) {

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
        timeline_item.firstChild.innerHTML = window.TIMESTAMPS[i];
        viewTimeline.appendChild(timeline_item);
    }

    // view timeline insertion
    viewBody.appendChild(viewTimeline);

    // view body building
    let weekDay = document.createElement('div');
    weekDay.classList.add('day-view-body-col');
    weekDay.setAttribute('data-date-info', date.toString());
    viewBody.appendChild(weekDay);

    $.ajax({
        type: 'GET',
        url: 'get_day_events/',
        data: {
            date: JSON.stringify(date.toString()),
        },
        dataType: 'json',
        success: function (data) {
            for (let eventData of data['events']) {
                let eventParameters = converTimeToPosition(eventData.startDate, eventData.endDate);
                eventParameters.id = eventData.id;
                eventParameters.title = eventData.title;
                eventParameters.color = eventData.color;

                let eventElement = createNewEvent(eventParameters);
                let eventTimenote = eventElement.getElementsByClassName('event-timenote')[0];
                eventTimenote.innerText = getTimeNote(eventElement);
                weekDay.appendChild(eventElement);
            }
        }
    });

    return viewBody;
}

function buildDayView (parentElement, dayViewHeaderID, dayViewBodyID, date) {
    let dateCopy = new Date();
    dateCopy.setTime(date.getTime());

    let viewHeader = buildDayViewHeader(dayViewHeaderID, dateCopy);
    let viewBody = buildDayViewBody(dayViewBodyID, dateCopy);

    parentElement.appendChild(viewHeader);
    parentElement.appendChild(viewBody);

    if (date.getDate() === CURRENT_DATE.getDate() &&
        date.getMonth() === CURRENT_DATE.getMonth() &&
        date.getFullYear() === CURRENT_DATE.getFullYear()) {

        let timemark = document.createElement('span');
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
    var eventTimeNote, eventStartPoint, prevY, topPanelHeight, scrollTopPos, scrollTopPos_delta;


    $('.day-view-body-col').on({
        mousedown: function (e) {
            if (e.target.className === 'day-view-body-col'
                && $('#eventCreationDialog').css('display') === 'none'
                && $('.context-menu').css('display') === 'none') {

                if (e.which === 1) {

                    isMousedown = true;
                    prevY = e.pageY; // aux.variable for identifying mouse movement direction
                    eventStartPoint = Math.round(e.offsetY / window.TIME_STEP) * TIME_STEP; // event start point (always starts from the point that is multiple of 15 min)
                    topPanelHeight = e.pageY - eventStartPoint; // have to consider the offset of working area

                    // scrolling offset
                    scrollTopPos = document.getElementById('dayViewBody').scrollTop;
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

                    scrollTopPos_delta = document.getElementById('dayViewBody').scrollTop - scrollTopPos;

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

}