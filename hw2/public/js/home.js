let sliderImages = [];
let currentIndex = 0;
const itemsPerPage = 3;
const step = 1;

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

function loadSliderImages() {
    fetch('/slider-images', {
        headers: {
            'X-CSRF-TOKEN': getCsrfToken()
        }
    })
        .then(onResponse)
        .then(function (result) {
            if (!result) return;

            if (!result.success) {
                return;
            }

            sliderImages = result.data;

            if (sliderImages.length === 0) {
                const noData = document.createElement("div");
                noData.classList.add("no-data");
                noData.textContent = result.message || 'Nessuna immagine disponibile';
                container.appendChild(noData);
                return;
            }

            const sliderWrapper = document.createElement("div");
            sliderWrapper.classList.add("slider-wrapper");
            const sliderTrack = document.createElement("div");
            sliderTrack.classList.add("slider-track");

            sliderImages.forEach(function (imgData) {
                const imageContainer = document.createElement("div");
                imageContainer.classList.add("image-container");

                const img = document.createElement("img");
                img.src = imgData.src;
                img.alt = imgData.alt;
                img.classList.add("slider-image");

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
            updateSlider();
        })
        .catch(function (error) {
            console.error('Errore nel caricamento delle immagini:', error);
        });
}

const container = document.getElementById("slider-container");
const prevButton = document.querySelector(".slider-controls .slider-btn.prev");
const nextButton = document.querySelector(".slider-controls .slider-btn.next");

prevButton.innerHTML = "&#10094;";
nextButton.innerHTML = "&#10095;";
prevButton.addEventListener("click", function () {
    if (currentIndex > 0) {
        currentIndex -= step;
        updateSlider();
    }
});

nextButton.addEventListener("click", function () {
    if (currentIndex + step <= sliderImages.length - itemsPerPage) {
        currentIndex += step;
        updateSlider();
    }
});

loadSliderImages();