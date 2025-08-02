{{-- resources/views/account/orders.blade.php --}}

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

    @if($orders->isEmpty())
        <div class="no-orders">
            <h2>Nessun ordine trovato</h2>
            <p>Non hai ancora effettuato nessun ordine.</p>
            <a href="{{ url('/') }}" class="shop-button">Inizia a fare shopping</a>
        </div>
    @else
        <div class="orders-list">
            @foreach($orders as $order)
                <div class="order-card">
                    <div class="order-header">
                        <div class="order-info">
                            <h3>Ordine #{{ $order->id }}</h3>
                            <p class="order-date">
                                {{ $order->created_at->format('d/m/Y H:i') }}
                            </p>
                            @if($order->square_order_id)
                                <p class="square-id">Square ID: {{ Str::limit($order->square_order_id, 20, '...') }}</p>
                            @endif
                        </div>
                        <div class="order-status">
                            <span class="status-badge status-{{ $order->status }}">
                                {{ $order->status_label }}
                            </span>
                        </div>
                    </div>
                    
                    <div class="order-details">
                        <div class="billing-info">
                            <h4>Dati di Fatturazione</h4>
                            <p><strong>{{ $order->billing_name }}</strong></p>
                            <p>{{ $order->billing_email }}</p>
                            <p>{!! nl2br(e($order->billing_address)) !!}</p>
                        </div>
                        
                        <div class="order-summary">
                            <p class="items-count">{{ $order->items_count }} prodotti</p>
                            <p class="total-amount">
                                <strong>Totale: €{{ number_format($order->total_amount, 2) }}</strong>
                            </p>
                            <button class="view-details-btn" data-order-id="{{ $order->id }}">
                                Vedi Dettagli
                            </button>
                        </div>
                    </div>
                    
                    <!-- Dettagli prodotti (nascosti inizialmente) -->
                    <div id="order-items-{{ $order->id }}" class="order-items" style="display: none;">
                        <h4>Prodotti nell'ordine</h4>
                        <div class="items-container" data-order-id="{{ $order->id }}">
                            <!-- I prodotti verranno caricati via JavaScript -->
                        </div>
                    </div>
                </div>
            @endforeach
        </div>
    @endif
</div>
@endsection