@extends('layouts.account')

@section('title', 'Il mio profilo')

@section('account-styles')
<link rel="stylesheet" href="{{ asset('css/account/profile.css') }}">
<link rel="stylesheet" href="{{ asset('css/account/interest.css') }}">
@endsection

@section('account-scripts')
<script src="{{ asset('js/account/profile.js') }}" defer></script>
<script src="{{ asset('js/account/interest.js') }}" defer></script>
@endsection

@section('account-content')
<div id="tab-profile" class="tab-content active">
    <section class="profile-section">
        <div id="error-message" class="error-message hidden">
            <p>Errore nel caricamento del profilo. Riprova più tardi.</p>
        </div>
        <div id="profile-content" class="profile-header hidden">
            <div class="profile-avatar" id="profile-avatar"></div>
            <div class="profile-info">
                <h1 id="profile-name"></h1>
                <p id="profile-member-since"> </p>
            </div>
        </div>
    </section>

    <section class="interests-section">
        <div class="interests-header">
            <h2>Interessi</h2>
            <button class="modify-btn">Modifica</button>
        </div>

        <div class="category-tabs" id="category-tabs">
        </div>

        <div class="interests-description">
            Aggiungi i tuoi interessi per scoprire una collezione di articoli basati sulle tue preferenze.
        </div>

        <div class="interests-grid" id="interests-grid">
        </div>
    </section>

    <div id="interest-modal" class="modal">
        <div class="modal-content">
            <div class="modal-header">
                <h2>Seleziona i tuoi interessi</h2>
                <button id="modal-close" class="modal-close">&times;</button>
            </div>

            <div class="modal-category-tabs" id="modal-category-tabs">
            </div>

            <div class="modal-body">
                <div id="modal-loading" class="modal-loading">Caricamento...</div>

                <div class="modal-interests-list" id="modal-interests-list">
                </div>
            </div>

            <div class="modal-footer">
                <button id="modal-cancel" class="modal-btn modal-cancel">Annulla</button>
                <button id="modal-save" class="modal-btn modal-save">Salva</button>
            </div>
        </div>
    </div>
</div>
@endsection