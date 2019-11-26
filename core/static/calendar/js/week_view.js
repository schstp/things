'use strict';

function buildViewHeader(headerID, viewBody) {

    // scrollbar width computing to consider it for the view header width
    let scrollbarWidth = viewBody.clientWidth - viewBody.offsetWidth;

    // view header initialization
    let viewHeader = document.createElement('div');
    viewHeader.id = headerID;
    viewHeader.classList.add('week-view-header');
    viewHeader.style.marginRight = scrollbarWidth + 'px';

    //view header building
    for (let i = 0; i < 7; i++) {
        let headerItem = document.createElement('div');
        headerItem.classList.add('week-view-header-item');
        headerItem.appendChild(document.createElement('p'));
        headerItem.firstChild.innerText = window.WEEK_DAYS[i];
        headerItem.appendChild(document.createElement('span'));
        headerItem.lastChild.innerText = 25;

        headerItem.lastChild.classList.add('td'); //temp !!!

        viewHeader.appendChild(headerItem);
    }

    return viewHeader;
}

function buildViewBody(viewBodyID) {

    // view body and view timeline initialization
    let viewBody = document.createElement('div');
    viewBody.id = viewBodyID;
    viewBody.classList.add('week-view-body');

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
    for (let i = 0; i < 7; i++) {
        let week_day = document.createElement('div');
        week_day.classList.add('week-view-body-col');

        for (let i = 0; i < 24; i++) {
            let time_section = document.createElement('div');
            time_section.classList.add('time-section');

            for (let i = 0; i < 4; i++) {
                let quarterOfAnHour = document.createElement('div');
                quarterOfAnHour.classList.add('quarter-of-an-hour');
                time_section.appendChild(quarterOfAnHour);
            }

            week_day.appendChild(time_section);
        }

        viewBody.appendChild(week_day);
    }

    return viewBody;
}


function buildWeekView (parentElement, weekViewHeaderID, weekViewBodyID) {
    let viewBody = buildViewBody(weekViewBodyID);
    let viewHeader = buildViewHeader(weekViewHeaderID, viewBody);

    parentElement.appendChild(viewHeader);
    parentElement.appendChild(viewBody);

    $('.quarter-of-an-hour').on({
        mousedown: function () {
            if (event.which === 1) {
                MOUSEDOWN = true;
                $(this).addClass('selectee');
            }
        },
        mouseup: function () {
            MOUSEDOWN = false;
        },
        mouseover: function () {
                    if (MOUSEDOWN) {
            $(this).toggleClass('selectee');
        }
        }
    });

}