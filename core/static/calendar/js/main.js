'use strict';

/* GLOBALS */

window.WEEK_DAYS = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];

window.TIMESTAMPS = [
            '01:00', '02:00', '03:00', '04:00', '05:00', '06:00', '07:00', '08:00',
            '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00',
            '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00'
        ];

window.VIEW_MODE = 1;

/* GENERAL HANDLERS */

$(document).ready(function () {

    // sidebar button click
    $('#sidebarCollapse').on('click', function () {
        $('#sidebar, #content').toggleClass('active');
    });

});