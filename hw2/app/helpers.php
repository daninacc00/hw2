<?php

if (!function_exists('isLoggedIn')) {
    function isLoggedIn()
    {
        return session()->has('user') && session('user') !== null;
    }
}

if (!function_exists('getCurrentUser')) {
    function getCurrentUser()
    {
        return session('user');
    }
}

if (!function_exists('loginUser')) {
    function loginUser($userData)
    {
        session(['user' => $userData]);
    }
}

if (!function_exists('logoutUser')) {
    function logoutUser()
    {
        session()->forget('user');
        session()->flush();
    }
}

// In composer.json aggiungere nella sezione autoload:
// "files": [
//     "app/helpers.php"
// ]

// Poi eseguire: composer dump-autoload