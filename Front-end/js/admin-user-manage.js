// Sample user data based on your entity
const usersData = [
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

function setupEventListeners() {
    // Filter functionality
    document.getElementById('organizationFilter').addEventListener('change', function() {
        filterUsers();
    });

    document.getElementById('roleFilter').addEventListener('change', function() {
        filterUsers();
    });

    // Export button
    document.getElementById('exportUsersBtn').addEventListener('click', function() {
        exportUsers();
    });

    // Add user button
    document.getElementById('addUserBtn').addEventListener('click', function() {
        addNewUser();
    });

    // Modal close on background click
    document.getElementById('userDetailModal').addEventListener('click', function(e) {
        if (e.target === this) {
            closeUserDetailModal();
        }
    });
}

function filterUsers() {
    const orgFilter = document.getElementById('organizationFilter').value;
    const roleFilter = document.getElementById('roleFilter').value;

    filteredUsers = usersData.filter(user => {
        const matchesOrg = !orgFilter || user.organizationName === orgFilter;
        const matchesRole = !roleFilter || user.role === roleFilter;

        return matchesOrg && matchesRole;
    });

    currentPage = 1;
    renderUsersTable();
    updatePaginationInfo();
}

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
        case 'MODERATOR': return 'status-pending';
        case 'USER': return 'status-inactive';
        default: return 'status-inactive';
    }
}

function formatDate(dateString) {
    const date = new Date(dateString);
    const today = new Date();
    const diffTime = Math.abs(today - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return 'Today';
    if (diffDays === 2) return 'Yesterday';
    if (diffDays <= 7) return `${diffDays} days ago`;

    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
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
}

function editUser(userId) {
    const user = usersData.find(u => u.id === userId);
    if (!user) return;

    // For now, just show an alert. In a real app, this would open an edit form
    alert(`Edit user: ${user.firstName} ${user.lastName}\n\nThis would open an edit form in a real application.`);
}

function editUserDetails() {
    const userName = document.getElementById('modalUserName').textContent;
    alert(`Edit user details for: ${userName}\n\nThis would open an edit form in a real application.`);
    closeUserDetailModal();
}

function deleteUser(userId) {
    const user = usersData.find(u => u.id === userId);
    if (!user) return;

    const confirmed = confirm(`Are you sure you want to delete user "${user.firstName} ${user.lastName}"?\n\nThis action cannot be undone.`);

    if (confirmed) {
        // Simulate deletion
        const button = document.querySelector(`button[onclick="deleteUser(${userId})"]`);
        const originalContent = button.innerHTML;
        button.innerHTML = '<div class="loading-spinner"></div>';
        button.disabled = true;

        setTimeout(() => {
            // In a real app, you would make an API call here
            const index = usersData.findIndex(u => u.id === userId);
            if (index > -1) {
                usersData.splice(index, 1);
                filterUsers(); // Refresh the table

                // Show success message
                showNotification('User deleted successfully', 'success');
            }
        }, 1500);
    }
}

function addNewUser() {
    alert('Add New User\n\nThis would open a form to create a new user account.');
}

function exportUsers() {
    const button = document.getElementById('exportUsersBtn');
    const originalContent = button.innerHTML;
    button.innerHTML = '<div class="loading-spinner"></div> Exporting...';
    button.disabled = true;

    setTimeout(() => {
        button.innerHTML = originalContent;
        button.disabled = false;

        // Simulate export
        showNotification('Users exported successfully', 'success');
    }, 2000);
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `profile-alert-msg alert-${type === 'success' ? 'success' : 'info'}-msg`;
    notification.innerHTML = `<i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i> ${message}`;
    notification.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 1001;
                min-width: 300px;
                animation: slideIn 0.3s ease-out;
            `;

    document.body.appendChild(notification);

    // Auto remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-in';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Add CSS for notification animations
const style = document.createElement('style');
style.textContent = `
            @keyframes slideIn {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            
            @keyframes slideOut {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(100%);
                    opacity: 0;
                }
            }
        `;
document.head.appendChild(style);

// Initialize pagination info
updatePaginationInfo();
