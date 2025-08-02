initializeSquarePayments();

function initializeSquarePayments() {
    if (typeof Square !== 'undefined') {
        initializeRealSquarePayments();
    } else {
        initializeMockSquarePayments();
    }
}

function initializeRealSquarePayments() {
    const payments = Square.payments('sandbox-sq0idb-MVXKt0GG8PPWtdhpsXUAYA', 'LQXXVMJNF3ZKE');
    
    let card;
    
    payments.card()
        .then(function(cardResult) {
            card = cardResult;
            return card.attach('#card-container');
        })
        .then(function() {
            console.log('Square Payment Form inizializzato');
        })
        .catch(function(e) {
            console.error('Errore inizializzazione Square:', e);
            showPaymentStatus('Errore nel caricamento del form di pagamento. Serve HTTPS per Square SDK.', 'error');
            return;
        });

    const form = document.getElementById('checkout-form');
    const payButton = document.getElementById('pay-button');
    
    form.addEventListener('submit', function(event) {
        event.preventDefault();
        
        if (!validateBillingForm()) {
            return;
        }
        
        payButton.disabled = true;
        payButton.textContent = 'Processando...';
        
        card.tokenize()
            .then(function(result) {
                if (result.status === 'OK') {
                    console.log('Token Square ricevuto:', result.token);
                    processPayment(result.token);
                } else {
                    console.error('Errore tokenizzazione:', result.errors);
                    showPaymentStatus('Errore nei dati della carta', 'error');
                }
            })
            .catch(function(e) {
                console.error('Errore durante il pagamento:', e);
                showPaymentStatus('Errore durante il pagamento', 'error');
            })
            .finally(function() {
                payButton.disabled = false;
                payButton.textContent = 'Paga €' + getTotalAmount();
            });
    });
}

function initializeMockSquarePayments() {
    const cardContainer = document.getElementById('card-container');
    
    cardContainer.innerHTML = '';

    const cardFormMock = document.createElement('div');
    cardFormMock.className = 'card-form-mock';

    const title = document.createElement('h3');
    title.textContent = 'Form Carta - Modalità Test Locale';

    const formGroup1 = document.createElement('div');
    formGroup1.className = 'form-group';
    const label1 = document.createElement('label');
    label1.textContent = 'Numero Carta';
    const input1 = document.createElement('input');
    input1.type = 'text';
    input1.id = 'mock-card-number';
    input1.placeholder = '4111 1111 1111 1111';
    input1.value = '4111 1111 1111 1111';
    formGroup1.appendChild(label1);
    formGroup1.appendChild(input1);

    const formRow = document.createElement('div');
    formRow.className = 'form-row';

    const formGroup2 = document.createElement('div');
    formGroup2.className = 'form-group';
    const label2 = document.createElement('label');
    label2.textContent = 'MM/YY';
    const input2 = document.createElement('input');
    input2.type = 'text';
    input2.id = 'mock-expiry';
    input2.placeholder = '12/25';
    input2.value = '12/25';
    formGroup2.appendChild(label2);
    formGroup2.appendChild(input2);

    const formGroup3 = document.createElement('div');
    formGroup3.className = 'form-group';
    const label3 = document.createElement('label');
    label3.textContent = 'CVV';
    const input3 = document.createElement('input');
    input3.type = 'text';
    input3.id = 'mock-cvv';
    input3.placeholder = '123';
    input3.value = '123';
    formGroup3.appendChild(label3);
    formGroup3.appendChild(input3);

    formRow.appendChild(formGroup2);
    formRow.appendChild(formGroup3);

    const testNote = document.createElement('p');
    testNote.className = 'test-note';
    testNote.textContent = '🧪 Modalità test locale - Nessuna carta reale sarà addebitata';

    cardFormMock.appendChild(title);
    cardFormMock.appendChild(formGroup1);
    cardFormMock.appendChild(formRow);
    cardFormMock.appendChild(testNote);
    cardContainer.appendChild(cardFormMock);
    
    console.log('Mock Square Payment Form inizializzato per ambiente locale');
    
    const form = document.getElementById('checkout-form');
    const payButton = document.getElementById('pay-button');
    
    form.addEventListener('submit', function(event) {
        event.preventDefault();
        
        if (!validateBillingForm()) {
            return;
        }
        
        payButton.disabled = true;
        payButton.textContent = 'Processando...';
        
        const mockToken = 'mock_token_' + Date.now();
        console.log('Mock Token generato:', mockToken);
        
        processPayment(mockToken)
            .finally(function() {
                payButton.disabled = false;
                payButton.textContent = 'Paga €' + getTotalAmount();
            });
    });
}

function validateBillingForm() {
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

function processPayment(paymentToken) {
    const billingData = {
        name: document.getElementById('billing_name').value,
        email: document.getElementById('billing_email').value,
        address: document.getElementById('billing_address').value
    };
    
    const formData = new FormData();
    formData.append('payment_token', paymentToken);
    formData.append('billing_name', billingData.name);
    formData.append('billing_email', billingData.email);
    formData.append('billing_address', billingData.address);
    
    const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
    formData.append('_token', csrfToken);
    
    return fetch('/api/checkout/process', {
        method: 'POST',
        body: formData
    })
        .then(function(response) {
            if (!response.ok) {
                throw new Error('Errore HTTP: ' + response.status);
            }
            return response.json();
        })
        .then(function(result) {
            console.log('Risposta server:', result);
            
            if (result.success) {
                showPaymentStatus('Pagamento completato con successo!', 'success');
                
                setTimeout(function() {
                    window.location.href = '/account/orders';
                }, 2000);
            } else {
                showPaymentStatus(result.message || 'Errore durante il pagamento', 'error');
            }
        })
        .catch(function(error) {
            console.error('Errore chiamata server:', error);
            showPaymentStatus('Errore di connessione', 'error');
        });
}

function showPaymentStatus(message, type) {
    const statusDiv = document.getElementById('payment-status');
    statusDiv.textContent = message;
    statusDiv.className = type;
    statusDiv.style.display = 'block';
    
    if (type === 'error') {
        setTimeout(function() {
            statusDiv.style.display = 'none';
        }, 5000);
    }
}

function getTotalAmount() {
    const button = document.getElementById('pay-button');
    const match = button.textContent.match(/€([\d.,]+)/);
    return match ? match[1] : '0.00';
}