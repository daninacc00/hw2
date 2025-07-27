function onError(message) {
    console.error('Errore login:', message);
    showGlobalError(message);
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function onResponse(response) {
    if (response.status === 419) {
        throw new Error('Sessione scaduta. Ricarica la pagina e riprova.');
    }
    return response.json();
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