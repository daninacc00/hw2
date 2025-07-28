let currentFilters = {
    gender: [],
    section: null,
    sport: [],
    colors: [],
    sizes: [],
    min_price: null,
    max_price: null,
    shoe_height: null,
    is_on_sale: false,
    is_bestseller: false,
    is_new_arrival: false,
    sort: 'newest'
};

let currentPage = 1;
let itemsPerPage = 20;
let totalProducts = 0;
let isLoading = false;

document.addEventListener('DOMContentLoaded', function () {
    init();
});

function init() {
    const sortBtn = document.querySelector('.sort-btn');
    if (sortBtn) {
        sortBtn.addEventListener('click', toggleSortMenu);
    }

    const filterBtn = document.querySelector('.filter-btn');
    if (filterBtn) {
        filterBtn.addEventListener('click', toggleFilters);
    }

    setupFilterSections();
    loadInitialData();
}

function setupFilterSections() {
    const filterSections = document.querySelectorAll('.filter-section');

    filterSections.forEach(section => {
        const title = section.querySelector('.filter-title');
        if (title) {
            title.addEventListener('click', () => toggleFilterSection(section));
        }
    });

    createFilterControls();
}

function createFilterControls() {
    createGenderFilter();
    createPriceFilter();
    createSizeFilter();
    createColorFilter();
    createDiscountFilter();
    createShoeHeightFilter();
}

function createGenderFilter() {
    const genders = [
        { name: 'Uomo', slug: 0 },
        { name: 'Donna', slug: 1 },
        { name: 'Unisex', slug: 2 },
    ];

    const sections = document.querySelectorAll('.filter-section');
    let genderTitle = null;

    sections.forEach(function (section) {
        if (section.dataset.section === "gender") {
            genderTitle = section;
        }
    });

    if (genderTitle) {
        const content = document.createElement('div');
        content.classList.add("filter-content");
        content.classList.add("gender-filter");

        genders.forEach(function (gender) {
            const label = document.createElement("label");
            label.classList.add("checkbox-label");

            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.id = gender.slug.toString();

            const text = document.createElement("span");
            text.textContent = gender.name;

            label.appendChild(checkbox);
            label.appendChild(text);

            content.appendChild(label);
        });

        genderTitle.appendChild(content);

        const checkboxes = content.querySelectorAll('input[type="checkbox"]');
        checkboxes.forEach(function (checkbox) {
            checkbox.addEventListener('change', function () {
                handleGenderFilter(checkbox);
            });
        });
    }
}

function createPriceFilter() {
    const sections = document.querySelectorAll('.filter-section');
    let priceTitle = null;

    sections.forEach(function (section) {
        if (section.dataset.section === "price") {
            priceTitle = section;
        }
    });

    if (priceTitle) {
        const content = document.createElement('div');
        content.classList.add("filter-content");
        content.classList.add("price-filter");

        const priceInputs = document.createElement("div");
        priceInputs.classList.add("price-inputs");

        const minInput = document.createElement("input");
        minInput.type = "number";
        minInput.id = "min-price";
        minInput.placeholder = "Minimo €";
        minInput.min = "0";

        const maxInput = document.createElement("input");
        maxInput.type = "number";
        maxInput.id = "max-price";
        maxInput.placeholder = "Massimo €";
        maxInput.min = "0";

        priceInputs.appendChild(minInput);
        priceInputs.appendChild(maxInput);

        const applyBtn = document.createElement("button");
        applyBtn.classList.add("apply-price-btn");
        applyBtn.textContent = "Applica";
        applyBtn.addEventListener("click", applyPriceFilter);

        content.appendChild(priceInputs);
        content.appendChild(applyBtn);

        priceTitle.appendChild(content);
    }
}

function createSizeFilter() {
    const sizes = ['35', '36', '37', '38', '39', '40', '41', '42', '43', '44', '45', '46'];
    const sections = document.querySelectorAll('.filter-section');
    let sizeTitle = null;

    sections.forEach(function (section) {
        if (section.dataset.section === "size") {
            sizeTitle = section;
        }
    });

    if (sizeTitle) {
        const content = document.createElement('div');
        content.classList.add("filter-content");
        content.classList.add("size-filter");

        const sizeGrid = document.createElement("div");
        sizeGrid.classList.add("size-grid");

        sizes.forEach(function (size) {
            const sizeBtn = document.createElement("button");
            sizeBtn.classList.add("size-btn");
            sizeBtn.setAttribute("data-size", size);
            sizeBtn.textContent = size;

            sizeGrid.appendChild(sizeBtn);
        });

        content.appendChild(sizeGrid);
        sizeTitle.appendChild(content);

        const sizeButtons = content.querySelectorAll('.size-btn');
        sizeButtons.forEach(function (btn) {
            btn.addEventListener('click', function () {
                toggleSize(btn);
            });
        });
    }
}

function createColorFilter() {
    const colors = [
        { name: 'Nero', hex: '#000000' },
        { name: 'Bianco', hex: '#FFFFFF' },
        { name: 'Rosso', hex: '#FF0000' },
        { name: 'Blu', hex: '#0000FF' },
        { name: 'Verde', hex: '#008000' },
        { name: 'Grigio', hex: '#808080' }
    ];

    const sections = document.querySelectorAll('.filter-section');
    let colorTitle = null;

    sections.forEach(function (section) {
        if (section.dataset.section === "color") {
            colorTitle = section;
        }
    });

    if (colorTitle) {
        const content = document.createElement('div');
        content.classList.add("filter-content");
        content.classList.add("color-filter");

        const colorGrid = document.createElement("div");
        colorGrid.classList.add("color-grid");

        colors.forEach(function (color) {
            const colorItem = document.createElement("div");
            colorItem.classList.add("color-item");

            const colorCircle = document.createElement("div");
            colorCircle.classList.add("color-circle");
            colorCircle.style.backgroundColor = color.hex;

            const colorLabel = document.createElement("div");
            colorLabel.classList.add("color-label");
            colorLabel.textContent = color.name;

            colorItem.setAttribute("data-color", color.hex);
            colorItem.title = color.name;

            colorItem.appendChild(colorCircle);
            colorItem.appendChild(colorLabel);
            colorGrid.appendChild(colorItem);
        });

        content.appendChild(colorGrid);
        colorTitle.appendChild(content);

        const colorButtons = content.querySelectorAll('.color-item');
        colorButtons.forEach(function (btn) {
            btn.addEventListener('click', function () {
                toggleColor(btn);
            });
        });
    }
}

function createDiscountFilter() {
    const discounts = [
        { name: "In offerta", slug: "on-sale" },
        { name: "Bestseller", slug: "bestseller" },
        { name: "Nuovi arrivi", slug: "new-arrival" },
    ];

    const sections = document.querySelectorAll('.filter-section');
    let discountTitle = null;

    sections.forEach(function (section) {
        if (section.dataset.section === "discount") {
            discountTitle = section;
        }
    });

    if (discountTitle) {
        const content = document.createElement('div');
        content.classList.add("filter-content");
        content.classList.add("discount-filter");

        discounts.forEach(function (discount) {
            const label = document.createElement("label");
            label.classList.add("checkbox-label");

            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.id = discount.slug;

            const text = document.createElement("span");
            text.textContent = discount.name;

            label.appendChild(checkbox);
            label.appendChild(text);

            content.appendChild(label);
        });

        discountTitle.appendChild(content);

        const checkboxes = content.querySelectorAll('input[type="checkbox"]');
        checkboxes.forEach(function (checkbox) {
            checkbox.addEventListener('change', function () {
                handleDiscountFilter(checkbox);
            });
        });
    }
}

function createShoeHeightFilter() {
    const heights = ['low', 'mid', 'high'];
    const heightLabels = { low: 'Basse', mid: 'Medie', high: 'Alte' };

    const sections = document.querySelectorAll('.filter-section');
    let heightTitle = null;

    sections.forEach(function (section) {
        if (section.dataset.section === "height") {
            heightTitle = section;
        }
    });

    if (heightTitle) {
        const content = document.createElement('div');
        content.classList.add("filter-content");
        content.classList.add("height-filter");

        const heightOptions = document.createElement("div");
        heightOptions.classList.add("height-options");

        heights.forEach(function (height) {
            const label = document.createElement("label");
            label.classList.add("radio-label");

            const input = document.createElement("input");
            input.type = "radio";
            input.name = "shoe-height";
            input.value = height;

            const title = document.createElement("span");
            title.textContent = heightLabels[height];

            label.appendChild(input);
            label.appendChild(title);

            heightOptions.appendChild(label);
        });

        content.appendChild(heightOptions);
        heightTitle.appendChild(content);

        const radios = content.querySelectorAll('input[type="radio"]');
        radios.forEach(function (radio) {
            radio.addEventListener('change', function () {
                handleHeightFilter(radio);
            });
        });
    }
}

function toggleFilterSection(section) {
    const content = section.querySelector('.filter-content');
    const chevron = section.querySelector('i');

    if (content) {
        content.classList.toggle('open');
        if (chevron) {
            chevron.style.transform = content.classList.contains('open') ? 'rotate(180deg)' : '';
        }
    }
}

function handleGenderFilter(checkbox) {
    const filterId = parseInt(checkbox.id);

    const index = currentFilters.gender.indexOf(filterId);
    if (index > -1) {
        currentFilters.gender.splice(index, 1);
    } else {
        currentFilters.gender.push(filterId);
    }

    applyFilters();
}

function toggleSize(btn) {
    const size = btn.dataset.size;
    btn.classList.toggle('selected');

    const index = currentFilters.sizes.indexOf(size);
    if (index > -1) {
        currentFilters.sizes.splice(index, 1);
    } else {
        currentFilters.sizes.push(size);
    }

    applyFilters();
}

function toggleColor(btn) {
    const color = btn.dataset.color;
    btn.classList.toggle('selected');

    const index = currentFilters.colors.indexOf(color);
    if (index > -1) {
        currentFilters.colors.splice(index, 1);
    } else {
        currentFilters.colors.push(color);
    }

    applyFilters();
}

function applyPriceFilter() {
    const minPrice = document.getElementById('min-price');
    const maxPrice = document.getElementById('max-price');

    currentFilters.min_price = minPrice ? parseFloat(minPrice.value) : null;
    currentFilters.max_price = maxPrice ? parseFloat(maxPrice.value) : null;

    applyFilters();
}

function handleDiscountFilter(checkbox) {
    const filterId = checkbox.id.replace('-', '_');
    currentFilters[`is_${filterId}`] = checkbox.checked;
    applyFilters();
}

function handleHeightFilter(radio) {
    currentFilters.shoe_height = radio.checked ? radio.value : null;
    applyFilters();
}

function toggleSortMenu() {
    let sortMenu = document.querySelector('.sort-menu');
    if (!sortMenu) {
        createSortMenu();
        sortMenu = document.querySelector('.sort-menu');
    }

    sortMenu.classList.toggle('open');
}

function createSortMenu() {
    const sortBtn = document.querySelector('.sort-btn');
    const sortOptions = [
        { value: 'newest', label: 'Più recenti' },
        { value: 'price_asc', label: 'Prezzo: dal più basso' },
        { value: 'price_desc', label: 'Prezzo: dal più alto' },
        { value: 'name_asc', label: 'Nome: A-Z' },
        { value: 'name_desc', label: 'Nome: Z-A' },
        { value: 'rating', label: 'Valutazione più alta' }
    ];

    const menu = document.createElement('div');
    menu.className = 'sort-menu';

    sortOptions.forEach(option => {
        const sortOption = document.createElement("div");
        sortOption.classList.add("sort-option");
        sortOption.setAttribute("data-sort", option.value);
        sortOption.textContent = option.label
        menu.appendChild(sortOption);
    })

    sortBtn.parentNode.appendChild(menu);

    menu.querySelectorAll('.sort-option').forEach(option => {
        option.addEventListener('click', () => changeSortOrder(option.dataset.sort));
    });

    document.addEventListener('click', handleCloseMenu);
}

function handleCloseMenu(e) {
    const sortMenu = document.querySelector('.sort-menu');
    if (sortMenu && !e.target.closest('.sort-btn') && !e.target.closest('.sort-menu')) {
        sortMenu.classList.remove("open");
    }
}

function changeSortOrder(sortValue) {
    currentFilters.sort = sortValue;
    currentPage = 1;
    applyFilters();
    handleCloseMenu();
}

function toggleFilters() {
    const filters = document.querySelector('.filters');
    const btn = document.querySelector('.filter-btn');

    filters.classList.toggle('hidden');
    const isHidden = filters.classList.contains('hidden')
    btn.textContent = isHidden ? 'Mostra filtri' : 'Nascondi filtri';
}

function loadInitialData() {
    loadProducts();
}

function loadProducts(append = false) {
    if (isLoading) return;

    isLoading = true;
    showLoading();

    const params = buildApiParams();

    fetch(`/api/shop/products?${params}`, {
        headers: {
            'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''
        }
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                if (append) {
                    appendProducts(data.data.products);
                } else {
                    renderProducts(data.data.products);
                    updateCategoryTitle();
                }
            } else {
                showError(data.message);
            }
        })
        .catch(error => {
            console.error('Error loading products:', error);
            showError('Errore nel caricamento dei prodotti');
        })
        .finally(function () {
            isLoading = false;
            hideLoading();
        })
}

function buildApiParams() {
    const params = [];

    Object.entries(currentFilters).forEach(([key, value]) => {
        if (value && value !== '') {
            if (Array.isArray(value)) {
                value.forEach(v => params.push(`${key}[]=${encodeURIComponent(v)}`));
            } else {
                params.push(`${key}=${encodeURIComponent(value)}`);
            }
        }
    });

    params.push(`page=${currentPage}`, `limit=${itemsPerPage}`);
    return params.join('&');
}

function renderProducts(products) {
    const grid = document.getElementById('product-grid');
    if (!grid) return;

    grid.innerHTML = '';

    if (products.length === 0) {
        const noProducts = document.createElement("div");
        noProducts.classList.add("no-products");
        noProducts.textContent = "Nessun prodotto trovato";

        grid.appendChild(noProducts);
        return;
    }

    products.forEach(product => {
        const productCard = createProductCard(product);
        grid.appendChild(productCard);
    })
}

function appendProducts(products) {
    const grid = document.getElementById('product-grid');
    if (!grid) return;

    products.forEach(product => {
        const productCard = createProductCard(product);
        grid.appendChild(productCard);
    })
}

function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.dataset.productId = product.id;

    const productLink = document.createElement('a');
    // Link aggiornato per Laravel
    productLink.href = `/product/${product.id}`;
    productLink.className = 'product-link';

    const imageContainer = document.createElement('div');
    imageContainer.className = 'product-image';

    const img = document.createElement('img');
    img.src = product.primary_image || '/assets/images/placeholder.jpg';
    img.alt = product.name;
    imageContainer.appendChild(img);

    const info = document.createElement('div');
    info.className = 'product-info';

    const badgesContainer = document.createElement('div');
    badgesContainer.className = 'product-badges';

    if (product.is_new_arrival) {
        const badge = document.createElement('span');
        badge.className = 'badge';
        badge.textContent = 'Nuovi arrivi';
        badgesContainer.appendChild(badge);
    }

    if (product.is_bestseller) {
        const badge = document.createElement('span');
        badge.className = 'badge';
        badge.textContent = 'Bestseller';
        badgesContainer.appendChild(badge);
    }

    if (badgesContainer.children.length > 0) {
        info.appendChild(badgesContainer);
    }

    const name = document.createElement('h3');
    name.className = 'product-name';
    name.textContent = product.name;
    info.appendChild(name);

    const category = document.createElement('p');
    category.className = 'product-category';
    category.textContent = product.category_name || product.sport_name;
    info.appendChild(category);

    if (product.color_count > 1) {
        const colorCount = document.createElement('p');
        colorCount.className = 'color-count';
        colorCount.textContent = `${product.color_count} colori`;
        info.appendChild(colorCount);
    }

    const ratingDiv = document.createElement('div');
    ratingDiv.className = 'product-rating';
    ratingDiv.innerHTML = renderStars(product.rating);

    const ratingCount = document.createElement('span');
    ratingCount.className = 'rating-count';
    ratingCount.textContent = `(${product.rating_count})`;
    ratingDiv.appendChild(ratingCount);

    info.appendChild(ratingDiv);

    const priceDiv = document.createElement('div');
    priceDiv.className = 'product-price';

    const currentPrice = document.createElement('span');
    currentPrice.className = 'current-price';
    currentPrice.textContent = `€${product.price}`;
    priceDiv.appendChild(currentPrice);

    if (product.original_price && product.original_price > product.price && product.is_on_sale) {
        const originalPrice = document.createElement('span');
        originalPrice.className = 'original-price';
        originalPrice.textContent = `€${product.original_price}`;
        priceDiv.appendChild(originalPrice);

        if (product.discount_percentage > 0) {
            const discount = document.createElement("span");
            discount.classList.add("discount");
            discount.textContent = `-${product.discount_percentage}%`;
            priceDiv.appendChild(discount);
        }
    }

    info.appendChild(priceDiv);

    productLink.appendChild(imageContainer);
    productLink.appendChild(info);
    card.appendChild(productLink);

    return card;
}

function renderStars(rating) {
    let stars = '';

    for (let i = 1; i <= 5; i++) {
        if (i <= rating) {
            stars += '<i class="fa-solid fa-star"></i>';
        } else if (i - 0.5 <= rating) {
            stars += '<i class="fa-solid fa-star-half-alt"></i>';
        } else {
            stars += '<i class="fa-regular fa-star"></i>';
        }
    }

    return stars;
}

function applyFilters() {
    currentPage = 1;
    loadProducts();
}

function showLoading() {
    const grid = document.getElementById('product-grid');
    const loadingDiv = document.createElement('div');
    loadingDiv.className = 'loading';
    loadingDiv.textContent = 'Caricamento...';

    if (currentPage === 1) {
        grid.innerHTML = '';
        grid.appendChild(loadingDiv);
    } else {
        grid.appendChild(loadingDiv);
    }
}

function hideLoading() {
    document.querySelectorAll('.loading').forEach(el => el.remove());
}

function showError(message) {
    const grid = document.getElementById('product-grid');
    const error = document.createElement("div");
    error.classList.add("error");
    error.textContent = message;

    grid.appendChild(error);
}

function updateCategoryTitle() {
    const title = document.getElementById('categoryTitle');
    if (title) {
        let newTitle = 'Sneakers e scarpe';
        if (currentFilters.gender.includes(0)) newTitle += ' da uomo';
        else if (currentFilters.gender.includes(1)) newTitle += ' da donna';
        else if (currentFilters.gender.includes(2)) newTitle += ' per bambini';

        title.textContent = newTitle;
    }
}