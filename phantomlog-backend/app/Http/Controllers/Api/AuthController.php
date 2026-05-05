<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $data = $request->validate([
            'dni'        => ['required', 'string', 'unique:users', 'regex:/^[0-9]{8}[A-Z]$/i'],
            'username'   => 'required|string|min:4|max:30|unique:users',
            'firstname'  => ['required', 'string', 'max:50', 'regex:/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/'],
            'lastname'   => ['required', 'string', 'max:50', 'regex:/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/'],
            'email'      => 'required|email|unique:users',
            'password'   => 'required|string|min:8|confirmed',
            'address'    => ['nullable', 'string', 'max:255', 'regex:/^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s,.\-\/ºª]+$/'],
            'postalCode' => 'nullable|numeric|digits:5',
        ], [
            'dni.required' => 'El DNI es obligatorio.',
            'dni.unique' => 'Este DNI ya está registrado.',
            'dni.regex' => 'El DNI debe tener 8 números y una letra.',
            'username.required' => 'El nombre de usuario es obligatorio.',
            'username.unique' => 'Este nombre de usuario ya existe.',
            'firstname.required' => 'El nombre es obligatorio.',
            'firstname.regex' => 'El nombre no puede contener números ni caracteres especiales.',
            'lastname.required' => 'Los apellidos son obligatorios.',
            'lastname.regex' => 'Los apellidos no pueden contener números ni caracteres especiales.',
            'email.required' => 'El correo electrónico es obligatorio.',
            'email.email' => 'Introduce un formato de correo válido.',
            'email.unique' => 'Este correo ya está registrado.',
            'password.required' => 'La contraseña es obligatoria.',
            'password.min' => 'La contraseña debe tener al menos 8 caracteres.',
            'password.confirmed' => 'Las contraseñas no coinciden.',
            'postalCode.numeric' => 'El código postal debe ser únicamente numérico.',
            'postalCode.digits' => 'El código postal debe tener exactamente 5 dígitos.',
            'address.regex' => 'La dirección contiene caracteres no permitidos.',
        ]);

        // Sanitización manual
        foreach ($data as $key => $value) {
            if (is_string($value) && $key !== 'password') {
                $data[$key] = trim(strip_tags($value));
            }
        }

        $user = User::create([
            ...$data,
            'password' => Hash::make($data['password']),
        ]);

        $token = $user->createToken('api-token')->plainTextToken;

        return response()->json(['token' => $token, 'user' => $user], 201);
    }

    public function login(Request $request)
    {
        $request->validate([
            'email'    => 'required|email',
            'password' => 'required',
        ]);

        if (!Auth::attempt($request->only('email', 'password'))) {
            return response()->json(['message' => 'Credenciales incorrectas'], 401);
        }

        $token = $request->user()->createToken('api-token')->plainTextToken;

        return response()->json(['token' => $token, 'user' => $request->user()]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json(['message' => 'Sesión cerrada']);
    }

    public function me(Request $request)
    {
        return response()->json($request->user());
    }

    public function update(Request $request)
    {
        $user = $request->user();

        $data = $request->validate([
            'username'   => 'sometimes|string|min:4|max:30|unique:users,username,' . $user->id,
            'firstname'  => ['sometimes', 'string', 'max:50', 'regex:/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/'],
            'lastname'   => ['sometimes', 'string', 'max:50', 'regex:/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/'],
            'dni'        => ['sometimes', 'string', 'unique:users,dni,' . $user->id, 'regex:/^[0-9]{8}[A-Z]$/i'],
            'address'    => ['sometimes', 'string', 'max:255', 'regex:/^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s,.\-\/ºª]+$/'],
            'postalCode' => 'sometimes|numeric|digits:5',
            'img'        => ['sometimes', 'string', 'regex:/^data:image\/(jpeg|png|webp|jpg);base64,/'], 
        ], [
            'firstname.regex' => 'El nombre no puede contener números ni símbolos.',
            'lastname.regex' => 'Los apellidos no pueden contener números ni símbolos.',
            'dni.regex' => 'El DNI debe tener 8 números y una letra.',
            'postalCode.numeric' => 'El código postal debe ser numérico.',
            'postalCode.digits' => 'El código postal debe tener 5 dígitos.',
            'img.regex' => 'El archivo seleccionado no es una imagen válida (JPG, PNG, WEBP).',
        ]);

        foreach ($data as $key => $value) {
            if (is_string($value) && $key !== 'password') {
                $data[$key] = trim(strip_tags($value));
            }
        }

        if ($request->has('password') && $request->password) {
            $request->validate(['password' => 'string|min:8|confirmed']);
            $data['password'] = Hash::make($request->password);
        }

        $user->update($data);

        return response()->json($user);
    }
}