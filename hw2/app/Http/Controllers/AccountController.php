<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\UserProfile;
use App\Models\UserSettings;
use Illuminate\Http\Request;

class AccountController extends Controller
{
    public function index()
    {
        $user = User::with(['profile', 'settings'])->find(session('user_id'));

        return view('account.profile', ['user' => $user]);
    }

    // public function profile()
    // {
    //     $user = User::with('profile')->find(session('user')['id']);

    //     return view('account.profile', ['user' => $user]);
    // }

    // public function updateProfile(Request $request)
    // {
    //     $userId = session('user')['id'];
    //     $user = User::find($userId);

    //     $user->first_name = $request->input('first_name');
    //     $user->last_name = $request->input('last_name');
    //     $user->save();

    //     $profile = UserProfile::where('user_id', $userId)->first();
    //     if (!$profile) {
    //         $profile = new UserProfile();
    //         $profile->user_id = $userId;
    //     }

    //     $profile->phone = $request->input('phone');
    //     $profile->birth_date = $request->input('birth_date');
    //     $profile->save();

    //     return redirect('/account/profile')->with('success', 'Profilo aggiornato con successo');
    // }

    // public function settings()
    // {
    //     $user = User::with('settings')->find(session('user')['id']);

    //     return view('account.settings', ['user' => $user]);
    // }

    // public function updateSettings(Request $request)
    // {
    //     $userId = session('user')['id'];

    //     $settings = UserSettings::where('user_id', $userId)->first();
    //     if (!$settings) {
    //         $settings = new UserSettings();
    //         $settings->user_id = $userId;
    //     }

    //     $settings->newsletter_enabled = $request->has('newsletter_enabled');
    //     $settings->notifications_enabled = $request->has('notifications_enabled');
    //     $settings->save();

    //     return redirect('/account/settings')->with('success', 'Impostazioni aggiornate con successo');
    // }

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
}
