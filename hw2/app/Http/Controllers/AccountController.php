<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\UserProfile;
use App\Models\UserSettings;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

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
        
        $email = $request->input('email');
        $first_name = $request->input('first_name');
        $last_name = $request->input('last_name');
        $phone = $request->input('phone');
        $birth_date = $request->input('birth_date');
        $newsletter_enabled = $request->input('newsletter_enabled');
        $notifications_enabled = $request->input('notifications_enabled');

        if (empty($email) || empty($first_name) || empty($last_name)) {
            return response()->json([
                'success' => false,
                'error' => 'Campi obbligatori mancanti'
            ], 400);
        }

        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            return response()->json([
                'success' => false,
                'error' => 'Formato email non valido'
            ], 400);
        }

        try {
            $user = User::find($userId);
            $user->email = $email;
            $user->first_name = $first_name;
            $user->last_name = $last_name;
            $user->save();

            $profile = UserProfile::where('user_id', $userId)->first();
            if (!$profile) {
                $profile = new UserProfile();
                $profile->user_id = $userId;
            }
            
            $profile->phone = $phone;
            $profile->birth_date = $birth_date;
            $profile->save();

            $settings = UserSettings::where('user_id', $userId)->first();
            if (!$settings) {
                $settings = new UserSettings();
                $settings->user_id = $userId;
            }
            
            $settings->newsletter_enabled = $newsletter_enabled;
            $settings->notifications_enabled = $notifications_enabled;
            $settings->save();

            return response()->json([
                'success' => true,
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
        
        $current_password = $request->input('current_password');
        $new_password = $request->input('new_password');
        $confirm_password = $request->input('confirm_password');

        if (empty($current_password) || empty($new_password) || empty($confirm_password)) {
            return response()->json([
                'success' => false,
                'error' => 'Tutti i campi sono obbligatori'
            ], 400);
        }

        if ($new_password !== $confirm_password) {
            return response()->json([
                'success' => false,
                'error' => 'Le password non corrispondono'
            ], 400);
        }

        try {
            $user = User::find($userId);
            
            if (!password_verify($current_password, $user->password_hash)) {
                return response()->json([
                    'success' => false,
                    'error' => 'Password attuale non corretta'
                ], 400);
            }

            $user->password_hash = password_hash($new_password, PASSWORD_DEFAULT);
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