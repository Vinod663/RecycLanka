// Admin Dashboard JavaScript

document.addEventListener('DOMContentLoaded', function() {
    const token = localStorage.getItem("accessToken");

    if (!token) {
        alert("Please login first!");
        window.location.href = "signIn.html";
        return;
    }


    console.log(token);
    // Initialize all components
    initNavigation();
    initCounterAnimations();
    initActionCards();
    initScrollAnimations();
    initNotifications();
});

// Navigation Functions
function initNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');

    // Handle navigation clicks
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            if (this.getAttribute('href').startsWith('#')) {
                e.preventDefault();
                const targetId = this.getAttribute('href').substring(1);
                const targetSection = document.getElementById(targetId);

                if (targetSection) {
                    targetSection.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });

                    // Update active nav link
                    updateActiveNavLink(this);
                }
            }
        });
    });

    // Handle scroll-based navigation highlighting
    window.addEventListener('scroll', function() {
        let current = '';
        const scrollPosition = window.scrollY + 150;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        if (current) {
            const activeLink = document.querySelector(`.nav-link[href="#${current}"]`);
            if (activeLink) {
                updateActiveNavLink(activeLink);
            }
        }
    });
}

function updateActiveNavLink(activeLink) {
    // Remove active class from all nav links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });

    // Add active class to current link
    activeLink.classList.add('active');
}

// Counter Animations
function initCounterAnimations() {
    const counters = document.querySelectorAll('.stat-number');
    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    counters.forEach(counter => {
        observer.observe(counter);
    });
}

function animateCounter(element) {
    const target = parseInt(element.getAttribute('data-count'));
    const duration = 2000; // 2 seconds
    const step = target / (duration / 16); // 60fps
    let current = 0;

    const timer = setInterval(() => {
        current += step;
        if (current >= target) {
            element.textContent = target.toLocaleString();
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current).toLocaleString();
        }
    }, 16);
}

// Action Cards
function initActionCards() {
    const actionCards = document.querySelectorAll('.action-card');

    actionCards.forEach(card => {
        card.addEventListener('click', function() {
            const section = this.getAttribute('data-section');
            if (section) {
                // Add click animation
                this.style.transform = 'scale(0.98)';
                setTimeout(() => {
                    this.style.transform = '';
                }, 150);

                // Navigate to section
                setTimeout(() => {
                    const targetSection = document.getElementById(section);
                    if (targetSection) {
                        targetSection.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start'
                        });
                    } else {
                        // Show coming soon notification for unimplemented sections
                        showNotification(`${section.charAt(0).toUpperCase() + section.slice(1)} section coming soon!`, 'info');
                    }
                }, 200);
            }
        });

        // Add hover sound effect (optional)
        card.addEventListener('mouseenter', function() {
            // You can add a subtle sound effect here if needed
        });
    });
}

// Scroll Animations
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('.stat-card, .action-card, .float-card');

    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    animatedElements.forEach(element => {
        observer.observe(element);
    });
}

// Notification System
function initNotifications() {
    // Create notification container if it doesn't exist
    if (!document.querySelector('.notification-container')) {
        const container = document.createElement('div');
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
}

function showNotification(message, type = 'info', duration = 4000) {
    const container = document.querySelector('.notification-container');
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

// Utility Functions
function showLoading(element) {
    element.classList.add('loading');
    const loadingSpinner = document.createElement('div');
    loadingSpinner.className = 'loading-spinner';
    loadingSpinner.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
    element.appendChild(loadingSpinner);
}

function hideLoading(element) {
    element.classList.remove('loading');
    const spinner = element.querySelector('.loading-spinner');
    if (spinner) {
        spinner.remove();
    }
}

// Search Functionality (for future implementation)
function initSearch() {
    const searchInput = document.querySelector('#adminSearch');
    if (searchInput) {
        searchInput.addEventListener('input', function(e) {
            const query = e.target.value.toLowerCase();
            // Implement search logic here
            console.log('Searching for:', query);
        });
    }
}

// Data Refresh Functions
function refreshDashboardData() {
    showNotification('Refreshing dashboard data...', 'info', 2000);

    // Simulate API call
    setTimeout(() => {
        // Update counters with new data
        const counters = document.querySelectorAll('.stat-number');
        counters.forEach(counter => {
            const currentValue = parseInt(counter.textContent.replace(/,/g, ''));
            const increase = Math.floor(Math.random() * 10) + 1;
            const newValue = currentValue + increase;
            counter.setAttribute('data-count', newValue);
            animateCounter(counter);
        });

        showNotification('Dashboard data updated successfully!', 'success');
    }, 2000);
}

// Keyboard Shortcuts
document.addEventListener('keydown', function(e) {
    // Ctrl/Cmd + R for refresh
    if ((e.ctrlKey || e.metaKey) && e.key === 'r') {
        e.preventDefault();
        refreshDashboardData();
    }

    // Ctrl/Cmd + / for search (future implementation)
    if ((e.ctrlKey || e.metaKey) && e.key === '/') {
        e.preventDefault();
        const searchInput = document.querySelector('#adminSearch');
        if (searchInput) {
            searchInput.focus();
        }
    }
});

// Mobile Navigation
function initMobileNavigation() {
    const navbarToggler = document.querySelector('.navbar-toggler');
    const navbarCollapse = document.querySelector('.navbar-collapse');

    if (navbarToggler && navbarCollapse) {
        // Close mobile menu when clicking on nav links
        const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (window.innerWidth < 992) {
                    const bsCollapse = new bootstrap.Collapse(navbarCollapse, {
                        toggle: true
                    });
                }
            });
        });
    }
}

// Initialize mobile navigation
initMobileNavigation();

// Add custom CSS animations
const style = document.createElement('style');
style.textContent = `
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
    
    .loading-spinner {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        font-size: 1.5rem;
        color: var(--primary-color);
    }
`;
document.head.appendChild(style);

// Welcome message on load
window.addEventListener('load', function() {
    setTimeout(() => {
        showNotification('Welcome to RecycLanka Admin Dashboard! 🌿', 'success', 5000);
    }, 1000);
});

//Logout Btn --> Remove Token and Refresh
$("#logoutBtn").click(function () {
    localStorage.removeItem("accessToken");
    location.reload();

})