// ========== VARIABLES ==========
let sliderImages = [];
let currentIndex = 0;
let container = null;
let prevButton = null;
let nextButton = null;
const itemsPerPage = 3;
const step = 1;

// ========== SLIDER LOGIC ==========
function updateSlider() {
    const sliderTrack = document.querySelector(".slider-track");
    if (!sliderTrack || sliderImages.length === 0) {
        return;
    }

    const imageWidth = 100 / itemsPerPage;
    const translateX = -(currentIndex * imageWidth);
    sliderTrack.style.transform = 'translateX(' + translateX + '%)';

    prevButton.classList.toggle("disabled", currentIndex === 0);
    nextButton.classList.toggle("disabled", currentIndex + step > sliderImages.length - itemsPerPage);
}

function createImageElement(imgData) {
    const img = document.createElement("img");
    img.src = imgData.src;
    img.alt = imgData.alt;
    img.classList.add("slider-image");

    return img;
}

function createOverlayElement(imgData) {
    const overlayContainer = document.createElement("div");
    overlayContainer.classList.add("slider-image-overlay");

    const link = document.createElement("a");
    link.textContent = imgData.name;
    link.classList.add("button");
    overlayContainer.appendChild(link);

    if (imgData.isFreeShipping) {
        const chip = document.createElement("div");
        chip.textContent = "Spedizione gratuita";
        chip.classList.add("chip");
        chip.setAttribute("data-tooltip", "Idoneo per spedizione gratuita oltre le 200€");
        overlayContainer.appendChild(chip);
    }

    return overlayContainer;
}

function createImageContainer(imgData) {
    const imageContainer = document.createElement("div");
    imageContainer.classList.add("image-container");

    const img = createImageElement(imgData);
    const overlay = createOverlayElement(imgData);

    imageContainer.appendChild(img);
    imageContainer.appendChild(overlay);

    return imageContainer;
}

function createSliderElements() {
    const sliderWrapper = document.createElement("div");
    sliderWrapper.classList.add("slider-wrapper");
    const sliderTrack = document.createElement("div");
    sliderTrack.classList.add("slider-track");

    sliderImages.forEach(function (imgData) {
        const imageContainer = createImageContainer(imgData);
        sliderTrack.appendChild(imageContainer);
    });

    sliderWrapper.appendChild(sliderTrack);
    container.appendChild(sliderWrapper);
}

function showNoDataMessage(message) {
    const noData = document.createElement("div");
    noData.classList.add("no-data");
    noData.textContent = message || 'Nessuna immagine disponibile';
    container.appendChild(noData);
}

// ========== API CALL ==========
function loadSliderImages() {
    fetch('/slider-images')
        .then(onResponse)
        .then(function (result) {
            if (!result || !result.success) return;

            sliderImages = result.data;

            if (sliderImages.length === 0) {
                showNoDataMessage(result.message)
                return;
            }

            createSliderElements();
            updateSlider();
        })
        .catch(function (error) {
            console.error('Errore nel caricamento delle immagini:', error);
        });
}

// ========== EVENT HANDLERS ==========
function handlePrevClick() {
    if (currentIndex > 0) {
        currentIndex -= step;
        updateSlider();
    }
}

function handleNextClick() {
    if (currentIndex + step <= sliderImages.length - itemsPerPage) {
        currentIndex += step;
        updateSlider();
    }
}

function initializeElements() {
    container = document.getElementById("slider-container");
    prevButton = document.querySelector(".slider-controls .slider-btn.prev");
    nextButton = document.querySelector(".slider-controls .slider-btn.next");

    if (!container || !prevButton || !nextButton) {
        console.error('Slider elements not found');
        return false;
    }

    prevButton.innerHTML = "&#10094;";
    prevButton.addEventListener("click", handlePrevClick);

    nextButton.innerHTML = "&#10095;";
    nextButton.addEventListener("click", handleNextClick);

    return true;
}

function initialize() {
    if (!initializeElements()) {
        return;
    }

    loadSliderImages();
}

initialize();