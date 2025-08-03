// ========== UTILITY FUNCTIONS ==========
function onError(error) {
    console.error('Errore nel caricamento dei prodotti preferiti:', error);
    showAlert('Errore nel caricamento dei prodotti. Riprova più tardi.', 'error');
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
    const existingAlert = document.querySelector('.favorites-alert');
    if (existingAlert) {
        existingAlert.remove();
    }

    const container = document.querySelector('.container');
    const productsGrid = document.querySelector('.products-grid');

    const alertDiv = document.createElement('div');
    alertDiv.className = 'favorites-alert favorites-alert-' + type;
    alertDiv.textContent = message;

    const dismissBtn = createAlertDismissButton(alertDiv);
    alertDiv.appendChild(dismissBtn);

    container.insertBefore(alertDiv, productsGrid);
}

// ========== RENDER ADD TO CARD MODAL ==========
function createModalHeader() {
    const header = document.createElement('div');
    header.className = 'cart-modal-header';

    const title = document.createElement('h3');
    title.textContent = 'Seleziona opzioni';

    const closeBtn = document.createElement('button');
    closeBtn.className = 'cart-modal-close';

    const closeIcon = document.createElement('i');
    closeIcon.className = "fa-solid fa-xmark";
    closeBtn.appendChild(closeIcon);

    header.appendChild(title);
    header.appendChild(closeBtn);

    return { header: header, closeBtn: closeBtn };
}

function createModalBody() {
    const body = document.createElement('div');
    body.className = 'cart-modal-body';

    const loading = document.createElement('div');
    loading.className = 'loading';
    loading.textContent = 'Caricamento opzioni...';
    body.appendChild(loading);

    return body;
}

function handleModalClose(modal) {
    return function () {
        document.body.removeChild(modal);
    };
}

function handleModalBackdropClick(modal) {
    return function (e) {
        if (e.target === modal) {
            document.body.removeChild(modal);
        }
    };
}

function createProductHeader(product) {
    const fragment = document.createDocumentFragment();

    const productName = document.createElement('h4');
    productName.textContent = product.name;

    const productPrice = document.createElement('p');
    productPrice.className = 'product-price';
    productPrice.textContent = '€' + product.price;

    fragment.appendChild(productName);
    fragment.appendChild(productPrice);

    return fragment;
}

function createColorSelection(product, selectedColorId) {
    if (!product.colors || product.colors.length === 0) return null;

    const colorSelection = document.createElement('div');
    colorSelection.className = 'color-selection';

    const colorTitle = document.createElement('h5');
    colorTitle.textContent = 'Colore';

    const colorOptions = document.createElement('div');
    colorOptions.className = 'color-options';

    product.colors.forEach(function (color, index) {
        const colorOption = document.createElement('div');
        colorOption.className = 'color-option';
        if (index === 0) colorOption.classList.add('selected');
        colorOption.dataset.colorId = color.id;
        colorOption.title = color.name;
        colorOption.style.backgroundColor = color.hex_code;

        colorOption.addEventListener('click', function () {
            colorOptions.querySelectorAll('.color-option').forEach(function (el) {
                el.classList.remove('selected');
            });
            colorOption.classList.add('selected');
            selectedColorId.value = colorOption.dataset.colorId;
        });

        colorOptions.appendChild(colorOption);
    });

    colorSelection.appendChild(colorTitle);
    colorSelection.appendChild(colorOptions);

    return colorSelection;
}

function createSizeSelection(product, selectedSizeId, addBtn) {
    if (!product.sizes || product.sizes.length === 0) return null;

    const sizeSelection = document.createElement('div');
    sizeSelection.className = 'size-selection';

    const sizeTitle = document.createElement('h5');
    sizeTitle.textContent = 'Taglia';

    const sizeOptions = document.createElement('div');
    sizeOptions.className = 'size-options';

    product.sizes.forEach(function (size) {
        const sizeOption = document.createElement('button');
        sizeOption.className = 'size-option';
        sizeOption.dataset.sizeId = size.id;
        sizeOption.disabled = size.pivot.stock_quantity <= 0;
        sizeOption.textContent = 'EU ' + size.value + (size.pivot.stock_quantity <= 0 ? ' (Esaurito)' : '');

        sizeOption.addEventListener('click', function () {
            if (!sizeOption.disabled) {
                sizeOptions.querySelectorAll('.size-option').forEach(function (el) {
                    el.classList.remove('selected');
                });
                sizeOption.classList.add('selected');
                selectedSizeId.value = sizeOption.dataset.sizeId;

                addBtn.disabled = false;
                addBtn.textContent = 'Aggiungi al carrello';
            }
        });

        sizeOptions.appendChild(sizeOption);
    });

    sizeSelection.appendChild(sizeTitle);
    sizeSelection.appendChild(sizeOptions);

    return sizeSelection;
}

function createAddButton(product, selectedColorId, selectedSizeId, buttonElement, modal) {
    const addBtn = document.createElement('button');
    addBtn.className = 'add-to-cart-modal-btn';
    addBtn.disabled = true;
    addBtn.textContent = 'Seleziona una taglia';

    addBtn.addEventListener('click', function () {
        if (selectedSizeId.value) {
            addToCartWithOptions(product.id, selectedColorId.value, selectedSizeId.value, buttonElement, modal);
        }
    });

    return addBtn;
}

function renderCartModal(product, modal, buttonElement) {
    const modalBody = modal.querySelector('.cart-modal-body');
    const selectedColorId = { value: product.colors[0] ? product.colors[0].id : null };
    const selectedSizeId = { value: null };

    modalBody.innerHTML = '';

    const productOptions = document.createElement('div');
    productOptions.className = 'product-options';

    const productHeader = createProductHeader(product);
    productOptions.appendChild(productHeader);

    const colorSelection = createColorSelection(product, selectedColorId);
    if (colorSelection) {
        productOptions.appendChild(colorSelection);
    }

    const addBtn = createAddButton(product, selectedColorId, selectedSizeId, buttonElement, modal);

    const sizeSelection = createSizeSelection(product, selectedSizeId, addBtn);
    if (sizeSelection) {
        productOptions.appendChild(sizeSelection);
    }

    productOptions.appendChild(addBtn);
    modalBody.appendChild(productOptions);
}

// ========== RENDER PRODUCTS ==========
function createProductImage(product) {
    const imageContainer = document.createElement('div');
    imageContainer.className = 'product-image-container';

    const image = document.createElement('img');
    image.className = 'product-image';
    image.src = product.image_url;
    image.alt = product.name;

    const heartButton = document.createElement('button');
    heartButton.className = 'heart-icon';
    heartButton.addEventListener('click', function () {
        handleRemoveFromFavorites(product.id, heartButton.closest('.product-card'));
    });

    const heartImg = document.createElement('img');
    heartImg.src = "/assets/icons/hearth-icon-filled.svg";
    heartImg.alt = 'Rimuovi dai preferiti';

    heartButton.appendChild(heartImg);
    imageContainer.appendChild(image);
    imageContainer.appendChild(heartButton);

    return imageContainer;
}

function createProductInfo(product) {
    const info = document.createElement('div');
    info.className = 'product-info';

    const principalInfo = document.createElement('div');
    principalInfo.className = 'product-principal-info';

    const name = document.createElement('div');
    name.className = 'product-name';
    name.textContent = product.name;

    const categoryDiv = document.createElement('div');
    categoryDiv.className = 'product-category';
    const categoryText = product.section_name + ' - ' + product.category_name;
    categoryDiv.textContent = categoryText;

    principalInfo.appendChild(name);
    principalInfo.appendChild(categoryDiv);

    const price = document.createElement('div');
    price.className = 'product-price';
    price.textContent = '€' + product.price;

    info.appendChild(principalInfo);
    info.appendChild(price);

    return info;
}

function createCartButton(product) {
    const cartButton = document.createElement('button');
    cartButton.className = 'product-status ' + (product.isInCart ? 'status-added' : 'status-add-to-cart');
    cartButton.addEventListener('click', function () {
        handleCartToggle(product.id, cartButton, product.isInCart);
    });

    if (product.isInCart) {
        const status = document.createElement("i");
        status.className = "fa-solid fa-check";

        const text = document.createElement("span");
        text.textContent = "Aggiunto";
        cartButton.appendChild(status);
        cartButton.appendChild(text);
    } else {
        cartButton.textContent = 'Aggiungi al carrello';
    }

    return cartButton;
}

function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.dataset.productId = product.id;

    const imageContainer = createProductImage(product);

    const infoContainer = document.createElement('div');
    infoContainer.className = 'product-info-container';

    const info = createProductInfo(product);
    const cartButton = createCartButton(product);

    infoContainer.appendChild(info);
    infoContainer.appendChild(cartButton);

    card.appendChild(imageContainer);
    card.appendChild(infoContainer);

    return card;
}

function showEmptyState() {
    const productsGrid = document.querySelector('.products-grid');
    productsGrid.innerHTML = "";

    const emptyAlert = document.createElement("div");
    emptyAlert.classList.add("favorites-empty-alert");

    const emptyText = document.createElement("p");
    emptyText.textContent = "Gli articoli aggiunti ai preferiti saranno salvati qui";

    const shopBtn = document.createElement("a");
    shopBtn.href = "/shop";
    shopBtn.className = "btn btn-primary";
    shopBtn.textContent = "Inizia a fare shopping";

    emptyAlert.appendChild(emptyText);
    emptyAlert.appendChild(shopBtn);
    productsGrid.appendChild(emptyAlert);
}

function renderProducts(products) {
    const productsGrid = document.querySelector('.products-grid');

    if (!productsGrid) {
        console.error('Container prodotti non trovato');
        return;
    }

    productsGrid.innerHTML = '';

    if (products.length === 0) {
        showEmptyState();
        return;
    }

    products.forEach(function (product) {
        const productCard = createProductCard(product);
        productsGrid.appendChild(productCard);
    });
}

// ========== API CALLS ==========
function handleFavoritesDataSuccess(data) {
    if (!data) return;

    if (data.success) {
        renderProducts(data.data);
    } else {
        showAlert(data.message || 'Errore nel caricamento dei prodotti preferiti', 'error');
    }
}

function loadFavoriteProducts() {
    fetch("/api/favorites/get")
        .then(onResponse)
        .then(handleFavoritesDataSuccess)
        .catch(onError);
}

function handleRemoveFavoritesSuccess(data) {
    if (!data) return;

    if (data.success) {
        loadFavoriteProducts();
        updateFavoritesCounter(-1);
    } else {
        showAlert(data.message || 'Errore nella rimozione del prodotto', 'error');
    }
}

function handleRemoveFromFavorites(productId, cardElement) {
    const formData = new FormData();
    formData.append('productId', productId);
    formData.append('_token', getCsrfToken());

    fetch("/api/favorites/remove", {
        method: 'POST',
        body: formData
    })
        .then(onResponse)
        .then(handleRemoveFavoritesSuccess)
        .catch(onError);
}

function handleAddToCart(productId, buttonElement) {
    showAddToCartModal(productId, buttonElement);
}

function handleCartToggle(productId, buttonElement, isCurrentlyInCart) {
    if (isCurrentlyInCart) {
        handleRemoveFromCart(productId, buttonElement);
    } else {
        handleAddToCart(productId, buttonElement);
    }
}

function handleRemoveCartSuccess(data, buttonElement) {
    if (!data) return;

    if (data.success) {
        buttonElement.className = 'product-status status-add-to-cart';
        buttonElement.textContent = 'Aggiungi al carrello';
        updateCartCounter(-data.deleted_count);
        loadFavoriteProducts();
    } else {
        showAlert(data.message || 'Errore nella rimozione del prodotto', 'error');
    }
}

function handleRemoveFromCart(productId, buttonElement) {
    buttonElement.disabled = true;
    buttonElement.style.opacity = '0.6';
    buttonElement.textContent = 'Rimuovendo...';

    const formData = new FormData();
    formData.append('productId', productId);
    formData.append('_token', getCsrfToken());

    fetch("/api/cart/remove", {
        method: 'POST',
        body: formData,
    })
        .then(onResponse)
        .then(function (data) {
            handleRemoveCartSuccess(data, buttonElement);
        })
        .catch(onError)
        .finally(function () {
            buttonElement.disabled = false;
            buttonElement.style.opacity = '1';
        });
}

function handleAddToCartSuccess(data, buttonElement, modal) {
    if (!data) return;

    if (data.success) {
        buttonElement.className = 'product-status status-added';

        const statusIndicator = document.createElement('span');
        statusIndicator.className = 'status-indicator';

        buttonElement.innerHTML = '';
        buttonElement.appendChild(statusIndicator);
        buttonElement.appendChild(document.createTextNode('Aggiunto'));

        updateCartCounter(1);
        document.body.removeChild(modal);
        loadFavoriteProducts();
    } else {
        showAlert(data.message || 'Errore durante l\'aggiunta al carrello', 'error');
        resetAddButton(modal);
    }
}

function handleAddToCartError(error, modal) {
    console.error('Errore nell\'aggiunta al carrello:', error);
    showAlert('Errore nell\'aggiunta al carrello. Riprova.', 'error');
    resetAddButton(modal);
}

function resetAddButton(modal) {
    const addBtn = modal.querySelector('.add-to-cart-modal-btn');
    addBtn.disabled = false;
    addBtn.classList.remove('loading');
    addBtn.textContent = 'Aggiungi al carrello';
}

function addToCartWithOptions(productId, colorId, sizeId, buttonElement, modal) {
    const addBtn = modal.querySelector('.add-to-cart-modal-btn');
    addBtn.disabled = true;
    addBtn.textContent = 'Aggiungendo...';
    addBtn.classList.add('loading');

    const formData = new FormData();
    formData.append('productId', productId);
    formData.append('colorId', colorId);
    formData.append('sizeId', sizeId);
    formData.append('quantity', 1);
    formData.append('_token', getCsrfToken());

    fetch("/api/cart/add", {
        method: 'POST',
        body: formData
    })
        .then(onResponse)
        .then(function (data) {
            handleAddToCartSuccess(data, buttonElement, modal);
        })
        .catch(function (error) {
            handleAddToCartError(error, modal);
        });
}

function showAddToCartModal(productId, buttonElement) {
    const modal = document.createElement('div');
    modal.className = 'cart-modal';

    const modalContent = document.createElement('div');
    modalContent.className = 'cart-modal-content';

    const headerData = createModalHeader();
    const body = createModalBody();

    modalContent.appendChild(headerData.header);
    modalContent.appendChild(body);
    modal.appendChild(modalContent);
    document.body.appendChild(modal);

    headerData.closeBtn.addEventListener('click', handleModalClose(modal));
    modal.addEventListener('click', handleModalBackdropClick(modal));

    fetch('/api/favorites/product?id=' + productId)
        .then(onResponse)
        .then(function (data) {
            handleProductDataSuccess(data, modal, buttonElement);
        })
        .catch(function (error) {
            handleProductDataError(error, modal);
        });
}

function handleProductDataSuccess(data, modal, buttonElement) {
    if (!data) return;

    if (data.success) {
        renderCartModal(data.data, modal, buttonElement);
    } else {
        document.body.removeChild(modal);
        showAlert(data.message || 'Errore nel caricamento delle opzioni prodotto', 'error');
    }
}

function handleProductDataError(error, modal) {
    console.error('Errore:', error);
    showAlert('Errore nel caricamento delle opzioni prodotto', 'error');
    document.body.removeChild(modal);
}


function initialize() {
    loadFavoriteProducts();
}

initialize();