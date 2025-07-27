@extends('layouts.auth')

@section('title', 'Login')
<meta name="csrf-token" content="{{ csrf_token() }}">

@section('page-styles')
<link rel="stylesheet" href="{{ asset('css/auth/login.css') }}">
@endsection

@section('page-scripts')
<script src="{{ asset('js/auth/login.js') }}" defer></script>
@endsection

@section('heading')
Inserisci la tua e-mail per unirti a noi o accedi.
@endsection

@section('auth-links')
Non hai un account? <a href="/register">Registrati ora</a>
@endsection

@section('content')
<form id="loginForm" method="POST" action="/login">
    @csrf
    <div class="form-group">
        <label for="username">Email*</label>
        <input
            type="text"
            id="username"
            name="username"
            required>
    </div>

    <div class="form-group">
        <label for="password">Password*</label>
        <input
            type="password"
            id="password"
            name="password"
            required>
    </div>

    <div class="terms-text">
        Registrandoti, accetti le <a href="#">condizioni d'uso</a> di Nike<br>
        e confermi di aver letto l'<a href="#">informativa sulla privacy</a><br>
        di Nike.
    </div>

    <div class="actions">
        <button type="submit" class="btn btn-primary">Continua</button>
    </div>


</form>
@endsection