<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\UserProfile;
use App\Models\UserSettings;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class AccountController extends Controller
{
    public function profile()
    {
        return view('account.profile');
    }

    public function settings()
    {
        return view('account.settings');
    }

    public function getProfileData()
    {
        $user = User::with(['profile', 'settings'])->find(session('user_id'));
        if (!$user) {
            return response()->json([
                'success' => false,
                'error' => 'Utente non trovato'
            ], 404);
        }

        $profileData = [
            'id' => $user->id,
            'username' => $user->username,
            'email' => $user->email,
            'first_name' => $user->first_name,
            'last_name' => $user->last_name,
            'last_login' => $user->last_login,
            'created_at' => $user->created_at,
            'profile' => $user->profile ? [
                'birth_date' => $user->profile->birth_date,
                'phone' => $user->profile->phone,
                'interests' => $user->profile->interests
            ] : null,
            'settings' => $user->settings ? [
                'newsletter_enabled' => $user->settings->newsletter_enabled,
                'notifications_enabled' => $user->settings->notifications_enabled,
            ] : null
        ];

        return response()->json([
            'success' => true,
            'data' => $profileData
        ]);
    }

    public function updateSettings(Request $request)
    {
        $userId = session('user_id');
        
        $validator = Validator::make($request->all(), [
            'email' => 'required|email|unique:users,email,' . $userId,
            'first_name' => 'required|string|max:50',
            'last_name' => 'required|string|max:50',
            'phone' => 'nullable|string|max:20',
            'birth_date' => 'nullable|date_format:Y-m-d',
            'country' => 'nullable|string|max:10',
            'province' => 'nullable|string|max:10',
            'newsletter_enabled' => 'boolean',
            'notifications_enabled' => 'boolean'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'error' => $validator->errors()->first()
            ], 400);
        }

        try {
            // Aggiorna i dati utente
            $user = User::find($userId);
            $user->email = $request->input('email');
            $user->first_name = $request->input('first_name');
            $user->last_name = $request->input('last_name');
            $user->save();

            // Aggiorna o crea il profilo
            $profile = UserProfile::where('user_id', $userId)->first();
            if (!$profile) {
                $profile = new UserProfile();
                $profile->user_id = $userId;
            }
            
            $profile->phone = $request->input('phone');
            
            // Gestisci la data di nascita
            $birthDate = $request->input('birth_date');
            if (!empty($birthDate)) {
                // Assicurati che la data sia nel formato corretto
                try {
                    $profile->birth_date = \Carbon\Carbon::createFromFormat('Y-m-d', $birthDate)->format('Y-m-d');
                } catch (\Exception $e) {
                    // Se il formato non è corretto, prova altri formati comuni
                    try {
                        $profile->birth_date = \Carbon\Carbon::parse($birthDate)->format('Y-m-d');
                    } catch (\Exception $e) {
                        return response()->json([
                            'success' => false,
                            'error' => 'Formato data di nascita non valido'
                        ], 400);
                    }
                }
            } else {
                $profile->birth_date = null;
            }
            
            $profile->save();

            // Aggiorna o crea le impostazioni
            $settings = UserSettings::where('user_id', $userId)->first();
            if (!$settings) {
                $settings = new UserSettings();
                $settings->user_id = $userId;
            }
            
            $settings->newsletter_enabled = $request->input('newsletter_enabled', false);
            $settings->notifications_enabled = $request->input('notifications_enabled', false);
            $settings->save();

            // Ricarica i dati aggiornati
            $updatedUser = User::with(['profile', 'settings'])->find($userId);
            
            $profileData = [
                'id' => $updatedUser->id,
                'username' => $updatedUser->username,
                'email' => $updatedUser->email,
                'first_name' => $updatedUser->first_name,
                'last_name' => $updatedUser->last_name,
                'last_login' => $updatedUser->last_login,
                'created_at' => $updatedUser->created_at,
                'profile' => $updatedUser->profile ? [
                    'birth_date' => $updatedUser->profile->birth_date,
                    'phone' => $updatedUser->profile->phone,
                    'interests' => $updatedUser->profile->interests
                ] : null,
                'settings' => $updatedUser->settings ? [
                    'newsletter_enabled' => $updatedUser->settings->newsletter_enabled,
                    'notifications_enabled' => $updatedUser->settings->notifications_enabled,
                ] : null
            ];

            return response()->json([
                'success' => true,
                'data' => $profileData,
                'message' => 'Impostazioni aggiornate con successo'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => 'Errore durante l\'aggiornamento delle impostazioni'
            ], 500);
        }
    }

    public function updatePassword(Request $request)
    {
        $userId = session('user_id');
        
        $validator = Validator::make($request->all(), [
            'current_password' => 'required',
            'new_password' => 'required|min:6',
            'confirm_password' => 'required|same:new_password'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'error' => $validator->errors()->first()
            ], 400);
        }

        try {
            $user = User::find($userId);
            
            // Verifica la password attuale
            if (!Hash::check($request->input('current_password'), $user->password_hash)) {
                return response()->json([
                    'success' => false,
                    'error' => 'Password attuale non corretta'
                ], 400);
            }

            // Aggiorna la password
            $user->password_hash = Hash::make($request->input('new_password'));
            $user->save();

            return response()->json([
                'success' => true,
                'message' => 'Password aggiornata con successo'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => 'Errore durante l\'aggiornamento della password'
            ], 500);
        }
    }
}