function showAlert(message, type) {
    const existingAlert = document.querySelector('.orders-alert');
    if (existingAlert) {
        existingAlert.remove();
    }

    const container = document.querySelector('.orders-container');
    const pageHeader = document.querySelector('.page-header');

    const alertDiv = document.createElement('div');
    alertDiv.className = 'orders-alert orders-alert-' + type;
    alertDiv.textContent = message;

    const dismissBtn = document.createElement('button');
    dismissBtn.className = 'alert-dismiss';
    dismissBtn.innerHTML = '&times;';
    dismissBtn.addEventListener('click', function () {
        alertDiv.remove();
    });

    alertDiv.appendChild(dismissBtn);

    container.insertBefore(alertDiv, pageHeader.nextSibling);
}

function showLoading(container, show) {
    if (show) {
        const itemLoading = document.createElement("div");
        const text = document.createElement("span");
        text.textContent = "Caricamento prodotti...";

        itemLoading.appendChild(text);
        container.append(itemLoading);
    }
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

    showLoading(container, true);

    fetch('/api/orders/items?order_id=' + orderId)
        .then(onResponse)
        .then(function (result) {
            if (!result) return;

            if (result.success && result.items) {
                displayOrderItems(container, result.items);
                container.setAttribute('data-loaded', 'true');
            } else {
                container.innerHTML = '';
                showAlert(result.message || 'Errore nel caricamento dei prodotti dell\'ordine', 'error');
            }
        })
        .catch(function (error) {
            console.error('Errore nel caricamento prodotti ordine:', error);
            container.innerHTML = '';
            showAlert('Errore di connessione. Riprova più tardi.', 'error');
        });
}

function displayOrderItems(container, items) {
    if (items.length === 0) {
        const emptyItems = document.createElement("div");
        const text = document.createElement("span");
        text.textContent = "Nessun prodotto trovato";

        emptyItems.appendChild(text);
        container.append(emptyItems);
        return;
    }

    container.innerHTML = '';

    items.forEach(function (item) {
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
        itemPrice.textContent = formatPrice(totalPrice);

        itemDetail.appendChild(itemPrice);
        container.appendChild(itemDetail);
    });
}

function formatPrice(price) {
    return '€' + parseFloat(price).toFixed(2).replace('.', ',');
}

const detailButtons = document.querySelectorAll('.view-details-btn');

detailButtons.forEach(function (button) {
    button.addEventListener('click', function (event) {
        const orderId = event.target.getAttribute('data-order-id');
        toggleOrderItems(orderId);
    });
});