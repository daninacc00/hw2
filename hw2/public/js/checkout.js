// checkout.js - Integrazione Square Payment seguendo le slide del corso

document.addEventListener('DOMContentLoaded', function() {
    initializeSquarePayments();
});

async function initializeSquarePayments() {
    // Inizializza Square (usa le tue credenziali sandbox)
    const payments = Square.payments('sandbox-sq0idb-MVXKt0GG8PPWtdhpsXUAYA', 'LQXXVMJNF3ZKE');
    
    let card;
    
    try {
        // Crea il form della carta
        card = await payments.card();
        await card.attach('#card-container');
        
        console.log('Square Payment Form inizializzato');
    } catch (e) {
        console.error('Errore inizializzazione Square:', e);
        showPaymentStatus('Errore nel caricamento del form di pagamento. Serve HTTPS per Square SDK.', 'error');
        return;
    }

    // Gestione submit del form
    const form = document.getElementById('checkout-form');
    const payButton = document.getElementById('pay-button');
    
    form.addEventListener('submit', async function(event) {
        event.preventDefault(); // Come visto nelle slide per bloccare submit normale
        
        // Validazione form di fatturazione
        if (!validateBillingForm()) {
            return;
        }
        
        payButton.disabled = true;
        payButton.textContent = 'Processando...';
        
        try {
            // Tokenizza la carta usando Square
            const result = await card.tokenize();
            
            if (result.status === 'OK') {
                console.log('Token Square ricevuto:', result.token);
                // Processa il pagamento
                await processPayment(result.token);
            } else {
                console.error('Errore tokenizzazione:', result.errors);
                showPaymentStatus('Errore nei dati della carta', 'error');
            }
        } catch (e) {
            console.error('Errore durante il pagamento:', e);
            showPaymentStatus('Errore durante il pagamento', 'error');
        }
        
        payButton.disabled = false;
        payButton.textContent = 'Paga €' + getTotalAmount();
    });
}

// Versione mock per testing locale (seguendo le slide con form semplice)
function initializeMockSquarePayments() {
    const cardContainer = document.getElementById('card-container');
    
    // Crea form carta mock per testing locale
    cardContainer.innerHTML = `
        <div class="card-form-mock">
            <h3>Form Carta - Modalità Test Locale</h3>
            <div class="form-group">
                <label>Numero Carta</label>
                <input type="text" id="mock-card-number" placeholder="4111 1111 1111 1111" value="4111 1111 1111 1111">
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label>MM/YY</label>
                    <input type="text" id="mock-expiry" placeholder="12/25" value="12/25">
                </div>
                <div class="form-group">
                    <label>CVV</label>
                    <input type="text" id="mock-cvv" placeholder="123" value="123">
                </div>
            </div>
            <p class="test-note">🧪 Modalità test locale - Nessuna carta reale sarà addebitata</p>
        </div>
    `;
    
    console.log('Mock Square Payment Form inizializzato per ambiente locale');
    
    // Gestione submit del form per ambiente locale
    const form = document.getElementById('checkout-form');
    const payButton = document.getElementById('pay-button');
    
    form.addEventListener('submit', async function(event) {
        event.preventDefault();
        
        if (!validateBillingForm()) {
            return;
        }
        
        payButton.disabled = true;
        payButton.textContent = 'Processando...';
        
        try {
            // Simula tokenizzazione carta per test locale
            const mockToken = 'mock_token_' + Date.now();
            console.log('Mock Token generato:', mockToken);
            
            // Processa il pagamento con token mock
            await processPayment(mockToken);
            
        } catch (e) {
            console.error('Errore durante il pagamento mock:', e);
            showPaymentStatus('Errore durante il pagamento', 'error');
        }
        
        payButton.disabled = false;
        payButton.textContent = 'Paga €' + getTotalAmount();
    });
}

function validateBillingForm() {
    const requiredFields = ['billing_name', 'billing_email', 'billing_address'];
    
    for (let field of requiredFields) {
        const input = document.getElementById(field);
        if (!input.value.trim()) {
            showPaymentStatus('Compila tutti i campi obbligatori', 'error');
            input.focus();
            return false;
        }
    }
    
    // Validazione email semplice
    const email = document.getElementById('billing_email').value;
    if (!email.includes('@') || !email.includes('.')) {
        showPaymentStatus('Inserisci un indirizzo email valido', 'error');
        return false;
    }
    
    return true;
}

async function processPayment(paymentToken) {
    // Raccogli dati form
    const billingData = {
        name: document.getElementById('billing_name').value,
        email: document.getElementById('billing_email').value,
        address: document.getElementById('billing_address').value
    };
    
    // Prepara dati per invio al server PHP (come visto nelle slide)
    const formData = new FormData();
    formData.append('payment_token', paymentToken);
    formData.append('billing_name', billingData.name);
    formData.append('billing_email', billingData.email);
    formData.append('billing_address', billingData.address);
    
    // Aggiungi CSRF token (come mostrato nelle slide)
    const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
    formData.append('_token', csrfToken);
    
    try {
        // Chiamata fetch al server Laravel (come visto nelle slide)
        const response = await fetch('/api/checkout/process', {
            method: 'POST',
            body: formData
        });
        
        if (!response.ok) {
            throw new Error('Errore HTTP: ' + response.status);
        }
        
        const result = await response.json();
        
        console.log('Risposta server:', result);
        
        if (result.success) {
            showPaymentStatus('Pagamento completato con successo!', 'success');
            
            // Reindirizza alla pagina ordini dopo 2 secondi
            setTimeout(() => {
                window.location.href = '/account/orders';
            }, 2000);
        } else {
            showPaymentStatus(result.message || 'Errore durante il pagamento', 'error');
        }
        
    } catch (error) {
        console.error('Errore chiamata server:', error);
        showPaymentStatus('Errore di connessione', 'error');
    }
}

function showPaymentStatus(message, type) {
    const statusDiv = document.getElementById('payment-status');
    statusDiv.textContent = message;
    statusDiv.className = type;
    statusDiv.style.display = 'block';
    
    // Nascondi il messaggio dopo 5 secondi se è un errore
    if (type === 'error') {
        setTimeout(() => {
            statusDiv.style.display = 'none';
        }, 5000);
    }
}

function getTotalAmount() {
    // Estrae il totale dal testo del bottone
    const button = document.getElementById('pay-button');
    const match = button.textContent.match(/€([\d.,]+)/);
    return match ? match[1] : '0.00';
}