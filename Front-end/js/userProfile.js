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