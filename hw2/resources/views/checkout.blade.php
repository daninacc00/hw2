{{-- resources/views/checkout/index.blade.php --}}

@extends('layouts.app')

@section('styles')
<title>Checkout</title>
<meta name="csrf-token" content="{{ csrf_token() }}">
<link rel="stylesheet" href="{{ asset('css/checkout.css') }}">
<!-- Square Web Payments SDK -->
<script type="text/javascript" src="https://sandbox.web.squarecdn.com/v1/square.js"></script>
@endsection

@section('scripts')
<script src="{{ asset('js/checkout.js') }}" defer></script>
@endsection

@section('content')
<div class="container">
    <h1>Finalizza Ordine</h1>
    
    <div class="checkout-container">
        <!-- Riepilogo Ordine -->
        <div class="order-summary">
            <h2>Riepilogo Ordine</h2>
            @foreach ($cartItems as $item)
            <div class="order-item">
                <img src="{{ $item->image_url }}" alt="{{ $item->name }}">
                <div class="item-details">
                    <h3>{{ $item->name }}</h3>
                    <p>Colore: {{ $item->color_name }}</p>
                    <p>Taglia: {{ $item->size_name }}</p>
                    <p>Quantità: {{ $item->quantity }}</p>
                    <p class="price">€{{ number_format($item->price * $item->quantity, 2) }}</p>
                </div>
            </div>
            @endforeach
            <div class="total">
                <strong>Totale: €{{ number_format($total, 2) }}</strong>
            </div>
        </div>

        <!-- Form Checkout -->
        <div class="checkout-form">
            <form id="checkout-form">
                @csrf
                <h2>Dati di Fatturazione</h2>
                
                <div class="form-group">
                    <label for="billing_name">Nome Completo</label>
                    <input type="text" id="billing_name" name="billing_name" required>
                </div>
                
                <div class="form-group">
                    <label for="billing_email">Email</label>
                    <input type="email" id="billing_email" name="billing_email" required>
                </div>
                
                <div class="form-group">
                    <label for="billing_address">Indirizzo</label>
                    <textarea id="billing_address" name="billing_address" required></textarea>
                </div>

                <h2>Dati di Pagamento</h2>
                
                <!-- Container per Square Payment Form -->
                <div id="card-container"></div>
                <div id="payment-status"></div>
                
                <button type="submit" id="pay-button">
                    Paga €{{ number_format($total, 2) }}
                </button>
            </form>
        </div>
    </div>
</div>
@endsection