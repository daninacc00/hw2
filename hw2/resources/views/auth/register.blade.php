@extends('layouts.auth')

@section('title', 'Registrazione')
<meta name="csrf-token" content="{{ csrf_token() }}">

@section('page-styles')
<link rel="stylesheet" href="{{ asset('css/auth/registration.css') }}">
@endsection

@section('page-scripts')
<script src="{{ asset('js/auth/registration.js') }}" defer></script>
@endsection

@section('heading')
Diventa un membro di Nike per ottenere i prodotti, l'ispirazione e la storia migliori dello sport
@endsection

@section('auth-links')
Hai già un account? <a href="/login">Accedi</a>
@endsection

@section('content')
<form id="registerForm" method="POST" action="/register">
    @csrf
    <div class="form-group">
        <label for="username">Username*</label>
        <input
            type="text"
            id="username"
            name="username"
            required>
    </div>

    <div class="form-group">
        <label for="email">Email*</label>
        <input
            type="email"
            id="email"
            name="email"
            required>
    </div>

    <div class="form-group">
        <label for="nome">Nome*</label>
        <input
            type="text"
            id="nome"
            name="nome"
            required>
    </div>

    <div class="form-group">
        <label for="cognome">Cognome*</label>
        <input
            type="text"
            id="cognome"
            name="cognome"
            required>
    </div>

    <div class="form-group">
        <label for="password">Password*</label>
        <input
            type="password"
            id="password"
            name="password"
            required>
        <div class="password-requirements">
            <p>La password deve contenere:</p>
            <ul>
                <li id="length"><i class="fa-solid fa-xmark"></i> 8 caratteri</li>
                <li id="uppercase"><i class="fa-solid fa-xmark"></i> una lettera maiuscola</li>
                <li id="lowercase"><i class="fa-solid fa-xmark"></i> una lettera minuscola</li>
                <li id="number"><i class="fa-solid fa-xmark"></i> un numero</li>
                <li id="special"><i class="fa-solid fa-xmark"></i> un carattere speciale</li>
            </ul>
        </div>
    </div>

    <div class="form-group">
        <label for="password_confirm">Conferma Password*</label>
        <input
            type="password"
            id="password_confirm"
            name="password_confirm"
            required>
    </div>

    <div class="terms-text">
        Registrandoti, accetti le <a href="#">condizioni d'uso</a> di Nike<br>
        e confermi di aver letto l'<a href="#">informativa sulla privacy</a><br>
        di Nike.
    </div>

    <div class="actions">
        <button type="submit" class="btn btn-primary">Registrati</button>
    </div>
</form>
@endsection