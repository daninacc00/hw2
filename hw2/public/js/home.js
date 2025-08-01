let sliderImages = [];
let currentIndex = 0;
const itemsPerPage = 3;
const step = 1;

const container = document.getElementById("slider-container");
const prevButton = document.querySelector(".slider-controls .slider-btn.prev");
const nextButton = document.querySelector(".slider-controls .slider-btn.next");

prevButton.innerHTML = "&#10094;";
nextButton.innerHTML = "&#10095;";

function loadSliderImages() {
    fetch('/slider-images', {
        headers: {
            'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content') || ''
        }
    })
        .then(function(response) {
            if (!response.ok) {
                throw new Error('HTTP error! status: ' + response.status);
            }
            return response.json();
        })
        .then(function(result) {
            if (!result.success) {
                throw new Error(result.message || result.error || 'Errore nel caricamento dei dati');
            }

            sliderImages = result.data;

            if (sliderImages.length === 0) {
                const noData = document.createElement("div");
                noData.classList.add("no-data");
                noData.textContent = result.message || 'Nessuna immagine disponibile';
                container.appendChild(noData);
                return;
            }

            createSlider();
            updateSlider();
        })
        .catch(function(error) {
            console.error('Errore nel caricamento delle immagini:', error);
            const errorDiv = document.createElement("div");
            errorDiv.classList.add("error");
            errorDiv.textContent = 'Errore nel caricamento: ' + error.message;
            container.appendChild(errorDiv);
        });
}

function createSlider() {
    const sliderWrapper = document.createElement("div");
    sliderWrapper.classList.add("slider-wrapper");

    const sliderTrack = document.createElement("div");
    sliderTrack.classList.add("slider-track");

    sliderImages.forEach(function(imgData) {
        const imageContainer = document.createElement("div");
        imageContainer.classList.add("image-container");

        const img = document.createElement("img");
        img.src = imgData.src;
        img.alt = imgData.alt;
        img.classList.add("slider-image");

        img.onerror = function() {
            this.src = '/assets/images/placeholder.jpg';
        };

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

        imageContainer.appendChild(img);
        imageContainer.appendChild(overlayContainer);
        sliderTrack.appendChild(imageContainer);
    });

    sliderWrapper.appendChild(sliderTrack);
    container.appendChild(sliderWrapper);
}

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

function handlePrev() {
    if (currentIndex > 0) {
        currentIndex -= step;
        updateSlider();
    }
}

function handleNext() {
    if (currentIndex + step <= sliderImages.length - itemsPerPage) {
        currentIndex += step;
        updateSlider();
    }
}

prevButton.addEventListener("click", handlePrev);
nextButton.addEventListener("click", handleNext);

loadSliderImages();