@extends('layouts.app')

@section('title', 'Nike')

@section('styles')
<link rel="stylesheet" href="{{ asset('css/shop.css') }}">
@endsection

@section('scripts')
<script src="{{ asset('js/shop.js') }}" defer></script>
@endsection

@section('content')
<div id="experience-wrapper">
    <header id="shop-header">
        <div class="category" id="categoryTitle">Sneakers e scarpe da uomo</div>
        <div class="header-controls">
            <button class="btn filter-btn">
                Nascondi filtri
            </button>
            <button class="btn sort-btn">
                Ordina per
                <i class="fa-solid fa-chevron-down"></i>
            </button>
        </div>
    </header>

    <div class="container">
        <div class="filters">
            <div class="filter-section" data-section="section">
                <div class="filter-title">
                    <h3>Categoria</h3>
                    <i class="fa-solid fa-chevron-down"></i>
                </div>
            </div>

            <div class="filter-section" data-section="price">
                <div class="filter-title">
                    <h3>Acquista per prezzo</h3>
                    <i class="fa-solid fa-chevron-down"></i>
                </div>
            </div>

            <div class="filter-section" data-section="discount">
                <div class="filter-title">
                    <h3>Sconti e offerte</h3>
                    <i class="fa-solid fa-chevron-down"></i>
                </div>
            </div>

            <div class="filter-section" data-section="size">
                <div class="filter-title">
                    <h3>Taglia/Misura</h3>
                    <i class="fa-solid fa-chevron-down"></i>
                </div>
            </div>

            <div class="filter-section" data-section="color">
                <div class="filter-title">
                    <h3>Colore</h3>
                    <i class="fa-solid fa-chevron-down"></i>
                </div>
            </div>

            <div class="filter-section" data-section="height">
                <div class="filter-title">
                    <h3>Altezza scarpa</h3>
                    <i class="fa-solid fa-chevron-down"></i>
                </div>
            </div>
        </div>

        <div id="product-grid" class="products">
        </div>
    </div>
</div>
@endsection