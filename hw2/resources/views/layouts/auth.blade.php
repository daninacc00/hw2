<!DOCTYPE html>
<html lang="it">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    
    <title>@yield('title') - Nike</title>

    <link rel="icon" type="image/x-icon" sizes="32x32" href="{{ asset('favicon.ico') }}" />
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
    
    <link rel="stylesheet" href="{{ asset('css/auth/auth.css') }}">
    @yield('page-styles')

    <script src="{{ asset('js/auth/auth.js') }}" defer></script>
    <script src="{{ asset('js/auth/validation.js') }}" defer></script>
    @yield('page-scripts')
</head>
<body>

<div class="container">
    <div class="auth-container">

        <div class="auth-logo">
            <img class="swoosh-icon" src="/assets/icons/icon.svg" alt="Nike" />
            <img class="air-jordan-icon" src="/assets/icons/air-jordan-icon.svg" />
        </div>

        <h1>@yield('heading')</h1>
        
        <div class="auth-links">
            <p>@yield('auth-links')</p>
        </div>

        <div class="error-message hidden"></div>

        @if(isset($success))
            <div class="success-message">{{ $success }}</div>
        @endif

        @yield('content')

    </div>
</div>

</body>
</html>