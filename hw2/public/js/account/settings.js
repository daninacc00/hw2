function populateSettings(userData) {
    settingsContent.classList.remove("hidden");

    document.getElementById('email').value = userData.email || '';
    document.getElementById('first_name').value = userData.first_name || '';
    document.getElementById('last_name').value = userData.last_name || '';
    
    if (userData.profile) {
        document.getElementById('phone').value = userData.profile.phone || '';
        
        if (userData.profile.birth_date) {
            console.log('Data di nascita ricevuta:', userData.profile.birth_date);
            
            let dateValue = userData.profile.birth_date;
            if (dateValue.includes('T')) {
                dateValue = dateValue.split('T')[0];
            }
            
            document.getElementById('birthdate').value = dateValue;
            console.log('Data impostata nel campo:', dateValue);
        } else {
            document.getElementById('birthdate').value = '';
        }
    }
    
    if (userData.settings) {
        document.getElementById('newsletter_enabled').checked = userData.settings.newsletter_enabled || false;
        document.getElementById('notifications_enabled').checked = userData.settings.notifications_enabled || false;
    }
    
    console.log('Popolamento completato. Valore campo data:', document.getElementById('birthdate').value);
}

function showSettingsError(message) {
    if (settingsErrorElement) {
        settingsErrorElement.classList.remove("hidden");
        settingsErrorElement.querySelector('p').textContent = message;
    }
}

function showSettingsSuccess(message) {
    if (settingsSuccessElement) {
        settingsSuccessElement.textContent = message;
        settingsSuccessElement.classList.remove("hidden");
        setTimeout(function() {
            settingsSuccessElement.classList.add("hidden");
        }, 3000);
    }
}

function onSettingsResponse(response) {
    if (response.status === 419) {
        throw new Error('Sessione scaduta. Ricarica la pagina e riprova.');
    }
    return response.json();
}

function onSettingsJsonResponse(data) {
    if (data.success) {
        populateSettings(data.data);
    } else {
        onSettingsError(data.error || data.message || 'Errore nel caricamento delle impostazioni');
    }
}

function onSettingsError(message) {
    console.error('Errore nel caricamento delle impostazioni:', message);
    showSettingsError(message);
}

function setSettingsLoading(loading) {
    if (settingsLoadingElement) {
        if (loading)
            settingsLoadingElement.classList.remove("hidden");
        else
            settingsLoadingElement.classList.add("hidden");
    }
}

function hideSettingsError() {
    if (settingsErrorElement) {
        settingsErrorElement.classList.add("hidden");
    }
}

function hideSettingsContent() {
    if (settingsContent) {
        settingsContent.classList.add("hidden");
    }
}

function loadUserSettings() {
    hideSettingsContent();
    hideSettingsError();
    setSettingsLoading(true);

    fetch('/api/account/profile')
        .then(onSettingsResponse)
        .then(onSettingsJsonResponse)
        .catch(onSettingsError)
        .finally(function() {
            setSettingsLoading(false);
        });
}

function updateUserSettings(formData) {
    setSettingsLoading(true);
    hideSettingsError();

    fetch('/api/account/settings', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
        },
        body: JSON.stringify(formData)
    })
    .then(onSettingsResponse)
    .then(function(data) {
        if (data.success) {
            showSettingsSuccess('Impostazioni aggiornate con successo!');
            if (data.data) {
                populateSettings(data.data);
            }
        } else {
            onSettingsError(data.error || data.message || 'Errore sconosciuto durante l\'aggiornamento');
        }
    })
    .catch(onSettingsError)
    .finally(function() {
        setSettingsLoading(false);
    });
}

function updatePassword(passwordData) {
    setSettingsLoading(true);

    fetch('/api/account/password', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
        },
        body: JSON.stringify(passwordData)
    })
    .then(onSettingsResponse)
    .then(function(data) {
        if (data.success) {
            showSettingsSuccess('Password aggiornata con successo!');
            closePasswordModal();
        } else {
            onSettingsError(data.error || data.message || 'Errore sconosciuto durante l\'aggiornamento della password');
        }
    })
    .catch(onSettingsError)
    .finally(function() {
        setSettingsLoading(false);
    });
}

function openPasswordModal() {
    passwordModal.style.display = 'block';
    document.getElementById('current_password').value = '';
    document.getElementById('new_password').value = '';
    document.getElementById('confirm_password').value = '';
}

function closePasswordModal() {
    passwordModal.style.display = 'none';
}

function handleSettingsFormSubmit(e) {
    e.preventDefault();
    
    const formData = {
        email: document.getElementById('email').value,
        first_name: document.getElementById('first_name').value,
        last_name: document.getElementById('last_name').value,
        phone: document.getElementById('phone').value,
        birth_date: document.getElementById('birthdate').value,
        country: document.getElementById('country').value,
        province: document.getElementById('province').value,
        newsletter_enabled: document.getElementById('newsletter_enabled').checked,
        notifications_enabled: document.getElementById('notifications_enabled').checked
    };
    
    console.log('Dati inviati:', formData);
    console.log('Data di nascita:', formData.birth_date);
    
    updateUserSettings(formData);
}

function handlePasswordFormSubmit(e) {
    e.preventDefault();
    
    const currentPassword = document.getElementById('current_password').value;
    const newPassword = document.getElementById('new_password').value;
    const confirmPassword = document.getElementById('confirm_password').value;
    
    if (newPassword !== confirmPassword) {
        onSettingsError('Le password non coincidono');
        return;
    }
    
    if (newPassword.length < 6) {
        onSettingsError('La password deve contenere almeno 6 caratteri');
        return;
    }
    
    const passwordData = {
        current_password: currentPassword,
        new_password: newPassword,
        confirm_password: confirmPassword
    };
    
    updatePassword(passwordData);
}

const settingsLoadingElement = document.getElementById('settings-loading');
const settingsErrorElement = document.getElementById('settings-error');
const settingsSuccessElement = document.getElementById('settings-success');
const settingsContent = document.getElementById('settings-content');
const settingsForm = document.getElementById('settings-form');
const passwordModal = document.getElementById('password-modal');
const passwordForm = document.getElementById('password-form');

if (settingsForm) {
    settingsForm.addEventListener('submit', handleSettingsFormSubmit);
}

if (passwordForm) {
    passwordForm.addEventListener('submit', handlePasswordFormSubmit);
}

const changePasswordBtn = document.getElementById('change-password-btn');
if (changePasswordBtn) {
    changePasswordBtn.addEventListener('click', openPasswordModal);
}

const passwordModalClose = document.getElementById('password-modal-close');
if (passwordModalClose) {
    passwordModalClose.addEventListener('click', closePasswordModal);
}

const passwordCancel = document.getElementById('password-cancel');
if (passwordCancel) {
    passwordCancel.addEventListener('click', closePasswordModal);
}

const passwordSave = document.getElementById('password-save');
if (passwordSave) {
    passwordSave.addEventListener('click', function() {
        const currentPassword = document.getElementById('current_password').value;
        const newPassword = document.getElementById('new_password').value;
        const confirmPassword = document.getElementById('confirm_password').value;
        
        if (newPassword !== confirmPassword) {
            onSettingsError('Le password non coincidono');
            return;
        }
        
        if (newPassword.length < 6) {
            onSettingsError('La password deve contenere almeno 6 caratteri');
            return;
        }
        
        const passwordData = {
            current_password: currentPassword,
            new_password: newPassword,
            confirm_password: confirmPassword
        };
        
        updatePassword(passwordData);
    });
}

const cancelBtn = document.getElementById('cancel-btn');
if (cancelBtn) {
    cancelBtn.addEventListener('click', function() {
        loadUserSettings();
    });
}

window.addEventListener('click', function(e) {
    if (e.target === passwordModal) {
        closePasswordModal();
    }
});

loadUserSettings();