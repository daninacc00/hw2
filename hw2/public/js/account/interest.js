let appState = {
    categories: [],
    interests: [],
    userInterests: [],
    activeCategory: 'all',
    loading: false
};

function fetchCategories(callback) {
    fetch('/api/account/profile/interests/getCategories.php')
        .then(result => result.json())
        .then(data => {
            if (!data.success) {
                console.error(data.message || 'Errore nel caricamento delle categorie');
                callback([]);
                return;
            }
            callback(data.data);
        })
        .catch(error => {
            console.error(error);
            callback([]);
        });
}

function fetchInterests(category, callback) {
    if (typeof category === 'function') {
        callback = category;
        category = 'all';
    }

    const url = category === 'all'
        ? '/api/account/profile/interests/getInterests.php'
        : `/api/account/profile/interests/getInterests.php?category=${category}`;

    fetch(url)
        .then(result => result.json())
        .then(data => {
            if (!data.success) {
                console.error(data.message || 'Errore nel caricamento degli interessi');
                callback([]);
                return;
            }
            callback(data.data);
        })
        .catch(error => {
            console.error(error);
            callback([]);
        });
}

function fetchUserInterests(category, callback) {
    if (typeof category === 'function') {
        callback = category;
        category = 'all';
    }

    const url = category === 'all'
        ? '/api/account/profile/interests/getUserInterests.php?'
        : `/api/account/profile/interests/getUserInterests.php?category=${category}`;

    fetch(url)
        .then(result => result.json())
        .then(data => {
            if (!data.success) {
                console.error(data.message || 'Errore nel caricamento degli interessi utente');
                callback([]);
                return;
            }
            callback(data.data);
        })
        .catch(error => {
            console.error(error);
            callback([]);
        });
}

function toggleInterest(interestId, callback) {
    const formData = new FormData();
    formData.append('interestId', interestId);
    
    fetch('/api/account/profile/interests/toggleInterest.php', {
        method: 'POST',
        body: formData
    })
        .then(result => result.json())
        .then(data => {
            if (!data.success) {
                console.error(data.message || 'Errore nella selezione');
                callback(null);
                return;
            }
            callback(data);
        })
        .catch(error => {
            console.error(error);
            callback(null);
        });
}

function renderCategoryTabs(categories, activeCategory) {
    const tabsContainer = document.getElementById('category-tabs');

    const allTab = document.createElement('a');
    allTab.href = '#';
    allTab.className = `category-tab ${activeCategory === 'all' ? 'active' : ''}`;
    allTab.textContent = 'Tutto';
    allTab.dataset.category = 'all';

    tabsContainer.innerHTML = '';
    tabsContainer.appendChild(allTab);

    categories.forEach(category => {
        const tab = document.createElement('a');
        tab.href = '#';
        tab.className = `category-tab ${activeCategory === category.value ? 'active' : ''}`;
        tab.textContent = category.name;
        tab.dataset.category = category.value;
        tabsContainer.appendChild(tab);
    });

    tabsContainer.querySelectorAll('.category-tab').forEach(tab => {
        tab.addEventListener('click', function(e) {
            e.preventDefault();
            const category = tab.dataset.category;
            switchCategory(category);
        });
    });
}

function renderInterestsGrid(userInterests) {
    const grid = document.getElementById('interests-grid');
    grid.innerHTML = '';

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
    grid.appendChild(addCard);

    if (userInterests.length === 0) {
        return;
    }

    userInterests.forEach(function(interest) {
        const card = document.createElement('div');
        card.className = `interest-card ${interest.user_has_interest ? 'selected' : ''}`;
        card.dataset.interestId = interest.id;
        
        const imageUrl = interest.image_url || `/assets/images/interests/${interest.id}.jpg`;
        card.style.backgroundImage = `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.5)), url('${imageUrl}')`;
        
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
        grid.appendChild(card);
    });
}

function renderModalCategoryTabs(categories, userInterests) {
    const tabsContainer = document.getElementById('modal-category-tabs');
    tabsContainer.innerHTML = '';

    const counts = { all: userInterests.length };
    userInterests.forEach(interest => {
        const catId = interest.category_id.toString();
        counts[catId] = (counts[catId] || 0) + 1;
    });

    const allTab = document.createElement('button');
    allTab.className = 'modal-category-tab active';
    allTab.dataset.category = 'all';
    allTab.textContent = `Tutto (${counts.all || 0})`;
    tabsContainer.appendChild(allTab);

    categories.forEach(category => {
        const tab = document.createElement('button');
        tab.className = 'modal-category-tab';
        tab.dataset.category = category.id.toString();
        tab.textContent = `${category.name} (${counts[category.id] || 0})`;
        tabsContainer.appendChild(tab);
    });

    tabsContainer.querySelectorAll('.modal-category-tab').forEach(tab => {
        tab.addEventListener('click', function() {
            switchModalCategory(tab.dataset.category);
        });
    });
}

function renderModalInterests(interests) {
    const container = document.getElementById('modal-interests-list');
    container.innerHTML = '';

    interests.forEach(interest => {
        const item = document.createElement('div');
        item.className = 'modal-interest-item';
        item.dataset.interestId = interest.id;
        item.dataset.category = interest.category_id;
        
        const imageDiv = document.createElement('div');
        imageDiv.className = 'modal-interest-image';
        
        const img = document.createElement('img');
        const imageUrl = interest.image_url || `/assets/images/interests/${interest.id}.jpg`;
        img.src = imageUrl;
        img.alt = interest.name;
        img.onerror = function() {
            this.src = '/assets/images/profile/interests/gym.jpg';
        };
        
        const nameDiv = document.createElement('div');
        nameDiv.className = 'modal-interest-name';
        nameDiv.textContent = interest.name;
        
        const checkboxDiv = document.createElement('div');
        checkboxDiv.className = 'modal-interest-checkbox';
        
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        
        const userHasInterest = appState.userInterests.some(userInterest => 
            userInterest.id.toString() === interest.id.toString()
        );
        checkbox.checked = userHasInterest;
        
        imageDiv.appendChild(img);
        checkboxDiv.appendChild(checkbox);
        item.appendChild(imageDiv);
        item.appendChild(nameDiv);
        item.appendChild(checkboxDiv);

        checkbox.addEventListener('click', function() {
            handleInterestToggle(interest.id, checkbox);
        });

        container.appendChild(item);
    });
}

function switchCategory(category) {
    if (appState.loading) return;

    appState.activeCategory = category;
    setLoading(true);

    document.querySelectorAll('.category-tab').forEach(tab => {
        tab.classList.toggle('active', tab.dataset.category === category);
    });

    fetchUserInterests(category, function(userInterests) {
        appState.userInterests = userInterests;
        renderInterestsGrid(userInterests);
        setLoading(false);
    });
}

function handleInterestToggle(interestId, checkboxElement) {
    const modalLoading = document.getElementById('modal-loading');
    modalLoading.style.display = 'block';

    toggleInterest(interestId, function(result) {
        if (!result) {
            checkboxElement.checked = !checkboxElement.checked;
            modalLoading.style.display = 'none';
            return;
        }

        checkboxElement.checked = result.action === 'added';

        const interestIndex = appState.interests.findIndex(i => i.id.toString() === interestId.toString());
        if (interestIndex !== -1) {
            appState.interests[interestIndex].user_has_interest = result.action === 'added';
        }

        if (result.action === 'added') {
            const existsInUserInterests = appState.userInterests.some(ui => ui.id.toString() === interestId.toString());
            if (!existsInUserInterests) {
                const interestToAdd = appState.interests.find(i => i.id.toString() === interestId.toString());
                if (interestToAdd) {
                    const userInterest = Object.assign({}, interestToAdd);
                    userInterest.user_has_interest = true;
                    appState.userInterests.push(userInterest);
                }
            }
        } else {
            appState.userInterests = appState.userInterests.filter(ui => ui.id.toString() !== interestId.toString());
        }

        fetchUserInterests(appState.activeCategory, function(userInterests) {
            appState.userInterests = userInterests;
            renderInterestsGrid(userInterests);
            renderModalCategoryTabs(appState.categories, userInterests);
            modalLoading.style.display = 'none';
        });
    });
}

function switchModalCategory(categoryId) {
    document.querySelectorAll('.modal-category-tab').forEach(tab => {
        tab.classList.toggle('active', tab.dataset.category === categoryId);
    });

    document.querySelectorAll('.modal-interest-item').forEach(item => {
        const shouldShow = categoryId === 'all' || item.dataset.category === categoryId;
        item.style.display = shouldShow ? 'flex' : 'none';
    });
}

function showAddInterestModal() {
    document.getElementById('interest-modal').style.display = 'flex';
}

function closeInterestModal() {
    document.getElementById('interest-modal').style.display = 'none';
}

function saveInterestsAndClose() {
    closeInterestModal();
}

function setLoading(loading) {
    appState.loading = loading;
    document.getElementById('loading').style.display = loading ? 'block' : 'none';
}

function init() {
    setLoading(true);

    function getUrlParam(name) {
        const search = window.location.search;
        if (!search) return null;
        
        const query = search.substring(1);
        const pairs = query.split('&');
        
        for (const pair of pairs) {
            const [key, value] = pair.split('=');
            if (key === name && value) {
                return decodeURIComponent(value);
            }
        }
        
        return null;
    }

    const activeCategory = getUrlParam('category') || 'all';
    appState.activeCategory = activeCategory;

    let categoriesLoaded = false;
    let interestsLoaded = false;
    let userInterestsLoaded = false;

    function checkAllLoaded() {
        if (categoriesLoaded && interestsLoaded && userInterestsLoaded) {
            renderCategoryTabs(appState.categories, activeCategory);
            renderInterestsGrid(appState.userInterests);
            renderModalCategoryTabs(appState.categories, appState.userInterests);
            renderModalInterests(appState.interests);

            setLoading(false);
        }
    }

    fetchCategories(function(categories) {
        appState.categories = categories;
        categoriesLoaded = true;
        checkAllLoaded();
    });

    fetchInterests(function(interests) {
        appState.interests = interests;
        interestsLoaded = true;
        checkAllLoaded();
    });

    fetchUserInterests(activeCategory, function(userInterests) {
        appState.userInterests = userInterests;
        userInterestsLoaded = true;
        checkAllLoaded();
    });
}

init();

document.getElementById('modal-close').addEventListener('click', closeInterestModal);
document.getElementById('modal-cancel').addEventListener('click', closeInterestModal);
document.getElementById('modal-save').addEventListener('click', saveInterestsAndClose);

document.querySelector('.modify-btn').addEventListener('click', showAddInterestModal);

const categoryTabs = document.querySelector('.category-tabs');
if (categoryTabs) {
    categoryTabs.addEventListener('wheel', function(e) {
        e.preventDefault();
        e.currentTarget.scrollLeft += e.deltaY;
    });
}

const modalCategoryTabs = document.querySelector('.modal-category-tabs');
if (modalCategoryTabs) {
    modalCategoryTabs.addEventListener('wheel', function(e) {
        e.preventDefault();
        e.currentTarget.scrollLeft += e.deltaY;
    });
}