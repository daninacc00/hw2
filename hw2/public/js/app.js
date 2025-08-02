let currentUser = null;

loadUserData();

function loadUserData() {
    fetch('/api/user/profile', {
        headers: {
            'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content') || ''
        }
    })
        .then(function(response) {
            if (response.ok) {
                return response.json();
            } else {
                currentUser = null;
                updateUIForGuestUser();
                return null;
            }
        })
        .then(function(data) {
            if (data && data.success && data.user) {
                currentUser = data.user;
                updateUIForLoggedUser();
            } else {
                currentUser = null;
                updateUIForGuestUser();
            }
        })
        .catch(function(error) {
            console.error('Errore nel caricamento dati utente:', error);
            currentUser = null;
            updateUIForGuestUser();
        });
}

function updateUIForLoggedUser() {
    updateDesktopUserMenu();
    updateMobileUserMenu();
}

function updateUIForGuestUser() {
    updateDesktopGuestMenu();
    updateMobileGuestMenu();
}

function updateDesktopUserMenu() {
    const userMenuItem = document.querySelector('#user-menu-navbar .list-item:last-child');
    if (userMenuItem && currentUser) {
        const tooltipContainer = document.createElement('div');
        tooltipContainer.className = 'tooltip-container';

        const linkText = document.createElement('p');
        linkText.className = 'link-text';
        linkText.textContent = 'Ciao, ' + currentUser.first_name;

        const tooltip = document.createElement('div');
        tooltip.className = 'tooltip';

        const tooltipTitle = document.createElement('h3');
        tooltipTitle.className = 'tooltip-title';
        tooltipTitle.textContent = 'Account';

        const actionList = document.createElement('ul');
        actionList.className = 'action-list';

        const actions = [
            { action: 'profile', text: 'Profilo' },
            { action: 'favorites', text: 'Preferiti' },
            { action: 'cart', text: 'Carrello' },
            { action: 'orders', text: 'Ordini' },
            { action: 'settings', text: 'Impostazioni account' },
            { action: 'logout', text: 'Esci' }
        ];

        actions.forEach(function(actionData) {
            const actionItem = document.createElement('li');
            actionItem.className = 'action-item';
            actionItem.dataset.action = actionData.action;

            const actionText = document.createElement('span');
            actionText.className = 'action-text';
            actionText.textContent = actionData.text;

            actionItem.appendChild(actionText);
            actionList.appendChild(actionItem);
        });

        tooltip.appendChild(tooltipTitle);
        tooltip.appendChild(actionList);
        tooltipContainer.appendChild(linkText);
        tooltipContainer.appendChild(tooltip);

        userMenuItem.innerHTML = '';
        userMenuItem.appendChild(tooltipContainer);
        
        setupActionListeners();
    }
}

function updateDesktopGuestMenu() {
    const userMenuItem = document.querySelector('#user-menu-navbar .list-item:last-child');
    if (userMenuItem) {
        const linkItem = document.createElement('a');
        linkItem.className = 'link-item';
        linkItem.href = '/login';

        const linkText = document.createElement('p');
        linkText.className = 'link-text';
        linkText.textContent = 'Accedi';

        linkItem.appendChild(linkText);
        userMenuItem.innerHTML = '';
        userMenuItem.appendChild(linkItem);
    }
}

function updateMobileUserMenu() {
    const mobileMenuNav = document.querySelector('.mobile-menu-nav');
    if (mobileMenuNav && currentUser) {
        const membershipDiv = mobileMenuNav.querySelector('.mobile-menu-membership');
        
        if (membershipDiv) {
            const mobileUserProfile = document.createElement('div');
            mobileUserProfile.className = 'mobile-user-profile';

            const mobileUserCollapse = document.createElement('div');
            mobileUserCollapse.className = 'mobile-user-collapse';
            mobileUserCollapse.onclick = toggleMobileUserMenu;

            const mobileUserInfo = document.createElement('div');
            mobileUserInfo.className = 'mobile-user-info';

            const mobileUserIcon = document.createElement('div');
            mobileUserIcon.className = 'mobile-user-icon';
            const userIcon = document.createElement('i');
            userIcon.className = 'fa-regular fa-user';
            mobileUserIcon.appendChild(userIcon);

            const mobileUserName = document.createElement('span');
            mobileUserName.className = 'mobile-user-name';
            mobileUserName.textContent = currentUser.first_name + ' ' + currentUser.last_name;

            const mobileUserArrow = document.createElement('div');
            mobileUserArrow.className = 'mobile-user-arrow';
            const arrowIcon = document.createElement('i');
            arrowIcon.className = 'fa-solid fa-chevron-down';
            mobileUserArrow.appendChild(arrowIcon);

            mobileUserInfo.appendChild(mobileUserIcon);
            mobileUserInfo.appendChild(mobileUserName);
            mobileUserInfo.appendChild(mobileUserArrow);
            mobileUserCollapse.appendChild(mobileUserInfo);

            const mobileUserMenu = document.createElement('div');
            mobileUserMenu.className = 'mobile-user-menu hidden';
            mobileUserMenu.id = 'mobile-user-menu';

            const mobileUserActions = document.createElement('ul');
            mobileUserActions.className = 'mobile-user-actions';

            const mobileActions = [
                { action: 'profile', text: 'Profilo' },
                { action: 'favorites', text: 'Preferiti' },
                { action: 'cart', text: 'Carrello' },
                { action: 'orders', text: 'Ordini' },
                { action: 'settings', text: 'Impostazioni account' },
                { action: 'logout', text: 'Esci' }
            ];

            mobileActions.forEach(function(actionData) {
                const li = document.createElement('li');
                const a = document.createElement('a');
                a.href = '#';
                a.onclick = function() { handleAction(actionData.action); };
                a.textContent = actionData.text;
                li.appendChild(a);
                mobileUserActions.appendChild(li);
            });

            mobileUserMenu.appendChild(mobileUserActions);
            mobileUserProfile.appendChild(mobileUserCollapse);
            mobileUserProfile.appendChild(mobileUserMenu);

            membershipDiv.innerHTML = '';
            membershipDiv.appendChild(mobileUserProfile);
        }
    }
}

function updateMobileGuestMenu() {
    const mobileMenuNav = document.querySelector('.mobile-menu-nav');
    if (mobileMenuNav) {
        const membershipDiv = mobileMenuNav.querySelector('.mobile-menu-membership');
        
        if (membershipDiv) {
            const description = document.createElement('p');
            description.textContent = 'Diventa Member Nike per accedere a prodotti fantastici, tanta ispirazione e storie sullo sport. ';
            
            const discoverMore = document.createElement('a');
            discoverMore.href = '#';
            discoverMore.className = 'discover-more';
            discoverMore.textContent = 'Scopri di più';
            description.appendChild(discoverMore);

            const mobileMenuButtons = document.createElement('div');
            mobileMenuButtons.className = 'mobile-menu-buttons';

            const primaryBtn = document.createElement('button');
            primaryBtn.className = 'mobile-menu-btn primary';
            primaryBtn.onclick = function() { window.location.href = '/register'; };
            primaryBtn.textContent = 'Unisciti a noi';

            const secondaryBtn = document.createElement('button');
            secondaryBtn.className = 'mobile-menu-btn secondary';
            secondaryBtn.onclick = function() { window.location.href = '/login'; };
            secondaryBtn.textContent = 'Accedi';

            mobileMenuButtons.appendChild(primaryBtn);
            mobileMenuButtons.appendChild(secondaryBtn);

            membershipDiv.innerHTML = '';
            membershipDiv.appendChild(description);
            membershipDiv.appendChild(mobileMenuButtons);
        }
    }
}

function toggleMobileUserMenu() {
    const userMenu = document.getElementById('mobile-user-menu');
    const arrow = document.querySelector('.mobile-user-arrow i');
    
    if (userMenu) {
        userMenu.classList.toggle('hidden');
        
        if (arrow) {
            if (userMenu.classList.contains('hidden')) {
                arrow.style.transform = 'rotate(0deg)';
            } else {
                arrow.style.transform = 'rotate(180deg)';
            }
        }
    }
}

function setupActionListeners() {
    document.querySelectorAll('.action-item').forEach(function(item) {
        const action = item.getAttribute("data-action");
        item.replaceWith(item.cloneNode(true));
    });
    
    document.querySelectorAll('.action-item').forEach(function(item) {
        const action = item.getAttribute("data-action");
        item.addEventListener("click", function() {
            handleAction(action);
        });
    });
}

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

function performLogout() {
    fetch('/api/auth/logout', {
        method: 'POST',
        headers: {
            'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content') || '',
            'Content-Type': 'application/json'
        }
    })
        .then(function(response) {
            if (response.ok) {
                currentUser = null;
                updateUIForGuestUser();
                window.location.href = '/';
            } else {
                console.error('Errore durante il logout');
            }
        })
        .catch(function(error) {
            console.error('Errore durante il logout:', error);
            window.location.href = "/logout";
        });
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

let cartCount = 0;
let favoritesCount = 0;

function showNotificationPopup(type, title, message, actions) {
    actions = actions || [];
    const existingPopup = document.querySelector('.notification-popup');
    if (existingPopup) {
        existingPopup.remove();
    }

    const popup = document.createElement('div');
    popup.className = 'notification-popup ' + type;

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

        actions.forEach(function(action) {
            const actionBtn = document.createElement('a');
            actionBtn.href = action.url;
            actionBtn.className = 'popup-btn ' + (action.primary ? 'primary' : '');
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

function openMobileMenu() {
    const menu = document.querySelector('#mobile-menu');
    const overlay = document.querySelector('#mobile-menu-overlay');

    menu.classList.remove('hidden');
    overlay.classList.remove('hidden');
}

function closeMobileMenu() {
    const menu = document.querySelector('#mobile-menu');
    const overlay = document.querySelector('#mobile-menu-overlay');

    menu.classList.add('hidden');
    overlay.classList.add('hidden');
}

function onHamburgerClick() {
    openMobileMenu();
}

function onCloseClick() {
    closeMobileMenu();
}

function onOverlayClick() {
    closeMobileMenu();
}

const hamburgerButton = document.querySelector('.hamburger-button');
if (hamburgerButton) {
    hamburgerButton.addEventListener('click', onHamburgerClick);
}

const closeButton = document.querySelector('.mobile-menu-close');
if (closeButton) {
    closeButton.addEventListener('click', onCloseClick);
}

const overlay = document.querySelector('#mobile-menu-overlay');
if (overlay) {
    overlay.addEventListener('click', onOverlayClick);
}