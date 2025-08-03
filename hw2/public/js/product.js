// ========== CONSTANTS ==========
const SHOE_HEIGHT_LABELS = {
    'low': 'Basse',
    'mid': 'Medie',
    'high': 'Alte'
};

// ========== VARIABLES ==========
let selectedColorId = null;
let selectedSizeId = null;
let productId = null;
let productData = null;
let isFavorite = false;

let container = null;

// ========== UTILITY FUNCTIONS ==========

function formatPrice(price) {
    const number = parseFloat(price);
    if (isNaN(number)) return "";
    return '€' + number.toFixed(2).replace('.', ',');
}

function updateCounters(favoriteDelta, cartDelta) {
    if (favoriteDelta !== 0) {
        const favCounter = document.getElementById('favorites-counter');
        if (favCounter) {
            const current = parseInt(favCounter.textContent) || 0;
            const newValue = Math.max(0, current + favoriteDelta);
            favCounter.textContent = newValue;
            favCounter.classList.toggle('hidden', newValue === 0);
        }
    }

    if (cartDelta !== 0) {
        const cartCounter = document.getElementById('cart-counter');
        if (cartCounter) {
            const current = parseInt(cartCounter.textContent) || 0;
            const newValue = Math.max(0, current + cartDelta);
            cartCounter.textContent = newValue;
            cartCounter.classList.toggle('hidden', newValue === 0);
        }
    }
}

function showMessage(message, type) {
    const messageDiv = document.getElementById(type === 'error' ? 'error-message' : 'success-message');
    if (messageDiv) {
        messageDiv.textContent = message;
        messageDiv.style.display = 'block';
    }
}

function setIsLoading(isLoading) {
    const element = document.getElementById('loading');
    if (!element) return;

    if (isLoading) {
        element.style.display = 'block';
    } else {
        element.style.display = 'none';
    }
}

function showErrorMessage(message) {
    const errorDiv = document.createElement("div");
    errorDiv.classList.add("error");
    errorDiv.textContent = message;
    container.appendChild(errorDiv);
}

function getProductIdFromUrl() {
    const pathParts = window.location.pathname.split('/');
    const productIndex = pathParts.indexOf('product');
    return (productIndex !== -1 && pathParts[productIndex + 1]) ? pathParts[productIndex + 1] : null;
}

// ========== CREATE PRODUCT =========
function createThumbnailImage(image, index) {
    const thumbnail = document.createElement('div');
    thumbnail.classList.add('thumbnail');
    if (index === 0) {
        thumbnail.classList.add('active');
    }

    thumbnail.addEventListener("click", function () {
        const mainImage = document.getElementById('main-product-image');
        if (mainImage) {
            mainImage.src = image.image_url;
        }

        const thumbnails = document.querySelectorAll('.thumbnail');
        if (thumbnails) {
            thumbnails.forEach(function (thumb) {
                thumb.classList.remove('active');
            });
        }

        thumbnail.classList.add('active');
    });

    const img = document.createElement('img');
    img.src = image.image_url;
    img.alt = image.alt_text;
    thumbnail.appendChild(img);

    return thumbnail;
}

function createProductImages(product) {
    const productImages = document.createElement('div');
    productImages.className = 'product-images';

    const thumbnails = document.createElement('div');
    thumbnails.className = 'thumbnails';

    if (product.images && product.images.length > 0) {
        product.images.forEach(function (image, index) {
            const thumbnail = createThumbnailImage(image, index);
            thumbnails.appendChild(thumbnail);
        });
    }

    const mainImage = document.createElement('div');
    mainImage.className = 'main-image';
    const img = document.createElement('img');
    img.id = 'main-product-image';
    img.src = product.images[0].image_url;
    img.alt = product.name;
    mainImage.appendChild(img);

    productImages.appendChild(thumbnails);
    productImages.appendChild(mainImage);

    return productImages;
}

function createProductHeader(product) {
    const header = document.createElement('div');

    const title = document.createElement('h1');
    title.textContent = product.name;
    header.appendChild(title);

    const categoryDiv = document.createElement('div');
    categoryDiv.className = 'product-category';
    categoryDiv.textContent = product.section_name + ' - ' + product.category_name;
    header.appendChild(categoryDiv);

    return header;
}

function createBadges(product) {
    if (!product.is_new_arrival && !product.is_bestseller && !product.is_on_sale) {
        return null;
    }

    const badges = document.createElement('div');
    badges.className = 'badges';

    if (product.is_new_arrival) {
        const badge = document.createElement('span');
        badge.className = 'badge new-arrival';
        badge.textContent = 'Nuovi arrivi';
        badges.appendChild(badge);
    }

    if (product.is_bestseller) {
        const badge = document.createElement('span');
        badge.className = 'badge bestseller';
        badge.textContent = 'Bestseller';
        badges.appendChild(badge);
    }

    if (product.is_on_sale) {
        const badge = document.createElement('span');
        badge.className = 'badge on-sale';
        badge.textContent = 'In offerta';
        badges.appendChild(badge);
    }

    return badges;
}

function createRating(product) {
    if (!product.rating || product.rating <= 0) {
        return null;
    }

    const rating = document.createElement('div');
    rating.className = 'rating';

    const starsDiv = document.createElement('div');
    starsDiv.className = 'stars';

    for (let i = 1; i <= 5; i++) {
        const star = document.createElement('i');
        if (i <= product.rating) {
            star.className = 'fas fa-star';
        } else if (i - 0.5 <= product.rating) {
            star.className = 'fas fa-star-half-alt';
        } else {
            star.className = 'far fa-star';
        }
        starsDiv.appendChild(star);
    }

    const ratingText = document.createElement('span');
    ratingText.className = 'rating-text';
    ratingText.textContent = product.rating + ' (' + (product.rating_count || 0) + ' recensioni)';

    rating.appendChild(starsDiv);
    rating.appendChild(ratingText);

    return rating;
}

function createPriceSection(product) {
    const priceDiv = document.createElement('div');
    priceDiv.className = 'price';

    const current = document.createElement('span');
    current.className = 'current-price';
    current.textContent = formatPrice(product.price);
    priceDiv.appendChild(current);

    if (product.original_price && product.original_price > product.price) {
        const original = document.createElement('span');
        original.className = 'original-price';
        original.textContent = formatPrice(product.original_price);

        const discount = document.createElement('span');
        discount.className = 'discount';
        discount.textContent = '-' + (product.discount_percentage || 0) + '%';

        priceDiv.appendChild(original);
        priceDiv.appendChild(discount);
    }

    return priceDiv;
}

function handleColorSelection(colorOption, colorId) {
    const colorOptions = document.querySelectorAll('.color-option');
    colorOptions.forEach(function (c) {
        c.classList.remove('selected');
    });
    colorOption.classList.add('selected');
    selectedColorId = colorId;
    checkAddToCartButton();
}

function createColorOptions(product) {
    if (!product.colors || product.colors.length === 0) {
        return null;
    }

    const colorsWrapper = document.createElement('div');
    colorsWrapper.className = 'colors';

    const colorsTitle = document.createElement('h3');
    colorsTitle.textContent = 'Colori disponibili';

    const colorOptions = document.createElement('div');
    colorOptions.className = 'color-options';

    product.colors.forEach(function (color, index) {
        const div = document.createElement('div');
        div.className = 'color-option' + (index === 0 ? ' selected' : '');
        div.style.backgroundColor = color.hex_code;
        div.dataset.colorId = color.id;
        div.title = color.name;

        div.addEventListener("click", function () {
            handleColorSelection(div, div.dataset.colorId);
        });

        colorOptions.appendChild(div);
    });

    colorsWrapper.appendChild(colorsTitle);
    colorsWrapper.appendChild(colorOptions);

    return colorsWrapper;
}

function handleSizeSelection(sizeOption, sizeId) {
    if (sizeOption.classList.contains('out-of-stock')) {
        showMessage('Taglia non disponibile', 'error');
        return;
    }

    document.querySelectorAll('.size-option').forEach(function (s) {
        s.classList.remove('selected');
    });

    sizeOption.classList.add('selected');
    selectedSizeId = sizeId;
    checkAddToCartButton();
}

function createSizeOptions(product) {
    if (!product.sizes || product.sizes.length === 0) {
        return null;
    }

    const sizesWrapper = document.createElement('div');
    sizesWrapper.className = 'sizes';

    const header = document.createElement('div');
    header.className = 'sizes-header';

    const title = document.createElement('h3');
    title.className = 'sizes-title';
    title.textContent = 'Seleziona la taglia/misura';

    const guide = document.createElement('a');
    guide.className = 'size-guide';
    guide.textContent = 'Guida alle taglie e alle misure';
    guide.href = "https://www.nike.com/it/size-fit/scarpe-kids";
    guide.target = "_blank";

    header.appendChild(title);
    header.appendChild(guide);

    const sizeOptions = document.createElement('div');
    sizeOptions.className = 'size-options';

    product.sizes.forEach(function (size) {
        const div = document.createElement('div');
        div.className = 'size-option';

        if (size.stock_quantity == 0) {
            div.classList.add('out-of-stock');
        }

        div.dataset.sizeId = size.id;
        div.dataset.stock = size.stock_quantity;
        div.textContent = 'EU ' + size.value;

        div.addEventListener('click', function () {
            handleSizeSelection(div, div.dataset.sizeId);
        });

        sizeOptions.appendChild(div);
    });

    sizesWrapper.appendChild(header);
    sizesWrapper.appendChild(sizeOptions);

    return sizesWrapper;
}

function createDescription(product) {
    if (!product.description) {
        return null;
    }

    const descDiv = document.createElement('div');
    descDiv.className = 'product-description';
    const p = document.createElement('p');
    p.textContent = product.description;
    descDiv.appendChild(p);

    return descDiv;
}

function createAdditionalInfo(product) {
    if (!product.sport_name && (!product.shoe_height || !SHOE_HEIGHT_LABELS[product.shoe_height])) {
        return null;
    }

    const additionalInfo = document.createElement('div');
    additionalInfo.className = 'additional-info';

    if (product.sport_name) {
        const sport = document.createElement('p');
        sport.className = 'info-item';

        const sportLabel = document.createElement('strong');
        sportLabel.textContent = 'Categoria Sport: ';

        const sportValue = document.createElement('span');
        sportValue.textContent = product.sport_name;

        sport.appendChild(sportLabel);
        sport.appendChild(sportValue);
        additionalInfo.appendChild(sport);
    }

    if (product.shoe_height && SHOE_HEIGHT_LABELS[product.shoe_height]) {
        const height = document.createElement('p');
        height.className = 'info-item';

        const heightLabel = document.createElement('strong');
        heightLabel.textContent = 'Altezza: ';

        const heightValue = document.createElement('span');
        heightValue.textContent = SHOE_HEIGHT_LABELS[product.shoe_height];

        height.appendChild(heightLabel);
        height.appendChild(heightValue);
        additionalInfo.appendChild(height);
    }

    return additionalInfo;
}

function createAddToCartButton() {
    const addToCartBtn = document.createElement('button');
    addToCartBtn.className = 'add-to-cart';
    addToCartBtn.id = 'add-to-cart-btn';
    addToCartBtn.textContent = 'Seleziona una taglia';
    addToCartBtn.disabled = true;

    addToCartBtn.addEventListener("click", handleAddToCart);

    return addToCartBtn;
}

function createAddToFavoritesButton() {
    const addToFavBtn = document.createElement('button');
    addToFavBtn.className = 'add-to-favorites';
    addToFavBtn.id = 'add-to-favorites-btn';

    return addToFavBtn;
}

function createMessageContainers() {
    const messageContainer = document.createElement('div');

    const errorMsg = document.createElement('div');
    errorMsg.id = 'error-message';
    errorMsg.className = 'error-message';
    messageContainer.appendChild(errorMsg);

    const successMsg = document.createElement('div');
    successMsg.id = 'success-message';
    successMsg.className = 'success-message';
    messageContainer.appendChild(successMsg);

    return messageContainer;
}

function renderProduct(product) {
    const productDetail = document.createElement('div');
    productDetail.classList.add("product-detail");

    if (product.colors && product.colors.length > 0) {
        selectedColorId = product.colors[0].id;
    }

    const productImages = createProductImages(product);

    const productInfo = document.createElement('div');
    productInfo.className = 'product-info';

    const header = createProductHeader(product);
    productInfo.appendChild(header);

    const badges = createBadges(product);
    if (badges) {
        productInfo.appendChild(badges);
    }

    const rating = createRating(product);
    if (rating) {
        productInfo.appendChild(rating);
    }

    const priceSection = createPriceSection(product);
    productInfo.appendChild(priceSection);

    const colorOptions = createColorOptions(product);
    if (colorOptions) {
        productInfo.appendChild(colorOptions);
    }

    const sizeOptions = createSizeOptions(product);
    if (sizeOptions) {
        productInfo.appendChild(sizeOptions);
    }

    const addToCartBtn = createAddToCartButton();
    productInfo.appendChild(addToCartBtn);

    const addToFavBtn = createAddToFavoritesButton();
    productInfo.appendChild(addToFavBtn);

    const messageContainers = createMessageContainers();
    productInfo.appendChild(messageContainers);

    const description = createDescription(product);
    if (description) {
        productInfo.appendChild(description);
    }

    const additionalInfo = createAdditionalInfo(product);
    if (additionalInfo) {
        productInfo.appendChild(additionalInfo);
    }

    productDetail.appendChild(productImages);
    productDetail.appendChild(productInfo);
    container.appendChild(productDetail);
    updateFavoriteButton();
    checkAddToCartButton();
}

function checkAddToCartButton() {
    const addToCartBtn = document.getElementById('add-to-cart-btn');
    if (!addToCartBtn) return;

    if (selectedSizeId) {
        addToCartBtn.disabled = false;
        addToCartBtn.textContent = 'Aggiungi al carrello';
    } else {
        addToCartBtn.disabled = true;
        addToCartBtn.textContent = 'Seleziona una taglia';
    }
}

function updateFavoriteButton() {
    const addToFavBtn = document.getElementById('add-to-favorites-btn');
    if (!addToFavBtn) return;

    addToFavBtn.onclick = null;

    if (isFavorite) {
        addToFavBtn.textContent = 'Rimuovi dai preferiti';
        addToFavBtn.classList.add('in-favorites');
        addToFavBtn.addEventListener("click", handleRemoveFromFavorites);
    } else {
        addToFavBtn.textContent = 'Aggiungi ai preferiti';
        addToFavBtn.classList.remove('in-favorites');
        addToFavBtn.addEventListener("click", handleAddToFavorites);
    }
}

// ========== API CALLS ==========
function handleAddToCart() {
    if (!selectedSizeId) {
        showMessage('Seleziona una taglia prima di aggiungere al carrello', 'error');
        return;
    }

    const addToCartBtn = document.getElementById('add-to-cart-btn');
    const originalText = addToCartBtn.textContent;
    addToCartBtn.disabled = true;
    addToCartBtn.textContent = 'Aggiungendo...';

    const formData = new FormData();
    formData.append('productId', productData.id);
    formData.append('colorId', selectedColorId);
    formData.append('sizeId', selectedSizeId);
    formData.append('quantity', 1);
    formData.append('_token', getCsrfToken());

    fetch('/api/cart/add', {
        method: 'POST',
        body: formData,
    })
        .then(onResponse)
        .then(function (result) {
            if (!result) return;

            if (result.success) {
                updateCounters(0, 1);
                showMessage('Prodotto aggiunto al carrello con successo!', 'success');
            } else {
                showMessage(result.message || 'Errore durante l\'aggiunta al carrello', 'error');
            }
        })
        .catch(function (error) {
            console.error('Errore nella richiesta:', error);
            showMessage('Errore di connessione. Riprova più tardi.', 'error');
        })
        .finally(function () {
            addToCartBtn.disabled = false;
            addToCartBtn.textContent = originalText;
            checkAddToCartButton();
        });
}

function handleAddToFavorites() {
    const addToFavBtn = document.getElementById('add-to-favorites-btn');
    const originalText = addToFavBtn.textContent;
    addToFavBtn.disabled = true;
    addToFavBtn.textContent = 'Aggiungendo...';

    const formData = new FormData();
    formData.append('productId', productData.id);
    formData.append('_token', getCsrfToken());

    fetch('/api/favorites/add', {
        method: 'POST',
        body: formData,
    })
        .then(onResponse)
        .then(function (result) {
            if (!result) return;

            if (result.success) {
                isFavorite = true;
                updateFavoriteButton();
                showMessage('Prodotto aggiunto ai preferiti!', 'success');
                updateCounters(1, 0);
            } else {
                showMessage(result.message || 'Errore durante l\'aggiunta ai preferiti', 'error');
            }
        })
        .catch(function (error) {
            console.error('Errore nella richiesta:', error);
            showMessage('Errore di connessione. Riprova più tardi.', 'error');
        })
        .finally(function () {
            addToFavBtn.disabled = false;
            if (!isFavorite) {
                addToFavBtn.textContent = originalText;
            }
        });
}

function handleRemoveFromFavorites() {
    const addToFavBtn = document.getElementById('add-to-favorites-btn');
    const originalText = addToFavBtn.textContent;
    addToFavBtn.disabled = true;
    addToFavBtn.textContent = 'Rimuovendo...';

    const formData = new FormData();
    formData.append('productId', productData.id);
    formData.append('_token', getCsrfToken());

    fetch('/api/favorites/remove', {
        method: 'POST',
        body: formData,
    })
        .then(onResponse)
        .then(function (result) {
            if (!result) return;

            if (result.success) {
                isFavorite = false;
                updateFavoriteButton();
                updateCounters(-1, 0);
                showMessage('Prodotto rimosso dai preferiti!', 'success');
            } else {
                showMessage(result.message || 'Errore durante la rimozione dai preferiti', 'error');
            }
        })
        .catch(function (error) {
            console.error('Errore nella richiesta:', error);
            showMessage('Errore di connessione. Riprova più tardi.', 'error');
        })
        .finally(function () {
            addToFavBtn.disabled = false;
            if (isFavorite) {
                addToFavBtn.textContent = originalText;
            }
        });
}

function loadProduct() {
    setIsLoading(true);

    productId = getProductIdFromUrl();

    if (!productId) {
        showErrorMessage('ID prodotto non trovato');
        setIsLoading(false)
        return;
    }

    fetch('/api/product?id=' + productId)
        .then(onResponse)
        .then(function (data) {
            if (!data || !data.success) {
                showErrorMessage(data?.message || 'Errore nel caricamento dei prodotti');
                return;
            }

            productData = data.data;
            isFavorite = data.data.is_favorite;
            renderProduct(data.data);
        })
        .catch(function (error) {
            console.error('Errore nel caricamento del prodotto:', error);
            showErrorMessage(error.message);
        })
        .finally(function () {
            setIsLoading(false);
        });
}


function initialize() {
    container = document.querySelector('.container');
    if(!container) return;

    container.style.display = 'grid';

    loadProduct();
}

initialize();