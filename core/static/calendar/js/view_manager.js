'use strict';


$(document).ready(function () {
    /* TEMP PART WHILE NOT CACHING USER LAST USED MODE */
    let content = document.getElementById('content');
    content.innerHTML = "";
    buildWeekView(content, 'weekViewHeader', 'weekViewBody', BASE_DATE);

    // view mode changing handler
    $('#viewSelector').change(function () {

        VIEW_MODE = +this.value;
        let content = document.getElementById('content');
        content.innerHTML = "";
        $("#viewSelector option").removeAttr('selected');

        switch (VIEW_MODE) {
            case 0:
                $("#viewSelector option[value=0]").attr('selected', true);
                buildDayView(content, 'dayViewHeader', 'dayViewBody', BASE_DATE);
                break;
            case 1:
                $("#viewSelector option[value=1]").attr('selected', true);
                buildWeekView(content, 'weekViewHeader', 'weekViewBody', BASE_DATE);
                break;
            case 2:
                $("#viewSelector option[value=2]").attr('selected', true);
                break;
            case 3:
                $("#viewSelector option[value=3]").attr('selected', true);
                break;
        }
    });

    // click on sidebar calendar handler
    $('#calendar2').on('click', function(event) {
        $('.selected').removeClass('selected');
        let selected = event.target;
        $(selected).addClass('selected');
        var selectedDay = selected.innerHTML;
        if(Number.isInteger(Number(selectedDay)) === true)
        {
            let selectedMonth = $('#dateHeader').attr('data-month');
            let selectedYear = $('#dateHeader').attr('data-year');
            let selectedDate = new Date(selectedYear, selectedMonth, selectedDay);

            switch (VIEW_MODE) {
                case 0:
                    if (BASE_DATE.getFullYear() !== selectedDate.getFullYear() ||
                        BASE_DATE.getMonth() !== selectedDate.getMonth() ||
                        BASE_DATE.getDate() !== selectedDate.getDate()) {

                        BASE_DATE.setTime(selectedDate);
                        content.innerHTML = "";
                        buildDayView(content, 'dayViewHeader', 'dayViewBody', BASE_DATE);
                    }
                    break;
                case 1:
                    if (getWeekNumber(BASE_DATE) !== getWeekNumber(selectedDate)) {

                        BASE_DATE.setTime(selectedDate);
                        content.innerHTML = "";
                        buildWeekView(content, 'dayViewHeader', 'dayViewBody', BASE_DATE);
                    }
                    break;
                case 2:
                    console.log('at 2 | NOT IMPLEMENTED | CLICK ON SIDEBAR CALENDAR');
                    break;
                case 3:
                    console.log('at 3 | NOT IMPLEMENTED | CLICK ON SIDEBAR CALENDAR');
                    break;
                }

        }
    });

    // moveBack button click
    $('#moveBack').on('click', function () {

        content.innerHTML = "";
        switch (VIEW_MODE) {
            case 0:
                BASE_DATE.setDate(BASE_DATE.getDate() - 1 );
                buildDayView(content, 'dayViewHeader', 'dayViewBody', BASE_DATE);
                break;
            case 1:
                BASE_DATE.setDate(BASE_DATE.getDate() - 7 );
                buildWeekView(content, 'weekViewHeader', 'weekViewBody', BASE_DATE);
                break;
            case 2:
                console.log('at 2');
                break;
            case 3:
                console.log('at 3');
                break;
        }
    });

    // moveForward button click
    $('#moveForward').on('click', function () {

        content.innerHTML = "";

        switch (VIEW_MODE) {
            case 0:
                BASE_DATE.setDate(BASE_DATE.getDate() + 1);
                buildDayView(content, 'dayViewHeader', 'dayViewBody', BASE_DATE);
                break;
            case 1:
                BASE_DATE.setDate(BASE_DATE.getDate() + 7);
                buildWeekView(content, 'weekViewHeader', 'weekViewBody', BASE_DATE);
                break;
            case 2:
                console.log('at 2');
                break;
            case 3:
                console.log('at 3');
                break;
        }
    });

    // todayBtn button click
    $('#todayBtn').on('click', function () {

        content.innerHTML = "";
        BASE_DATE.setTime(CURRENT_DATE.getTime());

        switch (VIEW_MODE) {
            case 0:
                buildDayView(content, 'dayViewHeader', 'dayViewBody', BASE_DATE);
                break;
            case 1:
                buildWeekView(content, 'weekViewHeader', 'weekViewBody', BASE_DATE);
                break;
            case 2:
                console.log('at 2');
                break;
            case 3:
                console.log('at 3');
                break;
        }
    });

});