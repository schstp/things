'use strict';


$(document).ready(function () {
    /* TEMP PART WHILE NOT CACHING USER LAST USED MODE */
    let content = document.getElementById('content');
    content.innerHTML = "";
    buildWeekView(content, 'weekViewHeader', 'weekViewBody', BASE_DATE);

    // view mode changing handler
    $('#viewSelector').change(function () {

        VIEW_MODE = this.value;
        let content = document.getElementById('content');
        content.innerHTML = "";

        switch (this.value) {
            case '0':
                buildDayView(content, 'dayViewHeader', 'dayViewBody');
                break;
            case '1':
                buildWeekView(content, 'weekViewHeader', 'weekViewBody', BASE_DATE);
                break;
            case '2':
                break;
            case '3':
                break;
        }
    });

    // moveBack button click
    $('#moveBack').on('click', function () {
        BASE_DATE.setDate(BASE_DATE.getDate() - 7);
        content.innerHTML = "";
        buildWeekView(content, 'weekViewHeader', 'weekViewBody', BASE_DATE);
    });

    // moveForward button click
    $('#moveForward').on('click', function () {
        BASE_DATE.setDate(BASE_DATE.getDate() + 7);
        content.innerHTML = "";
        buildWeekView(content, 'weekViewHeader', 'weekViewBody', BASE_DATE);
    });

});