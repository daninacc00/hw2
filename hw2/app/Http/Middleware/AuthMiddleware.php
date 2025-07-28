<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class AuthMiddleware
{
    public function handle(Request $request, Closure $next)
    {
        // Controlla se l'utente è autenticato
        if (!session('user_id')) {
            // Se è una richiesta AJAX, restituisci JSON
            if ($request->expectsJson() || $request->ajax()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Devi essere loggato per accedere a questa funzione',
                    'error_type' => 'auth_required'
                ], 401);
            }
            
            // Altrimenti, redirect normale al login
            return redirect('/login');
        }

        return $next($request);
    }
}