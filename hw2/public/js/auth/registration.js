function validateUsername() {
    const username = usernameField.value.trim();

    if (username === '') {
        showError(usernameField, 'Username è obbligatorio');
        return false;
    }

    if (username.length < 3) {
        showError(usernameField, 'Username deve contenere almeno 3 caratteri');
        return false;
    }

    removeError(usernameField);
    return true;
}

function validateEmail() {
    const email = emailField.value.trim();

    if (email === '') {
        showError(emailField, 'Email è obbligatoria');
        return false;
    }

     if (!isValidEmail(email)) {
        showError(emailField, 'Inserisci un indirizzo email valido');
        return false;
    }

    removeError(emailField);
    return true;
}

function validatePassword() {
    const password = passwordField.value;

    if (password === '') {
        showError(passwordField, 'Password è obbligatoria');
        return false;
    }

    if (!isValidPassword(password)) {
        showError(passwordField, 'Password non valida. Verifica i requisiti');
        return false;
    }

    removeError(passwordField);
    return true;
}

function validateConfirmPassword() {
    const password = passwordField.value;
    const confirmPassword = confirmField.value;

    if (confirmPassword === '') {
        showError(confirmField, 'Conferma password è obbligatoria');
        return false;
    }

    if (confirmPassword !== password) {
        showError(confirmField, 'Le password non corrispondono');
        return false;
    }

    removeError(confirmField);
    return true;
}

function validate() {
    const isUsernameValid = validateUsername();
    const isEmailValid = validateEmail();
    const isPasswordValid = validatePassword();
    const isConfirmPasswordValid = validateConfirmPassword();

    return isUsernameValid && isEmailValid && isPasswordValid && isConfirmPasswordValid;
}

function setFormLoading(loading) {
    const submitBtn = registerForm.querySelector('button[type="submit"]');
    const inputs = registerForm.querySelectorAll('input');

    if (loading) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Registrazione in corso...';
        inputs.forEach(function(input) {
            input.disabled = true;
        });
    } else {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Registrati';
        inputs.forEach(function(input) {
            input.disabled = false;
        });
    }
}

function onJsonResponse(data) {
    if (data.success) {
        window.location.href = '/login';
    } else {
        onError(data.message);
    }
}

function handleRegister(e) {
    e.preventDefault();

    hideGlobalError();

    if (!validate()) {
        showGlobalError('Correggi i campi evidenziati prima di continuare');
        return;
    }

    setFormLoading(true);

    const csrf_token = document.querySelector('meta[name="csrf-token"]').content;

    const formData = new FormData();
    formData.append('username', document.getElementById('username').value);
    formData.append('email', document.getElementById('email').value);
    formData.append('nome', document.getElementById('nome').value);
    formData.append('cognome', document.getElementById('cognome').value);
    formData.append('password', document.getElementById('password').value);
    formData.append('password_confirm', document.getElementById('password_confirm').value);
    formData.append('_token', csrf_token);

    fetch('/register', {
        method: 'POST',
        body: formData
    })
        .then(onResponse)
        .then(onJsonResponse)
        .catch(onError)
        .finally(function (){
            setFormLoading(false);
        });
}

const usernameField = document.getElementById('username');
const emailField = document.getElementById('email');
const passwordField = document.getElementById('password');
if (passwordField) {
    passwordField.addEventListener('input', function () {
        validatePasswordStrength(passwordField.value);
    });
}

const confirmField = document.getElementById('password_confirm');
if (confirmField && passwordField) {
    confirmField.addEventListener('input', function () {
        if (confirmField.value !== passwordField.value) {
            showError(confirmField, 'Le password non corrispondono');
        } else {
            removeError(confirmField);
        }
    });
}

const registerForm = document.getElementById('registerForm');
registerForm.addEventListener('submit', handleRegister);