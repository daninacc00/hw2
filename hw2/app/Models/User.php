<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class User extends Model
{
    protected $table = 'users';
    
    protected $fillable = [
        'username',
        'email', 
        'password_hash',
        'first_name',
        'last_name',
        'account_status'
    ];

    protected $hidden = [
        'password_hash',
    ];

    public function profile()
    {
        return $this->hasOne(UserProfile::class);
    }

    public function settings()
    {
        return $this->hasOne(UserSettings::class);
    }

    public function register($username, $email, $password, $nome, $cognome)
    {
        if ($this->isUserExist($username, $email)) {
            return ['success' => false, 'message' => 'Username o email già esistenti'];
        }

        $passwordHash = password_hash($password, PASSWORD_DEFAULT);

        $user = new User();
        $user->username = $username;
        $user->email = $email;
        $user->password_hash = $passwordHash;
        $user->first_name = $nome;
        $user->last_name = $cognome;

        if ($user->save()) {
            $user->profile()->create([]);
            $user->settings()->create([]);

            return ['success' => true, 'message' => 'Registrazione completata con successo'];
        } else {
            return ['success' => false, 'message' => 'Errore durante la registrazione'];
        }
    }

    public function authenticateUser($username, $password)
    {
        $user = User::where(function($query) use ($username) {
            $query->where('username', $username)
                  ->orWhere('email', $username);
        })
        ->where('account_status', 0)
        ->first();

        if ($user) {
            if (password_verify($password, $user->password_hash)) {
                $this->updateLastLogin($user->id);
                
                $userData = $user->toArray();
                unset($userData['password_hash']);

                return ['success' => true, 'utente' => $userData];
            } else {
                return ['success' => false, 'message' => 'Credenziali non valide'];
            }
        } else {
            return ['success' => false, 'message' => 'Credenziali non valide'];
        }
    }

    private function isUserExist($username, $email)
    {
        $count = User::where('username', $username)
                     ->orWhere('email', $email)
                     ->count();

        return $count > 0;
    }

    private function updateLastLogin($idUtente)
    {
        User::where('id', $idUtente)
            ->update(['last_login' => now()]);
    }
}