// ===== FUNZIONI DI VALIDAZIONE =====

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

    if (password.length < 6) {
        showError(passwordField, 'Password troppo corta');
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

// ===== FUNZIONI DI GESTIONE ERRORI =====

function showGlobalError(message) {
    const errorContainer = document.querySelector('.error-message');
    if (errorContainer) {
        const errorText = document.createElement("span");
        errorText.textContent = message;

        errorContainer.innerHTML = ''; // Pulisci errori precedenti
        errorContainer.append(errorText);
        errorContainer.classList.remove('hidden');
    }
}

function hideGlobalError() {
    const errorContainer = document.querySelector('.error-message');
    if (errorContainer) {
        errorContainer.classList.add('hidden');
        errorContainer.innerHTML = '';
    }
}

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

// ===== FUNZIONI DI SUPPORTO =====

function isValidEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
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
        submitBtn.textContent = 'Continua';
        inputs.forEach(input => input.disabled = false);
    }
}

// ===== FUNZIONI DI GESTIONE RISPOSTA =====

function onResponse(data) {
    if (data.success) {
        // Redirect alla homepage di Laravel (non a un file PHP statico)
        window.location.href = '/';
    } else {
        onError(data.message);
    }
}

function onError(message) {
    console.error('Errore login:', message);
    showGlobalError(message);
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ===== FUNZIONE PRINCIPALE LOGIN =====

function handleLogin(e) {
    e.preventDefault();
    
    // Nascondi eventuali errori globali precedenti
    hideGlobalError();
    
    // Valida tutti i campi
    if (!validate()) {
        showGlobalError('Correggi i campi evidenziati prima di continuare');
        return;
    }
    
    // Disabilita il form durante l'invio
    setFormLoading(true);
    
    // Leggi il token CSRF dal meta tag (come visto nelle slide)
    const csrf_token = document.querySelector('meta[name="csrf-token"]').content;
    
    // Crea FormData con i dati del form
    const formData = new FormData();
    formData.append('username', usernameField.value.trim());
    formData.append('password', passwordField.value); // CORRETTO: era 'passwo' 
    formData.append('_token', csrf_token); // Campo _token richiesto da Laravel
    
    console.log('=== DATI INVIATI ===');
    for (let [key, value] of formData.entries()) {
        console.log(`${key}: "${value}"`);
    }
    
    // Invia richiesta seguendo le specifiche delle slide
    fetch('/login', {
        method: 'POST',
        body: formData,
        headers: {
            'Accept': 'application/json',
            'X-Requested-With': 'XMLHttpRequest'
        }
    })
    .then(response => {
        if (response.status === 419) {
            throw new Error('Sessione scaduta. Ricarica la pagina e riprova.');
        }
        return response.json();
    })
    .then(onResponse)
    .catch(error => {
        console.error('Errore:', error);
        onError(error.message || 'Errore di connessione. Riprova.');
    })
    .finally(() => {
        setFormLoading(false);
    });
}

// ===== INIZIALIZZAZIONE =====

const usernameField = document.getElementById('username');
const passwordField = document.getElementById('password');
const loginForm = document.getElementById('loginForm');

loginForm.addEventListener('submit', handleLogin);