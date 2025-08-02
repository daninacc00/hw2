loadCartItems();

function loadCartItems() {
    fetch("/api/cart/get")
        .then(function(response) {
            if (!response.ok) {
                if (response.status === 401 || response.status === 403) {
                    showAuthRequiredState('Devi essere loggato per accedere al tuo carrello');
                    return;
                }
                throw new Error('HTTP ' + response.status + ': ' + response.statusText);
            }
            return response.json();
        })
        .then(function(data) {
            if (!data) return;
            
            if (data.success) {
                renderCart(data.data);
            } else {
                if (data.error_type === 'auth_required') {
                    showAuthRequiredState(data.message);
                } else {
                    showErrorMessage(data.message || 'Errore nel caricamento del carrello');
                }
            }
        })
        .catch(function(error) {
            console.error('Errore nel caricamento del carrello:', error);
            showErrorMessage('Errore nel caricamento del carrello. Riprova più tardi.');
        });
}

function showAuthRequiredState(message) {
    const cartContent = document.querySelector('.cart-content');
    cartContent.innerHTML = "";

    const authAlert = document.createElement("div");
    authAlert.className = "auth-required-alert";

    const icon = document.createElement("i");
    icon.className = "fa-solid fa-cart-shopping auth-icon";

    const title = document.createElement("h2");
    title.className = "auth-title";
    title.textContent = "Accedi per vedere il tuo carrello";

    const description = document.createElement("p");
    description.className = "auth-description";
    description.textContent = message || "Devi essere loggato per accedere al tuo carrello";

    const loginBtn = document.createElement("a");
    loginBtn.href = "/login";
    loginBtn.className = "btn btn-primary";
    loginBtn.textContent = "Accedi";

    const shopBtn = document.createElement("a");
    shopBtn.href = "/shop";
    shopBtn.className = "btn btn-secondary";
    shopBtn.textContent = "Continua a fare shopping";

    authAlert.appendChild(icon);
    authAlert.appendChild(title);
    authAlert.appendChild(description);
    authAlert.appendChild(loginBtn);
    authAlert.appendChild(shopBtn);
    cartContent.appendChild(authAlert);
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

    cartData.items.forEach(function(item) {
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
    removeBtn.addEventListener('click', function() {
        removeFromCart(item.product_id);
    });

    const quantityControls = document.createElement('div');
    quantityControls.className = 'quantity-controls';

    const decreaseBtn = document.createElement('button');
    decreaseBtn.className = 'quantity-btn';
    decreaseBtn.textContent = '-';
    decreaseBtn.addEventListener('click', function() {
        updateQuantity(item.cart_item_id, item.quantity - 1);
    });

    const quantityDisplay = document.createElement('span');
    quantityDisplay.className = 'quantity-display';
    quantityDisplay.textContent = item.quantity;

    const increaseBtn = document.createElement('button');
    increaseBtn.className = 'quantity-btn';
    increaseBtn.textContent = '+';
    increaseBtn.addEventListener('click', function() {
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
    
    checkoutBtn.addEventListener('click', function() {
        if (summary.items_count > 0) {
            window.location.href = '/checkout';
        } else {
            showErrorMessage('Il carrello è vuoto');
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

    fetch("/api/cart/remove", {
        method: 'POST',
        body: formData,
        headers: {
            'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
        }
    })
        .then(function(response) {
            if (!response.ok) {
                if (response.status === 401 || response.status === 403) {
                    window.location.href = '/login';
                    return;
                }
                throw new Error('HTTP ' + response.status + ': ' + response.statusText);
            }
            return response.json();
        })
        .then(function(data) {
            if (!data) return;
            
            if (data.success) {
                showSuccessMessage('Prodotto rimosso dal carrello');
                updateCartCounter(-data.deleted_count);
                loadCartItems();
            } else {
                if (data.error_type === 'auth_required') {
                    window.location.href = '/login';
                } else {
                    showErrorMessage(data.message || 'Errore nella rimozione del prodotto');
                }
            }
        })
        .catch(function(error) {
            console.error('Errore:', error);
            showErrorMessage('Errore nella rimozione del prodotto');
        });
}

function updateQuantity(cartItemId, newQuantity) {
    if (newQuantity < 1) {
        removeCartItem(cartItemId);
        return;
    }

    const formData = new FormData();
    formData.append('cartItemId', cartItemId);
    formData.append('quantity', newQuantity);

    fetch("/api/cart/update", {
        method: 'POST',
        body: formData,
        headers: {
            'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
        }
    })
        .then(function(response) {
            if (!response.ok) {
                if (response.status === 401 || response.status === 403) {
                    window.location.href = '/login';
                    return;
                }
                throw new Error('HTTP ' + response.status + ': ' + response.statusText);
            }
            return response.json();
        })
        .then(function(data) {
            if (!data) return;
            
            if (data.success) {
                showSuccessMessage('Quantità aggiornata');
                loadCartItems();
            } else {
                if (data.error_type === 'auth_required') {
                    window.location.href = '/login';
                } else {
                    showErrorMessage(data.message || 'Errore nell\'aggiornamento della quantità');
                }
            }
        })
        .catch(function(error) {
            console.error('Errore:', error);
            showErrorMessage('Errore nell\'aggiornamento della quantità');
        });
}

function removeCartItem(cartItemId) {
    const formData = new FormData();
    formData.append('cartItemId', cartItemId);

    fetch("/api/cart/remove-item", {
        method: 'POST',
        body: formData,
        headers: {
            'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
        }
    })
        .then(function(response) {
            if (!response.ok) {
                if (response.status === 401 || response.status === 403) {
                    window.location.href = '/login';
                    return;
                }
                throw new Error('HTTP ' + response.status + ': ' + response.statusText);
            }
            return response.json();
        })
        .then(function(data) {
            if (!data) return;
            
            if (data.success) {
                showSuccessMessage('Elemento rimosso dal carrello');
                updateCartCounter(-1);
                loadCartItems();
            } else {
                if (data.error_type === 'auth_required') {
                    window.location.href = '/login';
                } else {
                    showErrorMessage(data.message || 'Errore nella rimozione');
                }
            }
        })
        .catch(function(error) {
            console.error('Errore:', error);
            showErrorMessage('Errore nella rimozione');
        });
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

function showError(message) {
    const cartContent = document.querySelector('.cart-content');
    cartContent.innerHTML = '';

    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-state';

    const errorTitle = document.createElement('h3');
    errorTitle.textContent = 'Errore';

    const errorMessage = document.createElement('p');
    errorMessage.textContent = message;

    errorDiv.appendChild(errorTitle);
    errorDiv.appendChild(errorMessage);
    cartContent.appendChild(errorDiv);
}

function showErrorMessage(message) {
    showMessage(message, 'error');
}

function showSuccessMessage(message) {
    showMessage(message, 'success');
}

function showMessage(message, type) {
    const existingMessages = document.querySelectorAll('.feedback-message');
    existingMessages.forEach(function(msg) {
        msg.remove();
    });

    const messageElement = document.createElement('div');
    messageElement.className = 'feedback-message feedback-' + type;
    messageElement.textContent = message;

    document.body.appendChild(messageElement);

    messageElement.offsetHeight;
    messageElement.classList.add('show');

    messageElement.addEventListener('click', function () {
        messageElement.classList.remove('show');
    });

    setTimeout(function() {
        messageElement.classList.remove('show');
        setTimeout(function() {
            messageElement.remove();
        }, 300);
    }, 5000);
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