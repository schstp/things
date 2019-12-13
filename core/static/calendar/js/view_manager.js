'use strict';


function renderCurrentMode(content) {

    $("#viewSelector option").removeAttr('selected');
    content.innerHTML = "";

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
            buildMonthView(content, 'monthViewHeader', 'monthViewBody', BASE_DATE);
            $("#viewSelector option[value=2]").attr('selected', true);
            break;
    }
}


function saveUserViewSettings() {
    $.ajax({
        type: 'POST',
        url: 'save_user_view_settings/',
        data: {
            csrfmiddlewaretoken: $('input[name="csrfmiddlewaretoken"]').val(),
            view_mode: VIEW_MODE,
            is_sidebar_on: IS_SIDEBAR_ON,
        },
        dataType: 'json',
        success: function (data) {
            if (data.flag) {
                console.log('SUCCESS! [view mode and sidebar state have been saved]');
            }
        }
    })
}


$(document).ready(function () {

    let content = document.getElementById('content');

    renderCurrentMode(content); // init

    // view mode changing handler
    $('#viewSelector').change(function () {

        VIEW_MODE = +this.value;
        $("#viewSelector option").removeAttr('selected');

        renderCurrentMode(content);
        saveUserViewSettings();

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

                        BASE_DATE.setTime(selectedDate.getTime());
                        renderCurrentMode(content);
                    }
                    break;
                case 1:
                    if (getWeekNumber(BASE_DATE) !== getWeekNumber(selectedDate)) {
                        BASE_DATE.setTime(selectedDate.getTime());
                        renderCurrentMode(content);
                    }
                    break;
                case 2:
                    if (BASE_DATE.getMonth() !== selectedDate.getMonth()) {
                        BASE_DATE.setTime(selectedDate.getTime());
                        renderCurrentMode(content);
                    }
                    break;
            }
        }
    });

    // moveBack button click
    $('#moveBack').on('click', function () {

        switch (VIEW_MODE) {
            case 0:
                BASE_DATE.setDate(BASE_DATE.getDate() - 1 );
                break;
            case 1:
                BASE_DATE.setDate(BASE_DATE.getDate() - 7 );
                break;
            case 2:
                BASE_DATE.setMonth(BASE_DATE.getMonth() - 1);
                break;
        }

        renderCurrentMode(content);
    });

    // moveForward button click
    $('#moveForward').on('click', function () {

        switch (VIEW_MODE) {
            case 0:
                BASE_DATE.setDate(BASE_DATE.getDate() + 1);
                break;
            case 1:
                BASE_DATE.setDate(BASE_DATE.getDate() + 7);
                break;
            case 2:
                BASE_DATE.setMonth(BASE_DATE.getMonth() + 1);
                break;
        }

        renderCurrentMode(content);
    });

    // todayBtn button click
    $('#todayBtn').on('click', function () {

        if (BASE_DATE.getFullYear() !== CURRENT_DATE.getFullYear() ||
            BASE_DATE.getMonth() !== CURRENT_DATE.getMonth() ||
            BASE_DATE.getDate() !== CURRENT_DATE.getDate()) {

            BASE_DATE.setTime(CURRENT_DATE.getTime());

            renderCurrentMode(content);
        }
    });

});