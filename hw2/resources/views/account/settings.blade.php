@extends('layouts.account')

@section('title', 'Impostazioni')

@section('account-styles')
<link rel="stylesheet" href="{{ asset('css/account/settings.css') }}">
@endsection

@section('account-scripts')
<script src="{{ asset('js/account/settings.js') }}" defer></script>
@endsection

@section('account-content')
<div id="tab-settings" class="tab-content active">
    <div class="settings-container">
        <div class="sidebar">
            <h2>Impostazioni</h2>
            <nav>
                <ul class="nav-menu">
                    <li class="nav-item">
                        <a href="#" class="nav-link active" data-settings-tab="account">
                            <i class="nav-icon fas fa-user"></i>
                            Dettagli account
                        </a>
                    </li>
                    <li class="nav-item">
                        <a href="#" class="nav-link disabled">
                            <i class="nav-icon fas fa-credit-card"></i>
                            Metodi di pagamento
                        </a>
                    </li>
                    <li class="nav-item">
                        <a href="#" class="nav-link disabled">
                            <i class="nav-icon fas fa-map-marker-alt"></i>
                            Indirizzi di consegna
                        </a>
                    </li>
                    <li class="nav-item">
                        <a href="#" class="nav-link disabled">
                            <i class="nav-icon fas fa-shopping-bag"></i>
                            Preferenze di acquisto
                        </a>
                    </li>
                    <li class="nav-item">
                        <a href="#" class="nav-link disabled">
                            <i class="nav-icon fas fa-envelope"></i>
                            Preferenze sulle comunicazioni
                        </a>
                    </li>
                    <li class="nav-item">
                        <a href="#" class="nav-link disabled">
                            <i class="nav-icon fas fa-shield-alt"></i>
                            Privacy
                        </a>
                    </li>
                    <li class="nav-item">
                        <a href="#" class="nav-link disabled">
                            <i class="nav-icon fas fa-eye"></i>
                            Visibilità del profilo
                        </a>
                    </li>
                    <li class="nav-item">
                        <a href="#" class="nav-link disabled">
                            <i class="nav-icon fas fa-link"></i>
                            Account collegati
                        </a>
                    </li>
                </ul>
            </nav>
        </div>

        <main class="main-content">
            <div id="settings-loading" class="loading-spinner hidden">
                <p>Caricamento impostazioni...</p>
            </div>
            
            <div id="settings-error" class="error-message hidden">
                <p>Errore nel caricamento delle impostazioni. Riprova più tardi.</p>
            </div>

            <div id="settings-success" class="message success hidden">
                Impostazioni aggiornate con successo!
            </div>

            <div id="settings-content" class="settings-content hidden">
                <div class="page-header">
                    <h1>Dettagli account</h1>
                </div>

                <div class="form-section">
                    <form id="settings-form">
                        @csrf
                        <div class="form-group">
                            <label for="email">E-mail*</label>
                            <input type="email" id="email" class="form-control" name="email" required>
                        </div>

                        <div class="form-group">
                            <label for="first_name">Nome*</label>
                            <input type="text" id="first_name" class="form-control" name="first_name" required>
                        </div>

                        <div class="form-group">
                            <label for="last_name">Cognome*</label>
                            <input type="text" id="last_name" class="form-control" name="last_name" required>
                        </div>

                        <div class="form-group">
                            <label for="password">Password</label>
                            <div style="display: flex; align-items: center; gap: 1rem;">
                                <input type="password" id="password" class="form-control" placeholder="**********" style="max-width: 300px;">
                                <button type="button" class="btn-link" id="change-password-btn">Modifica</button>
                            </div>
                        </div>

                        <div class="form-group">
                            <label for="phone">Numero di telefono</label>
                            <div style="display: flex; align-items: center; gap: 1rem;">
                                <input type="tel" id="phone" class="form-control" name="phone" placeholder="Inserisci numero" style="max-width: 300px;">
                            </div>
                        </div>

                        <div class="form-group">
                            <label for="birthdate">Data di nascita</label>
                            <input type="date" id="birthdate" class="form-control" name="birth_date">
                        </div>

                        <div class="form-group">
                            <label>Posizione</label>
                            <div class="form-row">
                                <div class="form-group">
                                    <label for="country">Paese/regione*</label>
                                    <div class="select-wrapper">
                                        <select id="country" class="form-select" name="country" required>
                                            <option value="IT">Italia</option>
                                            <option value="US">Stati Uniti</option>
                                            <option value="FR">Francia</option>
                                            <option value="DE">Germania</option>
                                            <option value="ES">Spagna</option>
                                        </select>
                                    </div>
                                </div>

                                <div class="form-group">
                                    <label for="province">Provincia</label>
                                    <div class="select-wrapper">
                                        <select id="province" class="form-select" name="province">
                                            <option value="">Seleziona provincia</option>
                                            <option value="MI">Milano</option>
                                            <option value="RM">Roma</option>
                                            <option value="NA">Napoli</option>
                                            <option value="TO">Torino</option>
                                            <option value="PA">Palermo</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="form-group">
                            <h3>Preferenze comunicazioni</h3>
                            <div class="checkbox-group">
                                <label class="checkbox-label">
                                    <input type="checkbox" id="newsletter_enabled" name="newsletter_enabled">
                                    <span class="checkmark"></span>
                                    Ricevi newsletter Nike
                                </label>
                                <label class="checkbox-label">
                                    <input type="checkbox" id="notifications_enabled" name="notifications_enabled">
                                    <span class="checkmark"></span>
                                    Abilita notifiche
                                </label>
                            </div>
                        </div>

                        <div class="form-actions">
                            <button type="submit" class="btn btn-primary">Salva modifiche</button>
                            <button type="button" class="btn btn-secondary" id="cancel-btn">Annulla</button>
                        </div>
                    </form>
                </div>
            </div>

            <div id="password-modal" class="modal">
                <div class="modal-content">
                    <div class="modal-header">
                        <h2>Cambia Password</h2>
                        <button id="password-modal-close" class="modal-close">&times;</button>
                    </div>
                    <div class="modal-body">
                        <form id="password-form">
                            @csrf
                            <div class="form-group">
                                <label for="current_password">Password attuale*</label>
                                <input type="password" id="current_password" class="form-control" name="current_password" required>
                            </div>
                            <div class="form-group">
                                <label for="new_password">Nuova password*</label>
                                <input type="password" id="new_password" class="form-control" name="new_password" required>
                            </div>
                            <div class="form-group">
                                <label for="confirm_password">Conferma nuova password*</label>
                                <input type="password" id="confirm_password" class="form-control" name="confirm_password" required>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button id="password-cancel" class="modal-btn modal-cancel">Annulla</button>
                        <button id="password-save" class="modal-btn modal-save">Salva</button>
                    </div>
                </div>
            </div>
        </main>
    </div>
</div>
@endsection