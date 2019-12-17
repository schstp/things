'use strict';
$(document).ready(function() {
        var reminder30Output;
        var reminder1hOutput;
        var reminder3hOutput;
        var reminder1dOutput;
        var customReminders = [];
        window.sliderOutput = '2';
        window.fromDate = new Date();
        window.toDate = new Date();
        var colorOutput = '#7587C7';
        var textAreaOutput = "";
        var eventTitle = "(no title)";

        $('.createEventButton').on('click', function(event) {
          //resetToDefaultState();
          let today = new Date();
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
              let notificationButton = document.createElement('button');
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

        $('.color-picker-modal span').on('click', function (e) {
            $('.color-picker-modal .active-color').removeClass('active-color');
            this.classList.add('active-color');
          }
        );

        $('.close').on('click', function() {
          resetToDefaultState();
          $('#deleteEventButton').remove();
        }); 

        function resetToDefaultState() 
        {
          var sliderOutput = '2';
          window.fromDate = new Date();
          window.toDate = new Date();
          var colorOutput = '#7587C7';
          var textAreaOutput = "";
          var eventTitle = "(no title)";
          let today = new Date();
          var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
          $('#dateTimeFrom').attr('value', date);

          $("input[name='eventTitle']").val("");
          $('.textArea').val("");
          $('#timeFrom option:first').prop('selected', true);
          $('#timeTo option:first').prop('selected', true);
          var customNotificationCounter = 0;
          var nextIdIndex = 0;          
        }

        $('#saveChangesButton').on('click', function(e) {         
            var i = 0;
            $('.customNotification').each(function() {
              customReminders[i] = $(this).children('.spinbox').val() + ' ' + $(this).children('.selection').val();
              console.log(customReminders[i])
              i++;
            });

            textAreaOutput = $('.textArea').val();
            colorOutput = $('.active-color').attr('data-color');
            fromDate = new Date($('#dateTimeFrom').val() + 'T' + $('#timeFrom').val());
            toDate = new Date($('#dateTimeFrom').val()  + 'T' + $('#timeTo').val());
            
            if (fromDate > toDate) 
            {
                alert('Startig date cannot be larger than Ending');
            }
            else
            {
               if ($("input[name='eventTitle']").val() !== "") 
            {
                eventTitle = $("input[name='eventTitle']").val();
            }

            if (byDoubleClickCalled) 
            {
              byDoubleClickCalled = false;
              //console.log('called by double click');
              $.ajax({
                type: 'POST',
                url: 'update_double_clicked_event/',
                data: {
                  csrfmiddlewaretoken: $('input[name="csrfmiddlewaretoken"]').val(),
                  event_id: ID_OF_DOUBLE_CLICKED_EVENT,
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
            else 
            {
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
            }

            $('#deleteEventButton').remove();
            resetToDefaultState();

            BASE_DATE.setTime(fromDate.getTime());
            let content = document.getElementById('content');
            console.log(content);
            renderCurrentMode(content);

        });
})