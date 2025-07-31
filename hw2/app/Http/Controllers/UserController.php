<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class UserController extends Controller
{
    /**
     * Restituisce i dati del profilo utente corrente
     */
    public function getProfile(Request $request)
    {
        // Controlla se l'utente è autenticato tramite sessione
        if (session('user_id')) {
            // Usa il tuo sistema esistente per recuperare l'utente
            $userId = session('user_id');
            
            // Assumendo che tu abbia un model User, altrimenti usa query dirette
            $user = \App\Models\User::find($userId);
            
            if ($user) {
                return response()->json([
                    'success' => true,
                    'user' => [
                        'id' => $user->id,
                        'first_name' => $user->first_name,
                        'last_name' => $user->last_name,
                        'email' => $user->email,
                        // Aggiungi altri campi necessari
                    ]
                ]);
            }
        }
        
        // Utente non autenticato
        return response()->json([
            'success' => false,
            'message' => 'Utente non autenticato'
        ], 401);
    }
    
    /**
     * Logout tramite API
     */
    public function logout(Request $request)
    {
        try {
            // Pulisci la sessione
            session()->forget('user_id');
            session()->forget('user_first_name');
            session()->forget('user_last_name');
            session()->forget('user_email');
            
            // Invalida la sessione completa se necessario
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