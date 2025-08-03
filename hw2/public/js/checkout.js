let card;

function showPaymentStatus(message, type) {
    const statusDiv = document.getElementById('payment-status');
    statusDiv.textContent = message;
    statusDiv.className = type;
    statusDiv.style.display = 'block';
}

function getTotalAmount() {
    const button = document.getElementById('pay-button');
    const match = button.textContent.match(/€([\d.,]+)/);
    return match ? match[1] : '0.00';
}

function processPayment(paymentToken) {
    const formData = new FormData();
    formData.append('payment_token', paymentToken);
    formData.append('billing_name', document.getElementById('billing_name').value);
    formData.append('billing_email', document.getElementById('billing_email').value);
    formData.append('billing_address', document.getElementById('billing_address').value);
    formData.append('_token', getCsrfToken());

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

function validateForm() {
    const requiredFields = ['billing_name', 'billing_email', 'billing_address'];
    for (let i = 0; i < requiredFields.length; i++) {
        const field = requiredFields[i];
        const input = document.getElementById(field);
        if (!input.value.trim()) {
            showPaymentStatus('Compila tutti i campi obbligatori', 'error');
            input.focus();
            return false;
        }
    }

    const email = document.getElementById('billing_email').value;
    if (!email.includes('@') || !email.includes('.')) {
        showPaymentStatus('Inserisci un indirizzo email valido', 'error');
        return false;
    }

    return true;
}

function handlePayment(card, payButton) {
    payButton.disabled = true;
    payButton.textContent = 'Processando...';

    card.tokenize()
        .then(function (result) {
            if (result.status === 'OK') {
                processPayment(result.token);
            } else {
                showPaymentStatus('Errore nei dati della carta', 'error');
            }
        })
        .catch(function (e) {
            console.error('Errore durante il pagamento:', e);
            showPaymentStatus('Errore durante il pagamento', 'error');
        })
        .finally(function () {
            payButton.disabled = false;
            payButton.textContent = 'Paga €' + getTotalAmount();
        });
}

function handleProcessPayment(event) {
    event.preventDefault();

    if (!validateForm()) {
        return;
    }

    handlePayment(card, payButton);
}

const form = document.getElementById('checkout-form');
form.addEventListener('submit', handleProcessPayment);

const payButton = document.getElementById('pay-button');

if (typeof Square === 'undefined') {
    showPaymentStatus('Errore: Square SDK non disponibile. Impossibile processare pagamenti.', 'error');
}

const payments = Square.payments('sandbox-sq0idb-MVXKt0GG8PPWtdhpsXUAYA', 'LQXXVMJNF3ZKE');
payments.card()
    .then(function (cardResult) {
        card = cardResult;
        return card.attach('#card-container');
    })
    .catch(function (e) {
        console.error('Errore inizializzazione Square:', e);
        showPaymentStatus('Errore nel caricamento del form di pagamento.', 'error');
        return;
    });
