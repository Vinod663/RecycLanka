// Password toggle functionality
document.addEventListener('DOMContentLoaded', function() {
    const passwordInput = document.getElementById('password');
    const passwordToggle = document.getElementById('passwordToggle');
    const loginForm = document.getElementById('loginForm');
    const loginButton = document.getElementById('loginButton');
    const btnText = loginButton.querySelector('.btn-text');
    const btnSpinner = loginButton.querySelector('.btn-spinner');

    // Password visibility toggle
    passwordToggle.addEventListener('click', function() {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);

        const icon = passwordToggle.querySelector('i');
        if (type === 'password') {
            icon.classList.remove('fa-eye-slash');
            icon.classList.add('fa-eye');
        } else {
            icon.classList.remove('fa-eye');
            icon.classList.add('fa-eye-slash');
        }
    });

    // Form submission
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const remember = document.getElementById('remember').checked;

        /*console.log("Email:", email);
        console.log("Password:", password);*/

        // Basic validation
        if (!email || !password) {
            showNotification('Please fill in all required fields', 'error');
            return;
        }

        if (!isValidEmail(email)) {
            showNotification('Please enter a valid email address', 'error');
            return;
        }
        //////////////////////////////
        $.ajax({
            type: "POST",
            url: "http://localhost:8080/auth/login",
            data: JSON.stringify({ email: email, password: password }),
            contentType: "application/json",
            success: function(response) {
                // Store the JWT token in localStorage
                console.log(response.data.accessToken);

                localStorage.removeItem("accessToken");
                localStorage.removeItem("lastSection");
                localStorage.setItem("accessToken", response.data.accessToken);

                // Show loading state
                showLoadingState(true);

                // Simulate login process
                setTimeout(() => {
                    showLoadingState(false);

                    // For demo purposes, show a success message
                    showNotification('Login successful! Redirecting...', 'success');

                    // Simulate redirect after 2 seconds (Should be dashboard.js)
                    /*setTimeout(() => {
                        showNotification('Welcome to RecycLanka!', 'success');
                    }, 2000);*/

                    // Check the role and redirect accordingly after 3 seconds
                    setTimeout(()=>{
                        // First: Try Admin
                        $.ajax({
                            type: "GET",
                            url: "http://localhost:8080/hello/admin",
                            headers: {
                                "Authorization": "Bearer " + localStorage.getItem("accessToken")
                            },

                            success: function (response) {
                                console.log("🛡️ Logged in as ADMIN");
                                window.location.href="adminDashboard.html";
                            },

                            error: function () {
                                // If not admin, try user
                                $.ajax({
                                    type: "GET",
                                    url: "http://localhost:8080/hello/user",
                                    headers: {
                                        "Authorization": "Bearer " + localStorage.getItem("accessToken")
                                    },

                                    success: function (response) {
                                        console.log("👤 Logged in as USER");
                                        // Store user email for future use if login as user
                                        localStorage.removeItem("userEmail");
                                        localStorage.setItem("userEmail", email);
                                        window.location.href="userDashboard.html";
                                    },

                                    error: function () {
                                        alert("❌ Unauthorized! Your token is invalid or expired.");
                                        window.location.href = "signIn.html";
                                    }
                                });
                            }
                        });
                    }, 3000);


                });

                /*showNotification('Login successful! Redirecting...', 'success');*/

                // Simulate redirect after 2 seconds
                /*setTimeout(() => {
                    window.location.href = "dashboard.html"; // Redirect to the main page
                }, 2000);*/
            },
            error: function(response) {
                let errMsg = "An error occurred!";
                if (response.responseJSON && response.responseJSON.message) {
                    errMsg = response.responseJSON.data;
                }
                showNotification(errMsg, 'error');
            }
        })

    });

    // Show/hide loading state
    function showLoadingState(loading) {
        if (loading) {
            loginButton.disabled = true;
            btnText.style.display = 'none';
            btnSpinner.classList.remove('d-none');
        } else {
            loginButton.disabled = false;
            btnText.style.display = 'block';
            btnSpinner.classList.add('d-none');
        }
    }

    // Email validation
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Simple notification system
    function showNotification(message, type = 'info') {
        // Remove existing notifications
        const existingNotifications = document.querySelectorAll('.notification');
        existingNotifications.forEach(notification => notification.remove());

        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas ${getNotificationIcon(type)}"></i>
                <span>${message}</span>
            </div>
            <button class="notification-close" onclick="this.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        `;

        // Add to page
        document.body.appendChild(notification);

        // Auto remove after 5 seconds
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 5000);

        // Animate in
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
    }

    function getNotificationIcon(type) {
        switch (type) {
            case 'success': return 'fa-check-circle';
            case 'error': return 'fa-exclamation-circle';
            case 'warning': return 'fa-exclamation-triangle';
            default: return 'fa-info-circle';
        }
    }

    // Add notification styles dynamically
    const notificationStyles = `
        .notification {
            position: fixed;
            top: 20px;
            right: 20px;
            background: white;
            border-radius: 8px;
            box-shadow: 0 10px 30px -10px rgba(0, 0, 0, 0.3);
            padding: 1rem 1.5rem;
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 1rem;
            z-index: 10000;
            transform: translateX(100%);
            transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            min-width: 300px;
            max-width: 400px;
        }

        .notification.show {
            transform: translateX(0);
        }

        .notification-content {
            display: flex;
            align-items: center;
            gap: 0.75rem;
        }

        .notification-success {
            border-left: 4px solid #22C55E;
        }

        .notification-success .fa-check-circle {
            color: #22C55E;
        }

        .notification-error {
            border-left: 4px solid #EF4444;
        }

        .notification-error .fa-exclamation-circle {
            color: #EF4444;
        }

        .notification-warning {
            border-left: 4px solid #F59E0B;
        }

        .notification-warning .fa-exclamation-triangle {
            color: #F59E0B;
        }

        .notification-info {
            border-left: 4px solid #3B82F6;
        }

        .notification-info .fa-info-circle {
            color: #3B82F6;
        }

        .notification-close {
            background: none;
            border: none;
            color: #6B7280;
            cursor: pointer;
            padding: 0.25rem;
            border-radius: 4px;
            transition: all 0.2s;
        }

        .notification-close:hover {
            background: #F3F4F6;
            color: #374151;
        }

        @media (max-width: 768px) {
            .notification {
                right: 10px;
                left: 10px;
                min-width: auto;
                max-width: none;
            }
        }
    `;

    // Add styles to head
    const styleElement = document.createElement('style');
    styleElement.textContent = notificationStyles;
    document.head.appendChild(styleElement);

    // Add smooth animations to form elements
    const formElements = document.querySelectorAll('.form-control, .btn-login');
    formElements.forEach((element, index) => {
        element.style.animation = `fadeInUp 0.6s ease-out ${index * 0.1}s both`;
    });

    // Add hover effects to feature cards
    const featureCards = document.querySelectorAll('.feature-card');
    featureCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
        });

        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });

    // Add focus animations to form inputs
    const inputs = document.querySelectorAll('.form-control');
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.style.transform = 'scale(1.02)';
        });

        input.addEventListener('blur', function() {
            this.parentElement.style.transform = 'scale(1)';
        });
    });

    console.log('RecycLanka Login Page Initialized');
});