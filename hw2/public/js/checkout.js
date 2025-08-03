// ========== CONSTANTS ==========
const SQUARE_APPLICATION_ID = 'sandbox-sq0idb-MVXKt0GG8PPWtdhpsXUAYA';
const SQUARE_LOCATION_ID = 'LQXXVMJNF3ZKE';

const REQUIRED_FIELDS = ['billing_name', 'billing_email', 'billing_address'];

// ========== VARIABLES ==========
let card;

// ========== UTILITY FUNCTIONS ==========
function getTotalAmount() {
    const button = document.getElementById('pay-button');
    const match = button.textContent.match(/€([\d.,]+)/);
    return match ? match[1] : '0.00';
}

function showPaymentStatus(message, type) {
    const statusDiv = document.getElementById('payment-status');
    statusDiv.textContent = message;
    statusDiv.className = type;
    statusDiv.style.display = 'block';
}

function hidePaymentStatus() {
    const statusDiv = document.getElementById('payment-status');
    statusDiv.style.display = 'none';
}

function updatePayButtonState(isProcessing) {
    const payButton = document.getElementById('pay-button');

    if (isProcessing) {
        payButton.disabled = true;
        payButton.textContent = 'Processando...';
    } else {
        payButton.disabled = false;
        payButton.textContent = 'Paga €' + getTotalAmount();
    }
}

function validateEmail(email) {
    return email.includes('@') && email.includes('.');
}

function validateRequiredField(fieldId) {
    const input = document.getElementById(fieldId);
    if (!input.value.trim()) {
        showPaymentStatus('Compila tutti i campi obbligatori', 'error');
        input.focus();
        return false;
    }
    return true;
}

function validateForm() {
    for (let i = 0; i < REQUIRED_FIELDS.length; i++) {
        const field = REQUIRED_FIELDS[i];
        if (!validateRequiredField(field)) {
            return false;
        }
    }

    const email = document.getElementById('billing_email').value;
    if (!validateEmail(email)) {
        showPaymentStatus('Inserisci un indirizzo email valido', 'error');
        return false;
    }

    return true;
}

function buildPaymentFormData(paymentToken) {
    const formData = new FormData();
    formData.append('payment_token', paymentToken);
    formData.append('billing_name', document.getElementById('billing_name').value);
    formData.append('billing_email', document.getElementById('billing_email').value);
    formData.append('billing_address', document.getElementById('billing_address').value);
    formData.append('_token', getCsrfToken());
    return formData;
}

// ========== API CALL ==========
function processPayment(paymentToken) {
    const formData = buildPaymentFormData(paymentToken);

    return fetch('/api/checkout/process', {
        method: 'POST',
        body: formData
    })
        .then(onResponse)
        .then(function (result) {
            if (!result) return;

            if (result.success) {
                showPaymentStatus('Pagamento completato con successo!', 'success');
                window.location.href = '/account/orders';
            } else {
                showPaymentStatus(result.message || 'Errore durante il pagamento', 'error');
            }
        })
        .catch(function (error) {
            console.error('Errore chiamata server:', error);
            showPaymentStatus('Errore di connessione', 'error');
        });
}

function handleCardTokenization(result) {
    if (result.status === 'OK') {
        processPayment(result.token);
    } else {
        showPaymentStatus('Errore nei dati della carta', 'error');
    }
}

function handlePayment() {
    updatePayButtonState(true);

    card.tokenize()
        .then(handleCardTokenization)
        .catch(function (error) {
            console.error('Errore durante il pagamento:', error);
            showPaymentStatus('Errore durante il pagamento', 'error');
        })
        .finally(function () {
            updatePayButtonState(false);
        });
}

// ========== SQUARE SDK INITIALIZATION ==========
function handleSquareInitializationError(error) {
    console.error('Errore inizializzazione Square:', error);
    showPaymentStatus('Errore nel caricamento del form di pagamento.', 'error');
}

function handleCardAttachSuccess(cardResult) {
    card = cardResult;
    return card.attach('#card-container');
}

function initializeSquarePayments() {
    if (typeof Square === 'undefined') {
        showPaymentStatus('Errore: Square SDK non disponibile. Impossibile processare pagamenti.', 'error');
        return;
    }

    const payments = Square.payments(SQUARE_APPLICATION_ID, SQUARE_LOCATION_ID);

    payments.card()
        .then(handleCardAttachSuccess)
        .catch(handleSquareInitializationError);
}

function handleProcessPayment(event) {
    event.preventDefault();

    if (!validateForm()) {
        return;
    }

    handlePayment();
}

const form = document.getElementById('checkout-form');
if (form) {
    form.addEventListener('submit', handleProcessPayment);
}

function initialize() {
    initializeSquarePayments();
}

initialize();