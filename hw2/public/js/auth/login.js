function validateUsername() {
    const username = usernameField.value.trim();

    if (username === '') {
        showError(usernameField, 'Email è obbligatoria');
        return false;
    }

    if (!isValidEmail(username)) {
        showError(usernameField, 'Inserisci un indirizzo email valido');
        return false;
    }

    removeError(usernameField);
    return true;
}

function validatePassword() {
    const password = passwordField.value;

    if (password === '') {
        showError(passwordField, 'Password è obbligatoria');
        return false;
    }

    removeError(passwordField);
    return true;
}

function validate() {
    const isUsernameValid = validateUsername();
    const isPasswordValid = validatePassword();

    return isUsernameValid && isPasswordValid;
}

function setFormLoading(loading) {
    const submitBtn = loginForm.querySelector('button[type="submit"]');
    const inputs = loginForm.querySelectorAll('input');

    if (loading) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Accesso in corso...';
        inputs.forEach(input => input.disabled = true);
    } else {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Accedi';
        inputs.forEach(input => input.disabled = false);
    }
}

function onJsonResponse(data) {
    if (data.success) {
        window.location.href = '/';
    } else {
        onError(data.message);
    }
}

function handleLogin(e) {
    e.preventDefault();

    hideGlobalError();

    if (!validate()) {
        showGlobalError('Correggi i campi evidenziati prima di continuare');
        return;
    }

    setFormLoading(true);

    const csrf_token = document.querySelector('meta[name="csrf-token"]').content;

    const formData = new FormData();
    formData.append('username', usernameField.value.trim());
    formData.append('password', passwordField.value);
    formData.append('_token', csrf_token);

    fetch('/login', {
        method: 'POST',
        body: formData
    })
        .then(onResponse)
        .then(onJsonResponse)
        .catch(onError)
        .finally(() => {
            setFormLoading(false);
        });
}

const usernameField = document.getElementById('username');
const passwordField = document.getElementById('password');
const loginForm = document.getElementById('loginForm');

loginForm.addEventListener('submit', handleLogin);