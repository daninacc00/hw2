let categories = [];
let interests = [];
let userInterests = [];
let activeCategory = 'all';

let categoriesLoaded = false;
let interestsLoaded = false;
let userInterestsLoaded = false;

function renderAll() {
    if (categoriesLoaded && interestsLoaded && userInterestsLoaded) {
        renderCategoryTabs(categories, activeCategory);
        renderInterestsGrid(userInterests);
        renderModalCategoryTabs(categories, userInterests);
        renderModalInterests(interests);
    }
}

function fetchCategories() {
    fetch('/api/interests/categories')
        .then(onResponse)
        .then(function (data) {
            if (!data || !data.success) {
                console.error(data ? data.message : 'No data received' || 'Errore nel caricamento delle categorie');
                categories = [];
            } else {
                categories = data.data;
            }
            categoriesLoaded = true;
            renderAll();
        })
        .catch(function (error) {
            console.error('fetchCategories error:', error);
            categories = [];
            categoriesLoaded = true;
            renderAll();
        });
}

function fetchInterests(category) {
    if (!category) category = 'all';

    const url = category === 'all'
        ? '/api/interests'
        : '/api/interests?category=' + category;

    fetch(url)
        .then(onResponse)
        .then(function (data) {
            if (!data.success) {
                console.error(data.message || 'Errore nel caricamento degli interessi');
                interests = [];
            } else {
                interests = data.data;
            }
            interestsLoaded = true;
            renderAll();
        })
        .catch(function (error) {
            console.error(error);
            interests = [];
            interestsLoaded = true;
            renderAll();
        });
}

function fetchUserInterests() {
    if (!activeCategory) activeCategory = 'all';

    const url = activeCategory === 'all'
        ? '/api/interests/user'
        : '/api/interests/user?category=' + activeCategory;

    fetch(url)
        .then(onResponse)
        .then(function (data) {
            if (!data.success) {
                console.error(data.message || 'Errore nel caricamento degli interessi utente');
                userInterests = [];
            } else {
                userInterests = data.data;
            }
            userInterestsLoaded = true;
            renderAll();
        })
        .catch(function (error) {
            console.error(error);
            userInterests = [];
            userInterestsLoaded = true;
            renderAll();
        });
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

function renderCategoryTabs(categories, activeCategory) {
    const tabsContainer = document.getElementById('category-tabs');

    const allTab = document.createElement('a');
    allTab.href = '#';
    allTab.className = 'category-tab ' + (activeCategory === 'all' ? 'active' : '');
    allTab.textContent = 'Tutto';
    allTab.dataset.category = 'all';

    tabsContainer.innerHTML = '';
    tabsContainer.appendChild(allTab);

    categories.forEach(function (category) {
        const tab = document.createElement('a');
        tab.href = '#';
        tab.className = 'category-tab ' + (activeCategory === category.value ? 'active' : '');
        tab.textContent = category.name;
        tab.dataset.category = category.value;
        tabsContainer.appendChild(tab);
    });

    tabsContainer.querySelectorAll('.category-tab').forEach(function (tab) {
        tab.addEventListener('click', function (e) {
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

    userInterests.forEach(function (interest) {
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
        grid.appendChild(card);
    });
}

function renderModalCategoryTabs(categories, userInterests) {
    const tabsContainer = document.getElementById('modal-category-tabs');
    tabsContainer.innerHTML = '';

    const counts = { all: userInterests.length };
    userInterests.forEach(function (interest) {
        const categoryId = interest.category_id.toString();
        counts[categoryId] = (counts[categoryId] || 0) + 1;
    });

    const allTab = document.createElement('button');
    allTab.className = 'modal-category-tab active';
    allTab.dataset.category = 'all';
    allTab.textContent = 'Tutto (' + (counts.all || 0) + ')';
    tabsContainer.appendChild(allTab);

    categories.forEach(function (category) {
        const tab = document.createElement('button');
        tab.className = 'modal-category-tab';
        tab.dataset.category = category.id.toString();
        tab.textContent = category.name + ' (' + (counts[category.id] || 0) + ')';
        tabsContainer.appendChild(tab);
    });

    tabsContainer.querySelectorAll('.modal-category-tab').forEach(function (tab) {
        tab.addEventListener('click', function () {
            switchModalCategory(tab.dataset.category);
        });
    });
}

function renderModalInterests(interests) {
    const container = document.getElementById('modal-interests-list');
    container.innerHTML = '';

    interests.forEach(function (interest) {
        const item = document.createElement('div');
        item.className = 'modal-interest-item';
        item.dataset.interestId = interest.id;
        item.dataset.category = interest.category_id;

        const imageDiv = document.createElement('div');
        imageDiv.className = 'modal-interest-image';

        const img = document.createElement('img');
        const imageUrl = interest.image_url || '/assets/images/interests/' + interest.id + '.jpg';
        img.src = imageUrl;
        img.alt = interest.name;

        const nameDiv = document.createElement('div');
        nameDiv.className = 'modal-interest-name';
        nameDiv.textContent = interest.name;

        const checkboxDiv = document.createElement('div');
        checkboxDiv.className = 'modal-interest-checkbox';

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';

        const userHasInterest = userInterests.some(function (userInterest) {
            return userInterest.id.toString() === interest.id.toString();
        });
        checkbox.checked = userHasInterest;

        imageDiv.appendChild(img);
        checkboxDiv.appendChild(checkbox);
        item.appendChild(imageDiv);
        item.appendChild(nameDiv);
        item.appendChild(checkboxDiv);

        checkbox.addEventListener('click', function () {
            handleInterestToggle(interest.id, checkbox);
        });

        container.appendChild(item);
    });
}

function switchCategory(category) {
    activeCategory = category;

    document.querySelectorAll('.category-tab').forEach(function (tab) {
        tab.classList.toggle('active', tab.dataset.category === category);
    });

    const url = category === 'all'
        ? '/api/interests/user'
        : '/api/interests/user?category=' + category;

    fetch(url)
        .then(onResponse)
        .then(function (data) {
            if (!data.success) {
                console.error(data.message || 'Errore nel caricamento degli interessi utente');
                userInterests = [];
            } else {
                userInterests = data.data;
            }
            renderInterestsGrid(userInterests);
        })
        .catch(function (error) {
            console.error(error);
            userInterests = [];
            renderInterestsGrid(userInterests);
        });
}

function handleInterestToggle(interestId, checkboxElement) {
    const modalLoading = document.getElementById('modal-loading');
    modalLoading.style.display = 'block';

    toggleInterest(interestId, function (result) {
        if (!result) {
            checkboxElement.checked = !checkboxElement.checked;
            modalLoading.style.display = 'none';
            return;
        }

        checkboxElement.checked = result.action === 'added';

        const interestIndex = interests.findIndex(function (i) {
            return i.id.toString() === interestId.toString();
        });
        if (interestIndex !== -1) {
            interests[interestIndex].user_has_interest = result.action === 'added';
        }

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

        const url = activeCategory === 'all'
            ? '/api/interests/user'
            : '/api/interests/user?category=' + activeCategory;

        fetch(url)
            .then(onResponse)
            .then(function (data) {
                if (data.success) {
                    userInterests = data.data;
                    renderInterestsGrid(userInterests);
                    renderModalCategoryTabs(categories, userInterests);
                }
                modalLoading.style.display = 'none';
            })
            .catch(function (error) {
                console.error(error);
                modalLoading.style.display = 'none';
            });
    });
}

function switchModalCategory(categoryId) {
    document.querySelectorAll('.modal-category-tab').forEach(function (tab) {
        tab.classList.toggle('active', tab.dataset.category === categoryId);
    });

    document.querySelectorAll('.modal-interest-item').forEach(function (item) {
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

function init() {
    fetchCategories();
    fetchInterests();
    fetchUserInterests();
}

init();

document.getElementById('modal-close').addEventListener('click', closeInterestModal);
document.getElementById('modal-cancel').addEventListener('click', closeInterestModal);
document.getElementById('modal-save').addEventListener('click', saveInterestsAndClose);

document.querySelector('.modify-btn').addEventListener('click', showAddInterestModal);