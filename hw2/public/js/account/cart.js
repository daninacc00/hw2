// ========== UTILITY FUNCTIONS ==========
function formatPrice(price) {
    return '€' + parseFloat(price).toFixed(2).replace('.', ',');
}

function onError(error) {
    console.error('Errore nel caricamento del carrello:', error);
    showAlert('Errore nel caricamento del carrello. Riprova più tardi.', 'error');
}

function createAlertDismissButton(alertDiv) {
    const dismissBtn = document.createElement('button');
    dismissBtn.className = 'alert-dismiss';
    dismissBtn.innerHTML = '&times;';
    dismissBtn.addEventListener('click', function () {
        alertDiv.remove();
    });
    return dismissBtn;
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

    const dismissBtn = createAlertDismissButton(alertDiv);
    alertDiv.appendChild(dismissBtn);

    container.insertBefore(alertDiv, cartContent);
}
// ========== RENDER CART FUNCTIONS ==========
function createSummaryRow(label, value, isTotal) {
    const row = document.createElement('div');
    row.className = isTotal ? 'summary-row summary-total' : 'summary-row';

    const labelSpan = document.createElement('span');
    labelSpan.textContent = label;

    const valueSpan = document.createElement('span');
    valueSpan.textContent = value;

    row.appendChild(labelSpan);
    row.appendChild(valueSpan);

    return row;
}

function createCheckoutButton(summary) {
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

    return checkoutBtn;
}

function createCartSummary(summary) {
    const summaryDiv = document.createElement('div');
    summaryDiv.className = 'cart-summary';

    const subtotalRow = createSummaryRow('Subtotale', formatPrice(summary.subtotal), false);
    const shippingValue = summary.shipping_cost > 0 ? formatPrice(summary.shipping_cost) : 'Gratuita';
    const shippingRow = createSummaryRow('Spedizione', shippingValue, false);
    const totalRow = createSummaryRow('Totale', formatPrice(summary.total), true);
    const checkoutBtn = createCheckoutButton(summary);

    summaryDiv.appendChild(subtotalRow);
    summaryDiv.appendChild(shippingRow);
    summaryDiv.appendChild(totalRow);
    summaryDiv.appendChild(checkoutBtn);

    return summaryDiv;
}

function createItemImage(item) {
    const img = document.createElement('img');
    img.src = item.product_image;
    img.alt = item.product_name;
    img.className = 'item-image';
    return img;
}

function createItemDetails(item) {
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

    return itemDetails;
}

function createItemActions(item) {
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

    return itemActions;
}

function createCartItem(item) {
    const cartItem = document.createElement('div');
    cartItem.className = 'cart-item';
    cartItem.dataset.itemId = item.cart_item_id;

    const img = createItemImage(item);
    const itemDetails = createItemDetails(item);
    const itemActions = createItemActions(item);

    cartItem.appendChild(img);
    cartItem.appendChild(itemDetails);
    cartItem.appendChild(itemActions);

    return cartItem;
}

function createEmptyCartContent() {
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

    return emptyAlert;
}

function showEmptyCart() {
    const cartContent = document.querySelector('.cart-content');
    cartContent.innerHTML = "";

    const emptyCartContent = createEmptyCartContent();
    cartContent.appendChild(emptyCartContent);
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

// ========== API CALLS ==========
function handleCartDataSuccess(data) {
    if (!data) return;

    if (data.success) {
        renderCart(data.data);
    } else {
        showAlert(data.message || 'Errore nel caricamento del carrello', 'error');
    }
}

function loadCartItems() {
    fetch("/api/cart/get")
        .then(onResponse)
        .then(handleCartDataSuccess)
        .catch(onError);
}

function handleRemoveSuccess(data) {
    if (!data) return;

    if (data.success) {
        showAlert('Prodotto rimosso dal carrello', 'success');
        updateCartCounter(-data.deleted_count);
        loadCartItems();
    } else {
        showAlert(data.message || 'Errore nella rimozione del prodotto', 'error');
    }
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
        .then(handleRemoveSuccess)
        .catch(onError);
}

function handleQuantityUpdateSuccess(data) {
    if (!data) return;

    if (data.success) {
        showAlert('Quantità aggiornata', 'success');
        loadCartItems();
    } else {
        showAlert(data.message || 'Errore nell\'aggiornamento della quantità', 'error');
    }
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
        .then(handleQuantityUpdateSuccess)
        .catch(onError);
}

function handleRemoveItemSuccess(data) {
    if (!data) return;

    if (data.success) {
        showAlert('Elemento rimosso dal carrello', 'success');
        updateCartCounter(-1);
        loadCartItems();
    } else {
        showAlert(data.message || 'Errore nella rimozione', 'error');
    }
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
        .then(handleRemoveItemSuccess)
        .catch(onError);
}

function initialize() {
    loadCartItems();
}

initialize();