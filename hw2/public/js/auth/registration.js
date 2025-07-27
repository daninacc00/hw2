const passwordField = document.getElementById('password');
const confirmField = document.getElementById('password_confirm');
const registerForm = document.getElementById('registerForm');
registerForm.addEventListener('submit', handleRegister);

if (passwordField) {
    passwordField.addEventListener('input', function () {
        validatePasswordStrength(passwordField.value);
    });
}

if (confirmField && passwordField) {
    confirmField.addEventListener('input', function () {
        if (confirmField.value !== passwordField.value) {
            showError(confirmField, 'Le password non corrispondono');
        } else {
            removeError(confirmField);
        }
    });
}

function validate() {
    let isValid = true;

    const username = document.getElementById('username');
    if (username.value.trim() === '') {
        showError(username, 'Username è obbligatorio');
        isValid = false;
    } else if (username.value.trim().length < 3) {
        showError(username, 'Username deve contenere almeno 3 caratteri');
        isValid = false;
    } else {
        removeError(username);
    }

    const email = document.getElementById('email');
    if (email.value.trim() === '') {
        showError(email, 'Email è obbligatoria');
        isValid = false;
    } else if (!isValidEmail(email.value.trim())) {
        showError(email, 'Email non valida');
        isValid = false;
    } else {
        removeError(email);
    }

    if (passwordField.value === '') {
        showError(passwordField, 'Password è obbligatoria');
        isValid = false;
    } else if (!isValidPassword(passwordField.value)) {
        showError(passwordField, 'Password non valida. Verifica i requisiti.');
        isValid = false;
    } else {
        removeError(passwordField);
    }

    if (confirmField.value === '') {
        showError(confirmField, 'Conferma password è obbligatoria');
        isValid = false;
    } else if (confirmField.value !== passwordField.value) {
        showError(confirmField, 'Le password non corrispondono');
        isValid = false;
    } else {
        removeError(confirmField);
    }

    return isValid;
}

function onResponse(data) {
    console.log(data);
    if (data.success) {
        window.location.href = '/pages/login/login.php';
    } else {
        onError(data.message);
    }
}

function onError(message) {
    console.error('Errore:', message);

    const errorMessage = document.querySelector(".error-message");
    if (errorMessage) {
        errorMessage.innerHTML = "";
        errorMessage.classList.remove("hidden");

        const messageText = document.createElement("span");
        messageText.textContent = message;

        errorMessage.appendChild(messageText);
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function handleRegister(e) {
    e.preventDefault();

    if (!validate()) {
        return;
    }

    const csrf_token = document.querySelector('meta[name="csrf-token"]').content;

    const formData = new FormData();
    formData.append('username', document.getElementById('username').value);
    formData.append('email', document.getElementById('email').value);
    formData.append('nome', document.getElementById('nome').value);
    formData.append('cognome', document.getElementById('cognome').value);
    formData.append('password', document.getElementById('password').value);
    formData.append('password_confirm', document.getElementById('password_confirm').value);
    formData.append('password_confirm', document.getElementById('password_confirm').value);
    formData.append('_token', csrf_token); // Campo _token richiesto da Laravel

    fetch('/register', {
        method: 'POST',
        body: formData
    })
        .then(response => response.json())
        .then(onResponse)
        .catch(onError);
}