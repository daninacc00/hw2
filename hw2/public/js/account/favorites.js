loadFavoriteProducts();

function loadFavoriteProducts() {
    fetch("/api/favorites/get")
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                renderProducts(data.data);
            } else {
                if (data.error_type === 'auth_required') {
                    showAuthRequiredState(data.message, data.redirect_url);
                } else {
                    showErrorMessage(data.message);
                }
            }
        })
        .catch(error => {
            console.error('Errore nel caricamento dei prodotti preferiti:', error);
            showErrorMessage('Errore nel caricamento dei prodotti. Riprova più tardi.');
        });
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

    products.forEach(product => {
        const productCard = createProductCard(product);
        productsGrid.appendChild(productCard);
    });
}

function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.dataset.productId = product.id;

    const imageContainer = document.createElement('div');
    imageContainer.className = 'product-image-container';

    const image = document.createElement('img');
    image.className = 'product-image';
    image.src = product.image_url;
    image.alt = product.name;

    const heartButton = document.createElement('button');
    heartButton.className = 'heart-icon';
    heartButton.addEventListener('click', function (e) {
        e.preventDefault();
        handleRemoveFromFavorites(product.id, card);
    });

    const heartImg = document.createElement('img');
    heartImg.src = "/assets/icons/hearth-icon-filled.svg";
    heartImg.alt = 'Rimuovi dai preferiti';

    heartButton.appendChild(heartImg);
    imageContainer.appendChild(image);
    imageContainer.appendChild(heartButton);

    const infoContainer = document.createElement('div');
    infoContainer.className = 'product-info-container';

    const info = document.createElement('div');
    info.className = 'product-info';

    const principalInfo = document.createElement('div');
    principalInfo.className = 'product-principal-info';

    const name = document.createElement('div');
    name.className = 'product-name';
    name.textContent = product.name;

    const categoryDiv = document.createElement('div');
    categoryDiv.className = 'product-category';
    const categoryText = `${product.section_name} - ${product.category_name}`;
    categoryDiv.textContent = categoryText;

    principalInfo.appendChild(name)
    principalInfo.appendChild(categoryDiv)

    const price = document.createElement('div');
    price.className = 'product-price';
    price.textContent = `€${product.price}`

    const cartButton = document.createElement('button');
    cartButton.className = `product-status ${product.isInCart ? 'status-added' : 'status-add-to-cart'}`;
    cartButton.addEventListener('click', function (e) {
        e.preventDefault();
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

    info.appendChild(principalInfo);
    info.appendChild(price);

    infoContainer.appendChild(info);
    infoContainer.appendChild(cartButton);

    card.appendChild(imageContainer);
    card.appendChild(infoContainer);

    return card;
}

function handleRemoveFromFavorites(productId, cardElement) {
    const formData = new FormData();
    formData.append('productId', productId);

    fetch("/api/favorites/remove", {
        method: 'POST',
        body: formData,
        headers: {
            'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''
        }
    })
        .then(response => response.json())
        .then(result => {
            if (result.success) {
                cardElement.style.opacity = '0.5';
                loadFavoriteProducts();
                updateFavoritesCounter(-1);
            } else {
                if (result.error_type === 'auth_required') {
                    showAuthRequiredState(result.message, result.redirect_url);
                } else {
                    showErrorMessage(result.message || 'Errore durante la rimozione dai preferiti');
                }
            }
        }).catch(error => {
            console.error('Errore nella rimozione dai preferiti:', error);
            showErrorMessage('Errore nella rimozione del prodotto. Riprova.');
        })
}

function handleCartToggle(productId, buttonElement, isCurrentlyInCart) {
    if (isCurrentlyInCart) {
        handleRemoveFromCart(productId, buttonElement);
    } else {
        handleAddToCart(productId, buttonElement);
    }
}

function handleRemoveFromCart(productId, buttonElement) {
    buttonElement.disabled = true;
    buttonElement.style.opacity = '0.6';
    const originalText = buttonElement.innerHTML;

    buttonElement.textContent = 'Rimuovendo...';

    const formData = new FormData();
    formData.append('productId', productId);

    fetch("/api/cart/remove", {
        method: 'POST',
        body: formData,
        headers: {
            'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''
        }
    })
        .then(response => response.json())
        .then(result => {
            if (result.success) {
                buttonElement.className = 'product-status status-add-to-cart';
                buttonElement.textContent = 'Aggiungi al carrello';

                updateCartCounter(result.deleted_count);
                showSuccessMessage('Prodotto rimosso dal carrello');

                loadFavoriteProducts();
            } else {
                if (result.error_type === 'auth_required') {
                    showAuthRequiredState(result.message, result.redirect_url);
                } else {
                    showErrorMessage(result.message || 'Errore durante la rimozione dal carrello');
                    buttonElement.innerHTML = originalText;
                }

            }
        })
        .catch(error => {
            console.error('Errore nella rimozione dal carrello:', error);
            showErrorMessage('Errore nella rimozione del prodotto. Riprova.');
            buttonElement.innerHTML = originalText;
        })
        .finally(function () {
            buttonElement.disabled = false;
            buttonElement.style.opacity = '1';
        });
}

function handleAddToCart(productId, buttonElement) {
    showAddToCartModal(productId, buttonElement);
}

function showAddToCartModal(productId, buttonElement) {
    const modal = document.createElement('div');
    modal.className = 'cart-modal';

    const modalContent = document.createElement('div');
    modalContent.className = 'cart-modal-content';

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

    const body = document.createElement('div');
    body.className = 'cart-modal-body';

    const loading = document.createElement('div');
    loading.className = 'loading';
    loading.textContent = 'Caricamento opzioni...';
    body.appendChild(loading);

    modalContent.appendChild(header);
    modalContent.appendChild(body);
    modal.appendChild(modalContent);
    document.body.appendChild(modal);

    closeBtn.addEventListener('click', () => document.body.removeChild(modal));
    modal.addEventListener('click', function (e) {
        if (e.target === modal) document.body.removeChild(modal);
    });

    fetch(`/api/favorites/product?id=${productId}`)
        .then(response => response.json())
        .then(result => {
            if (result.success) {
                renderCartModal(result.data, modal, buttonElement);
            } else {
                showErrorMessage('Errore nel caricamento delle opzioni prodotto');
                document.body.removeChild(modal);
            }
        })
        .catch(error => {
            console.error('Errore:', error);
            showErrorMessage('Errore nel caricamento delle opzioni prodotto');
            document.body.removeChild(modal);
        });
}

function renderCartModal(product, modal, buttonElement) {
    const modalBody = modal.querySelector('.cart-modal-body');
    let selectedColorId = product.colors[0]?.id || null;
    let selectedSizeId = null;

    modalBody.innerHTML = '';

    const productOptions = document.createElement('div');
    productOptions.className = 'product-options';

    const productName = document.createElement('h4');
    productName.textContent = product.name;

    const productPrice = document.createElement('p');
    productPrice.className = 'product-price';
    productPrice.textContent = `€${product.price}`;

    productOptions.appendChild(productName);
    productOptions.appendChild(productPrice);

    if (product.colors && product.colors.length > 0) {
        const colorSelection = document.createElement('div');
        colorSelection.className = 'color-selection';

        const colorTitle = document.createElement('h5');
        colorTitle.textContent = 'Colore';

        const colorOptions = document.createElement('div');
        colorOptions.className = 'color-options';

        product.colors.forEach((color, index) => {
            const colorOption = document.createElement('div');
            colorOption.className = 'color-option';
            if (index === 0) colorOption.classList.add('selected');
            colorOption.dataset.colorId = color.id;
            colorOption.title = color.name;
            colorOption.style.backgroundColor = color.hex_code;

            colorOption.addEventListener('click', function () {
                colorOptions.querySelectorAll('.color-option').forEach(el => {
                    el.classList.remove('selected');
                });
                colorOption.classList.add('selected');
                selectedColorId = colorOption.dataset.colorId;
            });

            colorOptions.appendChild(colorOption);
        });

        colorSelection.appendChild(colorTitle);
        colorSelection.appendChild(colorOptions);
        productOptions.appendChild(colorSelection);
    }

    if (product.sizes && product.sizes.length > 0) {
        const sizeSelection = document.createElement('div');
        sizeSelection.className = 'size-selection';

        const sizeTitle = document.createElement('h5');
        sizeTitle.textContent = 'Taglia';

        const sizeOptions = document.createElement('div');
        sizeOptions.className = 'size-options';

        product.sizes.forEach(size => {
            const sizeOption = document.createElement('button');
            sizeOption.className = 'size-option';
            sizeOption.dataset.sizeId = size.id;
            sizeOption.disabled = size.pivot.stock_quantity <= 0;
            sizeOption.textContent = `EU ${size.value} ${size.pivot.stock_quantity <= 0 ? '(Esaurito)' : ''}`;

            sizeOption.addEventListener('click', function () {
                if (!sizeOption.disabled) {
                    sizeOptions.querySelectorAll('.size-option').forEach(el => {
                        el.classList.remove('selected');
                    });
                    sizeOption.classList.add('selected');
                    selectedSizeId = sizeOption.dataset.sizeId;

                    addBtn.disabled = false;
                    addBtn.textContent = 'Aggiungi al carrello';
                }
            });

            sizeOptions.appendChild(sizeOption);
        });

        sizeSelection.appendChild(sizeTitle);
        sizeSelection.appendChild(sizeOptions);
        productOptions.appendChild(sizeSelection);
    }

    const addBtn = document.createElement('button');
    addBtn.className = 'add-to-cart-modal-btn';
    addBtn.disabled = true;
    addBtn.textContent = 'Seleziona una taglia';

    addBtn.addEventListener('click', function () {
        if (selectedSizeId) {
            addToCartWithOptions(product.id, selectedColorId, selectedSizeId, buttonElement, modal);
        }
    });

    productOptions.appendChild(addBtn);
    modalBody.appendChild(productOptions);
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

    fetch("/api/cart/add", {
        method: 'POST',
        body: formData,
        headers: {
            'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''
        }
    })
        .then(response => response.json())
        .then(result => {
            if (result.success) {
                buttonElement.className = 'product-status status-added';

                const statusIndicator = document.createElement('span');
                statusIndicator.className = 'status-indicator';

                buttonElement.innerHTML = '';
                buttonElement.appendChild(statusIndicator);
                buttonElement.appendChild(document.createTextNode('Aggiunto'));

                updateCartCounter(1);
                showSuccessMessage('Prodotto aggiunto al carrello');
                document.body.removeChild(modal);

                loadFavoriteProducts();
            } else {
                showErrorMessage(result.message || 'Errore durante l\'aggiunta al carrello');
                addBtn.disabled = false;
                addBtn.classList.remove('loading');
                addBtn.textContent = 'Aggiungi al carrello';
            }
        })
        .catch(error => {
            console.error('Errore nell\'aggiunta al carrello:', error);
            showErrorMessage('Errore nell\'aggiunta al carrello. Riprova.');
            addBtn.disabled = false;
            addBtn.classList.remove('loading');
            addBtn.textContent = 'Aggiungi al carrello';
        });
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

function showAuthRequiredState(message, redirectUrl) {
    const productsGrid = document.querySelector('.products-grid');
    productsGrid.innerHTML = "";

    const authAlert = document.createElement("div");
    authAlert.classList.add("auth-required-alert");

    const icon = document.createElement("i");
    icon.className = "fa-solid fa-heart auth-icon";

    const title = document.createElement("h2");
    title.className = "auth-title";
    title.textContent = "Accedi per vedere i tuoi preferiti";

    const description = document.createElement("p");
    description.className = "auth-description";
    description.textContent = message || "Devi essere loggato per accedere ai tuoi preferiti";

    const loginBtn = document.createElement("a");
    loginBtn.href = redirectUrl || "/login";
    loginBtn.className = "btn btn-primary btn-login";
    loginBtn.textContent = "Accedi";

    authAlert.appendChild(icon);
    authAlert.appendChild(title);
    authAlert.appendChild(description);
    authAlert.appendChild(loginBtn);
    productsGrid.appendChild(authAlert);
}

function showErrorMessage(message) {
    showMessage(message, 'error');
}

function showSuccessMessage(message) {
    showMessage(message, 'success');
}

function showMessage(message, type) {
    const existingMessages = document.querySelectorAll('.feedback-message');
    existingMessages.forEach(msg => msg.remove());

    const messageElement = document.createElement('div');
    messageElement.className = `feedback-message feedback-${type}`;
    messageElement.textContent = message;

    document.body.appendChild(messageElement);

    messageElement.offsetHeight;
    messageElement.classList.add('show');

    messageElement.addEventListener('click', function () {
        messageElement.classList.remove('show');
    });
}

function updateFavoritesCounter(delta) {
    const counter = document.getElementById('favorites-counter');
    if (counter) {
        const current = parseInt(counter.textContent) || 0;
        const newValue = Math.max(0, current + delta);
        counter.textContent = newValue;
        counter.classList.toggle('hidden', newValue === 0);
    }
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