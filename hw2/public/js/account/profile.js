function formatItalianDate(dateString) {
    const mesi = [
        'Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno',
        'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre'
    ];

    const date = new Date(dateString);
    const mese = mesi[date.getMonth()];
    const anno = date.getFullYear();

    return mese + ' ' + anno;
}

function populateProfile(userData) {
    profileContent.classList.remove("hidden");

    const avatarElement = document.getElementById('profile-avatar');
    if (userData.first_name && userData.last_name) {
        avatarElement.textContent = userData.first_name[0].toUpperCase() + userData.last_name[0].toUpperCase();
    }

    const nameElement = document.getElementById('profile-name');
    nameElement.textContent = userData.first_name + ' ' + userData.last_name;

    const memberSinceElement = document.getElementById('profile-member-since');
    if (userData.created_at) {
        const formattedDate = formatItalianDate(userData.created_at);
        memberSinceElement.textContent = 'Member Nike da ' + formattedDate;
    }
}

function showError(message) {
    if (errorElement) {
        errorElement.classList.remove("hidden");
        const errorText = document.createElement("span");
        errorText.textContent = message;

        errorElement.innerHTML = '';
        errorElement.appendChild(errorText);
        errorElement.classList.remove('hidden');
    }
}

function onResponse(response) {
    if (response.status === 419) {
        throw new Error('Sessione scaduta. Ricarica la pagina e riprova.');
    }
    return response.json();
}

function onJsonResponse(data) {
    if (data.success) {
        populateProfile(data.data);
    } else {
        onError(data.error);
    }
}

function onError(message) {
    console.error('Errore nel caricamento del profilo:', message);
    showError(message);
}

function setLoading(loading) {
    if(loadingElement){
        if(loading)
            loadingElement.classList.remove("hidden");
        else
            loadingElement.classList.add("hidden");
    }
}

function hideError() {
    if(errorElement){
        errorElement.classList.add("hidden");
    }
}

function hideContent() {
    if(profileContent){
        profileContent.classList.add("hidden");
    }
}

function loadUserProfile() {       
    hideContent();
    hideError();
    setLoading(true);

    fetch('/api/account/profile')
        .then(onResponse)
        .then(onJsonResponse)
        .catch(onError)
        .finally(function (){
            setLoading(false);
        });
}

const loadingElement = document.getElementById('loading');
const errorElement = document.getElementById('error-message');
const profileContent = document.getElementById('profile-content');

loadUserProfile();