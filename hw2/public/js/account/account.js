// ========== STATE VARIABLES ==========
let currentTab = "profile";

// ========== TAB NAVIGATION ==========
function handleClickTab(e, link) {
    const tabName = link.getAttribute('data-tab');

    if (tabName === 'profile') {
        window.location.href = '/account';
        return;
    }

    if (tabName === 'favorites') {
        window.location.href = '/account/favorites';
        return;
    }

    if (tabName === 'orders') {
        window.location.href = '/account/orders';
        return;
    }

    if (tabName === 'settings') {
        window.location.href = '/account/settings';
        return;
    }

    e.preventDefault();
    switchTab(tabName);
}

function switchTab(tabName) {
    if (tabName === currentTab) return;

    hideTab(currentTab);
    currentTab = tabName;
    showTab(currentTab);
}

function showTab(tabName) {
    const tabContent = document.getElementById('tab-' + tabName);

    if (tabContent) {
        tabContent.classList.add('active');
    }
}

function hideTab(tabName) {
    const tabContent = document.getElementById('tab-' + tabName);
    if (tabContent) {
        tabContent.classList.remove('active');
    }
}

const tabLinks = document.querySelectorAll('.tab-link');

tabLinks.forEach(function (link) {
    link.addEventListener('click', function (e) {
        handleClickTab(e, link);
    })
});

function initialize() {
    showTab(currentTab);
}

initialize();