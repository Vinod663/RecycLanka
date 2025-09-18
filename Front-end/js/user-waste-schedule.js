//load wards when municipality is selected
function loadWards(){
   /* weeklyScheduleContainer
    scheduleActions
    todaysCollection*/
    let municipalName = $("#municipalSelect").val();
    let $wardSelect = $("#wardSelect");

    clearForm(); // Clear previous selections and disable button


    if (!municipalName) {
        $wardSelect.prop("disabled", true).html('<option value="">Select municipality first...</option>');
        return;
    }

    $wardSelect.prop("disabled", true).html('<option value="">Loading wards...</option>');

    // Get token from localStorage
    let token = localStorage.getItem("accessToken");


    $.ajax({
        url: "http://localhost:8080/api/v1/ward/by-municipal/" + encodeURIComponent(municipalName),
        method: "GET",
        headers: {
            "Authorization": "Bearer " + token
        },
        success: function(response) {
            if (response.status === 200 && response.data.length > 0) {
                $wardSelect.empty();
                $wardSelect.append('<option value="" disabled selected>Select Ward</option>');

                $.each(response.data, function(index, ward) {
                    $wardSelect.append('<option value="' + ward.name + '">' + ward.name + '</option>');
                });

                $wardSelect.prop("disabled", false);

            } else {
                $wardSelect.html('<option value="">No wards found</option>');
            }
        },
        error: function(xhr) {
            if (xhr.status === 401) {
                $wardSelect.html('<option value="">Unauthorized - Please login again</option>');
            } else {
                $wardSelect.html('<option value="">Error loading wards</option>');
            }
            $wardSelect.prop("disabled", true);
        }
    });
}

function enableButton(){
    $('#loadScheduleBtn').prop('disabled', false);
    /*$('#weeklyScheduleContainer').show()*/
    /*$('#scheduleActions').show();
    $('#todaysCollection').show();*/
}

function loadWeeklySchedule(){
    $('#weeklyScheduleContainer').show()
    $('#scheduleActions').show();
    /*$('#todaysCollection').show();*/
    loadSchedule();
}

function clearForm() {
    // Reset selects
    /*$('#municipalSelect').val("");*/
    /*$('#wardSelect').empty()
        .append('<option value="" disabled selected>Select Municipal First</option>')
        .prop("disabled", true);*/

    // Disable button again
    $('#loadScheduleBtn').prop('disabled', true);

    // Hide schedule related sections
    $('#weeklyScheduleContainer').hide();
    $('#scheduleActions').hide();
    $('#todaysCollection').hide();

    // Reset weekly calendar collections to "No collection"
    const days = ["monday","tuesday","wednesday","thursday","friday","saturday","sunday"];
    days.forEach(day => {
        $('#' + day + 'Collections').html(`
            <div class="no-collection">
                <i class="fas fa-calendar-times"></i>
                <span>No collection</span>
            </div>
        `);
        $('#' + day + 'Date').text(""); // clear date
    });

    // Reset location text
    $('#scheduleLocation').text("Your Collection Schedule");

    // Reset today's collection alert
    $('#todayWasteType').text("");
    $('#time').text("");
}

// Initialize form on page load
function loadSchedule() {
    let municipal = $("#municipalSelect").val();
    let ward = $("#wardSelect").val();
    let token = localStorage.getItem("accessToken");

    if (!municipal || !ward) {
        alert("Please select a municipal and a ward.");
        return;
    }

    $.ajax({
        url: "http://localhost:8080/api/v1/schedules/by-municipal/" + municipal,
        method: "GET",
        headers: { "Authorization": "Bearer " + token },
        success: function (response) {
            console.log(response.data);
            if (response.status === 200 && response.data.length > 0) {
                renderSchedule(response.data, ward);
            } else {
                clearForm();
                alert("No schedules found for " + municipal + " - " + ward);
            }
        },
        error: function (xhr) {
            console.error("Error loading schedule:", xhr);
            alert("Error loading schedule. Please try again later.");
        }
    });
}


function renderSchedule(schedules, ward) {
    // Reset before rendering
    clearForm();



    let today = new Date().toLocaleDateString("en-US", { weekday: "long" }).toUpperCase();
    let foundToday = false;


    schedules.forEach(schedule => {
        console.log("Schedule:"+schedule+" Status:"+schedule.status);
        if (schedule.wardName === ward && schedule.status === "ACTIVE") {
            let dayId = schedule.day.toLowerCase() + "Collections";
            let dateId = schedule.day.toLowerCase() + "Date";

            // Remove "No collection" placeholder if it exists for this day
            $("#" + dayId).find(".no-collection").remove();

            // Render collection slot
            let textColor = "";
            if (schedule.wasteType === "ORGANIC") {
                textColor = "#22C55E"; // Green
            } else if (schedule.wasteType === "RECYCLABLE") {
                textColor = "#2563eb"; // Blue
            } else if (schedule.wasteType === "GENERAL") {
                textColor = "#6B7280"; // Gray
            }

            $("#" + dayId).append(`
                <div class="collection-card" style="display:flex; align-items:center; gap:6px; font-size:14px; font-weight:500;">
                    <i class="fas fa-calendar-week" style="color:${textColor};"></i>
                    <span style="color:${textColor};">${schedule.wasteType} (${schedule.time})</span>
                </div>
            `);


            // Optional: display actual date for that weekday
            /*$("#" + dateId).text(schedule.day);*/

            // Highlight today’s collection
            if (schedule.day === today) {
                $("#todayWasteType").text(`${schedule.wasteType}`);
                $("#time").text(` at ${schedule.time}`);
                foundToday = true;
            }
        }
    });

    // Show today's collection alert only if something found
    if (!foundToday) {
        $("#todaysCollection").hide();
    } else {
        $("#todaysCollection").show();
    }

    // Show UI sections
    $("#weeklyScheduleContainer").show();
    $("#scheduleActions").show();
    /*$("#todaysCollection").show();*/

    // Set location header
    /*$("#scheduleLocation").text(municipal + " - " + ward + " Schedule");*/
}

