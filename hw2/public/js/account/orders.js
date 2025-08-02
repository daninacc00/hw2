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
        itemsDiv.style.display = 'block';
        button.textContent = 'Nascondi Dettagli';

        const container = itemsDiv.querySelector('.items-container');
        if (!container.hasAttribute('data-loaded')) {
            loadOrderItems(orderId);
        }
    } else {
        itemsDiv.style.display = 'none';
        button.textContent = 'Vedi Dettagli';
    }
}

function loadOrderItems(orderId) {
    const container = document.querySelector('.items-container[data-order-id="' + orderId + '"]');

    container.innerHTML = '<div class="loading">Caricamento prodotti...</div>';

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

    container.innerHTML = '';

    for (let i = 0; i < items.length; i++) {
        const item = items[i];

        const itemDetail = document.createElement('div');
        itemDetail.className = 'item-detail';

        if (item.image_url) {
            const img = document.createElement('img');
            img.src = item.image_url;
            img.alt = item.product_name;
            itemDetail.appendChild(img);
        } else {
            const noImage = document.createElement('div');
            noImage.className = 'no-image';
            noImage.textContent = 'Nessuna immagine';
            itemDetail.appendChild(noImage);
        }

        const itemInfo = document.createElement('div');
        itemInfo.className = 'item-info';

        const productName = document.createElement('h5');
        productName.textContent = item.product_name;
        itemInfo.appendChild(productName);

        if (item.color_name) {
            const colorInfo = document.createElement('p');
            colorInfo.textContent = 'Colore: ' + item.color_name;
            itemInfo.appendChild(colorInfo);
        }

        if (item.size_name) {
            const sizeInfo = document.createElement('p');
            sizeInfo.textContent = 'Taglia: ' + item.size_name;
            itemInfo.appendChild(sizeInfo);
        }

        const quantityInfo = document.createElement('p');
        quantityInfo.textContent = 'Quantità: ' + item.quantity;
        itemInfo.appendChild(quantityInfo);

        itemDetail.appendChild(itemInfo);

        const totalPrice = item.price * item.quantity;
        const itemPrice = document.createElement('div');
        itemPrice.className = 'item-price';
        itemPrice.textContent = '€' + totalPrice.toFixed(2);
        itemDetail.appendChild(itemPrice);

        container.appendChild(itemDetail);
    }
}

function formatPrice(price) {
    return parseFloat(price).toFixed(2);
}