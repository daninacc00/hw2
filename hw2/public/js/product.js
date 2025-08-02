let selectedColorId = null;
let selectedSizeId = null;
let productId = null;
let productData = null;
let isFavorite = false;

const shoeHeightLabels = {
    'low': 'Basse',
    'mid': 'Medie',
    'high': 'Alte'
};

function getProductIdFromUrl() {
    const pathParts = window.location.pathname.split('/');
    const productIndex = pathParts.indexOf('product');

    if (productIndex !== -1 && pathParts[productIndex + 1]) {
        return pathParts[productIndex + 1];
    }
    
    return null;
}

loadProduct();

function loadProduct() {
    showLoading();
    hideError();

    productId = getProductIdFromUrl();

    if (!productId) {
        showError('ID prodotto non trovato');
        return;
    }

    fetch('/api/product?id=' + productId, {
        headers: {
            'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content') || ''
        }
    })
        .then(function(response) {
            console.log('Response status:', response.status);
            console.log('Response URL:', response.url);

            if (!response.ok) {
                throw new Error('HTTP ' + response.status + ': ' + response.statusText);
            }
            return response.json();
        })
        .then(function(result) {
            console.log('API Result:', result);

            if (!result.success || !result.data) {
                throw new Error(result.message || 'Prodotto non trovato');
            }
            productData = result.data;
            isFavorite = result.data.is_favorite;
            renderProduct(result.data);
            updateFavoriteButton();
            hideLoading();
        })
        .catch(function(error) {
            console.error('Errore nel caricamento del prodotto:', error);
            showError(error.message);
            hideLoading();
        });
}

function renderProduct(product) {
    const container = document.getElementById('product-detail');
    container.innerHTML = '';

    if (product.colors && product.colors.length > 0) {
        selectedColorId = product.colors[0].id;
    }

    const productImages = document.createElement('div');
    productImages.className = 'product-images';

    const thumbnails = document.createElement('div');
    thumbnails.className = 'thumbnails';
    thumbnails.appendChild(renderThumbnails(product.images));

    const mainImage = document.createElement('div');
    mainImage.className = 'main-image';

    const img = document.createElement('img');
    img.id = 'main-product-image';
    img.src = product.images[0].image_url;
    img.alt = product.name;
    mainImage.appendChild(img);

    productImages.appendChild(thumbnails);
    productImages.appendChild(mainImage);

    const productInfo = document.createElement('div');
    productInfo.className = 'product-info';

    const title = document.createElement('h1');
    title.textContent = product.name;

    const categoryDiv = document.createElement('div');
    categoryDiv.className = 'product-category';
    const categoryText = product.section_name + ' - ' + product.category_name;
    categoryDiv.textContent = categoryText;

    productInfo.appendChild(title);
    productInfo.appendChild(categoryDiv);
    productInfo.appendChild(renderBadges(product));
    productInfo.appendChild(renderRating(product));
    productInfo.appendChild(renderPrice(product));
    productInfo.appendChild(renderColors(product.colors));
    productInfo.appendChild(renderSizes(product.sizes));

    const addToCartBtn = document.createElement('button');
    addToCartBtn.className = 'add-to-cart';
    addToCartBtn.id = 'add-to-cart-btn';
    addToCartBtn.textContent = 'Aggiungi al carrello';
    addToCartBtn.disabled = true;
    addToCartBtn.addEventListener("click", addToCart);

    const addToFavBtn = document.createElement('button');
    addToFavBtn.className = 'add-to-favorites';
    addToFavBtn.id = 'add-to-favorites-btn';
    addToFavBtn.textContent = 'Aggiungi ai preferiti';

    const errorMsg = document.createElement('div');
    errorMsg.id = 'error-message';
    errorMsg.className = 'error-message';

    const successMsg = document.createElement('div');
    successMsg.id = 'success-message';
    successMsg.className = 'success-message';

    productInfo.appendChild(addToCartBtn);
    productInfo.appendChild(addToFavBtn);
    productInfo.appendChild(errorMsg);
    productInfo.appendChild(successMsg);
    productInfo.appendChild(renderDescription(product));
    productInfo.appendChild(renderAdditionalInfo(product));

    container.appendChild(productImages);
    container.appendChild(productInfo);
    container.style.display = 'grid';

    checkAddToCartButton();
}

function renderThumbnails(images) {
    const thumbnails = document.createElement("div");

    if (!images || images.length === 0) return thumbnails;

    images.forEach(function(image, index) {
        const thumbDiv = document.createElement('div');
        thumbDiv.className = 'thumbnail' + (index === 0 ? ' active' : '');
        thumbDiv.addEventListener("click", function() {
            changeMainImage(image.image_url, thumbDiv);
        });

        const img = document.createElement('img');
        img.src = image.image_url;
        img.alt = image.alt_text;

        thumbDiv.appendChild(img);
        thumbnails.appendChild(thumbDiv);
    });

    return thumbnails;
}

function renderBadges(product) {
    const container = document.createElement('div');
    container.className = 'badges';

    if (product.is_new_arrival) {
        const badge = document.createElement('span');
        badge.className = 'badge new-arrival';
        badge.textContent = 'Nuovi arrivi';
        container.appendChild(badge);
    }

    if (product.is_bestseller) {
        const badge = document.createElement('span');
        badge.className = 'badge bestseller';
        badge.textContent = 'Bestseller';
        container.appendChild(badge);
    }

    if (product.is_on_sale) {
        const badge = document.createElement('span');
        badge.className = 'badge on-sale';
        badge.textContent = 'In offerta';
        container.appendChild(badge);
    }

    return container;
}

function renderRating(product) {
    if (!product.rating || product.rating <= 0)
        return document.createElement("div");

    const container = document.createElement('div');
    container.className = 'rating';

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

    container.appendChild(starsDiv);
    container.appendChild(ratingText);

    return container;
}

function renderPrice(product) {
    const div = document.createElement('div');
    div.className = 'price';

    const current = document.createElement('span');
    current.className = 'current-price';
    current.textContent = formatPrice(product.price);
    div.appendChild(current);

    if (product.original_price && product.original_price > product.price) {
        const original = document.createElement('span');
        original.className = 'original-price';
        original.textContent = formatPrice(product.original_price);

        const discount = document.createElement('span');
        discount.className = 'discount';
        discount.textContent = '-' + (product.discount_percentage || 0) + '%';

        div.appendChild(original);
        div.appendChild(discount);
    }

    return div;
}

function renderColors(colors) {
    if (!colors || colors.length === 0)
        return document.createElement('div');

    const wrapper = document.createElement('div');
    wrapper.className = 'colors';

    const title = document.createElement('h3');
    title.textContent = 'Colori disponibili';

    const options = document.createElement('div');
    options.className = 'color-options';

    colors.forEach(function(color, index) {
        const div = document.createElement('div');
        div.className = 'color-option' + (index === 0 ? ' selected' : '');
        div.style.backgroundColor = color.hex_code;
        div.dataset.colorId = color.id;
        div.title = color.name;
        div.addEventListener("click", function() {
            selectColor(div);
        });
        options.appendChild(div);
    });

    wrapper.appendChild(title);
    wrapper.appendChild(options);

    return wrapper;
}

function renderSizes(sizes) {
    if (!sizes || sizes.length === 0)
        return document.createDocumentFragment();

    const wrapper = document.createElement('div');
    wrapper.className = 'sizes';

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

    const options = document.createElement('div');
    options.className = 'size-options';

    sizes.forEach(function(size) {
        const div = document.createElement('div');
        div.className = 'size-option';
        if (size.stock_quantity == 0) {
            div.classList.add('out-of-stock');
        }
        div.dataset.sizeId = size.id;
        div.dataset.stock = size.stock_quantity;
        div.textContent = 'EU ' + size.value;
        div.addEventListener('click', function() {
            selectSize(div);
        });
        options.appendChild(div);
    });

    wrapper.appendChild(header);
    wrapper.appendChild(options);

    return wrapper;
}

function renderDescription(product) {
    if (!product.description) return document.createDocumentFragment();

    const div = document.createElement('div');
    div.className = 'product-description';

    const p = document.createElement('p');
    p.textContent = product.description;

    div.appendChild(p);

    return div;
}

function renderAdditionalInfo(product) {
    const div = document.createElement('div');
    div.className = 'additional-info';

    if (product.sport_name) {
        const sport = document.createElement('p');
        sport.className = 'info-item';

        const sportLabel = document.createElement('strong');
        sportLabel.textContent = 'Categoria Sport: ';

        const sportValue = document.createElement('span');
        sportValue.textContent = product.sport_name;

        sport.appendChild(sportLabel);
        sport.appendChild(sportValue);
        div.appendChild(sport);
    }

    if (product.shoe_height && shoeHeightLabels[product.shoe_height]) {
        const height = document.createElement('p');
        height.className = 'info-item';

        const heightLabel = document.createElement('strong');
        heightLabel.textContent = 'Altezza: ';

        const heightValue = document.createElement('span');
        heightValue.textContent = shoeHeightLabels[product.shoe_height];

        height.appendChild(heightLabel);
        height.appendChild(heightValue);
        div.appendChild(height);
    }

    return div;
}

function changeMainImage(imageUrl, thumbnailElement) {
    document.getElementById('main-product-image').src = imageUrl;

    document.querySelectorAll('.thumbnail').forEach(function(thumb) {
        thumb.classList.remove('active');
    });

    thumbnailElement.classList.add('active');
}

function selectColor(colorElement) {
    document.querySelectorAll('.color-option').forEach(function(color) {
        color.classList.remove('selected');
    });

    colorElement.classList.add('selected');
    selectedColorId = colorElement.dataset.colorId;
    checkAddToCartButton();
}

function selectSize(sizeElement) {
    if (sizeElement.classList.contains('out-of-stock')) {
        showErrorMessage('Taglia non disponibile');
        return;
    }

    document.querySelectorAll('.size-option').forEach(function(size) {
        size.classList.remove('selected');
    });

    sizeElement.classList.add('selected');
    selectedSizeId = sizeElement.dataset.sizeId;

    hideErrorMessage();
    checkAddToCartButton();
}

function checkAddToCartButton() {
    const addToCartBtn = document.getElementById('add-to-cart-btn');

    if (selectedSizeId) {
        addToCartBtn.disabled = false;
        addToCartBtn.textContent = 'Aggiungi al carrello';
    } else {
        addToCartBtn.disabled = true;
        addToCartBtn.textContent = 'Seleziona una taglia';
    }
}

function addToCart() {
    if (!selectedSizeId) {
        showErrorMessage('Seleziona una taglia prima di aggiungere al carrello');
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

    fetch('/api/cart/add', {
        method: 'POST',
        body: formData,
        headers: {
            'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content') || ''
        }
    })
        .then(function(response) {
            console.log('Response status:', response.status);
            
            if (!response.ok) {
                if (response.status === 401 || response.status === 403) {
                    window.location.href = '/login';
                    return;
                }
                throw new Error('HTTP ' + response.status + ': ' + response.statusText);
            }
            
            return response.json();
        })
        .then(function(result) {
            if (!result) return;
            
            console.log('Add to cart result:', result);
            
            if (result.success) {
                updateCartCounter(1);
                showSuccessMessage('Prodotto aggiunto al carrello con successo!');
            } else {
                if (result.error_type === 'auth_required') {
                    window.location.href = "/login";
                } else {
                    showErrorMessage(result.message || 'Errore durante l\'aggiunta al carrello');
                }
            }
        })
        .catch(function(error) {
            console.error('Errore nella richiesta:', error);
            showErrorMessage('Errore di connessione. Riprova più tardi.');
        })
        .finally(function() {
            addToCartBtn.disabled = false;
            addToCartBtn.textContent = originalText;
            checkAddToCartButton();
        });
}

function updateFavoriteButton() {
    const favBtn = document.getElementById('add-to-favorites-btn');
    if (!favBtn) return;

    favBtn.removeEventListener('click', addFavorite);
    favBtn.removeEventListener('click', removeFavorite);

    if (isFavorite) {
        favBtn.textContent = 'Rimuovi dai preferiti';
        favBtn.classList.add('in-favorites');
        favBtn.addEventListener("click", removeFavorite);
    } else {
        favBtn.textContent = 'Aggiungi ai preferiti';
        favBtn.classList.remove('in-favorites');
        favBtn.addEventListener("click", addFavorite);
    }
}

function addFavorite() {
    const favBtn = document.getElementById('add-to-favorites-btn');
    const originalText = favBtn.textContent;

    favBtn.disabled = true;
    favBtn.textContent = 'Aggiungendo...';

    const formData = new FormData();
    formData.append('productId', productData.id);

    fetch('/api/favorites/add', {
        method: 'POST',
        body: formData,
        headers: {
            'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content') || ''
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
        .then(function(result) {
            if (!result) return;
            
            if (result.success) {
                isFavorite = true;
                updateFavoriteButton();
                showSuccessMessage('Prodotto aggiunto ai preferiti!');
                updateFavoritesCounter(1);
            } else {
                if (result.error_type === 'auth_required') {
                    window.location.href = "/login";
                } else {
                    showErrorMessage(result.message || 'Errore durante l\'aggiunta ai preferiti');
                }
            }
        })
        .catch(function(error) {
            console.error('Errore nella richiesta:', error);
            showErrorMessage('Errore di connessione. Riprova più tardi.');
        })
        .finally(function() {
            favBtn.disabled = false;
            if (!isFavorite) {
                favBtn.textContent = originalText;
            }
        });
}

function removeFavorite() {
    const favBtn = document.getElementById('add-to-favorites-btn');
    const originalText = favBtn.textContent;

    favBtn.disabled = true;
    favBtn.textContent = 'Rimuovendo...';

    const formData = new FormData();
    formData.append('productId', productData.id);

    fetch('/api/favorites/remove', {
        method: 'POST',
        body: formData,
        headers: {
            'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content') || ''
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
        .then(function(result) {
            if (!result) return;
            
            if (result.success) {
                isFavorite = false;
                updateFavoriteButton();
                updateFavoritesCounter(-1);
                showSuccessMessage('Prodotto rimosso dai preferiti!');
            } else {
                if (result.error_type === 'auth_required') {
                    window.location.href = "/login";
                } else {
                    showErrorMessage(result.message || 'Errore durante la rimozione dai preferiti');
                }
            }
        })
        .catch(function(error) {
            console.error('Errore nella richiesta:', error);
            showErrorMessage('Errore di connessione. Riprova più tardi.');
        })
        .finally(function() {
            favBtn.disabled = false;
            if (isFavorite) {
                favBtn.textContent = originalText;
            }
        });
}

function showLoading() {
    const loading = document.getElementById('loading');
    const productDetail = document.getElementById('product-detail');
    const error = document.getElementById('error');

    if (loading) loading.style.display = 'block';
    if (productDetail) productDetail.style.display = 'none';
    if (error) error.style.display = 'none';
}

function hideLoading() {
    const loading = document.getElementById('loading');
    if (loading) loading.style.display = 'none';
}

function showError(message) {
    const errorDiv = document.getElementById('error');
    const errorMessage = document.getElementById('error-message');
    const productDetail = document.getElementById('product-detail');

    if (errorMessage) errorMessage.textContent = message;
    if (errorDiv) errorDiv.style.display = 'block';
    if (productDetail) productDetail.style.display = 'none';
}

function hideError() {
    const errorDiv = document.getElementById('error');
    if (errorDiv) errorDiv.style.display = 'none';
}

function showErrorMessage(message) {
    const errorDiv = document.getElementById('error-message');
    if (errorDiv) {
        errorDiv.textContent = message;
        errorDiv.style.display = 'block';

        setTimeout(function () {
            hideErrorMessage();
        }, 5000);
    }
}

function showSuccessMessage(message) {
    const successDiv = document.getElementById('success-message');
    if (successDiv) {
        successDiv.textContent = message;
        successDiv.style.display = 'block';

        setTimeout(function () {
            successDiv.style.display = 'none';
        }, 3000);
    }
}

function hideErrorMessage() {
    const errorDiv = document.getElementById('error-message');
    if (errorDiv) errorDiv.style.display = 'none';
}

function formatPrice(price) {
    const number = parseFloat(price);
    if (isNaN(number)) return "";
    return '€' + number.toFixed(2).replace('.', ',');
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