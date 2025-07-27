@extends('layouts.app')

@section('title', 'I miei preferiti')

@section('styles')
<link rel="stylesheet" href="{{ asset('css/account/favorites.css') }}">
@endsection

@section('scripts')
<script src="{{ asset('js/account/favorites.js') }}" defer></script>
@endsection

@section('content')
<div class="container">
    <h1 class="title">Preferiti</h1>

    <div class="products-grid">
    </div>
</div>
@endsection