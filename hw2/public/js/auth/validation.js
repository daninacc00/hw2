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

    for (const key in checks) {
        if (checks.hasOwnProperty(key)) {
            const isValid = checks[key];
            const container = document.getElementById(key);

            const existingIcon = container.querySelector("i");
            if (existingIcon){
                existingIcon.className = "fa-solid " + (isValid ? "fa-check" : "fa-xmark");
            }

            container.classList.toggle('valid', isValid);
        }
    }
}