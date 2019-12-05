'use strict';

function buildDayViewHeader(headerID) {

    // view header initialization
    let viewHeader = document.createElement('div');
    viewHeader.id = headerID;
    viewHeader.classList.add('view-header');

    //view header building
    let headerItem = document.createElement('div');
    headerItem.classList.add('view-header-item');
    headerItem.appendChild(document.createElement('p'));
    headerItem.firstChild.innerText = window.WEEK_DAYS[0];
    headerItem.appendChild(document.createElement('span'));
    headerItem.lastChild.innerText = "d"; // TEMP

    headerItem.lastChild.classList.add('td'); //temp !!!

    viewHeader.appendChild(headerItem);

    return viewHeader;
}

function buildDayViewBody(viewBodyID) {

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
        timeline_item.appendChild(document.createElement('span'));
        timeline_item.firstChild.innerHTML = window.TIMESTAMPS[i];
        viewTimeline.appendChild(timeline_item);
    }

    // view timeline insertion
    viewBody.appendChild(viewTimeline);

    // view body building
    let week_day = document.createElement('div');
    week_day.classList.add('day-view-body-col');
    viewBody.appendChild(week_day);

    return viewBody;
}

function buildDayView (parentElement, dayViewHeaderID, dayViewBodyID) {
    let viewHeader = buildDayViewHeader(dayViewHeaderID);
    let viewBody = buildDayViewBody(dayViewBodyID);

    parentElement.appendChild(viewHeader);
    parentElement.appendChild(viewBody);

    // scrollbar width computing to consider it for the view header width
    let scrollbarWidth = viewBody.offsetWidth - viewBody.clientWidth;
    viewHeader.style.marginRight = scrollbarWidth + 'px';

    let isMousedown = false;
    var newEvent, eventStartPoint, prevY, topPanelHeight, scrollTopPos, scrollTopPos_delta;


    $('.day-view-body-col').on({
        mousedown: function (event) {
            if (event.target.className === 'day-view-body-col') {
                if (event.which === 1) {

                    isMousedown = true;
                    prevY = event.pageY; // aux.variable for identifying mouse movement direction
                    eventStartPoint = Math.round(event.offsetY / window.TIME_STEP) * window.TIME_STEP; // event start point (always starts from the point that is multiple of 15 min)
                    topPanelHeight = event.pageY - eventStartPoint; // have to consider the offset of working area

                    // scrolling offset
                    scrollTopPos = document.getElementById('dayViewBody').scrollTop;
                    scrollTopPos_delta = 0;

                    // new DOM item
                    newEvent = createNewEvent(eventStartPoint);
                    this.appendChild(newEvent);
                } // interested only in left mouse key down
            } // free working area was a target of mousedown event
        },
        mouseup: function (event) {
            if (isMousedown) {

                if (newEvent.style.height === '0px') {
                    newEvent.style.top = eventStartPoint + 'px';
                    newEvent.style.height = TIME_STEP * 2 + 'px'; // default duration is an hour
                } // user just clicked on the area, no duration was stated OR resulting duration is equal to 0

                newEvent.style.height -= 2 + 'px'; // to make margin
                newEvent.style.opacity = 1;

                isMousedown = false;
            } // the mousedown event was generated in free working area
        },
        mousemove: function (event) {

            if (isMousedown) {
                if (Math.abs(prevY - event.pageY) >= TIME_STEP) {

                    scrollTopPos_delta = document.getElementById('dayViewBody').scrollTop - scrollTopPos;

                    if (event.pageY + scrollTopPos_delta - topPanelHeight > eventStartPoint) {

                        if (newEvent.style.top !== eventStartPoint) newEvent.style.top = eventStartPoint + 'px'; // direction was changed
                        newEvent.style.height = Math.round((event.pageY - topPanelHeight - eventStartPoint + scrollTopPos_delta) / TIME_STEP) * TIME_STEP + 'px';
                    } // resizing after breakpoint (initClickY)
                    else {
                        newEvent.style.top = Math.round((Math.abs(event.pageY - topPanelHeight + scrollTopPos_delta)) / TIME_STEP) * TIME_STEP + 'px';
                        newEvent.style.height = Math.round((Math.abs(event.pageY - topPanelHeight - eventStartPoint + scrollTopPos_delta)) / TIME_STEP) * TIME_STEP + 'px';
                    } // resizing before breakpoint (initClickY)

                    prevY = event.pageY;

                } // movement is reasonable
            } // changing a new event duration only if left mouse key is down
        }
    });

}