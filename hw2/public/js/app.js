// Variabile globale per i dati utente
let currentUser = null;

// Inizializzazione al caricamento della pagina
loadUserData();

// Funzione per caricare i dati utente tramite API
async function loadUserData() {
    try {
        const response = await fetch('/api/user/profile', {
            headers: {
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''
            }
        });
        
        if (response.ok) {
            const data = await response.json();
            if (data.success && data.user) {
                currentUser = data.user;
                updateUIForLoggedUser();
            } else {
                currentUser = null;
                updateUIForGuestUser();
            }
        } else {
            currentUser = null;
            updateUIForGuestUser();
        }
    } catch (error) {
        console.error('Errore nel caricamento dati utente:', error);
        currentUser = null;
        updateUIForGuestUser();
    }
}

// Aggiorna UI per utente loggato
function updateUIForLoggedUser() {
    // Aggiorna topbar desktop
    updateDesktopUserMenu();
    
    // Aggiorna menu mobile
    updateMobileUserMenu();
}

// Aggiorna UI per utente guest
function updateUIForGuestUser() {
    // Aggiorna topbar desktop
    updateDesktopGuestMenu();
    
    // Aggiorna menu mobile
    updateMobileGuestMenu();
}

// Aggiorna menu desktop per utente loggato
function updateDesktopUserMenu() {
    const userMenuItem = document.querySelector('#user-menu-navbar .list-item:last-child');
    if (userMenuItem && currentUser) {
        userMenuItem.innerHTML = `
            <div class="tooltip-container">
                <p class="link-text">
                    Ciao, ${currentUser.first_name}
                </p>
                <div class="tooltip">
                    <h3 class="tooltip-title">Account</h3>
                    <ul class="action-list">
                        <li class="action-item" data-action="profile">
                            <span class="action-text">Profilo</span>
                        </li>
                        <li class="action-item" data-action="favorites">
                            <span class="action-text">Preferiti</span>
                        </li>
                        <li class="action-item" data-action="cart">
                            <span class="action-text">Carrello</span>
                        </li>
                        <li class="action-item" data-action="orders">
                            <span class="action-text">Ordini</span>
                        </li>
                        <li class="action-item" data-action="settings">
                            <span class="action-text">Impostazioni account</span>
                        </li>
                        <li class="action-item" data-action="logout">
                            <span class="action-text">Esci</span>
                        </li>
                    </ul>
                </div>
            </div>
        `;
        
        // Riassegna gli event listener
        setupActionListeners();
    }
}

// Aggiorna menu desktop per guest
function updateDesktopGuestMenu() {
    const userMenuItem = document.querySelector('#user-menu-navbar .list-item:last-child');
    if (userMenuItem) {
        userMenuItem.innerHTML = `
            <a class='link-item' href='/login'>
                <p class='link-text'>Accedi</p>
            </a>
        `;
    }
}

// Aggiorna menu mobile per utente loggato
function updateMobileUserMenu() {
    const mobileMenuNav = document.querySelector('.mobile-menu-nav');
    if (mobileMenuNav && currentUser) {
        // Trova il div mobile-menu-membership
        const membershipDiv = mobileMenuNav.querySelector('.mobile-menu-membership');
        
        if (membershipDiv) {
            // Sostituisce il contenuto con il profilo utente
            membershipDiv.innerHTML = `
                <div class="mobile-user-profile">
                    <div class="mobile-user-collapse" onclick="toggleMobileUserMenu()">
                        <div class="mobile-user-info">
                            <div class="mobile-user-icon">
                                <i class="fa-regular fa-user"></i>
                            </div>
                            <span class="mobile-user-name">${currentUser.first_name} ${currentUser.last_name}</span>
                            <div class="mobile-user-arrow">
                                <i class="fa-solid fa-chevron-down"></i>
                            </div>
                        </div>
                    </div>
                    <div class="mobile-user-menu hidden" id="mobile-user-menu">
                        <ul class="mobile-user-actions">
                            <li><a href="#" onclick="handleAction('profile')">Profilo</a></li>
                            <li><a href="#" onclick="handleAction('favorites')">Preferiti</a></li>
                            <li><a href="#" onclick="handleAction('cart')">Carrello</a></li>
                            <li><a href="#" onclick="handleAction('orders')">Ordini</a></li>
                            <li><a href="#" onclick="handleAction('settings')">Impostazioni account</a></li>
                            <li><a href="#" onclick="handleAction('logout')">Esci</a></li>
                        </ul>
                    </div>
                </div>
            `;
        }
    }
}

// Aggiorna menu mobile per guest
function updateMobileGuestMenu() {
    const mobileMenuNav = document.querySelector('.mobile-menu-nav');
    if (mobileMenuNav) {
        const membershipDiv = mobileMenuNav.querySelector('.mobile-menu-membership');
        
        if (membershipDiv) {
            // Ripristina il contenuto originale per guest
            membershipDiv.innerHTML = `
                <p>Diventa Member Nike per accedere a prodotti fantastici, tanta ispirazione e storie sullo sport. 
                    <a href="#" class="discover-more">Scopri di più</a>
                </p>
                <div class="mobile-menu-buttons">
                    <button class="mobile-menu-btn primary" onclick="window.location.href='/register'">Unisciti a noi</button>
                    <button class="mobile-menu-btn secondary" onclick="window.location.href='/login'">Accedi</button>
                </div>
            `;
        }
    }
}

// Toggle del menu utente mobile
function toggleMobileUserMenu() {
    const userMenu = document.getElementById('mobile-user-menu');
    const arrow = document.querySelector('.mobile-user-arrow i');
    
    if (userMenu) {
        userMenu.classList.toggle('hidden');
        
        // Ruota la freccia
        if (arrow) {
            if (userMenu.classList.contains('hidden')) {
                arrow.style.transform = 'rotate(0deg)';
            } else {
                arrow.style.transform = 'rotate(180deg)';
            }
        }
    }
}

// Riassegna gli event listener per le azioni
function setupActionListeners() {
    document.querySelectorAll('.action-item').forEach(item => {
        const action = item.getAttribute("data-action");
        // Rimuovi listener esistenti
        item.replaceWith(item.cloneNode(true));
    });
    
    // Riassegna i nuovi listener
    document.querySelectorAll('.action-item').forEach(item => {
        const action = item.getAttribute("data-action");
        item.addEventListener("click", () => handleAction(action));
    });
}

// Funzione per gestire le azioni (modificata per logout API)
function handleAction(action) {
    switch (action) {
        case 'profile':
            window.location.href = "/account";
            break;
        case 'favorites':
            window.location.href = "/account/favorites";
            break;
        case 'cart':
            window.location.href = "/account/cart";
            break;
        case 'orders':
            window.location.href = "/account/orders";
            break;
        case 'settings':
            window.location.href = "/account/settings";
            break;
        case 'logout':
            performLogout();
            break;
        default:
            break;
    }
}

// Logout tramite API
async function performLogout() {
    try {
        const response = await fetch('/api/auth/logout', {
            method: 'POST',
            headers: {
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                'Content-Type': 'application/json'
            }
        });
        
        if (response.ok) {
            currentUser = null;
            updateUIForGuestUser();
            // Redirect o mostra messaggio di successo
            window.location.href = '/';
        } else {
            console.error('Errore durante il logout');
        }
    } catch (error) {
        console.error('Errore durante il logout:', error);
        // Fallback: usa il logout tradizionale
        window.location.href = "/logout";
    }
}

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
            window.location.href = "/account";
            break;
        case 'favorites':
            window.location.href = "/account/favorites";
            break;
        case 'cart':
            window.location.href = "/account/cart";
            break;
        case 'orders':
            window.location.href = "/account/orders";
            break;
        case 'settings':
            window.location.href = "/account/settings";
            break;
        case 'logout':
            window.location.href = "/logout";
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