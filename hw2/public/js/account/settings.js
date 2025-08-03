const settingsContent = document.getElementById('settings-content');
const settingsForm = document.getElementById('settings-form');
const passwordModal = document.getElementById('password-modal');
const passwordForm = document.getElementById('password-form');

function showAlert(message, type) {
    const existingAlert = document.querySelector('.settings-alert');
    if (existingAlert) {
        existingAlert.remove();
    }

    const mainContent = document.querySelector('.main-content');
    const pageHeader = document.querySelector('.page-header');

    const alertDiv = document.createElement('div');
    alertDiv.className = 'settings-alert settings-alert-' + type;
    alertDiv.textContent = message;

    const dismissBtn = document.createElement('button');
    dismissBtn.className = 'alert-dismiss';
    dismissBtn.innerHTML = '&times;';
    dismissBtn.addEventListener('click', function() {
        alertDiv.remove();
    });

    alertDiv.appendChild(dismissBtn);
    mainContent.insertBefore(alertDiv, pageHeader);
}

function loadUserSettings() {
    if (settingsContent) {
        settingsContent.classList.add("hidden");
    }

    fetch('/api/account/profile')
        .then(onResponse)
        .then(function(data) {
            if (!data) return;
            
            if (data.success) {
                settingsContent.classList.remove("hidden");

                document.getElementById('email').value = data.data.email || '';
                document.getElementById('first_name').value = data.data.first_name || '';
                document.getElementById('last_name').value = data.data.last_name || '';
                
                if (data.data.profile) {
                    document.getElementById('phone').value = data.data.profile.phone || '';
                    
                    if (data.data.profile.birth_date) {
                        let dateValue = data.data.profile.birth_date;
                        if (dateValue.includes('T')) {
                            dateValue = dateValue.split('T')[0];
                        }
                        document.getElementById('birthdate').value = dateValue;
                    } else {
                        document.getElementById('birthdate').value = '';
                    }
                }
                
                if (data.data.settings) {
                    document.getElementById('newsletter_enabled').checked = data.data.settings.newsletter_enabled || false;
                    document.getElementById('notifications_enabled').checked = data.data.settings.notifications_enabled || false;
                }
            } else {
                showAlert(data.error || data.message || 'Errore nel caricamento delle impostazioni', 'error');
            }
        })
        .catch(function(error) {
            console.error('Errore nel caricamento delle impostazioni:', error);
            showAlert(error.message || 'Errore nel caricamento delle impostazioni', 'error');
        });
}

function updateUserSettings(formData) {
    fetch('/api/account/settings', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRF-TOKEN': getCsrfToken()
        },
        body: JSON.stringify(formData)
    })
        .then(onResponse)
        .then(function(data) {
            if (!data) return;
            
            if (data.success) {
                showAlert('Impostazioni aggiornate con successo!', 'success');
                if (data.data) {
                    // Ripopola i campi con i dati aggiornati
                    document.getElementById('email').value = data.data.email || '';
                    document.getElementById('first_name').value = data.data.first_name || '';
                    document.getElementById('last_name').value = data.data.last_name || '';
                    
                    if (data.data.profile) {
                        document.getElementById('phone').value = data.data.profile.phone || '';
                        
                        if (data.data.profile.birth_date) {
                            let dateValue = data.data.profile.birth_date;
                            if (dateValue.includes('T')) {
                                dateValue = dateValue.split('T')[0];
                            }
                            document.getElementById('birthdate').value = dateValue;
                        } else {
                            document.getElementById('birthdate').value = '';
                        }
                    }
                    
                    if (data.data.settings) {
                        document.getElementById('newsletter_enabled').checked = data.data.settings.newsletter_enabled || false;
                        document.getElementById('notifications_enabled').checked = data.data.settings.notifications_enabled || false;
                    }
                }
            } else {
                showAlert(data.error || data.message || 'Errore sconosciuto durante l\'aggiornamento', 'error');
            }
        })
        .catch(function(error) {
            console.error('Errore aggiornamento impostazioni:', error);
            showAlert(error.message || 'Errore durante l\'aggiornamento', 'error');
        });
}

function updatePassword(passwordData) {
    fetch('/api/account/password', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRF-TOKEN': getCsrfToken()
        },
        body: JSON.stringify(passwordData)
    })
        .then(onResponse)
        .then(function(data) {
            if (!data) return;
            
            if (data.success) {
                showAlert('Password aggiornata con successo!', 'success');
                passwordModal.style.display = 'none';
            } else {
                showAlert(data.error || data.message || 'Errore sconosciuto durante l\'aggiornamento della password', 'error');
            }
        })
        .catch(function(error) {
            console.error('Errore aggiornamento password:', error);
            showAlert(error.message || 'Errore durante l\'aggiornamento della password', 'error');
        });
}

if (settingsForm) {
    settingsForm.addEventListener('submit', function(e) {
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
        
        updateUserSettings(formData);
    });
}

if (passwordForm) {
    passwordForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const currentPassword = document.getElementById('current_password').value;
        const newPassword = document.getElementById('new_password').value;
        const confirmPassword = document.getElementById('confirm_password').value;
        
        if (newPassword !== confirmPassword) {
            showAlert('Le password non coincidono', 'error');
            return;
        }
        
        if (newPassword.length < 6) {
            showAlert('La password deve contenere almeno 6 caratteri', 'error');
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

const changePasswordBtn = document.getElementById('change-password-btn');
if (changePasswordBtn) {
    changePasswordBtn.addEventListener('click', function() {
        passwordModal.style.display = 'block';
        document.getElementById('current_password').value = '';
        document.getElementById('new_password').value = '';
        document.getElementById('confirm_password').value = '';
    });
}

const passwordModalClose = document.getElementById('password-modal-close');
if (passwordModalClose) {
    passwordModalClose.addEventListener('click', function() {
        passwordModal.style.display = 'none';
    });
}

const passwordCancel = document.getElementById('password-cancel');
if (passwordCancel) {
    passwordCancel.addEventListener('click', function() {
        passwordModal.style.display = 'none';
    });
}

const passwordSave = document.getElementById('password-save');
if (passwordSave) {
    passwordSave.addEventListener('click', function() {
        const currentPassword = document.getElementById('current_password').value;
        const newPassword = document.getElementById('new_password').value;
        const confirmPassword = document.getElementById('confirm_password').value;
        
        if (newPassword !== confirmPassword) {
            showAlert('Le password non coincidono', 'error');
            return;
        }
        
        if (newPassword.length < 6) {
            showAlert('La password deve contenere almeno 6 caratteri', 'error');
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
    cancelBtn.addEventListener('click', loadUserSettings);
}

loadUserSettings();