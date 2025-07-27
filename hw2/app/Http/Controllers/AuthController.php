<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class AuthController extends Controller
{
    public function showLogin()
    {
        if (session('user_id')) {
            return redirect('/');
        }
        
        return view('auth.login');
    }

    public function showRegister()
    {
        if (session('user_id')) {
            return redirect('/');
        }
        
        return view('auth.register');
    }

    public function login(Request $request)
    {    
        if ($request->isMethod('post')) {
            $username = $request->input('username');
            $password = $request->input('password');

            if (empty($username) || empty($password)) {
                return response()->json(['success' => false, 'message' => 'Username/Email e password sono obbligatori']);
            }

            $user = new User();
            $result = $user->authenticateUser($username, $password);

            if ($result['success']) {
                session(['user_id' => $result['utente']['id']]);
                session(['user_username' => $result['utente']['username']]);
                session(['user_email' => $result['utente']['email']]);
                session(['user_first_name' => $result['utente']['first_name']]);
                session(['user_last_name' => $result['utente']['last_name']]);
            }

            return response()->json($result);
        }

        return view('auth.login');
    }

    public function register(Request $request)
    {
        if ($request->isMethod('post')) {
            $username = $request->input('username');
            $email = $request->input('email');
            $password = $request->input('password');
            $nome = $request->input('nome');
            $cognome = $request->input('cognome');

            $requiredFields = ['username', 'email', 'password', 'nome', 'cognome'];
            foreach ($requiredFields as $field) {
                if (empty($request->input($field))) {
                    return response()->json(['success' => false, 'message' => "Il campo $field è obbligatorio"]);
                }
            }

            if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
                return response()->json(['success' => false, 'message' => 'Formato email non valido']);
            }

            if (!$this->validatePassword($password)) {
                return response()->json(['success' => false, 'message' => 'Password non valida']);
            }

            $user = new User();
            $result = $user->register($username, $email, $password, $nome, $cognome);

            return response()->json($result);
        }

        return view('auth.register');
    }

    public function logout()
    {
        session()->flush();
        return redirect('/login');
    }

    private function validatePassword($password)
    {
        if (strlen($password) < 8) {
            return false;
        }

        if (!preg_match('/[A-Z]/', $password)) {
            return false;
        }

        if (!preg_match('/[a-z]/', $password)) {
            return false;
        }

        if (!preg_match('/[0-9]/', $password)) {
            return false;
        }

        if (!preg_match('/[^A-Za-z0-9]/', $password)) {
            return false;
        }

        return true;
    }
}