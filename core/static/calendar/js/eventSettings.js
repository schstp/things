'use strict';
$(document).ready(function() {
        var reminder30Output;
        var reminder1hOutput;
        var reminder3hOutput;
        var reminder1dOutput;
        var customReminders = [];
        var sliderOutput = '2';
        window.fromDate = new Date();
        window.toDate = new Date();
        var repeatOutput;
        var colorOutput;
        var textAreaOutput;
        var eventTitle;

        $('.createEventButton').on('click', function(event) {
          let today = new Date();
          var tzoffset = (new Date()).getTimezoneOffset() * 60000;
          var localDate = (new Date(today - tzoffset));
          localDate.setSeconds(0);
          localDate.setMilliseconds(0)
          localDate.setMinutes(0);
          localDate.setHours(0);
          var localISOTime = localDate.toISOString().slice(0, -1);
          var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
          $('#dateTimeFrom').attr('value', date);
        });
        
        let button30 = document.getElementById('reminderButton30');
        let button1h = document.getElementById('reminderButton1h');
        let button3h = document.getElementById('reminderButton3h');
        let button1d = document.getElementById('reminderButton1d');

        button30.addEventListener('click', onReminderButtonClick);
        button1h.addEventListener('click', onReminderButtonClick);
        button3h.addEventListener('click', onReminderButtonClick);
        button1d.addEventListener('click', onReminderButtonClick);

        function onReminderButtonClick(event) {
          let clickButton = event.target;
          $(clickButton).toggleClass('pressed');
          if ($(clickButton).attr('id') === 'reminderButton30') 
          {
            reminder30Output = 'remind before 30 minutes';
          }
          if ($(clickButton).attr('id') === 'reminderButton1h') 
          {
            reminder1hOutput = 'remind before 1 hour';
          }
          if ($(clickButton).attr('id') === 'reminderButton3h') 
          {
            reminder3hOutput = 'remind before 3 hours';
          }
          if ($(clickButton).attr('id') === 'reminderButton1d') 
          {
            reminder1dOutput = 'remind before 1 day';
          }
        }

        let addNot = document.getElementById('addNotButton')
        addNot.addEventListener('click', onAddNotClick);

        var customNotificationCounter = 0;
        var nextIdIndex = 0;

        function onAddNotClick(event) {
          if (customNotificationCounter < 4)
          {
            customNotificationCounter++;
            let customNotContainer = document.createElement('div');
            $(customNotContainer).attr('class', 'row');
            $(customNotContainer).addClass('customNotification');

            let img = document.createElement('img');
            $(img).attr('src', "https://img.icons8.com/material-outlined/48/000000/filled-appointment-reminders.png");
            $(img).attr('heigth', '30');
            $(img).attr('width', '30');

            let spinbox = document.createElement('input');
            $(spinbox).attr('class', 'spinbox');
            $(spinbox).attr('type', 'number');
            $(spinbox).attr('value', '1');

            let selection = document.createElement('select');
            $(selection).attr('class', 'selection');

            let minuteOption = document.createElement('option');
            $(minuteOption).text('minutes');
            let hourOption = document.createElement('option');
            $(hourOption).text('hours');
            let dayOption = document.createElement('option');
            $(dayOption).text('days');
            let weekOption = document.createElement('option');
            $(weekOption).text('weeks');
            let monthOption = document.createElement('option');
            $(monthOption).text('months');

            $(selection).append(minuteOption);
            $(selection).append(hourOption);
            $(selection).append(dayOption);
            $(selection).append(weekOption);
            $(selection).append(monthOption);

            let deleteButton = document.createElement('button');
            $(deleteButton).attr("type", "button");
            $(deleteButton).attr('class', 'deleteButton');
            //$(deleteButton).attr('id', nextIdIndex);           
            deleteButton.addEventListener('click', onDeleteClick)

            let deleteButtonIcon = document.createElement('img');
            $(deleteButtonIcon).attr("src", "https://img.icons8.com/ios/24/000000/close-window.png");
            $(deleteButtonIcon).attr("heigth", "25");
            $(deleteButtonIcon).attr("width", "25");

            $(deleteButton).append(deleteButtonIcon);

            $(customNotContainer).append(img);
            $(customNotContainer).append(spinbox);
            $(customNotContainer).append(selection);
            $(customNotContainer).append(deleteButton);         
            
            $('#customNotCol').prepend(customNotContainer);

            if (customNotificationCounter === 4)
            {
              $('.addNotButton').remove();
            }
          }
        };

        function onDeleteClick(event) 
        {
            this.parentElement.remove(event.target.parentElement);
            customNotificationCounter--;            
            if (customNotificationCounter === 3)
            {  
              nextIdIndex = $(this).attr('id');            
              notificationButton = document.createElement('button');
              $(notificationButton).attr('class', 'addNotButton');
              $(notificationButton).attr('id', 'addNotButton');
              $(notificationButton).text('Add notification');
              notificationButton.addEventListener('click', onAddNotClick);
              $('#customNotCol').append(notificationButton);              
            }
        }    

        let slider = document.getElementById('slider');
        slider.addEventListener("change", function() {
          sliderOutput = this.value
        });

        $('.color-picker span').on('click', function (e) {
            $('.color-picker .active-color').removeClass('active-color');
            this.classList.add('active-color');
          }
        );

        $('#saveChangesButton').on('click', function(e) {
          if ($('#dateTimeFrom').attr('value') > $('#dateTimeTo').attr('value'))
          {
            alert('Final date cannot be more than Starting')
          }
          else 
          {
            var i = 0;
            $('.customNotification').each(function() {
              customReminders[i] = $(this).children('.spinbox').val() + ' ' + $(this).children('.selection').val();
              console.log(customReminders[i])
              i++;
            });

            fromDate = new Date($('#dateTimeFrom').val() + 'T' + $('#timeFrom').val());
            toDate = new Date($('#dateTimeFrom').val()  + 'T' + $('#timeTo').val());
            textAreaOutput = $('.textArea').val();
            colorOutput = $('.active-color').attr('data-color');
            eventTitle = $("input[name='eventTitle']").val();
            /*console.log('Event Title: ' + eventTitle);
            console.log('Starting date: ' + fromDate);
            console.log('Final date: ' + toDate);/*
            console.log('Importance: ' + sliderOutput);
            console.log('Comment: ' + textAreaOutput);
            console.log('Color: ' + colorOutput);
            if (reminder30Output)
              console.log(reminder30Output);
            if (reminder1hOutput)
              console.log(reminder1hOutput);
            if (reminder3hOutput)
              console.log(reminder3hOutput);
            if (reminderButton1d)
              console.log(reminder1dOutput);
            for (var j = 0; j < customReminders.length; j++)
            {
              if (customReminders[j]);
                console.log('remind before: ' + customReminders[j]);
            }*/

            $.ajax({
              type: 'POST',
              url: 'push_new_event_data/',
              data: {
                csrfmiddlewaretoken: $('input[name="csrfmiddlewaretoken"]').val(),
                title: eventTitle,
                start_date: JSON.stringify(fromDate.toString()),
                end_date: JSON.stringify(toDate.toString()),
                color: colorOutput,
                importance: sliderOutput,
                description: textAreaOutput,
              },
              dataType: 'json',
              success: function (data) {
                if (data.flag) {
                console.log('SUCCESS! [changes have been saved]');
                }
            }
            });
          }

        });
})