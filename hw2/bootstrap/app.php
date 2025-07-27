<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Foundation\Http\Middleware\VerifyCsrfToken;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        // Il middleware CSRF deve essere applicato automaticamente alle route web
        $middleware->web(append: [
            // VerifyCsrfToken::class, // Non serve qui, viene gestito automaticamente
        ]);
        
        // Se hai problemi con CSRF, puoi escludere specifiche route
        // $middleware->validateCsrfTokens(except: [
        //     'api/*',
        // ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        //
    })->create();