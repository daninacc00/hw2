loadCartItems();

function onError(error) {
    console.error('Errore nel caricamento del carrello:', error);
    showAlert('Errore nel caricamento del carrello. Riprova più tardi.', 'error');
}

function loadCartItems() {
    fetch("/api/cart/get")
        .then(onResponse)
        .then(function (data) {
            if (!data) return;

            if (data.success) {
                renderCart(data.data);
            } else {
                showAlert(data.message || 'Errore nel caricamento del carrello', 'error');
            }
        })
        .catch(onError);
}

function renderCart(cartData) {
    const cartContent = document.querySelector('.cart-content');

    if (!cartContent) {
        console.error('Container carrello non trovato');
        return;
    }

    cartContent.innerHTML = '';

    if (!cartData.items || cartData.items.length === 0) {
        showEmptyCart();
        return;
    }

    const cartItems = document.createElement('div');
    cartItems.className = 'cart-items';

    cartData.items.forEach(function (item) {
        const cartItem = createCartItem(item);
        cartItems.appendChild(cartItem);
    });

    const cartSummary = createCartSummary(cartData.summary);

    cartContent.appendChild(cartItems);
    cartContent.appendChild(cartSummary);
}

function createCartItem(item) {
    const cartItem = document.createElement('div');
    cartItem.className = 'cart-item';
    cartItem.dataset.itemId = item.cart_item_id;

    const img = document.createElement('img');
    img.src = item.product_image;
    img.alt = item.product_name;
    img.className = 'item-image';

    const itemDetails = document.createElement('div');
    itemDetails.className = 'item-details';

    const itemName = document.createElement('div');
    itemName.className = 'item-name';
    itemName.textContent = item.product_name;

    const colorInfo = document.createElement('div');
    colorInfo.className = 'item-info';
    colorInfo.textContent = 'Colore: ' + item.color_name;

    const sizeInfo = document.createElement('div');
    sizeInfo.className = 'item-info';
    sizeInfo.textContent = 'Taglia: EU ' + item.size_value;

    const itemPrice = document.createElement('div');
    itemPrice.className = 'item-price';
    itemPrice.textContent = formatPrice(item.price);

    itemDetails.appendChild(itemName);
    itemDetails.appendChild(colorInfo);
    itemDetails.appendChild(sizeInfo);
    itemDetails.appendChild(itemPrice);

    const itemActions = document.createElement('div');
    itemActions.className = 'item-actions';

    const removeBtn = document.createElement('button');
    removeBtn.className = 'remove-btn';
    removeBtn.textContent = 'Rimuovi';
    removeBtn.addEventListener('click', function () {
        removeFromCart(item.product_id);
    });

    const quantityControls = document.createElement('div');
    quantityControls.className = 'quantity-controls';

    const decreaseBtn = document.createElement('button');
    decreaseBtn.className = 'quantity-btn';
    decreaseBtn.textContent = '-';
    decreaseBtn.addEventListener('click', function () {
        updateQuantity(item.cart_item_id, item.quantity - 1);
    });

    const quantityDisplay = document.createElement('span');
    quantityDisplay.className = 'quantity-display';
    quantityDisplay.textContent = item.quantity;

    const increaseBtn = document.createElement('button');
    increaseBtn.className = 'quantity-btn';
    increaseBtn.textContent = '+';
    increaseBtn.addEventListener('click', function () {
        updateQuantity(item.cart_item_id, item.quantity + 1);
    });

    quantityControls.appendChild(decreaseBtn);
    quantityControls.appendChild(quantityDisplay);
    quantityControls.appendChild(increaseBtn);

    itemActions.appendChild(removeBtn);
    itemActions.appendChild(quantityControls);

    cartItem.appendChild(img);
    cartItem.appendChild(itemDetails);
    cartItem.appendChild(itemActions);

    return cartItem;
}

function createCartSummary(summary) {
    const summaryDiv = document.createElement('div');
    summaryDiv.className = 'cart-summary';

    const subtotalRow = document.createElement('div');
    subtotalRow.className = 'summary-row';
    const subtotalLabel = document.createElement('span');
    subtotalLabel.textContent = 'Subtotale';
    const subtotalValue = document.createElement('span');
    subtotalValue.textContent = formatPrice(summary.subtotal);
    subtotalRow.appendChild(subtotalLabel);
    subtotalRow.appendChild(subtotalValue);

    const shippingRow = document.createElement('div');
    shippingRow.className = 'summary-row';
    const shippingLabel = document.createElement('span');
    shippingLabel.textContent = 'Spedizione';
    const shippingValue = document.createElement('span');
    shippingValue.textContent = summary.shipping_cost > 0 ? formatPrice(summary.shipping_cost) : 'Gratuita';
    shippingRow.appendChild(shippingLabel);
    shippingRow.appendChild(shippingValue);

    const totalRow = document.createElement('div');
    totalRow.className = 'summary-row summary-total';
    const totalLabel = document.createElement('span');
    totalLabel.textContent = 'Totale';
    const totalValue = document.createElement('span');
    totalValue.textContent = formatPrice(summary.total);
    totalRow.appendChild(totalLabel);
    totalRow.appendChild(totalValue);

    const checkoutBtn = document.createElement('button');
    checkoutBtn.className = 'checkout-btn';
    checkoutBtn.textContent = 'Procedi al checkout';

    checkoutBtn.addEventListener('click', function () {
        if (summary.items_count > 0) {
            window.location.href = '/checkout';
        } else {
            showAlert('Il carrello è vuoto', 'error');
        }
    });

    summaryDiv.appendChild(subtotalRow);
    summaryDiv.appendChild(shippingRow);
    summaryDiv.appendChild(totalRow);
    summaryDiv.appendChild(checkoutBtn);

    return summaryDiv;
}

function removeFromCart(productId) {
    const formData = new FormData();
    formData.append('productId', productId);
    formData.append('_token', getCsrfToken());

    fetch("/api/cart/remove", {
        method: 'POST',
        body: formData,
    })
        .then(onResponse)
        .then(function (data) {
            if (!data) return;

            if (data.success) {
                showAlert('Prodotto rimosso dal carrello', 'success');
                updateCartCounter(-data.deleted_count);
                loadCartItems();
            } else {
                showAlert(data.message || 'Errore nella rimozione del prodotto', 'error');
            }
        })
        .catch(onError);
}

function updateQuantity(cartItemId, newQuantity) {
    if (newQuantity < 1) {
        removeCartItem(cartItemId);
        return;
    }

    const formData = new FormData();
    formData.append('cartItemId', cartItemId);
    formData.append('quantity', newQuantity);
    formData.append('_token', getCsrfToken());

    fetch("/api/cart/update", {
        method: 'POST',
        body: formData,
    })
        .then(onResponse)
        .then(function (data) {
            if (!data) return;

            if (data.success) {
                showAlert('Quantità aggiornata', 'success');
                loadCartItems();
            } else {
                showAlert(data.message || 'Errore nell\'aggiornamento della quantità', 'error');
            }
        })
        .catch(onError);
}

function removeCartItem(cartItemId) {
    const formData = new FormData();
    formData.append('cartItemId', cartItemId);
    formData.append('_token', getCsrfToken());

    fetch("/api/cart/remove-item", {
        method: 'POST',
        body: formData,
    })
        .then(onResponse)
        .then(function (data) {
            if (!data) return;

            if (data.success) {
                showAlert('Elemento rimosso dal carrello', 'success');
                updateCartCounter(-1);
                loadCartItems();
            } else {
                showAlert(data.message || 'Errore nella rimozione', 'error');
            }
        })
        .catch(onError);
}

function showEmptyCart() {
    const cartContent = document.querySelector('.cart-content');
    cartContent.innerHTML = "";

    const emptyAlert = document.createElement("div");
    emptyAlert.className = "cart-empty-alert";

    const icon = document.createElement("i");
    icon.className = "fa-solid fa-cart-shopping empty-icon";

    const title = document.createElement("h2");
    title.className = "empty-title";
    title.textContent = "Il tuo carrello è vuoto";

    const description = document.createElement("p");
    description.className = "empty-description";
    description.textContent = "I prodotti che aggiungi al carrello appariranno qui";

    const shopBtn = document.createElement("a");
    shopBtn.href = "/shop";
    shopBtn.className = "btn btn-primary";
    shopBtn.textContent = "Inizia a fare shopping";

    emptyAlert.appendChild(icon);
    emptyAlert.appendChild(title);
    emptyAlert.appendChild(description);
    emptyAlert.appendChild(shopBtn);
    cartContent.appendChild(emptyAlert);
}

function showAlert(message, type) {
    const existingAlert = document.querySelector('.cart-alert');
    if (existingAlert) {
        existingAlert.remove();
    }

    const container = document.querySelector('.container');
    const cartContent = document.querySelector('.cart-content');

    const alertDiv = document.createElement('div');
    alertDiv.className = 'cart-alert cart-alert-' + type;
    alertDiv.textContent = message;

    const dismissBtn = document.createElement('button');
    dismissBtn.className = 'alert-dismiss';
    dismissBtn.innerHTML = '&times;';
    dismissBtn.addEventListener('click', function () {
        alertDiv.remove();
    });

    alertDiv.appendChild(dismissBtn);

    container.insertBefore(alertDiv, cartContent);
}

function formatPrice(price) {
    return '€' + parseFloat(price).toFixed(2).replace('.', ',');
}

function updateCartCounter(delta) {
    const counter = document.getElementById('cart-counter');
    if (counter) {
        const current = parseInt(counter.textContent) || 0;
        const newValue = Math.max(0, current + delta);
        counter.textContent = newValue;
        counter.classList.toggle('hidden', newValue === 0);
    }
}