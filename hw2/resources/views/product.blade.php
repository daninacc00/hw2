@extends('layouts.app')

@section('title', 'Nike')

@section('styles')
<link rel="stylesheet" href="{{ asset('css/product.css') }}">
@endsection

@section('scripts')
<script src="{{ asset('js/product.js') }}" defer></script>
@endsection

@section('content')
<div class="container">
    <div class="breadcrumb">
        <a href="/">Home</a> /
        <a href="/shop">Shop</a> /
        <span>{{ $product->name }}</span>
    </div>

    <div id="loading" class="loading" style="display: none;">
        Caricamento prodotto...
    </div>

    <div id="error" class="error" style="display: none;">
        <h2>Errore nel caricamento</h2>
        <p id="error-message"></p>
    </div>

    <div id="product-detail" class="product-detail"></div>
</div>
@endsection