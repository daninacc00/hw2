// ========== VARIABLES ==========
let categories = [];
let interests = [];
let userInterests = [];
let activeCategory = 'all';

let categoriesLoaded = false;
let interestsLoaded = false;
let userInterestsLoaded = false;

let interestsModal = null;

// ========== UTILITY FUNCTIONS ==========
function handleCategoriesSuccess(data) {
    if (!data || !data.success) {
        console.error(data ? data.message : 'No data received' || 'Errore nel caricamento delle categorie');
        categories = [];
    } else {
        categories = data.data;
    }
    categoriesLoaded = true;
    renderAll();
}

function handleCategoriesError(error) {
    console.error('fetchCategories error:', error);
    categories = [];
    categoriesLoaded = true;
    renderAll();
}

function fetchCategories() {
    fetch('/api/interests/categories')
        .then(onResponse)
        .then(handleCategoriesSuccess)
        .catch(handleCategoriesError);
}

function handleInterestsSuccess(data) {
    if (!data.success) {
        console.error(data.message || 'Errore nel caricamento degli interessi');
        interests = [];
    } else {
        interests = data.data;
    }
    interestsLoaded = true;
    renderAll();
}

function handleInterestsError(error) {
    console.error(error);
    interests = [];
    interestsLoaded = true;
    renderAll();
}

function fetchInterests(category) {
    if (!category) category = 'all';

    const url = category === 'all'
        ? '/api/interests'
        : '/api/interests?category=' + category;

    fetch(url)
        .then(onResponse)
        .then(handleInterestsSuccess)
        .catch(handleInterestsError);
}

function handleUserInterestsSuccess(data) {
    if (!data.success) {
        console.error(data.message || 'Errore nel caricamento degli interessi utente');
        userInterests = [];
    } else {
        userInterests = data.data;
    }
    userInterestsLoaded = true;
    renderAll();
}

function handleUserInterestsError(error) {
    console.error(error);
    userInterests = [];
    userInterestsLoaded = true;
    renderAll();
}

function fetchUserInterests() {
    if (!activeCategory) activeCategory = 'all';

    const url = activeCategory === 'all'
        ? '/api/interests/user'
        : '/api/interests/user?category=' + activeCategory;

    fetch(url)
        .then(onResponse)
        .then(handleUserInterestsSuccess)
        .catch(handleUserInterestsError);
}

function renderAll() {
    if (categoriesLoaded && interestsLoaded && userInterestsLoaded) {
        renderCategoryTabs(categories, activeCategory);
        renderInterestsGrid(userInterests);
        renderModalCategoryTabs(categories, userInterests);
        renderModalInterests(interests);
    }
}

function createCategoryTab(category, isActive) {
    const tab = document.createElement('a');
    tab.href = '#';
    tab.className = 'category-tab ' + (isActive ? 'active' : '');
    tab.textContent = category.name || 'Tutto';
    tab.dataset.category = category.value || 'all';
    return tab;
}

function bindCategoryTabEvents(tabsContainer) {
    tabsContainer.querySelectorAll('.category-tab').forEach(function (tab) {
        tab.addEventListener('click', function (e) {
            e.preventDefault();
            const category = tab.dataset.category;
            switchCategory(category);
        });
    });
}

function renderCategoryTabs(categories, activeCategory) {
    const tabsContainer = document.getElementById('category-tabs');
    tabsContainer.innerHTML = '';

    const allTab = createCategoryTab({ name: 'Tutto', value: 'all' }, activeCategory === 'all');
    tabsContainer.appendChild(allTab);

    categories.forEach(function (category) {
        const tab = createCategoryTab(category, activeCategory === category.value);
        tabsContainer.appendChild(tab);
    });

    bindCategoryTabEvents(tabsContainer);
}

function createAddInterestsCard() {
    const addCard = document.createElement('div');
    addCard.className = 'add-interests-card';

    const plusIcon = document.createElement('div');
    plusIcon.className = 'plus-icon';
    plusIcon.textContent = '+';

    const title = document.createElement('h3');
    title.textContent = 'Aggiungi interessi';

    const description = document.createElement('p');
    description.textContent = 'Personalizza ulteriormente i tuoi interessi';

    addCard.appendChild(plusIcon);
    addCard.appendChild(title);
    addCard.appendChild(description);
    addCard.addEventListener('click', showAddInterestModal);

    return addCard;
}

function createInterestCard(interest) {
    const card = document.createElement('div');
    card.className = 'interest-card ' + (interest.user_has_interest ? 'selected' : '');
    card.dataset.interestId = interest.id;

    const imageUrl = interest.image_url || '/assets/images/interests/' + interest.id + '.jpg';
    card.style.backgroundImage = 'url(\'' + imageUrl + '\')';

    const categoryLabel = document.createElement('div');
    categoryLabel.className = 'category-label';
    categoryLabel.textContent = interest.category_name;

    const title = document.createElement('h3');
    title.textContent = interest.name;

    const description = document.createElement('p');
    description.classList.add("description");
    description.textContent = interest.description || '';

    card.appendChild(categoryLabel);
    card.appendChild(title);
    card.appendChild(description);

    return card;
}

function renderInterestsGrid(userInterests) {
    const grid = document.getElementById('interests-grid');
    grid.innerHTML = '';

    const addCard = createAddInterestsCard();
    grid.appendChild(addCard);

    if (userInterests.length === 0) {
        return;
    }

    userInterests.forEach(function (interest) {
        const card = createInterestCard(interest);
        grid.appendChild(card);
    });
}

function calculateCategoryCounts(userInterests) {
    const counts = { all: userInterests.length };
    userInterests.forEach(function (interest) {
        const categoryId = interest.category_id.toString();
        counts[categoryId] = (counts[categoryId] || 0) + 1;
    });
    return counts;
}

function createModalCategoryTab(category, count, isActive) {
    const tab = document.createElement('button');
    tab.className = 'modal-category-tab' + (isActive ? ' active' : '');
    tab.dataset.category = category.id || 'all';
    tab.textContent = category.name + ' (' + (count || 0) + ')';
    return tab;
}

function bindModalCategoryTabEvents(tabsContainer) {
    tabsContainer.querySelectorAll('.modal-category-tab').forEach(function (tab) {
        tab.addEventListener('click', function () {
            switchModalCategory(tab.dataset.category);
        });
    });
}

function renderModalCategoryTabs(categories, userInterests) {
    const tabsContainer = document.getElementById('modal-category-tabs');
    tabsContainer.innerHTML = '';

    const counts = calculateCategoryCounts(userInterests);

    const allTab = createModalCategoryTab({ name: 'Tutto', id: 'all' }, counts.all, true);
    tabsContainer.appendChild(allTab);

    categories.forEach(function (category) {
        const tab = createModalCategoryTab(category, counts[category.id], false);
        tabsContainer.appendChild(tab);
    });

    bindModalCategoryTabEvents(tabsContainer);
}

function createModalInterestImage(interest) {
    const imageDiv = document.createElement('div');
    imageDiv.className = 'modal-interest-image';

    const img = document.createElement('img');
    const imageUrl = interest.image_url || '/assets/images/interests/' + interest.id + '.jpg';
    img.src = imageUrl;
    img.alt = interest.name;

    imageDiv.appendChild(img);
    return imageDiv;
}

function createModalInterestCheckbox(interest) {
    const checkboxDiv = document.createElement('div');
    checkboxDiv.className = 'modal-interest-checkbox';

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';

    const userHasInterest = userInterests.some(function (userInterest) {
        return userInterest.id.toString() === interest.id.toString();
    });
    checkbox.checked = userHasInterest;

    checkbox.addEventListener('click', function () {
        handleInterestToggle(interest.id, checkbox);
    });

    checkboxDiv.appendChild(checkbox);
    return checkboxDiv;
}

function createModalInterestItem(interest) {
    const item = document.createElement('div');
    item.className = 'modal-interest-item';
    item.dataset.interestId = interest.id;
    item.dataset.category = interest.category_id;

    const imageDiv = createModalInterestImage(interest);

    const nameDiv = document.createElement('div');
    nameDiv.className = 'modal-interest-name';
    nameDiv.textContent = interest.name;

    const checkboxDiv = createModalInterestCheckbox(interest);

    item.appendChild(imageDiv);
    item.appendChild(nameDiv);
    item.appendChild(checkboxDiv);

    return item;
}

function renderModalInterests(interests) {
    const container = document.getElementById('modal-interests-list');
    container.innerHTML = '';

    interests.forEach(function (interest) {
        const item = createModalInterestItem(interest);
        container.appendChild(item);
    });
}

function handleToggleSuccess(result, interestId, checkboxElement) {
    if (!result) {
        checkboxElement.checked = !checkboxElement.checked;
        return;
    }

    checkboxElement.checked = result.action === 'added';

    const interestIndex = interests.findIndex(function (i) {
        return i.id.toString() === interestId.toString();
    });
    if (interestIndex !== -1) {
        interests[interestIndex].user_has_interest = result.action === 'added';
    }

    updateUserInterestsList(result, interestId);
    refreshUserInterestsData();
}

function updateUserInterestsList(result, interestId) {
    if (result.action === 'added') {
        const existsInUserInterests = userInterests.some(function (ui) {
            return ui.id.toString() === interestId.toString();
        });
        if (!existsInUserInterests) {
            const interestToAdd = interests.find(function (i) {
                return i.id.toString() === interestId.toString();
            });
            if (interestToAdd) {
                const userInterest = Object.assign({}, interestToAdd);
                userInterest.user_has_interest = true;
                userInterests.push(userInterest);
            }
        }
    } else {
        userInterests = userInterests.filter(function (ui) {
            return ui.id.toString() !== interestId.toString();
        });
    }
}

function refreshUserInterestsData() {
    const url = activeCategory === 'all'
        ? '/api/interests/user'
        : '/api/interests/user?category=' + activeCategory;

    fetch(url)
        .then(onResponse)
        .then(function (data) {
            handleRefreshSuccess(data);
        })
        .catch(function (error) {
            handleRefreshError(error);
        });
}

function handleRefreshSuccess(data) {
    if (data.success) {
        userInterests = data.data;
        renderInterestsGrid(userInterests);
        renderModalCategoryTabs(categories, userInterests);
    }
    hideModalLoading();
}

function handleRefreshError(error) {
    console.error(error);
    hideModalLoading();
}

function showModalLoading() {
    const modalLoading = document.getElementById('modal-loading');
    modalLoading.style.display = 'block';
}

function hideModalLoading() {
    const modalLoading = document.getElementById('modal-loading');
    modalLoading.style.display = 'none';
}

function toggleInterest(interestId, callback) {
    const formData = new FormData();
    formData.append('interestId', interestId);
    formData.append('_token', getCsrfToken());

    fetch('/api/interests/toggle', {
        method: 'POST',
        body: formData
    })
        .then(onResponse)
        .then(function (data) {
            if (!data.success) {
                console.error(data.message || 'Errore nella selezione');
                callback(null);
            } else {
                callback(data);
            }
        })
        .catch(function (error) {
            console.error(error);
            callback(null);
        });
}

function handleInterestToggle(interestId, checkboxElement) {
    showModalLoading();

    toggleInterest(interestId, function (result) {
        handleToggleSuccess(result, interestId, checkboxElement);
    });
}

function updateCategoryTabs(category) {
    document.querySelectorAll('.category-tab').forEach(function (tab) {
        tab.classList.toggle('active', tab.dataset.category === category);
    });
}

function handleCategorySwitchSuccess(data) {
    if (!data.success) {
        console.error(data.message || 'Errore nel caricamento degli interessi utente');
        userInterests = [];
    } else {
        userInterests = data.data;
    }
    renderInterestsGrid(userInterests);
}

function handleCategorySwitchError(error) {
    console.error(error);
    userInterests = [];
    renderInterestsGrid(userInterests);
}

function switchCategory(category) {
    activeCategory = category;
    updateCategoryTabs(category);

    const url = category === 'all'
        ? '/api/interests/user'
        : '/api/interests/user?category=' + category;

    fetch(url)
        .then(onResponse)
        .then(handleCategorySwitchSuccess)
        .catch(handleCategorySwitchError);
}

// ========== MODAL CATEGORY SWITCHING ==========
function updateModalCategoryTabs(categoryId) {
    document.querySelectorAll('.modal-category-tab').forEach(function (tab) {
        tab.classList.toggle('active', tab.dataset.category === categoryId);
    });
}

function updateModalInterestItems(categoryId) {
    document.querySelectorAll('.modal-interest-item').forEach(function (item) {
        const shouldShow = categoryId === 'all' || item.dataset.category === categoryId;
        item.style.display = shouldShow ? 'flex' : 'none';
    });
}

function switchModalCategory(categoryId) {
    updateModalCategoryTabs(categoryId);
    updateModalInterestItems(categoryId);
}

// ========== MODAL MANAGEMENT ==========
function showAddInterestModal() {
    if (interestsModal) {
        interestsModal.style.display = 'flex';
    }
}

function closeInterestModal() {
    if (interestsModal) {
        interestsModal.style.display = 'none';
    }
}

function saveInterestsAndClose() {
    closeInterestModal();
}

const modalCloseBtn = document.getElementById('modal-close');
if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', closeInterestModal);
}

const modalCancelBtn = document.getElementById('modal-cancel')
if (modalCancelBtn) {
    modalCancelBtn.addEventListener('click', closeInterestModal);
}

const modalSaveBtn = document.getElementById('modal-save')
if (modalSaveBtn) {
    modalSaveBtn.addEventListener('click', saveInterestsAndClose);
}

const modifyBtn = document.querySelector('.modify-btn');
if (modifyBtn) {
    modifyBtn.addEventListener('click', showAddInterestModal);
}
// ========== INITIALIZATION ==========
function initialize() {
    interestsModal = document.getElementById('interest-modal');

    fetchCategories();
    fetchInterests();
    fetchUserInterests();
}

initialize();
