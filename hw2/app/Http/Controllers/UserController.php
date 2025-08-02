<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class UserController extends Controller
{
    public function getProfile(Request $request)
    {
        if (session('user_id')) {
            $userId = session('user_id');
            
            $user = \App\Models\User::find($userId);
            
            if ($user) {
                return response()->json([
                    'success' => true,
                    'user' => [
                        'id' => $user->id,
                        'first_name' => $user->first_name,
                        'last_name' => $user->last_name,
                        'email' => $user->email,
                    ]
                ]);
            }
        }
        
        return response()->json([
            'success' => false,
            'message' => 'Utente non autenticato'
        ], 401);
    }
    
    public function logout(Request $request)
    {
        try {
            session()->forget('user_id');
            session()->forget('user_first_name');
            session()->forget('user_last_name');
            session()->forget('user_email');
            
            $request->session()->invalidate();
            $request->session()->regenerateToken();
            
            return response()->json([
                'success' => true,
                'message' => 'Logout effettuato con successo'
            ]);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Errore durante il logout'
            ], 500);
        }
    }
}