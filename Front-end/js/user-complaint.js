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