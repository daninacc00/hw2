@extends('layouts.account')

@section('title', 'I Miei Ordini')

@section('account-styles')
<link rel="stylesheet" href="{{ asset('css/account/orders.css') }}">
@endsection

@section('account-scripts')
<script src="{{ asset('js/account/orders.js') }}" defer></script>
@endsection

@section('account-content')
<div class="orders-container">
    <header class="page-header">
        <h1>I Miei Ordini</h1>
    </header>

    <div id="orders-loading" class="orders-loading">
        <p>Caricamento ordini...</p>
    </div>

    <div id="orders-content" class="orders-content">
    </div>
</div>
@endsection