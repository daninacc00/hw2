let currentTab = "profile";

function handleClickTab(e, link) {
    const tabName = link.getAttribute('data-tab');
    
    if (tabName === 'favorites') {
        window.location.href = '/pages/shop/favorites/favorites.php';
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
    updateActiveLink(tabName);
}

function showTab(tabName) {
    const tabContent = document.getElementById(`tab-${tabName}`);

    if (tabContent) {
        tabContent.classList.add('active');
        tabContent.style.opacity = '0';
        setTimeout(function () {
            tabContent.style.opacity = '1';
        }, 50);
    }
}

function hideTab(tabName) {
    
    const tabContent = document.getElementById(`tab-${tabName}`);
    if (tabContent) {
        tabContent.classList.remove('active');
    }
}

function updateActiveLink(tabName) {
    tabLinks.forEach(link => {
        link.classList.remove('active');
    });

    const activeLink = document.querySelector(`[data-tab="${tabName}"]`);
    if (activeLink) {
        activeLink.classList.add('active');
    }
}

const tabLinks = document.querySelectorAll('.tab-link');
const tabContents = document.querySelectorAll('.tab-content');

tabLinks.forEach(link => {
    link.addEventListener('click', (e) => handleClickTab(e, link));
});

showTab(currentTab);