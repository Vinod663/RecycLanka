function filterWards(){
    let municipalName = $("#filterMunicipal").val();
    let $wardSelect = $("#filterWard");//

    /*clearForm();*/ // Clear previous selections and disable button

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
                $wardSelect.append('<option value="" disabled selected>All Wards</option>');

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

// Trigger filter on change
$("#filterMunicipal, #filterWard, #filterStatus, #filterPriority").on("change", function () {
    loadComplaints();
});

// Trigger filter on typing search
$("#searchInputComplaint").on("keyup", function () {
    loadComplaints();
});

// Reset button
function resetFilters() {
    $("#filterMunicipal").val('');
    $("#filterWard").val('').prop("disabled", true).html('<option value="">All Wards</option>');
    $("#filterStatus").val('');
    $("#filterPriority").val('');
    $("#searchInputComplaint").val('');
    loadComplaints(); // reload without filters
    loadComplaintStats();
}


$(document).ready(function() {
    // Load ALl Complaints on page load
    loadComplaints();
    loadComplaintStats();

});



// Set default headers for all requests
$.ajaxSetup({
    beforeSend: function (xhr) {
        let token = localStorage.getItem("accessToken");
        if (token) {
            xhr.setRequestHeader("Authorization", "Bearer " + token);
        }
    }
});


// Load complaints into table
/*function loadComplaints() {
    $.ajax({
        url: "http://localhost:8080/api/v1/complaints", // Adjust port if needed
        type: "GET",
        success: function (response) {
            let complaints = response.data;
            let tableBody = $("#complaintsTableBody");
            tableBody.empty();

            // 🔹 Update complaint count
            $("#resultCount").text(`(${complaints.length} complaints)`);

            $.each(complaints, function (i, complaint) {
                let row = `
                        <tr>
                            <td>${complaint.id}</td>
                            <td>${complaint.name}</td>
                            <td>${complaint.complaintType}</td>
                            <td>${complaint.priority}</td>
                            <td>${complaint.complaintStatus}</td>
                            <td>${complaint.municipalName}</td>
                            <td>${complaint.wardName}</td>
                            <td>
                                <button class="btn btn-sm btn-info viewBtn" data-id="${complaint.id}">View/Edit</button>
                                <button class="btn btn-sm btn-danger deleteBtn" data-id="${complaint.id}">Delete</button>
                            </td>
                        </tr>`;
                tableBody.append(row);
            });
        },
        error: function (xhr) {
            alert("Failed to load complaints: " + xhr.responseText);
        }
    });
}*/

// Load complaints into table with filters
function loadComplaints() {
    // Get filter values
    let municipal = $("#filterMunicipal").val();
    let ward = $("#filterWard").val();
    let status = $("#filterStatus").val();
    let priority = $("#filterPriority").val();
    let search = $("#searchInputComplaint").val();

    $.ajax({
        url: "http://localhost:8080/api/v1/complaints",
        type: "GET",
        data: {
            municipalName: municipal || "",
            wardName: ward || "",
            complaintStatus: status || "",
            priority: priority || "",
            search: search || ""
        },
        success: function (response) {
            let complaints = response.data;
            let tableBody = $("#complaintsTableBody");
            tableBody.empty();

            // 🔹 Update complaint count
            $("#resultCount").text(`(${complaints.length} complaints)`);

            if (complaints.length === 0) {
                tableBody.append(`
                    <tr>
                        <td colspan="8" class="text-center text-muted">No complaints found</td>
                    </tr>
                `);
                return;
            }

            $.each(complaints, function (i, complaint) {
                let row = `
                    <tr>
                        <td>${complaint.id}</td>
                        <td>${complaint.name}</td>
                        <td>${complaint.complaintType}</td>
                        <td>${complaint.priority}</td>
                        <td>${complaint.complaintStatus}</td>
                        <td>${complaint.municipalName}</td>
                        <td>${complaint.wardName}</td>
                        <td>
                            <button class="btn btn-sm btn-info viewBtn" data-id="${complaint.id}">View/Edit</button>
                            <button class="btn btn-sm btn-danger deleteBtn" data-id="${complaint.id}">Delete</button>
                        </td>
                    </tr>`;
                tableBody.append(row);
            });
        },
        error: function (xhr) {
            alert("Failed to load complaints: " + xhr.responseText);
        }
    });
}


let selectedComplaintId = null;

// Handle View/Edit button click
$(document).on("click", ".viewBtn", function () {
    let complaintId = $(this).data("id");
    selectedComplaintId = complaintId;

    $.ajax({
        url: `http://localhost:8080/api/v1/complaints/${complaintId}`,
        type: "GET",
        headers: {
            "Authorization": "Bearer " + localStorage.getItem("accessToken")
        },
        success: function (response) {
            let complaint = response.data;

            // Fill modal fields
            $("#modalComplaintId").text(`#RC${complaint.id}`);
            $("#modalDate").text(complaint.createdAt || "N/A");
            $("#modalCurrentStatus")
                .text(complaint.complaintStatus)
                .removeClass()
                .addClass("status-badge " + complaint.complaintStatus.toLowerCase());
            $("#modalCitizenName").text(complaint.name);
            $("#modalCitizenEmail").text(complaint.email);
            $("#modalPhone").text(complaint.phone);
            $("#modalMunicipal").text(complaint.municipalName);
            $("#modalWard").text(complaint.wardName);
            $("#modalType").text(complaint.complaintType);
            $("#modalPriority")
                .text(complaint.priority)
                .removeClass()
                .addClass("priority-badge " + complaint.priority.toLowerCase());
            $("#modalDescription").text(complaint.description);

            // Show modal
            $("#complaintModal").modal("show");
        },
        error: function (xhr) {
            alert("Failed to load complaint: " + xhr.responseText);
        }
    });
});

// Handle Delete button click (inside table)
$(document).on("click", ".deleteBtn", function () {
    let complaintId = $(this).data("id");
    selectedComplaintId = complaintId;

    // Set text inside confirmation modal
    $("#deleteComplaintId").text(`#RC${complaintId}`);
    $("#deleteModal").modal("show");
});


// Update Status
function updateComplaintStatus() {
    let newStatus = $("#newStatus").val();


    $.ajax({
        url: `http://localhost:8080/api/v1/complaints/${selectedComplaintId}`,
        type: "PUT",
        contentType: "application/json",
        headers: {
            "Authorization": "Bearer " + localStorage.getItem("accessToken")
        },
        data: JSON.stringify({
            complaintStatus: newStatus

        }),
        success: function () {
            $("#complaintModal").modal("hide");
            loadComplaints(); // reload table
            loadComplaintStats();
        },
        error: function (xhr) {
            alert("Failed to update status: " + xhr.responseText);
        }
    });
}

// Confirm Delete
function confirmDelete() {
    $.ajax({
        url: `http://localhost:8080/api/v1/complaints/${selectedComplaintId}`,
        type: "DELETE",
        headers: {
            "Authorization": "Bearer " + localStorage.getItem("accessToken")
        },
        success: function () {
            $("#deleteModal").modal("hide");
            loadComplaints(); // reload table
            loadComplaintStats();
        },
        error: function (xhr) {
            alert("Failed to delete complaint: " + xhr.responseText);
        }
    });
}

function loadComplaintStats() {
    $.ajax({
        url: "http://localhost:8080/api/v1/complaints/stats",
        type: "GET",
        headers: {
            "Authorization": "Bearer " + localStorage.getItem("accessToken")
        },
        success: function (stats) {
            $("#pendingCount").text(stats.pendingCount);
            $("#inProgressCount").text(stats.inProgressCount);
            $("#resolvedCount").text(stats.resolvedCount);
            $("#totalCount").text(stats.totalCount);
        },
        error: function (xhr) {
            console.error("Failed to load stats: " + xhr.responseText);
        }
    });
}


