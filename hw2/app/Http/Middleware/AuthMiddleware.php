<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class AuthMiddleware
{
    public function handle(Request $request, Closure $next)
    {
        if (!session('user_id')) {
            $path = $request->getPathInfo();
            
            if (substr($path, 0, 5) === '/api/') {
                return response()->json([
                    'success' => false,
                    'message' => 'Devi essere loggato per accedere a questa funzione'
                ], 401);
            }
            
            return redirect('/login');
        }

        return $next($request);
    }
}