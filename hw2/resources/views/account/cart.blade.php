@extends('layouts.app')

@section('title', 'Carrello')

@section('styles')
<link rel="stylesheet" href="{{ asset('css/account/cart.css') }}">
@endsection

@section('scripts')
<script src="{{ asset('js/account/cart.js') }}" defer></script>
@endsection

@section('content')
<div class="container">
    <h1 class="title">Carrello</h1>
    
    <div class="cart-content">            
    </div>
</div>
@endsection