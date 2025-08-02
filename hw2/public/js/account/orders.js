
const detailButtons = document.querySelectorAll('.view-details-btn');

for (let i = 0; i < detailButtons.length; i++) {
    const button = detailButtons[i];
    button.addEventListener('click', function (event) {
        const orderId = event.target.getAttribute('data-order-id');
        toggleOrderItems(orderId);
    });
}

function toggleOrderItems(orderId) {
    const itemsDiv = document.getElementById('order-items-' + orderId);
    const button = document.querySelector('.view-details-btn[data-order-id="' + orderId + '"]');

    if (itemsDiv.style.display === 'none') {
        // Mostra dettagli
        itemsDiv.style.display = 'block';
        button.textContent = 'Nascondi Dettagli';

        // Carica i prodotti se non sono già stati caricati
        const container = itemsDiv.querySelector('.items-container');
        if (!container.hasAttribute('data-loaded')) {
            loadOrderItems(orderId);
        }
    } else {
        // Nascondi dettagli
        itemsDiv.style.display = 'none';
        button.textContent = 'Vedi Dettagli';
    }
}

function loadOrderItems(orderId) {
    const container = document.querySelector('.items-container[data-order-id="' + orderId + '"]');

    // Mostra loading
    container.innerHTML = '<div class="loading">Caricamento prodotti...</div>';

    // Chiamata fetch per recuperare i prodotti (seguendo le slide)
    fetch('/api/orders/items?order_id=' + orderId)
        .then(function (response) {
            if (!response.ok) {
                throw new Error('Errore HTTP: ' + response.status);
            }
            return response.json();
        })
        .then(function (result) {
            console.log('Prodotti ordine ricevuti:', result);

            if (result.success && result.items) {
                displayOrderItems(container, result.items);
                container.setAttribute('data-loaded', 'true');
            } else {
                container.innerHTML = '<div class="loading">Errore nel caricamento dei prodotti</div>';
            }
        })
        .catch(function (error) {
            console.error('Errore nel caricamento prodotti ordine:', error);
            container.innerHTML = '<div class="loading">Errore di connessione</div>';
        });
}

function displayOrderItems(container, items) {
    if (items.length === 0) {
        container.innerHTML = '<div class="loading">Nessun prodotto trovato</div>';
        return;
    }

    let html = '';

    for (let i = 0; i < items.length; i++) {
        const item = items[i];

        html += '<div class="item-detail">';

        // Immagine prodotto
        if (item.image_url) {
            html += '<img src="' + item.image_url + '" alt="' + item.product_name + '">';
        } else {
            html += '<div class="no-image">Nessuna immagine</div>';
        }

        // Info prodotto
        html += '<div class="item-info">';
        html += '<h5>' + item.product_name + '</h5>';

        if (item.color_name) {
            html += '<p>Colore: ' + item.color_name + '</p>';
        }

        if (item.size_name) {
            html += '<p>Taglia: ' + item.size_name + '</p>';
        }

        html += '<p>Quantità: ' + item.quantity + '</p>';
        html += '</div>';

        // Prezzo
        const totalPrice = item.price * item.quantity;
        html += '<div class="item-price">€' + totalPrice.toFixed(2) + '</div>';

        html += '</div>';
    }

    container.innerHTML = html;
}

// Funzione di utilità per formattare i prezzi
function formatPrice(price) {
    return parseFloat(price).toFixed(2);
}