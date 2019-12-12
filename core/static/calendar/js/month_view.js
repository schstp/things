'use strict';

function buildMonthViewHeader(headerID, baseDate) {

    // view header initialization
    let viewHeader = document.createElement('div');
    viewHeader.id = headerID;
    viewHeader.classList.add('month-view-header');

    //view header building
    setHeaderDateInfo(baseDate);

    for (let i = 0; i < 7; i++) {
        let headerItem = document.createElement('div');
        headerItem.classList.add('view-header-item');
        headerItem.appendChild(document.createElement('p'));
        headerItem.firstChild.innerText = WEEK_DAYS[i];

        viewHeader.appendChild(headerItem);
    }

    return viewHeader;
}

function buildMonthViewBody(viewBodyID, currMonthDates) {

    // view body and view timeline initialization
    let viewBody = document.createElement('div');
    viewBody.id = viewBodyID;
    viewBody.classList.add('month-view-body');

    // view body building
    let monthDays = [];
    for (var i = 0; i < 6; i++) {
        let row = document.createElement('div');
        row.classList.add('month-view-body-row');

        monthDays[i] = [];
        for (var j=0; j < 7; j++) {
            let cell = document.createElement('div');
            cell.classList.add('month-view-body-cell');
            let date = document.createElement('span');
            date.classList.add('date');
            date.innerText = currMonthDates[i][j].getDate();
            date.setAttribute('data-date-info', currMonthDates[i][j].toString());

            if (currMonthDates[i][j].getDate() === CURRENT_DATE.getDate() &&
                currMonthDates[i][j].getMonth() === CURRENT_DATE.getMonth() &&
                currMonthDates[i][j].getFullYear() === CURRENT_DATE.getFullYear()) {

                date.classList.add('td');

            } // mark current date

            cell.appendChild(date);
            row.appendChild(cell);
            monthDays[i][j] = cell;
        }

        viewBody.appendChild(row);

        if (BASE_DATE.getMonth() !== currMonthDates[i][6].getMonth()) break;
    }

    // events insertion
    let currMonthDatesStr = [];
    for (let k=0; k <= i; k++) {
        currMonthDatesStr[k] = [];
        for (let j=0; j < 7; j++) currMonthDatesStr[k][j] = currMonthDates[k][j].toString();
    }

    $.ajax({
        type: 'GET',
        url: 'get_month_events/',
        data: {
            dates: JSON.stringify(currMonthDatesStr),
        },
        dataType: 'json',
        success: function (data) {
            let eventsCount = 0;

            for (let k=0; k <= i; k++) {
                for (let j = 0; j < 7; j++) {
                    for (let eventData of data[k][j]) {
                        eventsCount++;
                        if (eventsCount > 5) {
                            eventsCount = 0;
                            let showMoreBtn = document.createElement('a');
                            showMoreBtn.innerText = "show " + (data[k][j].length - 5) + " more";
                            showMoreBtn.classList.add('show-more');
                            showMoreBtn.href = "#";
                            monthDays[k][j].appendChild(showMoreBtn);
                            break;
                        } else {
                            let eventInfo = document.createElement('div');
                            eventInfo.setAttribute("data-event-id", eventData.id);
                            eventInfo.classList.add('month-event-info');
                            let colorMark = document.createElement('span');
                            colorMark.classList.add('color');
                            $(colorMark).css('background-color', eventData.color);
                            eventInfo.appendChild(colorMark);

                            let timestamp = document.createElement('span');
                            timestamp.classList.add('start');
                            let startDate = new Date(eventData.startDate);
                            timestamp.innerText = (startDate.getHours() < 10 ? TIME_EDITS[startDate.getHours()] : startDate.getHours()) + ":" +
                                (startDate.getMinutes() < 10 ? TIME_EDITS[startDate.getMinutes()] : startDate.getMinutes());
                            eventInfo.appendChild(timestamp);

                            let eventTitle = document.createElement('span');
                            eventTitle.classList.add('title');
                            eventTitle.innerText = eventData.title;
                            eventInfo.appendChild(eventTitle);

                            monthDays[k][j].appendChild(eventInfo);
                        }
                    }
                eventsCount = 0;
                }
            }
        }
    });

    return viewBody;
}

function buildMonthView (parentElement, weekViewHeaderID, weekViewBodyID, baseDate) {

    let currMonthDates = getCurrMonthDates(new Date(BASE_DATE.getTime()));
    let viewHeader = buildMonthViewHeader(weekViewHeaderID, baseDate);
    let viewBody = buildMonthViewBody(weekViewBodyID, currMonthDates);

    parentElement.appendChild(viewHeader);
    parentElement.appendChild(viewBody);

    $('.month-view-body-cell span.date').on({
        click: function (e) {
            let date = new Date(e.target.getAttribute('data-date-info'));
            BASE_DATE.setTime(date.getTime());
            VIEW_MODE = 0;
            renderCurrentMode(content);
            saveUserViewSettings();
        }
    })

}