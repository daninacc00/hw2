function onOpenSearch(event) {
    const container = event.currentTarget;
    container.classList.add("search-open");
    document.body.classList.add('no-scroll');
    document.addEventListener("click", onCloseSearchOutside);
}

function onCloseSearch(event) {
    event.stopPropagation();
    let container = document.querySelector("#search-bar-container");
    container.classList.remove("search-open");
    document.body.classList.remove('no-scroll');
    document.removeEventListener("click", onCloseSearchOutside);
}

function onCloseSearchOutside(event) {
    let container = document.querySelector("#search-bar-container");
    if (!container.contains(event.target)) {
        onCloseSearch(event);
    }
}

let searchBarContainer = document.querySelector("#search-bar-container");
searchBarContainer.addEventListener("click", onOpenSearch);

let closeSearch = document.querySelector(".close-search-btn");
closeSearch.addEventListener("click", onCloseSearch);

function handleAction(action) {
    switch (action) {
        case 'profile':
            window.location.href = "/pages/account/account.php";
            break;
        case 'favorites':
            window.location.href = "/pages/shop/favorites/favorites.php";
            break;
        case 'logout':
            window.location.href = "/pages/logout.php";
            break;
        default:
            break;
    }
}

document.querySelectorAll('.action-item').forEach(item => {
    const action = item.getAttribute("data-action");
    item.addEventListener("click", () => handleAction(action))
});

let cartCount = 0;
let favoritesCount = 0;

function showNotificationPopup(type, title, message, actions = []) {
    const existingPopup = document.querySelector('.notification-popup');
    if (existingPopup) {
        existingPopup.remove();
    }

    const popup = document.createElement('div');
    popup.className = `notification-popup ${type}`;

    const popupHeader = document.createElement('div');
    popupHeader.className = 'popup-header';

    const popupTitle = document.createElement('h3');
    popupTitle.className = 'popup-title';
    popupTitle.textContent = title;

    popupHeader.appendChild(popupTitle);

    const popupMessage = document.createElement('p');
    popupMessage.className = 'popup-message';
    popupMessage.textContent = message;

    popup.appendChild(popupHeader);
    popup.appendChild(popupMessage);

    if (actions.length > 0) {
        const popupActions = document.createElement('div');
        popupActions.className = 'popup-actions';

        actions.forEach(action => {
            const actionBtn = document.createElement('a');
            actionBtn.href = action.url;
            actionBtn.className = `popup-btn ${action.primary ? 'primary' : ''}`;
            actionBtn.textContent = action.text;
            popupActions.appendChild(actionBtn);
        });

        popup.appendChild(popupActions);
    }

    document.body.appendChild(popup);

    popup.offsetHeight;
    popup.classList.add('show');
}


function updateCartCounter(quantity) {
    cartCount += quantity;
    const counter = document.getElementById('cart-counter');

    if (cartCount > 0) {
        counter.textContent = cartCount;
        counter.classList.remove('hidden');
    } else {
        counter.classList.add('hidden');
    }
}

function updateFavoritesCounter(quantity) {
    favoritesCount += quantity;
    const counter = document.getElementById('favorites-counter');

    if (favoritesCount > 0) {
        counter.textContent = favoritesCount;
        counter.classList.remove('hidden');
    } else {
        counter.classList.add('hidden');
    }
}














// Mobile Menu JavaScript - seguendo le slide del corso
// Usa querySelector, addEventListener, classList come mostrato nelle slide

// Funzione per aprire il menu (seguendo le slide)
function openMobileMenu() {
    const menu = document.querySelector('#mobile-menu');
    const overlay = document.querySelector('#mobile-menu-overlay');
    
    // Aggiungi classi usando classList.add come nelle slide
    menu.classList.remove('hidden');
    overlay.classList.remove('hidden');
}

// Funzione per chiudere il menu (seguendo le slide)  
function closeMobileMenu() {
    const menu = document.querySelector('#mobile-menu');
    const overlay = document.querySelector('#mobile-menu-overlay');
    
    // Rimuovi classi usando classList.remove come nelle slide
    menu.classList.add('hidden');
    overlay.classList.add('hidden');
}

// Event handler per il click sul pulsante hamburger (seguendo le slide)
function onHamburgerClick() {
    openMobileMenu();
}

// Event handler per chiudere il menu (seguendo le slide)
function onCloseClick() {
    closeMobileMenu();
}

// Event handler per chiudere cliccando sull'overlay (seguendo le slide)
function onOverlayClick() {
    closeMobileMenu();
}

// Inizializzazione - eseguita dopo il caricamento del DOM grazie a defer
// Seguendo le slide: querySelector + addEventListener

// Trova il pulsante hamburger e aggiungi event listener
const hamburgerButton = document.querySelector('.hamburger-button');
if (hamburgerButton) {
    hamburgerButton.addEventListener('click', onHamburgerClick);
}

// Trova il pulsante di chiusura e aggiungi event listener  
const closeButton = document.querySelector('.mobile-menu-close');
if (closeButton) {
    closeButton.addEventListener('click', onCloseClick);
}

// Trova l'overlay e aggiungi event listener
const overlay = document.querySelector('#mobile-menu-overlay');
if (overlay) {
    overlay.addEventListener('click', onOverlayClick);
}