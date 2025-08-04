// ========== CONSTANTS ==========
const ITEMS_PER_PAGE = 20;
const FILTER_TYPES = {
    GENDER: "gender",
    SECTION: "section",
    SPORT: "sport",
    COLOR: "color",
    SIZE: "size",
    PRICE: "price",
    DISCOUNT: "discount",
    HEIGHT: "height",
};

const SECTION_OPTIONS = [
    { name: "Scarpe", slug: "shoes" },
    { name: "Abbigliamento", slug: "wear" },
];

const SIZE_OPTIONS = [
    "35",
    "36",
    "37",
    "38",
    "39",
    "40",
    "41",
    "42",
    "43",
    "44",
    "45",
    "46",
];

const COLOR_OPTIONS = [
    { name: "Nero", hex: "#000000" },
    { name: "Bianco", hex: "#FFFFFF" },
    { name: "Rosso", hex: "#FF0000" },
    { name: "Blu", hex: "#0000FF" },
    { name: "Verde", hex: "#008000" },
    { name: "Grigio", hex: "#808080" },
];

const DISCOUNT_OPTIONS = [
    { name: "In offerta", slug: "on-sale" },
    { name: "Bestseller", slug: "bestseller" },
    { name: "Nuovi arrivi", slug: "new-arrival" },
];

const HEIGHT_OPTIONS = ["low", "mid", "high"];
const HEIGHT_LABELS = { low: "Basse", mid: "Medie", high: "Alte" };

const SORT_OPTIONS = [
    { value: "newest", label: "Più recenti" },
    { value: "price_asc", label: "Prezzo: dal più basso" },
    { value: "price_desc", label: "Prezzo: dal più alto" },
    { value: "name_asc", label: "Nome: A-Z" },
    { value: "name_desc", label: "Nome: Z-A" },
    { value: "rating", label: "Valutazione più alta" },
];

const SPORT_NAMES = {
    football: "Calcio",
    running: "Corsa",
    basketball: "Basket",
    tennis: "Tennis",
    lifestyle: "Lifestyle",
};

// ========== VARIABLES ==========
let genderFilters = [];
let sectionFilter = null;
let sportFilters = [];
let colorFilters = [];
let sizeFilters = [];
let minPrice = null;
let maxPrice = null;
let shoeHeight = null;
let isOnSale = false;
let isBestseller = false;
let isNewArrival = false;
let sortOrder = "newest";

let currentPage = 1;
let itemsPerPage = 20;
let totalProducts = 0;
let isLoading = false;

let grid = null;

// ========== UTILITY FUNCTIONS ==========
function showErrorMessage(message) {
    if (!grid) return;

    const errorDiv = document.createElement("div");
    errorDiv.classList.add("error");
    errorDiv.textContent = message;
    grid.appendChild(errorDiv);
}

function buildApiParams() {
    const params = [];

    if (genderFilters.length > 0) {
        genderFilters.forEach(function (v) {
            params.push("gender[]=" + encodeURIComponent(v));
        });
    }

    if (sectionFilter) {
        params.push("section=" + encodeURIComponent(sectionFilter));
    }

    if (sportFilters.length > 0) {
        sportFilters.forEach(function (v) {
            params.push("sport[]=" + encodeURIComponent(v));
        });
    }

    if (colorFilters.length > 0) {
        colorFilters.forEach(function (v) {
            params.push("colors[]=" + encodeURIComponent(v));
        });
    }

    if (sizeFilters.length > 0) {
        sizeFilters.forEach(function (v) {
            params.push("sizes[]=" + encodeURIComponent(v));
        });
    }

    if (minPrice) params.push("min_price=" + encodeURIComponent(minPrice));
    if (maxPrice) params.push("max_price=" + encodeURIComponent(maxPrice));
    if (shoeHeight)
        params.push("shoe_height=" + encodeURIComponent(shoeHeight));

    if (isOnSale) params.push("is_on_sale=true");
    if (isBestseller) params.push("is_bestseller=true");
    if (isNewArrival) params.push("is_new_arrival=true");

    params.push("sort=" + encodeURIComponent(sortOrder));
    params.push("page=" + currentPage);
    params.push("limit=" + itemsPerPage);

    return params.join("&");
}

function buildCategoryTitle() {
    let title = "";

    if (sectionFilter === "shoes") {
        title = "Scarpe";
    } else if (sectionFilter === "wear") {
        title = "Abbigliamento";
    } else {
        title = "Sneakers e scarpe";
    }

    if (genderFilters.includes(0)) {
        title += " da uomo";
    } else if (genderFilters.includes(1)) {
        title += " da donna";
    } else if (genderFilters.includes(2)) {
        title += " per bambini";
    }

    if (sportFilters.length > 0) {
        const sportName = SPORT_NAMES[sportFilters[0]] || sportFilters[0];
        title += ` - ${sportName}`;
    }

    return title;
}

function updateCategoryTitle() {
    const titleElement = document.getElementById("categoryTitle");
    if (!titleElement) return;

    titleElement.textContent = buildCategoryTitle();
}

function loadFiltersFromURL() {
    const urlParams = new URLSearchParams(window.location.search);

    if (urlParams.get("gender")) {
        const genderValue = urlParams.get("gender");
        if (genderValue === "men") genderFilters = [0];
        else if (genderValue === "women") genderFilters = [1];
        else if (genderValue === "kids") genderFilters = [2];
    }

    if (urlParams.get("section")) {
        sectionFilter = urlParams.get("section");
    }

    if (urlParams.get("sport")) {
        sportFilters = [urlParams.get("sport")];
    }

    if (urlParams.get("sort")) {
        sortOrder = urlParams.get("sort");
    }

    updateCategoryTitle();
}

// ========== PRODUCT CARD CREATION ==========
function createProductImage(product) {
    const imageContainer = document.createElement("div");
    imageContainer.className = "product-image";

    const img = document.createElement("img");
    img.src = product.primary_image;
    img.alt = product.name;
    imageContainer.appendChild(img);
    return imageContainer;
}

function createBadge(title) {
    const badge = document.createElement("span");
    badge.className = "badge";
    badge.textContent = title;
    return badge;
}

function createBadgesContainer(product) {
    if (!product.is_new_arrival && !product.is_bestseller) return null;

    const badgesContainer = document.createElement("div");
    badgesContainer.className = "product-badges";

    if (product.is_new_arrival) {
        const badge = createBadge("Nuovi arrivi");
        badgesContainer.appendChild(badge);
    }

    if (product.is_bestseller) {
        const badge = createBadge("Bestseller");
        badgesContainer.appendChild(badge);
    }

    return badgesContainer;
}

function createProductRating(product) {
    const ratingDiv = document.createElement("div");
    ratingDiv.className = "product-rating";

    for (let i = 1; i <= 5; i++) {
        const star = document.createElement("i");
        if (i <= product.rating) {
            star.className = "fa-solid fa-star";
        } else if (i - 0.5 <= product.rating) {
            star.className = "fa-solid fa-star-half-alt";
        } else {
            star.className = "fa-regular fa-star";
        }
        ratingDiv.appendChild(star);
    }

    const ratingCount = document.createElement("span");
    ratingCount.className = "rating-count";
    ratingCount.textContent = "(" + product.rating_count + ")";
    ratingDiv.appendChild(ratingCount);

    return ratingDiv;
}

function createProductPrice(product) {
    const priceDiv = document.createElement("div");
    priceDiv.className = "product-price";

    const currentPrice = document.createElement("span");
    currentPrice.className = "current-price";
    currentPrice.textContent = "€" + product.price;
    priceDiv.appendChild(currentPrice);

    if (
        product.original_price &&
        product.original_price > product.price &&
        product.is_on_sale
    ) {
        const originalPrice = document.createElement("span");
        originalPrice.className = "original-price";
        originalPrice.textContent = "€" + product.original_price;
        priceDiv.appendChild(originalPrice);

        if (product.discount_percentage > 0) {
            const discount = document.createElement("span");
            discount.classList.add("discount");
            discount.textContent = "-" + product.discount_percentage + "%";
            priceDiv.appendChild(discount);
        }
    }

    return priceDiv;
}

function createProductInfo(product) {
    const info = document.createElement("div");
    info.className = "product-info";

    const badges = createBadgesContainer(product);
    if (badges) info.appendChild(badges);

    const name = document.createElement("h3");
    name.className = "product-name";
    name.textContent = product.name;
    info.appendChild(name);

    const category = document.createElement("p");
    category.className = "product-category";
    category.textContent = product.category_name || product.sport_name;
    info.appendChild(category);

    if (product.color_count > 1) {
        const colorCount = document.createElement("p");
        colorCount.className = "color-count";
        colorCount.textContent = product.color_count + " colori";
        info.appendChild(colorCount);
    }

    const rating = createProductRating(product);
    info.appendChild(rating);

    const price = createProductPrice(product);
    info.appendChild(price);

    return info;
}

function createProductCard(product) {
    const card = document.createElement("div");
    card.className = "product-card";
    card.dataset.productId = product.id;

    const productLink = document.createElement("a");
    productLink.href = "/product/" + product.id;
    productLink.className = "product-link";

    const imageContainer = createProductImage(product);
    const info = createProductInfo(product);

    productLink.appendChild(imageContainer);
    productLink.appendChild(info);
    card.appendChild(productLink);

    return card;
}

function renderProducts(products, append) {
    if (!grid) return;

    if (!append) {
        grid.innerHTML = "";
    }

    if (products.length === 0 && !append) {
        showNoProductsMessage();
        return;
    }

    products.forEach(function (product) {
        const productCard = createProductCard(product);
        grid.appendChild(productCard);
    });
}

function updateCategoryTitle() {
    const titleElement = document.getElementById("categoryTitle");
    if (!titleElement) return;

    titleElement.textContent = buildCategoryTitle();
}

function showNoProductsMessage() {
    if (!grid) return;

    const noProducts = document.createElement("div");
    noProducts.classList.add("no-products");
    noProducts.textContent = "Nessun prodotto trovato";
    grid.appendChild(noProducts);
}

// ========== API CALL ==========
function loadProducts(append) {
    append = append || false;
    if (isLoading) return;

    isLoading = true;

    if (currentPage === 1 && !append) {
        grid.innerHTML = "";
        const loadingDiv = document.createElement("div");
        loadingDiv.className = "loading";
        loadingDiv.textContent = "Caricamento...";
        grid.appendChild(loadingDiv);
    }

    const params = buildApiParams();

    fetch("/api/shop/products?" + params)
        .then(onResponse)
        .then(function (data) {
            if (!data || !data.success) {
                showErrorMessage(
                    data?.message || "Errore nel caricamento dei prodotti"
                );
                return;
            }

            renderProducts(data.data.products, append);

            if (!append) {
                updateCategoryTitle();
            }
        })
        .catch(function (error) {
            console.error("Error loading products:", error);
            showErrorMessage("Errore nel caricamento dei prodotti");
        })
        .finally(function () {
            isLoading = false;
        });
}

function applyFilters() {
    currentPage = 1;
    loadProducts();
}

function applyGenderFilters() {
    genderFilters.forEach(function (genderId) {
        const genderSection = document.querySelector(
            '.filter-section[data-section="gender"]'
        );

        if (genderSection) {
            const checkbox = document.querySelector(`input[id="${genderId}"]`);

            if (checkbox) {
                checkbox.checked = true;
            }
        }
    });
}

// ========== FILTER UI CREATION ==========
function createCheckboxFilter(options, filterArray) {
    const content = document.createElement("div");
    content.classList.add("filter-content");

    options.forEach(function (option) {
        const label = document.createElement("label");
        label.classList.add("checkbox-label");

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.id = option.slug;

        checkbox.addEventListener("change", function () {
            const filterId = checkbox.id;
            const index = filterArray.indexOf(filterId);

            console.log("Checkbox changed:", filterId, index);

            if (index > -1) {
                filterArray.splice(index, 1);
            } else {
                filterArray.push(filterId);
            }

            applyFilters();
        });

        const text = document.createElement("span");
        text.textContent = option.name;

        label.appendChild(checkbox);
        label.appendChild(text);
        content.appendChild(label);
    });

    return content;
}

function createRadioFilter(options, currentValue) {
    const content = document.createElement("div");
    content.classList.add("filter-content");

    const optionsContainer = document.createElement("div");

    const allLabel = document.createElement("label");
    allLabel.classList.add("radio-label");

    const allRadio = document.createElement("input");
    allRadio.type = "radio";
    allRadio.name = "section-filter";
    allRadio.value = "";
    allRadio.checked = !currentValue;

    allRadio.addEventListener("change", function () {
        if (allRadio.checked) {
            sectionFilter = null;
            updateCategoryTitle();
            applyFilters();
        }
    });

    const allText = document.createElement("span");
    allText.textContent = "Tutti";

    allLabel.appendChild(allRadio);
    allLabel.appendChild(allText);
    optionsContainer.appendChild(allLabel);

    options.forEach(function (option) {
        const label = document.createElement("label");
        label.classList.add("radio-label");

        const radio = document.createElement("input");
        radio.type = "radio";
        radio.name = "section-filter";
        radio.value = option.slug;
        radio.checked = currentValue === option.slug;

        radio.addEventListener("change", function () {
            if (radio.checked) {
                sectionFilter = radio.value;
                updateCategoryTitle();
                applyFilters();
            }
        });

        const text = document.createElement("span");
        label.textContent = option.name;
        label.appendChild(radio);
        label.appendChild(text);
        optionsContainer.appendChild(label);
    });

    content.appendChild(optionsContainer);
    return content;
}

function createSizeFilter() {
    const content = document.createElement("div");
    content.classList.add("filter-content");
    content.classList.add("size-filter");

    const sizeGrid = document.createElement("div");
    sizeGrid.classList.add("size-grid");

    SIZE_OPTIONS.forEach(function (size) {
        const sizeBtn = document.createElement("button");
        sizeBtn.classList.add("size-btn");
        sizeBtn.textContent = size;
        sizeBtn.setAttribute("data-size", size);

        sizeBtn.addEventListener("click", function () {
            const sizeVal = sizeBtn.dataset.size;
            sizeBtn.classList.toggle("selected");

            const index = sizeFilters.indexOf(sizeVal);
            if (index > -1) {
                sizeFilters.splice(index, 1);
            } else {
                sizeFilters.push(sizeVal);
            }

            applyFilters();
        });

        sizeGrid.appendChild(sizeBtn);
    });

    content.appendChild(sizeGrid);
    return content;
}

function createColorFilter() {
    const content = document.createElement("div");
    content.classList.add("filter-content");
    content.classList.add("color-filter");

    const colorGrid = document.createElement("div");
    colorGrid.classList.add("color-grid");

    COLOR_OPTIONS.forEach(function (color) {
        const colorCircle = document.createElement("div");
        colorCircle.classList.add("color-circle");
        colorCircle.style.backgroundColor = color.hex;

        const colorLabel = document.createElement("div");
        colorLabel.classList.add("color-label");
        colorLabel.textContent = color.name;

        const colorItem = document.createElement("div");
        colorItem.classList.add("color-item");
        colorItem.setAttribute("data-color", color.hex);
        colorItem.title = color.name;

        colorItem.addEventListener("click", function () {
            const colorVal = colorItem.dataset.color;
            colorItem.classList.toggle("selected");

            const index = colorFilters.indexOf(colorVal);
            if (index > -1) {
                colorFilters.splice(index, 1);
            } else {
                colorFilters.push(colorVal);
            }

            applyFilters();
        });

        colorItem.appendChild(colorCircle);
        colorItem.appendChild(colorLabel);
        colorGrid.appendChild(colorItem);
    });

    content.appendChild(colorGrid);
    return content;
}

function createPriceFilter() {
    const content = document.createElement("div");
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
    applyBtn.addEventListener("click", function () {
        const minPriceEl = document.getElementById("min-price");
        const maxPriceEl = document.getElementById("max-price");

        minPrice = minPriceEl ? parseFloat(minPriceEl.value) || null : null;
        maxPrice = maxPriceEl ? parseFloat(maxPriceEl.value) || null : null;

        applyFilters();
    });

    content.appendChild(priceInputs);
    content.appendChild(applyBtn);
    return content;
}

function createDiscountFilter() {
    const content = document.createElement("div");
    content.classList.add("filter-content");
    content.classList.add("discount-filter");

    DISCOUNT_OPTIONS.forEach(function (discount) {
        const label = document.createElement("label");
        label.classList.add("checkbox-label");

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.id = discount.slug;

        checkbox.addEventListener("change", function () {
            const filterId = checkbox.id.replace("-", "_");
            if (filterId === "on_sale") isOnSale = checkbox.checked;
            else if (filterId === "bestseller") isBestseller = checkbox.checked;
            else if (filterId === "new_arrival")
                isNewArrival = checkbox.checked;
            applyFilters();
        });

        const text = document.createElement("span");
        text.textContent = discount.name;
        label.appendChild(checkbox);
        label.appendChild(text);
        content.appendChild(label);
    });

    return content;
}

function createHeightFilter() {
    const content = document.createElement("div");
    content.classList.add("filter-content");
    content.classList.add("height-filter");

    const heightOptions = document.createElement("div");
    heightOptions.classList.add("height-options");

    HEIGHT_OPTIONS.forEach(function (height) {
        const label = document.createElement("label");
        label.classList.add("radio-label");

        const input = document.createElement("input");
        input.type = "radio";
        input.name = "shoe-height";
        input.value = height;

        input.addEventListener("change", function () {
            shoeHeight = input.checked ? input.value : null;
            applyFilters();
        });

        const title = document.createElement("span");
        title.textContent = HEIGHT_LABELS[height];

        label.appendChild(input);
        label.appendChild(title);
        heightOptions.appendChild(label);
    });

    content.appendChild(heightOptions);
    return content;
}

function initializeSectionFilter() {
    const sectionSection = document.querySelector(
        '.filter-section[data-section="section"]'
    );
    if (!sectionSection) return;

    const content = createRadioFilter(SECTION_OPTIONS, sectionFilter);
    content.classList.add("section-filter");
    sectionSection.appendChild(content);
}

function initializePriceFilter() {
    const priceSection = document.querySelector(
        '.filter-section[data-section="price"]'
    );
    if (!priceSection) return;

    const content = createPriceFilter();
    priceSection.appendChild(content);
}

function initializeSizeFilter() {
    const sizeSection = document.querySelector(
        '.filter-section[data-section="size"]'
    );
    if (!sizeSection) return;

    const content = createSizeFilter();
    sizeSection.appendChild(content);
}

function initializeColorFilter() {
    const colorSection = document.querySelector(
        '.filter-section[data-section="color"]'
    );
    if (!colorSection) return;

    const content = createColorFilter();
    colorSection.appendChild(content);
}

function initializeDiscountFilter() {
    const discountSection = document.querySelector(
        '.filter-section[data-section="discount"]'
    );
    if (!discountSection) return;

    const content = createDiscountFilter();
    discountSection.appendChild(content);
}

function initializeHeightFilter() {
    const heightSection = document.querySelector(
        '.filter-section[data-section="height"]'
    );
    if (!heightSection) return;

    const content = createHeightFilter();
    heightSection.appendChild(content);
}

function initializeFilters() {
    initializeSectionFilter();
    initializePriceFilter();
    initializeSizeFilter();
    initializeColorFilter();
    initializeDiscountFilter();
    initializeHeightFilter();
}

function createSortMenu() {
    const menu = document.createElement("div");
    menu.className = "sort-menu";

    SORT_OPTIONS.forEach(function (option) {
        const sortOption = document.createElement("div");
        sortOption.classList.add("sort-option");
        sortOption.textContent = option.label;
        sortOption.setAttribute("data-sort", option.value);

        sortOption.addEventListener("click", function () {
            sortOrder = sortOption.dataset.sort;
            currentPage = 1;
            applyFilters();
            menu.classList.remove("open");
        });

        menu.appendChild(sortOption);
    });

    return menu;
}

function handleSortButtonClick() {
    let sortMenu = document.querySelector(".sort-menu");
    const sortBtn = document.querySelector(".sort-btn");

    if (!sortMenu) {
        sortMenu = createSortMenu();
        sortBtn.parentNode.appendChild(sortMenu);

        document.addEventListener("click", function (e) {
            const menu = document.querySelector(".sort-menu");
            if (
                menu &&
                !e.target.closest(".sort-btn") &&
                !e.target.closest(".sort-menu")
            ) {
                menu.classList.remove("open");
            }
        });
    }

    sortMenu.classList.toggle("open");
}

function handleFilterButtonClick() {
    const filters = document.querySelector(".filters");
    const btn = document.querySelector(".filter-btn");

    filters.classList.toggle("hidden");
    const isHidden = filters.classList.contains("hidden");
    btn.textContent = isHidden ? "Mostra filtri" : "Nascondi filtri";
}

function handleFilterSectionClick(section) {
    const content = section.querySelector(".filter-content");
    const chevron = section.querySelector("i");

    if (content) {
        content.classList.toggle("open");
        if (chevron) {
            chevron.style.transform = content.classList.contains("open")
                ? "rotate(180deg)"
                : "";
        }
    }
}

const sortBtn = document.querySelector(".sort-btn");
if (sortBtn) {
    sortBtn.addEventListener("click", handleSortButtonClick);
}

const filterBtn = document.querySelector(".filter-btn");
if (filterBtn) {
    filterBtn.addEventListener("click", handleFilterButtonClick);
}

const filterSections = document.querySelectorAll(".filter-section");
filterSections.forEach(function (section) {
    const title = section.querySelector(".filter-title");
    if (title) {
        title.addEventListener("click", function () {
            handleFilterSectionClick(section);
        });
    }
});

function initialize() {
    grid = document.getElementById("product-grid");
    if (!grid) return;

    loadFiltersFromURL();
    initializeFilters();
    applyGenderFilters();
    loadProducts();
}

initialize();
