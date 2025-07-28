<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">

<head>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>@yield('title')</title>

    <!-- CSRF Token -->
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <link rel="icon" type="image/x-icon" sizes="32x32" href="{{ asset('favicon.ico') }}" />

    <!-- Font -->
    <link href="https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100..900;1,100..900&display=swap" rel="stylesheet" />
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />

    <!-- Styles -->
    @yield('styles')
    <link href="{{ asset('css/app.css') }}" rel="stylesheet">

    <!-- Scripts -->
    <script src="{{ asset('js/app.js') }}" defer></script>
    @yield('scripts')
</head>

<body>
    <div id="commerce-header">
        <div id="topbar">
            <nav id="brand-navbar">
                <ul class="desktop-navbar-list desktop-brand-list">
                    <li class="list-item">
                        <a class="link-item" href="https://www.nike.com/it/jordan">
                            <img class="link-img air-jordan-icon" src="/assets/icons/air-jordan-icon.svg" />
                        </a>
                    </li>
                    <li class="list-item">
                        <a class="link-item" href="https://www.converse.com/it/it/go">
                            <img class="link-img converse-icon" src="/assets/icons/converse-icon.svg" />
                        </a>
                    </li>
                </ul>
            </nav>

            <nav id="user-menu-navbar">
                <ul class="desktop-navbar-list desktop-user-menu-list">
                    <li class="list-item">
                        <a class="link-item" href="https://www.nike.com/it/retail">
                            <p class="link-text">Trova un negozio</p>
                        </a>
                        <div class="vertical-line"></div>
                    </li>
                    <li class="list-item">
                        <a class="link-item" href="https://www.nike.com/it/help">
                            <p class="link-text">Aiuto</p>
                        </a>
                        <div class="vertical-line"></div>
                    </li>
                    <li class="list-item">
                        <a class="link-item" href="https://www.nike.com/it/membership">
                            <p class="link-text">Unisciti a noi</p>
                        </a>
                        <div class="vertical-line"></div>
                    </li>
                    <li class="list-item">
                        @if(session('user_id'))
                        <div class="tooltip-container">
                            <p class="link-text">
                                Ciao, {{ session('user_first_name') }}
                            </p>
                            <div class="tooltip">
                                <h3 class="tooltip-title">Account</h3>
                                <ul class="action-list">
                                    <li class="action-item" data-action="profile">
                                        <span class="action-text">Profilo</span>
                                    </li>
                                    <li class="action-item" data-action="favorites">
                                        <span class="action-text">Preferiti</span>
                                    </li>
                                    <li class="action-item" data-action="newsletter">
                                        <span class="action-text">Posta in arrivo</span>
                                    </li>
                                    <li class="action-item" data-action="experience">
                                        <span class="action-text">Esperienze</span>
                                    </li>
                                    <li class="action-item" data-action="settings">
                                        <span class="action-text">Impostazioni account</span>
                                    </li>
                                    <li class="action-item" data-action="logout">
                                        <span class="action-text">Esci</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        @else
                        <a class='link-item' href='/login'>
                            <p class='link-text'>Accedi</p>
                        </a>
                        @endif
                    </li>
                </ul>
            </nav>
        </div>

        <header id="shopping-header">

            <div class="swoosh">
                <a class="link-item swoosh-link" href="/">
                    <img class="link-img swoosh-icon" src="/assets/icons/icon.svg" alt="Nike" />
                </a>
            </div>

            <nav id="shopping-navbar">
                <ul class="desktop-shopping-category">
                    <li class="list-item">
                        <a class="menu-hover-trigger-link" href="/pages/shop/shop.php">Novità e in evidenza</a>
                    </li>
                    <li class="list-item">
                        <a class="menu-hover-trigger-link" href="/pages/shop/shop.php">Uomo</a>
                    </li>
                    <li class="list-item">
                        <a class="menu-hover-trigger-link" href="/pages/shop/shop.php">Donna</a>
                    </li>
                    <li class="list-item">
                        <a class="menu-hover-trigger-link" href="/pages/shop/shop.php">Kids</a>
                    </li>
                    <li class="list-item">
                        <a class="menu-hover-trigger-link" href="/pages/shop/shop.php">Outlet</a>
                    </li>
                </ul>
            </nav>

            <div class="user-tools-container">

                <div id="search-bar-container">
                    <div class="search-header">
                        <div class="swoosh">
                            <a class="link-item swoosh-link" href="/index.php">
                                <img class="link-img swoosh-icon" src="/assets/icons/icon.svg" alt="Nike" />
                            </a>
                        </div>

                        <div class="desktop-search-bar">
                            <img src="/assets/icons/search-icon.svg" alt="Cerca" class="search-icon">
                            <input type="text" class="search-bar" placeholder="Cerca">
                        </div>

                        <div class="close-search">
                            <button class="close-search-btn">
                                Annulla
                            </button>
                        </div>
                    </div>

                    <div class="search-results">
                        <div class="search-content">
                            <p>I termini più ricercati</p>
                            <div class="search-tags">
                                <span class="search-tag button">air force 1</span>
                                <span class="search-tag button ">jordan 4</span>
                                <span class="search-tag button">dunk</span>
                                <span class="search-tag button">jordan</span>
                                <span class="search-tag button">dunk low</span>
                                <span class="search-tag button">scarpe da calcio</span>
                                <span class="search-tag button">tn</span>
                                <span class="search-tag button">field general</span>
                            </div>
                        </div>
                    </div>

                </div>

                <div class="icon-button favorites-button">
                    <a href="/account/favorites" class="link-item favorites-link">
                        <img src="/assets/icons/hearth-icon.svg" alt="Preferiti">
                        <span class="counter-badge hidden" id="favorites-counter"></span>
                    </a>
                </div>

                <div class="icon-button cart-button">
                    <a href="/account/cart" class="link-item cart-link">
                        <img src="/assets/icons/cart-icon.svg" alt="Carrello">
                        <span
                            class="counter-badge  <?php echo "hidden" ?>"
                            id="cart-counter">
                        </span>
                    </a>
                </div>

                <div class="icon-button hamburger-button">
                    <img src="/assets/icons/hamburger-icon.svg" alt="Menu">
                </div>
            </div>

        </header>

        <div id="mobile-menu" class="mobile-menu hidden">
            <div class="mobile-menu-content">
                <div class="mobile-menu-header">
                    <button class="mobile-menu-close"><i class="fa-solid fa-x"></i></button>
                </div>
                <nav class="mobile-menu-nav">
                    <ul class="mobile-menu-list">
                        <li><a href="/pages/shop/shop.php">Novità e in evidenza</a></li>
                        <li><a href="/pages/shop/shop.php">Uomo</a></li>
                        <li><a href="/pages/shop/shop.php">Donna</a></li>
                        <li><a href="/pages/shop/shop.php">Kids</a></li>
                    </ul>

                    <div class="mobile-menu-brands">
                        <ul>
                            <li>
                                <a href="https://www.nike.com/it/jordan">
                                    <img class="air-jordan-icon" src="/assets/icons/air-jordan-icon.svg" />
                                    Jordan
                                </a>
                            </li>
                            <li>

                                <a href="https://www.converse.com/it/it/go">
                                    <img class="converse-icon" src="/assets/icons/converse-icon.svg" />
                                    Converse
                                </a>
                            </li>
                        </ul>
                    </div>

                    <div class="mobile-menu-membership">
                        <p>Diventa Member Nike per accedere a prodotti fantastici, tanta ispirazione e storie sullo sport. <a href="#" class="discover-more">Scopri di più</a></p>
                        <div class="mobile-menu-buttons">
                            <button class="mobile-menu-btn primary">Unisciti a noi</button>
                            <button class="mobile-menu-btn secondary">Accedi</button>
                        </div>
                    </div>

                    <div class="mobile-menu-help">
                        <ul>
                            <li>
                                <a href="#">
                                    <i class="fa-regular fa-circle-question help-icon"></i>
                                    Aiuto
                                </a>
                            </li>
                            <li>
                                <a href="#">
                                    <img class="help-icon" src="/assets/icons/cart-icon.svg" alt="Carrello" />
                                    Carrello
                                </a>
                            </li>
                            <li>
                                <a href="#">
                                    <i class="fa-regular fa-square help-icon"></i>
                                    Ordini
                                </a>
                            </li>
                            <li>
                                <a href="#">
                                    <i class="fa-solid fa-shop help-icon"></i>
                                    Trova un negozio
                                </a>
                            </li>
                        </ul>
                    </div>
                </nav>
            </div>
        </div>

        <div id="mobile-menu-overlay" class="mobile-menu-overlay hidden"></div>

    </div>

    @yield('content')

    <footer id="footer">
        <div class="divider"></div>
        <div class="footer-menu">

            <div class="mobile-footer-accordion">
                <div class="accordion">
                    <div class="accordion-details">
                        <div class="accordion-panel-wrapper">
                            <span class="accordion-summary-wrapper">
                                <p class="summary">Risorse</p>
                                <span class="summary-icon">
                                    <img src="/assets/icons/chevron-icon.png" alt="mostra-dettagli" />
                                </span>
                            </span>
                        </div>
                    </div>
                    <div class="accordion-details">
                        <div class="accordion-panel-wrapper">
                            <span class="accordion-summary-wrapper">
                                <p class="summary">Assistenza</p>
                                <span class="summary-icon">
                                    <img src="/assets/icons/chevron-icon.png" alt="mostra-dettagli" />
                                </span>
                            </span>
                        </div>
                    </div>
                    <div class="accordion-details">
                        <div class="accordion-panel-wrapper">
                            <span class="accordion-summary-wrapper">
                                <p class="summary">Azienda</p>
                                <span class="summary-icon">
                                    <img src="/assets/icons/chevron-icon.png" alt="mostra-dettagli" />
                                </span>
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <div class="footer-menu-column">
                <a class="footer-header">
                    <p class="footer-header-text">Risorse</p>
                </a>
                <a class="footer-link" href="#">
                    <p class="footer-link-text">Gift card</p>
                </a>
                <a class="footer-link" href="#">
                    <p class="footer-link-text">Gift card aziendali</p>
                </a>
                <a class="footer-link" href="#">
                    <p class="footer-link-text">Trova un negozio</p>
                </a>
                <a class="footer-link" href="#">
                    <p class="footer-link-text">Nike Journal</p>
                </a>
                <a class="footer-link" href="#">
                    <p class="footer-link-text">Diventa member</p>
                </a>
                <a class="footer-link" href="#">
                    <p class="footer-link-text">Sconto studenti</p>
                </a>
                <a class="footer-link" href="#">
                    <p class="footer-link-text">Feedback</p>
                </a>
                <a class="footer-link" href="#">
                    <p class="footer-link-text">Codici promozionali</p>
                </a>
            </div>
            <div class="footer-menu-column">
                <a class="footer-header">
                    <p class="footer-header-text">Assistenza</p>
                </a>
                <a class="footer-link" href="#">
                    <p class="footer-link-text">Assistenza</p>
                </a>
                <a class="footer-link" href="#">
                    <p class="footer-link-text">Stato ordine</p>
                </a>
                <a class="footer-link" href="#">
                    <p class="footer-link-text">Spedizione e consegna</p>
                </a>
                <a class="footer-link" href="#">
                    <p class="footer-link-text">Resi</p>
                </a>
                <a class="footer-link" href="#">
                    <p class="footer-link-text">Opzioni di pagamento</p>
                </a>
                <a class="footer-link" href="#">
                    <p class="footer-link-text">Contattaci</p>
                </a>
                <a class="footer-link" href="#">
                    <p class="footer-link-text">Recensioni</p>
                </a>
                <a class="footer-link" href="#">
                    <p class="footer-link-text">Assistenza Codici promozionali Nike</p>
                </a>
            </div>
            <div class="footer-menu-column">

                <a class="footer-header">
                    <p class="footer-header-text">Azienda</p>
                </a>
                <a class="footer-link" href="#">
                    <p class="footer-link-text">Informazioni su Nike</p>
                </a>
                <a class="footer-link" href="#">
                    <p class="footer-link-text">News</p>
                </a>
                <a class="footer-link" href="#">
                    <p class="footer-link-text">Lavora con noi</p>
                </a>
                <a class="footer-link" href="#">
                    <p class="footer-link-text">Investitori</p>
                </a>
                <a class="footer-link" href="#">
                    <p class="footer-link-text">Sostenibilità</p>
                </a>
                <a class="footer-link" href="#">
                    <p class="footer-link-text">Obiettivo</p>
                </a>
                <a class="footer-link" href="#">
                    <p class="footer-link-text">Feedback</p>
                </a>
                <a class="footer-link" href="#">
                    <p class="footer-link-text">Segnala un problema</p>
                </a>
            </div>
            <div class="language-tunnel">
                <button class="language-button">
                    <span class="icon-wrapper">
                        <img src="/assets/icons/globe-icon.png" alt="world-icon" />
                    </span>
                    <p>Italia</p>
                </button>
            </div>
        </div>

        <div class="footer-spacer"></div>

        <div class="footer-bottom">
            <ul class="footer-list">
                <li class="footer-list-item rights">
                    <p> <span>© <?php echo date('Y'); ?> Nike, Inc. Tutti i diritti riservati</span></p>
                </li>
                <li class="footer-list-item"><a href="#">Guide</a></li>
                <li class="footer-list-item"><a href="#">Condizioni d'uso</a></li>
                <li class="footer-list-item"><a href="#">Condizioni di vendita</a></li>
                <li class="footer-list-item"><a href="#">Info legali e societarie</a></li>
                <li class="footer-list-item"><a href="#">Informativa sulla privacy e sui cookie</a></li>
                <li class="footer-list-item"><a href="#">Impostazioni relative a privacy e cookie</a></li>
            </ul>
        </div>
    </footer>
</body>

</html>