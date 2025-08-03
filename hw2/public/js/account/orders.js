// ========== UTILITY FUNCTIONS ==========
function getCsrfToken() {
    const token = document.querySelector('meta[name="csrf-token"]');
    return token ? token.getAttribute('content') : '';
}

function onResponse(response) {
    if (!response.ok) {
        throw new Error('HTTP error! status: ' + response.status);
    }
    return response.json();
}

function formatPrice(price) {
    return '€' + parseFloat(price).toFixed(2).replace('.', ',');
}

function createAlertDismissButton(alertDiv) {
    const dismissBtn = document.createElement('button');
    dismissBtn.className = 'alert-dismiss';
    dismissBtn.innerHTML = '&times;';
    dismissBtn.addEventListener('click', function() {
        alertDiv.remove();
    });
    return dismissBtn;
}

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

    const dismissBtn = createAlertDismissButton(alertDiv);
    alertDiv.appendChild(dismissBtn);

    container.insertBefore(alertDiv, pageHeader.nextSibling);
}

function showOrdersLoading() {
    const loadingDiv = document.getElementById('orders-loading');
    const contentDiv = document.getElementById('orders-content');
    
    if (loadingDiv) loadingDiv.style.display = 'block';
    if (contentDiv) contentDiv.style.display = 'none';
}

function hideOrdersLoading() {
    const loadingDiv = document.getElementById('orders-loading');
    const contentDiv = document.getElementById('orders-content');
    
    if (loadingDiv) loadingDiv.style.display = 'none';
    if (contentDiv) contentDiv.style.display = 'block';
}

function createItemsLoadingElement() {
    const itemLoading = document.createElement("div");
    itemLoading.className = 'items-loading';
    
    const text = document.createElement("span");
    text.textContent = "Caricamento prodotti...";
    itemLoading.appendChild(text);
    
    return itemLoading;
}

function showItemsLoading(container) {
    const loadingElement = createItemsLoadingElement();
    container.appendChild(loadingElement);
}

function createNoOrdersMessage() {
    const noOrdersDiv = document.createElement('div');
    noOrdersDiv.className = 'no-orders';

    const title = document.createElement('h2');
    title.textContent = 'Nessun ordine trovato';

    const description = document.createElement('p');
    description.textContent = 'Non hai ancora effettuato nessun ordine.';

    const shopButton = document.createElement('a');
    shopButton.href = '/';
    shopButton.className = 'shop-button';
    shopButton.textContent = 'Inizia a fare shopping';

    noOrdersDiv.appendChild(title);
    noOrdersDiv.appendChild(description);
    noOrdersDiv.appendChild(shopButton);

    return noOrdersDiv;
}

function createOrderHeader(order) {
    const orderHeader = document.createElement('div');
    orderHeader.className = 'order-header';

    const orderInfo = document.createElement('div');
    orderInfo.className = 'order-info';

    const orderTitle = document.createElement('h3');
    orderTitle.textContent = 'Ordine #' + order.id;

    const orderDate = document.createElement('p');
    orderDate.className = 'order-date';
    orderDate.textContent = order.created_at;

    orderInfo.appendChild(orderTitle);
    orderInfo.appendChild(orderDate);

    if (order.square_order_id) {
        const squareId = document.createElement('p');
        squareId.className = 'square-id';
        squareId.textContent = 'Square ID: ' + order.square_order_id;
        orderInfo.appendChild(squareId);
    }

    const orderStatus = document.createElement('div');
    orderStatus.className = 'order-status';

    const statusBadge = document.createElement('span');
    statusBadge.className = 'status-badge status-' + order.status;
    statusBadge.textContent = order.status_label;

    orderStatus.appendChild(statusBadge);
    orderHeader.appendChild(orderInfo);
    orderHeader.appendChild(orderStatus);

    return orderHeader;
}

function createBillingInfo(order) {
    const billingInfo = document.createElement('div');
    billingInfo.className = 'billing-info';

    const title = document.createElement('h4');
    title.textContent = 'Dati di Fatturazione';

    const name = document.createElement('p');
    const nameStrong = document.createElement('strong');
    nameStrong.textContent = order.billing_name;
    name.appendChild(nameStrong);

    const email = document.createElement('p');
    email.textContent = order.billing_email;

    const address = document.createElement('p');
    address.textContent = order.billing_address;

    billingInfo.appendChild(title);
    billingInfo.appendChild(name);
    billingInfo.appendChild(email);
    billingInfo.appendChild(address);

    return billingInfo;
}

function createOrderSummary(order) {
    const orderSummary = document.createElement('div');
    orderSummary.className = 'order-summary';

    const itemsCount = document.createElement('p');
    itemsCount.className = 'items-count';
    itemsCount.textContent = order.items_count + ' prodotti';

    const totalAmount = document.createElement('p');
    totalAmount.className = 'total-amount';
    const totalStrong = document.createElement('strong');
    totalStrong.textContent = 'Totale: €' + order.total_amount;
    totalAmount.appendChild(totalStrong);

    const viewDetailsBtn = document.createElement('button');
    viewDetailsBtn.className = 'view-details-btn';
    viewDetailsBtn.setAttribute('data-order-id', order.id);
    viewDetailsBtn.textContent = 'Vedi Dettagli';

    viewDetailsBtn.addEventListener('click', function() {
        toggleOrderItems(order.id);
    });

    orderSummary.appendChild(itemsCount);
    orderSummary.appendChild(totalAmount);
    orderSummary.appendChild(viewDetailsBtn);

    return orderSummary;
}

function createOrderDetails(order) {
    const orderDetails = document.createElement('div');
    orderDetails.className = 'order-details';

    const billingInfo = createBillingInfo(order);
    const orderSummary = createOrderSummary(order);

    orderDetails.appendChild(billingInfo);
    orderDetails.appendChild(orderSummary);

    return orderDetails;
}

function createOrderItemsContainer(order) {
    const orderItems = document.createElement('div');
    orderItems.id = 'order-items-' + order.id;
    orderItems.className = 'order-items';
    orderItems.style.display = 'none';

    const title = document.createElement('h4');
    title.textContent = 'Prodotti nell\'ordine';

    const itemsContainer = document.createElement('div');
    itemsContainer.className = 'items-container';
    itemsContainer.setAttribute('data-order-id', order.id);

    orderItems.appendChild(title);
    orderItems.appendChild(itemsContainer);

    return orderItems;
}

function createOrderCard(order) {
    const orderCard = document.createElement('div');
    orderCard.className = 'order-card';

    const orderHeader = createOrderHeader(order);
    const orderDetails = createOrderDetails(order);
    const orderItems = createOrderItemsContainer(order);

    orderCard.appendChild(orderHeader);
    orderCard.appendChild(orderDetails);
    orderCard.appendChild(orderItems);

    return orderCard;
}

function renderOrdersList(orders) {
    const ordersList = document.createElement('div');
    ordersList.className = 'orders-list';

    orders.forEach(function(order) {
        const orderCard = createOrderCard(order);
        ordersList.appendChild(orderCard);
    });

    return ordersList;
}

function renderOrders(orders) {
    const ordersContent = document.getElementById('orders-content');
    ordersContent.innerHTML = '';

    if (orders.length === 0) {
        const noOrdersMessage = createNoOrdersMessage();
        ordersContent.appendChild(noOrdersMessage);
    } else {
        const ordersList = renderOrdersList(orders);
        ordersContent.appendChild(ordersList);
    }
}

function createItemImage(item) {
    if (item.image_url) {
        const img = document.createElement('img');
        img.src = item.image_url;
        img.alt = item.product_name;
        return img;
    } else {
        const noImage = document.createElement('div');
        noImage.className = 'no-image';
        noImage.textContent = 'Nessuna immagine';
        return noImage;
    }
}

function createItemInfo(item) {
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

    return itemInfo;
}

function createItemPrice(item) {
    const totalPrice = item.price * item.quantity;
    const itemPrice = document.createElement('div');
    itemPrice.className = 'item-price';
    itemPrice.textContent = formatPrice(totalPrice);
    return itemPrice;
}

function createItemDetail(item) {
    const itemDetail = document.createElement('div');
    itemDetail.className = 'item-detail';

    const image = createItemImage(item);
    const info = createItemInfo(item);
    const price = createItemPrice(item);

    itemDetail.appendChild(image);
    itemDetail.appendChild(info);
    itemDetail.appendChild(price);

    return itemDetail;
}

function createEmptyItemsMessage() {
    const emptyItems = document.createElement("div");
    emptyItems.className = 'empty-items';
    
    const text = document.createElement("span");
    text.textContent = "Nessun prodotto trovato";
    emptyItems.appendChild(text);
    
    return emptyItems;
}

function displayOrderItems(container, items) {
    const loading = container.querySelector('.items-loading');
    if (loading) {
        loading.remove();
    }

    if (items.length === 0) {
        const emptyMessage = createEmptyItemsMessage();
        container.appendChild(emptyMessage);
        return;
    }

    items.forEach(function(item) {
        const itemDetail = createItemDetail(item);
        container.appendChild(itemDetail);
    });
}

function handleOrderItemsSuccess(result, container) {
    if (!result) return;

    if (result.success && result.items) {
        displayOrderItems(container, result.items);
        container.setAttribute('data-loaded', 'true');
    } else {
        const loading = container.querySelector('.items-loading');
        if (loading) {
            loading.remove();
        }
        showAlert(result.message || 'Errore nel caricamento dei prodotti dell\'ordine', 'error');
    }
}

function handleOrderItemsError(error, container) {
    console.error('Errore nel caricamento prodotti ordine:', error);
    
    const loading = container.querySelector('.items-loading');
    if (loading) {
        loading.remove();
    }
    
    showAlert('Errore di connessione. Riprova più tardi.', 'error');
}

function loadOrderItems(orderId) {
    const container = document.querySelector('.items-container[data-order-id="' + orderId + '"]');

    showItemsLoading(container);

    fetch('/api/orders/items?order_id=' + orderId)
        .then(onResponse)
        .then(function(result) {
            handleOrderItemsSuccess(result, container);
        })
        .catch(function(error) {
            handleOrderItemsError(error, container);
        });
}

function updateToggleButton(button, isVisible) {
    if (isVisible) {
        button.textContent = 'Nascondi Dettagli';
    } else {
        button.textContent = 'Vedi Dettagli';
    }
}

function showOrderItems(orderId, itemsDiv, button) {
    itemsDiv.style.display = 'block';
    updateToggleButton(button, true);

    const container = itemsDiv.querySelector('.items-container');
    if (!container.hasAttribute('data-loaded')) {
        loadOrderItems(orderId);
    }
}

function hideOrderItems(itemsDiv, button) {
    itemsDiv.style.display = 'none';
    updateToggleButton(button, false);
}

function toggleOrderItems(orderId) {
    const itemsDiv = document.getElementById('order-items-' + orderId);
    const button = document.querySelector('.view-details-btn[data-order-id="' + orderId + '"]');

    if (itemsDiv.style.display === 'none' || itemsDiv.style.display === '') {
        showOrderItems(orderId, itemsDiv, button);
    } else {
        hideOrderItems(itemsDiv, button);
    }
}

function handleOrdersLoadSuccess(data) {
    if (!data) return;

    if (data.success) {
        renderOrders(data.data);
    } else {
        showAlert(data.message || 'Errore nel caricamento degli ordini', 'error');
    }
    
    hideOrdersLoading();
}

function handleOrdersLoadError(error) {
    console.error('Errore nel caricamento degli ordini:', error);
    showAlert('Errore nel caricamento degli ordini. Riprova più tardi.', 'error');
    hideOrdersLoading();
}

function loadOrders() {
    showOrdersLoading();

    fetch('/api/orders/get')
        .then(onResponse)
        .then(handleOrdersLoadSuccess)
        .catch(handleOrdersLoadError);
}

function initialize() {
    loadOrders();
}

initialize();