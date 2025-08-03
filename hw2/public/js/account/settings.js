"use strict";

/**
 * User Settings System
 * Gestisce le impostazioni utente e il cambio password
 */

// ========== VARIABLES ==========
let settingsContent = null;
let passwordModal = null;

// ========== UTILITY FUNCTIONS ==========
function formatDateForInput(dateValue) {
    if (!dateValue) return '';

    if (dateValue.includes('T')) {
        return dateValue.split('T')[0];
    }
    return dateValue;
}

function createAlertDismissButton(alertDiv) {
    const dismissBtn = document.createElement('button');
    dismissBtn.className = 'alert-dismiss';
    dismissBtn.innerHTML = '&times;';
    dismissBtn.addEventListener('click', function () {
        alertDiv.remove();
    });
    return dismissBtn;
}

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

    const dismissBtn = createAlertDismissButton(alertDiv);
    alertDiv.appendChild(dismissBtn);
    mainContent.insertBefore(alertDiv, pageHeader);
}

function populateBasicFields(data) {
    document.getElementById('email').value = data.email || '';
    document.getElementById('first_name').value = data.first_name || '';
    document.getElementById('last_name').value = data.last_name || '';
}

function populateProfileFields(profile) {
    if (!profile) return;

    document.getElementById('phone').value = profile.phone || '';

    const birthDateValue = formatDateForInput(profile.birth_date);
    document.getElementById('birthdate').value = birthDateValue;
}

function populateSettingsFields(settings) {
    if (!settings) return;

    document.getElementById('newsletter_enabled').checked = settings.newsletter_enabled || false;
    document.getElementById('notifications_enabled').checked = settings.notifications_enabled || false;
}

function hideSettingsContent() {
    if (settingsContent) {
        settingsContent.classList.add("hidden");
    }
}

function showSettingsContent() {
    if (settingsContent) {
        settingsContent.classList.remove("hidden");
    }
}

function handleSettingsLoadSuccess(data) {
    if (!data) return;

    if (data.success) {
        showSettingsContent();
        populateAllFields(data.data);
    } else {
        showAlert(data.error || data.message || 'Errore nel caricamento delle impostazioni', 'error');
    }
}

function handleSettingsLoadError(error) {
    console.error('Errore nel caricamento delle impostazioni:', error);
    showAlert(error.message || 'Errore nel caricamento delle impostazioni', 'error');
}

function loadUserSettings() {
    hideSettingsContent();

    fetch('/api/account/profile')
        .then(onResponse)
        .then(handleSettingsLoadSuccess)
        .catch(handleSettingsLoadError);
}

function handleSettingsUpdateSuccess(data) {
    if (!data) return;

    if (data.success) {
        showAlert('Impostazioni aggiornate con successo!', 'success');
        if (data.data) {
            populateBasicFields(data);
            populateProfileFields(data.profile);
            populateSettingsFields(data.settings);
        }
    } else {
        showAlert(data.error || data.message || 'Errore sconosciuto durante l\'aggiornamento', 'error');
    }
}

function handleSettingsUpdateError(error) {
    console.error('Errore aggiornamento impostazioni:', error);
    showAlert(error.message || 'Errore durante l\'aggiornamento', 'error');
}

function updateUserSettings() {
    const email = document.getElementById('email').value;
    const first_name = document.getElementById('first_name').value;
    const last_name = document.getElementById('last_name').value;
    const phone = document.getElementById('phone').value;
    const birth_date = document.getElementById('birthdate').value;
    const country = document.getElementById('country').value;
    const province = document.getElementById('province').value;
    const newsletter_enabled = document.getElementById('newsletter_enabled').value;
    const notifications_enabled = document.getElementById('notifications_enabled').value;

    const formData = new FormData();
    formData.append('email', email);
    formData.append('first_name', first_name);
    formData.append('last_name', last_name);
    formData.append('phone', phone);
    formData.append('birth_date', birth_date);
    formData.append('country', country);
    formData.append('province', province);
    formData.append('newsletter_enabled', newsletter_enabled);
    formData.append('notifications_enabled', notifications_enabled);
    formData.append('_token', getCsrfToken());

    fetch('/api/account/settings', {
        method: 'POST',
        body: formData
    })
        .then(onResponse)
        .then(handleSettingsUpdateSuccess)
        .catch(handleSettingsUpdateError);
}

function handlePasswordUpdateSuccess(data) {
    if (!data) return;

    if (data.success) {
        showAlert('Password aggiornata con successo!', 'success');
        closePasswordModal();
    } else {
        showAlert(data.error || data.message || 'Errore sconosciuto durante l\'aggiornamento della password', 'error');
    }
}

function handlePasswordUpdateError(error) {
    console.error('Errore aggiornamento password:', error);
    showAlert(error.message || 'Errore durante l\'aggiornamento della password', 'error');
}

function updatePassword() {
    const current_password = document.getElementById('current_password').value;
    const new_password = document.getElementById('new_password').value;
    const confirm_password = document.getElementById('confirm_password').value;

    if (!validatePasswordData(new_password, confirm_password)) {
        return;
    }

    const formData = new FormData();
    formData.append('current_password', current_password);
    formData.append('new_password', new_password);
    formData.append('confirm_password', confirm_password);
    formData.append('_token', getCsrfToken());

    fetch('/api/account/password', {
        method: 'POST',
        body: formData
    })
        .then(onResponse)
        .then(handlePasswordUpdateSuccess)
        .catch(handlePasswordUpdateError);
}

function validatePasswordMatch(newPassword, confirmPassword) {
    if (newPassword !== confirmPassword) {
        showAlert('Le password non coincidono', 'error');
        return false;
    }
    return true;
}

function validatePasswordLength(newPassword) {
    if (newPassword.length < 6) {
        showAlert('La password deve contenere almeno 6 caratteri', 'error');
        return false;
    }
    return true;
}

function validatePasswordData(new_password, confirm_password) {
    return validatePasswordMatch(new_password, confirm_password) &&
        validatePasswordLength(new_password);
}

// ========== MODAL MANAGEMENT ==========
function openPasswordModal() {
    passwordModal.style.display = 'block';
    clearPasswordFields();
}

function closePasswordModal() {
    passwordModal.style.display = 'none';
}

function clearPasswordFields() {
    document.getElementById('current_password').value = '';
    document.getElementById('new_password').value = '';
    document.getElementById('confirm_password').value = '';
}

function handleSettingsFormSubmit(e) {
    e.preventDefault();
    updateUserSettings();
}

function handlePasswordFormSubmit(e) {
    e.preventDefault();
    updatePassword();
}

function handleChangePasswordClick() {
    openPasswordModal();
}

function handlePasswordModalClose() {
    closePasswordModal();
}

function handlePasswordCancel() {
    closePasswordModal();
}

function handlePasswordSave() {
    const passwordData = collectPasswordFormData();

    if (!validatePasswordData(passwordData)) {
        return;
    }

    updatePassword(passwordData);
}

function handleCancelButtonClick() {
    loadUserSettings();
}

const settingsForm = document.getElementById('settings-form');
if (settingsForm) {
    settingsForm.addEventListener('submit', handleSettingsFormSubmit);
}

const passwordForm = document.getElementById('password-form');
if (passwordForm) {
    passwordForm.addEventListener('submit', handlePasswordFormSubmit);
}

const changePasswordBtn = document.getElementById('change-password-btn');
if (changePasswordBtn) {
    changePasswordBtn.addEventListener('click', handleChangePasswordClick);
}

const passwordModalClose = document.getElementById('password-modal-close');
if (passwordModalClose) {
    passwordModalClose.addEventListener('click', handlePasswordModalClose);
}

const passwordCancel = document.getElementById('password-cancel');
if (passwordCancel) {
    passwordCancel.addEventListener('click', handlePasswordCancel);
}

const passwordSave = document.getElementById('password-save');
if (passwordSave) {
    passwordSave.addEventListener('click', handlePasswordSave);
}

const cancelBtn = document.getElementById('cancel-btn');
if (cancelBtn) {
    cancelBtn.addEventListener('click', handleCancelButtonClick);
}

function initialize() {
    settingsContent = document.getElementById('settings-content');
    passwordModal = document.getElementById('password-modal');

    if (!settingsContent) return;

    loadUserSettings();
}

initialize();
