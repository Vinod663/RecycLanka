// Password visibility toggle
function togglePasswordField(fieldId) {
    const field = document.getElementById(fieldId);
    const toggle = field.nextElementSibling;
    const icon = toggle.querySelector('i');

    if (field.type === 'password') {
        field.type = 'text';
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
    } else {
        field.type = 'password';
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
    }
}


// Password strength checker
document.getElementById('newUserPassword').addEventListener('input', function() {
    const password = this.value;
    const strengthBar = document.querySelector('.pwd-strength-bar');
    const strengthText = document.querySelector('.pwd-strength-message');

    let strength = 0;
    let feedback = '';

    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;

    strengthBar.className = 'pwd-strength-bar';

    if (strength <= 2) {
        strengthBar.classList.add('strength-level-weak');
        feedback = 'Weak password. Consider adding more characters and variety.';
    } else if (strength <= 3) {
        strengthBar.classList.add('strength-level-medium');
        feedback = 'Medium strength. Add special characters for better security.';
    } else {
        strengthBar.classList.add('strength-level-strong');
        feedback = 'Strong password! Your account is well protected.';
    }

    strengthText.textContent = feedback;
});

$(document).ready(function () {
    loadUserProfile();

    // Handle profile form submit
    $("#userPersonalDataForm").on("submit", function (e) {
        e.preventDefault();
        updateUserProfile();
    });

    // Handle password form submit
    $("#userSecurityUpdateForm").on("submit", function (e) {
        e.preventDefault();
        updateUserPassword();
    });
});

// Load user profile from backend
function loadUserProfile() {
    let email = localStorage.getItem("userEmail");
    let token = localStorage.getItem("accessToken");

    if (!email || !token) {
        alert("Unauthorized. Please login again.");
        return;
    }

    $.ajax({
        url: "http://localhost:8080/api/v1/users/email/" + encodeURIComponent(email),
        method: "GET",
        headers: {
            "Authorization": "Bearer " + token
        },
        success: function (response) {
            if (response.status === 200 && response.data) {
                let user = response.data;

                // Fill fields
                $("#userFirstNameInput").val(user.firstName);
                $("#userLastNameInput").val(user.lastName);
                $("#userOrganizationSelect").val(user.organizationName);
                $("#userPhoneInput").val(user.phoneNumber);

                $(".user-display-name").text(user.firstName + " " + user.lastName);
                $("#userDisplayName").text(user.firstName + " " + user.lastName);
                $(".user-organization-role").text(user.role);
            } else {
                alert("User not found.");
            }
        },
        error: function (xhr) {
            console.error(xhr.responseText);
            alert("Error loading profile.");
        }
    });
}

function updateUserProfile() {
    let token = localStorage.getItem("accessToken");

    let payload = {
        firstName: $("#userFirstNameInput").val().trim(),
        lastName: $("#userLastNameInput").val().trim(),
        phoneNumber: $("#userPhoneInput").val().trim(),
        organizationName: $("#userOrganizationSelect").val(),
    };

    $.ajax({
        url: "http://localhost:8080/api/v1/users/profile",
        method: "PUT",
        headers: {
            "Authorization": "Bearer " + token
        },
        contentType: "application/json",
        data: JSON.stringify(payload),
        success: function (response) {
            alert("Profile updated successfully!");
            loadUserProfile(); // Refresh display
        },
        error: function (xhr) {
            console.error(xhr.responseText);
            alert("Error updating profile.");
        }
    });
}


// Update password
function updateUserPassword() {
    let token = localStorage.getItem("accessToken");

    let payload = {
        currentPassword: $("#currentUserPassword").val().trim(),
        newPassword: $("#newUserPassword").val().trim()
    };

    if (payload.newPassword !== $("#confirmUserPassword").val().trim()) {
        alert("New password and confirm password do not match.");
        return;
    }

    $.ajax({
        url: "http://localhost:8080/api/v1/users/password",
        method: "PUT",
        headers: {
            "Authorization": "Bearer " + token
        },
        contentType: "application/json",
        data: JSON.stringify(payload),
        success: function (response) {
            alert("Password updated successfully!");
            $("#userSecurityUpdateForm")[0].reset();
        },
        error: function (xhr) {
            let errMsg = "Error updating password.";

            try {
                // parse JSON from backend
                let res = JSON.parse(xhr.responseText);
                if (res && res.data) {
                    errMsg = res.data;
                }
            } catch (e) {
                console.error("Failed to parse error response:", xhr.responseText);
            }

            alert(errMsg);
        }
    });
}