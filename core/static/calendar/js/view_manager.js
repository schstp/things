'use strict';

let MOUSEDOWN = false;

$(document).ready(function () {
    /* TEMP PART WHILE NOT CACHING USER LAST USED MODE */
    let content = document.getElementById('content');
    content.innerHTML = "";
    buildWeekView(content, 'weekViewHeader', 'weekViewBody');

    // view mode changing handler
    $('#viewSelector').change(function () {

        window.VIEW_MODE = this.value;
        let content = document.getElementById('content');
        content.innerHTML = "";

        switch (this.value) {
            case '0':
                break;
            case '1':
                buildWeekView(content, 'weekViewHeader', 'weekViewBody');
                break;
            case '2':
                break;
            case '3':
                break;
        }
    });
});