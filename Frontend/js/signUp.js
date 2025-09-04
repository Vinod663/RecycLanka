// Signup Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Get form elements
    const signupForm = document.getElementById('signupForm');
    const signupButton = document.getElementById('signupButton');
    const passwordToggle = document.getElementById('passwordToggle');
    const confirmPasswordToggle = document.getElementById('confirmPasswordToggle');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirmPassword');

    // Password toggle functionality
    function setupPasswordToggle(toggleButton, passwordField) {
        if (toggleButton && passwordField) {
            toggleButton.addEventListener('click', function() {
                const type = passwordField.getAttribute('type') === 'password' ? 'text' : 'password';
                passwordField.setAttribute('type', type);

                const icon = toggleButton.querySelector('i');
                if (type === 'password') {
                    icon.classList.remove('fa-eye-slash');
                    icon.classList.add('fa-eye');
                } else {
                    icon.classList.remove('fa-eye');
                    icon.classList.add('fa-eye-slash');
                }
            });
        }
    }

    // Setup password toggles
    setupPasswordToggle(passwordToggle, passwordInput);
    setupPasswordToggle(confirmPasswordToggle, confirmPasswordInput);

    // Real-time password validation
    function validatePassword(password) {
        const minLength = 8;
        const hasUpperCase = /[A-Z]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);
        const hasNumbers = /\d/.test(password);
        const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);

        return {
            length: password.length >= minLength,
            upperCase: hasUpperCase,
            lowerCase: hasLowerCase,
            numbers: hasNumbers,
            specialChar: hasSpecialChar,
            isValid: password.length >= minLength && hasUpperCase && hasLowerCase && hasNumbers
        };
    }

    // Password confirmation validation
    function validatePasswordConfirmation() {
        const password = passwordInput.value;
        const confirmPassword = confirmPasswordInput.value;

        if (confirmPassword && password !== confirmPassword) {
            confirmPasswordInput.setCustomValidity('Passwords do not match');
            return false;
        } else {
            confirmPasswordInput.setCustomValidity('');
            return true;
        }
    }

    // Real-time validation listeners
    passwordInput.addEventListener('input', function() {
        const validation = validatePassword(this.value);
        if (this.value && !validation.isValid) {
            this.setCustomValidity('Password must be at least 8 characters with uppercase, lowercase, and numbers');
        } else {
            this.setCustomValidity('');
        }
        validatePasswordConfirmation();
    });

    confirmPasswordInput.addEventListener('input', validatePasswordConfirmation);

    // Email validation
    const emailInput = document.getElementById('email');
    emailInput.addEventListener('input', function() {
        const email = this.value;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (email && !emailRegex.test(email)) {
            this.setCustomValidity('Please enter a valid email address');
        } else {
            this.setCustomValidity('');
        }
    });

    // Phone validation
    const phoneInput = document.getElementById('phone');
    phoneInput.addEventListener('input', function() {
        const phone = this.value.replace(/\D/g, ''); // Remove non-digits

        if (phone.length >= 10) {
            // Format phone number (assuming US format)
            const formatted = phone.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
            this.value = formatted;
            this.setCustomValidity('');
        } else if (this.value) {
            this.setCustomValidity('Please enter a valid phone number');
        }
    });

    // Show notification
    function showNotification(message, type = 'success') {
        // Remove existing notifications
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }

        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
                <span>${message}</span>
                <button class="notification-close" onclick="this.parentElement.parentElement.remove()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;

        document.body.appendChild(notification);

        // Auto remove after 5 seconds
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 5000);
    }

    // Form submission
    signupForm.addEventListener('submit', function(e) {
        e.preventDefault();

        // Get form data
        const formData = new FormData(signupForm);
        const data = Object.fromEntries(formData);

        // Validate required fields
        const requiredFields = ['firstName', 'lastName', 'email', 'phone', 'password', 'confirmPassword'];
        let isValid = true;

        requiredFields.forEach(field => {
            const input = document.getElementById(field);
            if (!input.value.trim()) {
                input.setCustomValidity('This field is required');
                isValid = false;
            }
        });

        // Check terms agreement
        const termsCheckbox = document.getElementById('terms');
        if (!termsCheckbox.checked) {
            showNotification('Please agree to the Terms of Service and Privacy Policy', 'error');
            return;
        }

        // Validate password strength
        const passwordValidation = validatePassword(data.password);
        if (!passwordValidation.isValid) {
            showNotification('Password must be at least 8 characters with uppercase, lowercase, and numbers', 'error');
            return;
        }

        // Validate password confirmation
        if (!validatePasswordConfirmation()) {
            showNotification('Passwords do not match', 'error');
            return;
        }

        if (!isValid) {
            showNotification('Please fill in all required fields correctly', 'error');
            return;
        }

        // Show loading state
        const btnText = signupButton.querySelector('.btn-text');
        const btnSpinner = signupButton.querySelector('.btn-spinner');

        btnText.classList.add('d-none');
        btnSpinner.classList.remove('d-none');
        signupButton.disabled = true;

        console.log(data.phone) //ABCDEabcde1234
        console.log(data);

        // Simulate account creation (replace with actual API call)
        setTimeout(() => {
            // Reset button state
            btnText.classList.remove('d-none');
            btnSpinner.classList.add('d-none');
            signupButton.disabled = false;



            $.ajax({
                type: "POST",
                url: "http://localhost:8080/auth/register",
                data: JSON.stringify({
                    firstName: data.firstName,
                    lastName: data.lastName,
                    email: data.email,
                    phoneNumber: data.phone,
                    organizationName:document.getElementById('organization').value,
                    password: data.password,
                    role: "USER"
                }),
                contentType: "application/json",
                success: function(response) {
                    showNotification('Account created successfully! Please check your email for verification.', 'success');
                    setTimeout(() => {
                        window.location.href = 'signIn.html';
                    }, 2000);
                },
                error: function(response) {
                    let errMsg = "An error occurred!";
                    if (response.responseJSON && response.responseJSON.message) {
                        errMsg = response.responseJSON.data;
                    }
                    showNotification(errMsg, 'error');
                }
            })

            // Show a success message
/*
            showNotification('Account created successfully! Please check your email for verification.', 'success');
*/

           /* // Optionally redirect to login page
            setTimeout(() => {
                window.location.href = 'signIn.html';
            }, 2000);*/

        }, 2000);
    });

    // Add smooth animations to form elements
    const formGroups = document.querySelectorAll('.form-group');
    formGroups.forEach((group, index) => {
        group.style.animationDelay = `${index * 0.1}s`;
        group.classList.add('animate-fade-in');
    });
});

// Add CSS for notifications and animations
const additionalCSS = `
/* Notification Styles */
.notification {
    position: fixed;
    top: 20px;
    right: 20px;
    z-index: 1000;
    max-width: 400px;
    background: var(--white);
    border-radius: var(--border-radius);
    box-shadow: var(--shadow);
    border-left: 4px solid var(--primary-color);
    animation: slideInRight 0.3s ease-out;
}

.notification.error {
    border-left-color: #EF4444;
}

.notification-content {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 1rem;
}

.notification-content i:first-child {
    color: var(--primary-color);
    font-size: 1.25rem;
}

.notification.error .notification-content i:first-child {
    color: #EF4444;
}

.notification-content span {
    flex: 1;
    font-size: 0.875rem;
    color: var(--gray-700);
}

.notification-close {
    background: none;
    border: none;
    color: var(--gray-400);
    cursor: pointer;
    padding: 0.25rem;
    border-radius: 4px;
    transition: var(--transition);
}

.notification-close:hover {
    color: var(--gray-600);
    background: var(--gray-100);
}

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

/* Additional form styles */
.terms-agreement, .newsletter-signup {
    display: flex;
    align-items: flex-start;
    gap: 0.5rem;
    font-size: 0.875rem;
    line-height: 1.5;
}

.terms-agreement input[type="checkbox"], 
.newsletter-signup input[type="checkbox"] {
    margin-top: 0.125rem;
    accent-color: var(--primary-color);
}

.terms-agreement label, 
.newsletter-signup label {
    color: var(--gray-600);
    cursor: pointer;
}

.terms-link {
    color: var(--primary-color);
    text-decoration: none;
    font-weight: 500;
}

.terms-link:hover {
    color: var(--primary-dark);
    text-decoration: underline;
}

/* Form animation */
.animate-fade-in {
    opacity: 0;
    transform: translateY(20px);
    animation: fadeInUp 0.6s ease-out forwards;
}

@keyframes fadeInUp {
    to {
        opacity: 1;
        transform: translateY(0);
    }
}
`;

// Inject additional CSS
const style = document.createElement('style');
style.textContent = additionalCSS;
document.head.appendChild(style);