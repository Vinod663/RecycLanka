// Sample data structure
const municipalData = {
    colombo: {
        name: "Colombo Municipal Council",
        wards: [
            "Colombo 1 (Fort)", "Colombo 2 (Slave Island)", "Colombo 3 (Kollupitiya)",
            "Colombo 4 (Bambalapitiya)", "Colombo 5 (Narahenpita)", "Colombo 6 (Wellawatte)",
            "Colombo 7 (Cinnamon Gardens)", "Colombo 8 (Borella)", "Colombo 9 (Dematagoda)",
            "Colombo 10 (Maradana)", "Colombo 11 (Pettah)", "Colombo 12 (Hulftsdorp)",
            "Colombo 13 (Kotahena)", "Colombo 14 (Grandpass)", "Colombo 15 (Mutwal)"
        ]
    },
    dehiwala: {
        name: "Dehiwala-Mount Lavinia Municipal Council",
        wards: [
            "Dehiwala North", "Dehiwala South", "Mount Lavinia North", "Mount Lavinia South",
            "Kalubowila", "Pepiliyana", "Nedimala", "Attidiya", "Kohuwala",
            "Ratmalana East", "Ratmalana West", "Borupana", "Rawatawatte"
        ]
    },
    moratuwa: {
        name: "Moratuwa Municipal Council",
        wards: [
            "Moratuwa Central", "Moratuwa East", "Moratuwa West", "Koralawella",
            "Katukurunda", "Piliyandala", "Idama", "Soysapura", "Egoda Uyana",
            "Katubedda", "Rawathawatta", "Kadalana", "Angulana"
        ]
    },
    kotte: {
        name: "Sri Jayawardenepura Kotte Municipal Council",
        wards: [
            "Kotte Central", "Kotte North", "Kotte South", "Ethul Kotte",
            "Rajagiriya", "Battaramulla", "Thalawathugoda", "Welikada",
            "Pita Kotte", "Nawala", "Nugegoda East", "Nugegoda West"
        ]
    },
    maharagama: {
        name: "Maharagama Urban Council",
        wards: [
            "Maharagama Central", "Maharagama East", "Maharagama West",
            "Boralesgamuwa", "Kesbewa", "Piliyandala East", "Piliyandala West",
            "Homagama", "Kottawa", "Pannipitiya"
        ]
    },
    kesbewa: {
        name: "Kesbewa Urban Council",
        wards: [
            "Kesbewa Central", "Kesbewa North", "Kesbewa South",
            "Makumbura", "Delkanda", "Hewawasam", "Madivela",
            "Thalangama", "Malabe", "Kottikawatte"
        ]
    }
};

// Schedule storage
let schedules = JSON.parse(localStorage.getItem('wasteSchedules') || '[]');
let editingSchedule = null;

// Load wards when municipality is selected
function loadWards() {
    const municipalSelect = document.getElementById('municipalSelect');
    const wardSelect = document.getElementById('wardSelect');
    const scheduleForm = document.getElementById('scheduleForm');
    const schedulesContainer = document.getElementById('schedulesContainer');

    const selectedMunicipal = municipalSelect.value;

    if (selectedMunicipal && municipalData[selectedMunicipal]) {
        const wards = municipalData[selectedMunicipal].wards;

        wardSelect.innerHTML = '<option value="">Select a ward...</option>';
        wards.forEach(ward => {
            const option = document.createElement('option');
            option.value = ward;
            option.textContent = ward;
            wardSelect.appendChild(option);
        });

        wardSelect.disabled = false;
        scheduleForm.style.display = 'none';

        // Update current municipal name and show schedules
        document.getElementById('currentMunicipalName').textContent = municipalData[selectedMunicipal].name;
        schedulesContainer.style.display = 'block';
        loadSchedules();
    } else {
        wardSelect.innerHTML = '<option value="">Select municipality first...</option>';
        wardSelect.disabled = true;
        scheduleForm.style.display = 'none';
        schedulesContainer.style.display = 'none';
    }
}

// Handle ward selection
document.getElementById('wardSelect').addEventListener('change', function() {
    const wardSelect = document.getElementById('wardSelect');
    const scheduleForm = document.getElementById('scheduleForm');

    if (wardSelect.value) {
        document.getElementById('selectedWardName').textContent = wardSelect.value;
        scheduleForm.style.display = 'block';

        // Set minimum date to today
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('collectionDate').min = today;
    } else {
        scheduleForm.style.display = 'none';
    }
});

// Search wards functionality
function searchWards() {
    const searchTerm = document.getElementById('searchWard').value.toLowerCase();
    const wardSelect = document.getElementById('wardSelect');
    const municipalSelect = document.getElementById('municipalSelect');

    if (!municipalSelect.value) {
        showNotification('Please select a municipality first', 'warning');
        return;
    }

    const wards = municipalData[municipalSelect.value].wards;
    const filteredWards = wards.filter(ward =>
        ward.toLowerCase().includes(searchTerm)
    );

    wardSelect.innerHTML = '<option value="">Select a ward...</option>';
    filteredWards.forEach(ward => {
        const option = document.createElement('option');
        option.value = ward;
        option.innerHTML = ward.replace(new RegExp(searchTerm, 'gi'),
            '<span class="search-highlight">            dehiwala: {</span>');
        wardSelect.appendChild(option);
    });

    if (filteredWards.length === 0 && searchTerm) {
        wardSelect.innerHTML = '<option value="">No wards found...</option>';
    }
}

// Add new schedule
function addSchedule() {
    const municipalSelect = document.getElementById('municipalSelect');
    const wardSelect = document.getElementById('wardSelect');
    const collectionDate = document.getElementById('collectionDate');
    const wasteType = document.getElementById('wasteType');
    const startTime = document.getElementById('startTime');
    const endTime = document.getElementById('endTime');

    // Validation
    if (!municipalSelect.value || !wardSelect.value || !collectionDate.value ||
        !wasteType.value || !startTime.value || !endTime.value) {
        showNotification('Please fill in all fields', 'error');
        return;
    }

    if (startTime.value >= endTime.value) {
        showNotification('End time must be after start time', 'error');
        return;
    }

    // Check for existing schedule conflict
    const existingSchedule = schedules.find(schedule =>
        schedule.municipal === municipalSelect.value &&
        schedule.ward === wardSelect.value &&
        schedule.date === collectionDate.value &&
        schedule.wasteType === wasteType.value &&
        schedule.id !== editingSchedule
    );

    if (existingSchedule) {
        showNotification('A schedule already exists for this ward, date, and waste type', 'error');
        return;
    }

    const schedule = {
        id: editingSchedule || Date.now(),
        municipal: municipalSelect.value,
        municipalName: municipalData[municipalSelect.value].name,
        ward: wardSelect.value,
        date: collectionDate.value,
        wasteType: wasteType.value,
        startTime: startTime.value,
        endTime: endTime.value,
        status: 'active',
        createdAt: new Date().toISOString()
    };

    if (editingSchedule) {
        const index = schedules.findIndex(s => s.id === editingSchedule);
        schedules[index] = schedule;
        showNotification('Schedule updated successfully', 'success');
        editingSchedule = null;
    } else {
        schedules.push(schedule);
        showNotification('Schedule added successfully', 'success');
    }

    // Save to localStorage
    localStorage.setItem('wasteSchedules', JSON.stringify(schedules));

    clearForm();
    loadSchedules();
}

// Clear form
function clearForm() {
    document.getElementById('collectionDate').value = '';
    document.getElementById('wasteType').value = '';
    document.getElementById('startTime').value = '';
    document.getElementById('endTime').value = '';
    editingSchedule = null;

    // Reset button text
    const addButton = document.querySelector('#scheduleForm .btn-primary');
    addButton.innerHTML = '<i class="fas fa-plus me-2"></i>Add Schedule';
}

// Load and display schedules
function loadSchedules() {
    const municipalSelect = document.getElementById('municipalSelect');
    const tableBody = document.getElementById('schedulesTableBody');
    const scheduleCount = document.getElementById('scheduleCount');

    if (!municipalSelect.value) return;

    const municipalSchedules = schedules.filter(schedule =>
        schedule.municipal === municipalSelect.value
    );

    // Sort by date and time
    municipalSchedules.sort((a, b) => {
        const dateA = new Date(a.date + ' ' + a.startTime);
        const dateB = new Date(b.date + ' ' + b.startTime);
        return dateA - dateB;
    });

    tableBody.innerHTML = '';

    municipalSchedules.forEach(schedule => {
        const row = document.createElement('tr');
        const wasteTypeBadge = getWasteTypeBadge(schedule.wasteType);
        const statusClass = getStatusClass(schedule.status);

        row.innerHTML = `
                    <td><strong>${schedule.ward}</strong></td>
                    <td>${formatDate(schedule.date)}</td>
                    <td>${wasteTypeBadge}</td>
                    <td>${formatTime(schedule.startTime)} - ${formatTime(schedule.endTime)}</td>
                    <td><span class="${statusClass}">${capitalizeFirst(schedule.status)}</span></td>
                    <td>
                        <button class="action-btn btn-edit" onclick="editSchedule(${schedule.id})">
                            <i class="fas fa-edit"></i> Edit
                        </button>
                        <button class="action-btn btn-delete" onclick="deleteSchedule(${schedule.id})">
                            <i class="fas fa-trash"></i> Delete
                        </button>
                    </td>
                `;
        tableBody.appendChild(row);
    });

    scheduleCount.textContent = `${municipalSchedules.length} schedule${municipalSchedules.length !== 1 ? 's' : ''}`;
}

// Edit schedule
function editSchedule(scheduleId) {
    const schedule = schedules.find(s => s.id === scheduleId);
    if (!schedule) return;

    // Set form values
    document.getElementById('municipalSelect').value = schedule.municipal;
    loadWards();

    setTimeout(() => {
        document.getElementById('wardSelect').value = schedule.ward;
        document.getElementById('selectedWardName').textContent = schedule.ward;
        document.getElementById('scheduleForm').style.display = 'block';

        document.getElementById('collectionDate').value = schedule.date;
        document.getElementById('wasteType').value = schedule.wasteType;
        document.getElementById('startTime').value = schedule.startTime;
        document.getElementById('endTime').value = schedule.endTime;

        editingSchedule = scheduleId;

        // Update button text
        const addButton = document.querySelector('#scheduleForm .btn-primary');
        addButton.innerHTML = '<i class="fas fa-save me-2"></i>Update Schedule';

        // Scroll to form
        document.getElementById('scheduleForm').scrollIntoView({ behavior: 'smooth' });
    }, 100);
}

// Delete schedule
function deleteSchedule(scheduleId) {
    if (confirm('Are you sure you want to delete this schedule?')) {
        schedules = schedules.filter(s => s.id !== scheduleId);
        localStorage.setItem('wasteSchedules', JSON.stringify(schedules));
        loadSchedules();
        showNotification('Schedule deleted successfully', 'success');
    }
}

// Generate PDF Report
function generatePDFReport() {
    const municipalSelect = document.getElementById('municipalSelect');

    if (!municipalSelect.value) {
        showNotification('Please select a municipality first', 'warning');
        return;
    }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    const municipalName = municipalData[municipalSelect.value].name;
    const municipalSchedules = schedules.filter(schedule =>
        schedule.municipal === municipalSelect.value
    ).sort((a, b) => {
        const dateA = new Date(a.date + ' ' + a.startTime);
        const dateB = new Date(b.date + ' ' + b.startTime);
        return dateA - dateB;
    });

    // Header
    doc.setFontSize(20);
    doc.setTextColor(34, 197, 94);
    doc.text('RecycLanka', 20, 20);

    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    doc.text('Waste Collection Schedule Report', 20, 35);

    doc.setFontSize(12);
    doc.text(`Municipality: ${municipalName}`, 20, 50);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 60);
    doc.text(`Total Schedules: ${municipalSchedules.length}`, 20, 70);

    // Line
    doc.setLineWidth(0.5);
    doc.setDrawColor(229, 231, 235);
    doc.line(20, 80, 190, 80);

    // Table headers
    let yPosition = 95;
    doc.setFontSize(10);
    doc.setFont(undefined, 'bold');
    doc.text('Ward', 20, yPosition);
    doc.text('Date', 70, yPosition);
    doc.text('Waste Type', 105, yPosition);
    doc.text('Time', 140, yPosition);
    doc.text('Status', 170, yPosition);

    // Table content
    doc.setFont(undefined, 'normal');
    yPosition += 10;

    municipalSchedules.forEach(schedule => {
        if (yPosition > 270) {
            doc.addPage();
            yPosition = 30;
        }

        doc.text(schedule.ward, 20, yPosition);
        doc.text(formatDate(schedule.date), 70, yPosition);
        doc.text(capitalizeFirst(schedule.wasteType.replace('-', ' ')), 105, yPosition);
        doc.text(`${formatTime(schedule.startTime)}-${formatTime(schedule.endTime)}`, 140, yPosition);
        doc.text(capitalizeFirst(schedule.status), 170, yPosition);

        yPosition += 8;
    });

    // Footer
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(128, 128, 128);
        doc.text(`Page ${i} of ${pageCount}`, 20, 290);
        doc.text('RecycLanka - Sustainable Future Initiative', 120, 290);
    }

    // Save
    const fileName = `waste-collection-schedule-${municipalSelect.value}-${new Date().toISOString().split('T')[0]}.pdf`;
    doc.save(fileName);

    showNotification('PDF report generated successfully', 'success');
}

// Utility functions
function getWasteTypeBadge(wasteType) {
    const badges = {
        'degradable': '<span class="waste-type-badge badge-degradable">Degradable</span>',
        'recyclable': '<span class="waste-type-badge badge-recyclable">Recyclable</span>',
        'non-recyclable': '<span class="waste-type-badge badge-non-recyclable">Non-Recyclable</span>'
    };
    return badges[wasteType] || wasteType;
}

function getStatusClass(status) {
    const classes = {
        'active': 'status-active',
        'pending': 'status-pending',
        'inactive': 'status-inactive'
    };
    return classes[status] || '';
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

function formatTime(timeString) {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
}

function capitalizeFirst(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

// Notification system
function showNotification(message, type = 'info', duration = 4000) {
    // Create notification container if it doesn't exist
    let container = document.querySelector('.notification-container');
    if (!container) {
        container = document.createElement('div');
        container.className = 'notification-container';
        container.style.cssText = `
                    position: fixed;
                    top: 100px;
                    right: 20px;
                    z-index: 1050;
                    max-width: 400px;
                `;
        document.body.appendChild(container);
    }

    const notification = document.createElement('div');
    const typeClasses = {
        'info': 'alert-info',
        'success': 'alert-success',
        'warning': 'alert-warning',
        'error': 'alert-danger'
    };

    const typeIcons = {
        'info': 'fas fa-info-circle',
        'success': 'fas fa-check-circle',
        'warning': 'fas fa-exclamation-triangle',
        'error': 'fas fa-times-circle'
    };

    notification.className = `alert ${typeClasses[type]} alert-dismissible fade show mb-3`;
    notification.style.cssText = `
                box-shadow: 0 4px 12px rgba(0,0,0,0.1);
                border: none;
                border-radius: 8px;
                animation: slideInRight 0.3s ease-out;
            `;

    notification.innerHTML = `
                <div class="d-flex align-items-center">
                    <i class="${typeIcons[type]} me-2"></i>
                    <span>${message}</span>
                </div>
                <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
            `;

    container.appendChild(notification);

    // Auto remove after duration
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'slideOutRight 0.3s ease-in';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 300);
        }
    }, duration);
}

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    // Set minimum date to today for date input
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('collectionDate').min = today;

    // Welcome message
    /*setTimeout(() => {
        showNotification('Collection Schedule Management System Loaded Successfully!', 'success', 3000);
    }, 1000);*/
});

// Add animation styles
const animationStyle  = document.createElement('style');
animationStyle .textContent = `
            @keyframes slideInRight {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            
            @keyframes slideOutRight {
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