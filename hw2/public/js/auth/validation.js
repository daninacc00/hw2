function showError(input, message) {
    input.classList.add('error');

    const existingError = input.parentNode.querySelector('.error-text');
    if (existingError) {
        existingError.remove();
    }

    const errorSpan = document.createElement('span');
    errorSpan.className = 'error-text';
    errorSpan.textContent = message;
    input.parentNode.appendChild(errorSpan);
}

function removeError(input) {
    input.classList.remove('error');

    const existingError = input.parentNode.querySelector('.error-text');
    if (existingError) {
        existingError.remove();
    }
}

function isValidEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

function isValidPassword(password) {
    const minLength = 8;
    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecial = /[^a-zA-Z0-9]/.test(password);

    return password.length >= minLength && hasUpper && hasLower && hasNumber && hasSpecial;
}

function validatePasswordStrength(password) {
    const checks = {
        length: password.length >= 8,
        uppercase: /[A-Z]/.test(password),
        lowercase: /[a-z]/.test(password),
        number: /[0-9]/.test(password),
        special: /[^a-zA-Z0-9]/.test(password)
    };

    for (const [key, isValid] of Object.entries(checks)) {
        const container = document.getElementById(key);

        const existingIcon = container.querySelector("i");
        if (existingIcon){
            existingIcon.className = `fa-solid ${isValid ? "fa-check" : "fa-xmark"}`
        }

        container.classList.toggle('valid', isValid);
    }
}