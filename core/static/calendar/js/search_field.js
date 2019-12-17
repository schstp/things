$(document).ready(function () {

    var searchMode = false;

    // search button click event
    $('#searchButton').on('click', function()
    {
        if (!searchMode)
        {
            searchMode = true;

            //hiding panel
            var hideElem = document.getElementById("hideElem");
            hideElem.style.display = "none";
            hideElem = document.getElementById("searchButton");
            hideElem.style.display = "none";

            var searchPanel = document.getElementById("searchPanel");

            //creating search box
            var searchBox = document.createElement("div");
            searchBox.id = "searchBox";
            searchBox.className = "searchBox";

            //creating search field
            var searchInput = document.createElement("input");
            searchInput.id = "searchInput";
            searchInput.type = "text";
            searchInput.className = "searchInput";

            //creating event list box
            var eventBoxes = document.createElement("div");
            eventBoxes.id = "eventBoxes";
            eventBoxes.className = "eventBoxes";

            //creating cancel button
            var cancelButton = document.createElement("button");
            cancelButton.id = "cancelButton";
            cancelButton.className ="transp-button";
            var cancelIcon = document.createElement("ion-icon");
            cancelIcon.className = "icons";
            cancelIcon.name = "ios-arrow-back";
            cancelButton.appendChild(cancelIcon);

            //creating cancel label
            var cancelLabel = document.createElement("label");
            cancelLabel.innerText = "Hide search bar...";
            cancelLabel.className = "cancelLabel";

            //appending elements
            searchPanel.appendChild(cancelButton);
            searchPanel.appendChild(cancelLabel);
            searchBox.appendChild(searchInput);
            searchBox.appendChild(eventBoxes);
            searchPanel.appendChild(searchBox);

            // cancel button click event
            $('#cancelButton').on('click', function()
            {
                if (searchMode)
                {
                    searchMode = false;

                    //removing search panel
                    var searchPanel = document.getElementById("searchPanel");
                    while (searchPanel.firstChild)
                        searchPanel.removeChild(searchPanel.firstChild);

                    //showing panel
                    var hideElem = document.getElementById("hideElem");
                    hideElem.style.display = "flex";
                    hideElem = document.getElementById("searchButton");
                    hideElem.style.display = "flex";
                }
            });

            //uploading event list
            $('#searchInput').keyup(function (e) {
                //check input
                var searchStr = document.getElementById("searchInput").value;
                if (searchStr.length !== 0 && !isEmpty(searchStr))
                {
                    $.ajax({
                        type: 'GET',
                        url: 'get_search_res/',
                        data: {
                            csrfmiddlewaretoken: $('input[name="csrfmiddlewaretoken"]').val(),
                            q: searchStr,
                        },
                        dataType: 'json',
                        success: function (data) {
                                var eventBoxes = document.getElementById("eventBoxes");

                                while (eventBoxes.firstChild)
                                    eventBoxes.removeChild(eventBoxes.firstChild);
                                for (let eventData of data.events) {
                                    showEvent(eventData.title, new Date(eventData.startDate), new Date(eventData.endDate));
                                }
                        }
                    })
                }
                else
                {
                    var eventBoxes = document.getElementById("eventBoxes");
                    while (eventBoxes.firstChild)
                        eventBoxes.removeChild(eventBoxes.firstChild);
                    eventBoxes.style.display = "none";
                }
            });

            //showing uploaded events
            function showEvent(title, startDate, endDate)
            {
                var eventBoxes = document.getElementById("eventBoxes");
                eventBoxes.style.display = "flex";
                var eventBox = document.createElement("div");
                eventBox.id = "eventBox";
                eventBox.className = "eventBox";

                //title
                var titleLabel = document.createElement("label");
                titleLabel.innerText = title;
                titleLabel.className = "eventBoxLeft";

                //date and time
                var timeLabel = document.createElement("label");
                var dateTime = capitalize(window.WEEK_DAYS[startDate.getDay()]) + " " + window.MONTHS[startDate.getMonth()][1] + " "
                    + startDate.getDate() + ", " + startDate.getFullYear() + " | " + getTimeString(startDate.getHours()) + ":"
                    + getTimeString(startDate.getMinutes()) + " - " + getTimeString(endDate.getHours()) + ":"
                    + getTimeString(endDate.getMinutes());
                timeLabel.innerText = dateTime;
                timeLabel.className = "eventBoxRight";

                //appending elements
                eventBox.appendChild(titleLabel);
                eventBox.appendChild(timeLabel);
                eventBoxes.appendChild(eventBox);
            };

            //transform time to 00:00 format
            function getTimeString(time)
            {
                return time < 10 ? TIME_EDITS[time] : time;
            }

            function capitalize(str)
            {
                return str[0] + str.substring(1).toLowerCase();
            }

            function isEmpty(str)
            {
                for (var i = 0; i < str.length; i++)
                    if (str[i] != " ") return false;
                return true;
            }
        }
    });
});