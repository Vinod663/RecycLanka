// Sample user data based on your entity
/*const usersData = [
    {
        id: 1,
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@municipality.lk',
        phoneNumber: '+94 77 123 4567',
        organizationName: 'Municipal Council',
        role: 'ADMIN'
    },
    {
        id: 2,
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane.smith@wastecollection.lk',
        phoneNumber: '+94 77 234 5678',
        organizationName: 'Waste Collection Services',
        role: 'USER'
    },
    {
        id: 3,
        firstName: 'Mike',
        lastName: 'Johnson',
        email: 'mike.j@recycling.lk',
        phoneNumber: '+94 77 345 6789',
        organizationName: 'Recycling Center',
        role: 'MODERATOR'
    },
    {
        id: 4,
        firstName: 'Sarah',
        lastName: 'Williams',
        email: 'sarah.w@envagency.lk',
        phoneNumber: '+94 77 456 7890',
        organizationName: 'Environmental Agency',
        role: 'USER'
    },
    {
        id: 5,
        firstName: 'David',
        lastName: 'Brown',
        email: 'david.brown@gmail.com',
        phoneNumber: '+94 77 567 8901',
        organizationName: 'Citizen',
        role: 'USER'
    },
    {
        id: 6,
        firstName: 'Lisa',
        lastName: 'Anderson',
        email: 'lisa.anderson@municipality.lk',
        phoneNumber: '+94 77 678 9012',
        organizationName: 'Municipal Council',
        role: 'ADMIN'
    },
    {
        id: 7,
        firstName: 'Robert',
        lastName: 'Taylor',
        email: 'robert.t@citizen.lk',
        phoneNumber: '+94 77 789 0123',
        organizationName: 'Citizen',
        role: 'USER'
    },
    {
        id: 8,
        firstName: 'Emma',
        lastName: 'Wilson',
        email: 'emma.wilson@recycling.lk',
        phoneNumber: '+94 77 890 1234',
        organizationName: 'Recycling Center',
        role: 'USER'
    }
];

let currentPage = 1;
let filteredUsers = [...usersData];

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    renderUsersTable();
    setupEventListeners();
});

function renderUsersTable() {
    const tbody = document.getElementById('usersTableBody');
    tbody.innerHTML = '';

    if (filteredUsers.length === 0) {
        tbody.innerHTML = `
                    <tr>
                        <td colspan="6" style="text-align: center; padding: 2rem; color: var(--gray-500);">
                            <i class="fas fa-users" style="font-size: 2rem; margin-bottom: 1rem; display: block;"></i>
                            No users found matching your criteria
                        </td>
                    </tr>
                `;
        return;
    }

    filteredUsers.forEach(user => {
        const row = createUserRow(user);
        tbody.appendChild(row);
    });
}

function createUserRow(user) {
    const row = document.createElement('tr');

    const roleBadgeClass = getRoleBadgeClass(user.role);

    row.innerHTML = `
                <td>
                    <div class="user-profile-cell">
                        <div class="user-avatar-mini">
                            <i class="fas fa-user"></i>
                        </div>
                        <div class="user-name-info">
                            <div class="user-name-primary">${user.firstName} ${user.lastName}</div>
                            <div class="user-email-secondary">${user.email}</div>
                        </div>
                    </div>
                </td>
                <td>
                    <span class="org-badge">${user.organizationName}</span>
                </td>
                <td>${user.phoneNumber}</td>
                <td>
                    <span class="status-badge ${roleBadgeClass}">${user.role}</span>
                </td>
                <td><strong>#${user.id}</strong></td>
                <td>
                    <div class="action-buttons">
                        <button class="action-btn action-btn-view" onclick="viewUserDetails(${user.id})" title="View Details">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="action-btn action-btn-edit" onclick="editUser(${user.id})" title="Edit User">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="action-btn action-btn-delete" onclick="deleteUser(${user.id})" title="Delete User">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            `;

    return row;
}

function getRoleBadgeClass(role) {
    switch(role) {
        case 'ADMIN': return 'status-active';
        case 'USER': return 'status-inactive';
        default: return 'status-inactive';
    }
}

function updatePaginationInfo() {
    document.getElementById('paginationTotal').textContent = filteredUsers.length;
    document.getElementById('paginationStart').textContent = filteredUsers.length > 0 ? '1' : '0';
    document.getElementById('paginationEnd').textContent = filteredUsers.length;
}

function viewUserDetails(userId) {
    const user = usersData.find(u => u.id === userId);
    if (!user) return;

    // Populate modal with user data
    document.getElementById('modalUserName').textContent = `${user.firstName} ${user.lastName}`;
    document.getElementById('modalUserEmail').textContent = user.email;
    document.getElementById('modalUserId').textContent = `#${user.id}`;
    document.getElementById('modalUserFirstName').textContent = user.firstName;
    document.getElementById('modalUserLastName').textContent = user.lastName;
    document.getElementById('modalUserOrg').textContent = user.organizationName;
    document.getElementById('modalUserPhone').textContent = user.phoneNumber;

    // Role with badge
    const roleElement = document.getElementById('modalUserRole');
    const roleBadgeClass = getRoleBadgeClass(user.role);
    roleElement.innerHTML = `<span class="status-badge ${roleBadgeClass}">${user.role}</span>`;

    // Show modal
    document.getElementById('userDetailModal').classList.add('show');
    document.body.style.overflow = 'hidden';
}

function closeUserDetailModal() {
    document.getElementById('userDetailModal').classList.remove('show');
    document.body.style.overflow = 'auto';
}*/

$(document).ready(function () {
    loadAllUsers();
    loadUserStats();

    // Filter handlers
    $("#organizationFilter, #roleFilter").on("change", function () {
        loadAllUsers();

    });

    // Add User Button
    $("#addUserBtn").on("click", function () {
        $("#userDetailModal").show();
        resetUserModal();
    });

    // Export users
    $("#exportUsersBtn").on("click", function () {
        exportUsers();
    });
});

// ================= Load All Users =================
function loadAllUsers() {
    let token = localStorage.getItem("accessToken");
    let orgFilter = $("#organizationFilter").val();
    let roleFilter = $("#roleFilter").val();

    $.ajax({
        url: "http://localhost:8080/api/v1/users",
        method: "GET",
        headers: {"Authorization": "Bearer " + token},
        success: function (response) {
            if (response.status === 200) {
                let users = response.data;

                // Apply filters
                if (orgFilter) {
                    users = users.filter(u => u.organizationName === orgFilter);
                }
                if (roleFilter) {
                    users = users.filter(u => u.role === roleFilter);
                }

                populateUsersTable(users);
            }
        },
        error: function (xhr) {
            console.error(xhr.responseText);
            alert("Failed to load users.");
        }
    });
}

function populateUsersTable(users) {
    let tbody = $("#usersTableBody");
    tbody.empty();

    if (!users || users.length === 0) {
        tbody.append("<tr><td colspan='6'>No users found</td></tr>");
        return;
    }

    users.forEach(user => {
        tbody.append(`
            <tr>
                <td>${user.firstName} ${user.lastName} <br><small>${user.email}</small></td>
                <td>${user.organizationName || "-"}</td>
                <td>${user.phoneNumber || "-"}</td>
                <td>${user.role}</td>
                <td>${user.id}</td>
                <td>
                    <button class="admin-btn-secondary action-btn action-btn-view" onclick="viewUser('${user.email}')">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="admin-btn-primary action-btn action-btn-edit" onclick="editUser('${user.email}')">
                        <i class="fas fa-edit"></i>
                    </button>
               
                </td>
            </tr>
        `);
    });
}

/*<button className="admin-btn-danger action-btn action-btn-delete" onClick="deleteUser('${user.email}')">
    <i className="fas fa-trash"></i>
</button>*/

function loadUserStats() {
    let token = localStorage.getItem("accessToken");

    $.ajax({
        url: "http://localhost:8080/api/v1/users/stats",
        method: "GET",
        headers: {
            "Authorization": "Bearer " + token
        },
        success: function (response) {
            $("#totalUSerCount").prev().text(response.data.total);
            $("#MunicipalUsers").prev().text(response.data.municipal);
            $("#citizenUsers").prev().text(response.data.citizen);
            $("#organizationalUsers").prev().text(response.data.organization);
        },
        error: function (xhr) {
            console.error(xhr.responseText);
            alert("Error loading stats.");
        }
    });
}


// ================= Helpers =================
function resetUserModal() {
    $("#modalUserId").text("New User");
    $("#modalUserFirstName").text("");
    $("#modalUserLastName").text("");
    $("#modalUserOrg").text("");
    $("#modalUserPhone").text("");
    $("#modalUserRole").text("USER");
    $("#modalUserName").text("New User");
    $("#modalUserEmail").text("");
}

function closeUserDetailModal() {
    $("#userDetailModal").hide();

}

function exportUsers() {
    alert("Export to CSV/PDF coming soon 🚀");
}

// ================= View / Edit User =================
function viewUser(email) {
    let token = localStorage.getItem("accessToken");

    $.ajax({
        url: "http://localhost:8080/api/v1/users/email/" + encodeURIComponent(email),
        method: "GET",
        headers: {"Authorization": "Bearer " + token},
        success: function (response) {
            if (response.status === 200) {
                let u = response.data;
                $("#modalUserId").text(u.id);
                $("#modalUserFirstName").text(u.firstName);
                $("#modalUserLastName").text(u.lastName);
                $("#modalUserOrg").text(u.organizationName);
                $("#modalUserPhone").text(u.phoneNumber);
                $("#modalUserRole").text(u.role);
                $("#modalUserName").text(u.firstName + " " + u.lastName);
                $("#modalUserEmail").text(u.email);
                $("#userDetailModal").show();
            }
        },
        error: function () {
            alert("Failed to load user details.");
        }
    });
}

function editUser(email) {
    let token = localStorage.getItem("accessToken");

    $.ajax({
        url: "http://localhost:8080/api/v1/users/email/" + encodeURIComponent(email),
        method: "GET",
        headers: {"Authorization": "Bearer " + token},
        success: function (response) {
            if (response.status === 200) {
                let u = response.data;

                // fill modal inputs
                $("#UserId").text(u.id);
                $("#modalUserFirstNameInput").val(u.firstName);
                $("#modalUserLastNameInput").val(u.lastName);
                $("#modalUserEmailInput").val(u.email);
                $("#modalUserPhoneInput").val(u.phoneNumber);
                $("#modalUserOrgInput").val(u.organizationName);
                $("#modalUserRoleInput").val(u.role);

                // show modal
                $("#userEditModal").modal("show");
            }
        },
        error: function () {
            alert("Failed to load user details.");
        }
    });
}

/*function saveUserEdits() {//mail ekn edit karanna ba ekama mail eken dennek inna bari nisa
    let token = localStorage.getItem("accessToken");

    let payload = {
        firstName: $("#modalUserFirstNameInput").val().trim(),
        lastName: $("#modalUserLastNameInput").val().trim(),
        phoneNumber: $("#modalUserPhoneInput").val().trim(),
        organizationName: $("#modalUserOrgInput").val(),
        role: $("#modalUserRoleInput").val()
    };

    $.ajax({
        url: "http://localhost:8080/api/v1/users/profile?email=" + $("#modalUserEmailInput").val().trim(), // or admin update endpoint
        method: "PUT",
        headers: { "Authorization": "Bearer " + token },
        contentType: "application/json",
        data: JSON.stringify(payload),
        success: function () {
            alert("User updated successfully!");
            $("#userEditModal").modal("hide");
            loadAllUsers();
            loadUserStats(); // refresh dashboard
        },
        error: function (xhr) {
            console.error(xhr.responseText);
            alert("Error updating user.");
        }
    });
}*/


// ================= Delete User =================
/*function deleteUser(email) {
    if (!confirm("Are you sure you want to delete this user?")) return;

    let token = localStorage.getItem("accessToken");

    $.ajax({
        url: "http://localhost:8080/api/v1/users/" + encodeURIComponent(email),
        method: "DELETE",
        headers: { "Authorization": "Bearer " + token },
        success: function () {
            alert("User deleted successfully.");
            loadAllUsers();
        },
        error: function () {
            alert("Failed to delete user.");
        }
    });
}*/ //transaction


//ward tika danna
//edit eka hadanna
//tawa data tikak save karanna



