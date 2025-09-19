function loadComplaintWards(){
        let municipalName = $("#complaintMunicipal").val();
        let $wardSelect = $("#complaintWard");

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

$("#complaintForm").on("submit", function(e) {
    e.preventDefault();
    addComplaint();
});


function addComplaint() {
    let token = localStorage.getItem("accessToken"); // Get JWT from localStorage

    // Prepare payload
    let payload = {
        municipalName: $("#complaintMunicipal").val(),
        wardName: $("#complaintWard").val(),
        complaintStatus: "PENDING", // always pending when created
        complaintType: $("input[name=complaintType]:checked").val(),
        priority: $("input[name=priority]:checked").val(),
        description: $("#complaintDescription").val().trim(),
        name: $("#complaintName").val().trim(),
        email: $("#complaintEmail").val().trim(),
        phone: $("#complaintPhone").val().trim()
    };

    // Validations
    if (!payload.municipalName) {
        alert("Please select a municipality.");
        return;
    }
    if (!payload.wardName) {
        alert("Please select a ward.");
        return;
    }
    if (!payload.complaintType) {
        alert("Please select a complaint type.");
        return;
    }
    if (!payload.priority) {
        alert("Please select a priority level.");
        return;
    }
    if (!payload.description) {
        alert("Please enter a complaint description.");
        return;
    }
    if (!payload.name) {
        alert("Please enter your name.");
        return;
    }
    if (!payload.phone) {
        alert("Please enter your phone number.");
        return;
    }

    console.log("Payload: ", payload);

    $.ajax({
        url: "http://localhost:8080/api/v1/complaints",
        method: "POST",
        headers: { "Authorization": "Bearer " + token },
        contentType: "application/json",
        data: JSON.stringify(payload),
        success: function (response) {
            alert("Complaint saved successfully!");

            $("#complaintForm")[0].reset(); // reset form after saving
        },
        error: function (xhr) {
            console.error(xhr.responseText);
            alert("Error saving complaint.");
        }
    });
}
