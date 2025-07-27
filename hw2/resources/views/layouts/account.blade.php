@extends('layouts.app')

@section('styles')
<title>@yield('title') - Account</title>
<link rel="stylesheet" href="{{ asset('css/account/account.css') }}">
@yield('account-styles')
@endsection

@section('scripts')
<script src="{{ asset('js/account/account.js') }}" defer></script>
@yield('account-scripts')
@endsection

@section('content')
<header class="header">
    <nav>
        <a href="/account" data-tab="profile" class="tab-link @if(request()->is('account') || request()->is('account/profile')) active @endif">Profilo</a>
        <a href="/account/orders" data-tab="orders" class="tab-link @if(request()->is('account/orders')) active @endif">Ordini</a>
        <a href="/account/favorites" data-tab="favorites" class="tab-link @if(request()->is('account/favorites')) active @endif">Preferiti</a>
        <a href="/account/settings" data-tab="settings" class="tab-link @if(request()->is('account/settings')) active @endif">Impostazioni</a>
    </nav>
</header>

<div class="container">
    @yield('account-content')
</div>
@endsection