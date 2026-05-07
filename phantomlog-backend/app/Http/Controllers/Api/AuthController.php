<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

final class AuthController
{
    public function register(Request $request): JsonResponse
    {
        /** @var array<string, mixed> $data */
        $data = $request->validate([
            'dni' => ['required', 'string', 'unique:users', 'regex:/^[0-9]{8}[A-Z]$/i'],
            'username' => ['required', 'string', 'min:4', 'max:30', 'unique:users'],
            'firstname' => ['required', 'string', 'max:50', 'regex:/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/'],
            'lastname' => ['required', 'string', 'max:50', 'regex:/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/'],
            'email' => ['required', 'email', 'unique:users'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
            'password.confirmed' => ['Las contraseñas no coinciden.'],
            'address' => ['nullable', 'string', 'max:255', 'regex:/^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s,.\-\/ºª]+$/'],
            'postalCode' => ['nullable', 'numeric', 'digits:5'],
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
            'postalCode.numeric' => 'El código postal debe ser únicamente numérico.',
            'postalCode.digits' => 'El código postal debe tener exactamente 5 dígitos.',
            'address.regex' => 'La dirección contiene caracteres no permitidos.',
        ]);

        foreach ($data as $key => $value) {
            if (is_string($value) && $key !== 'password') {
                $data[$key] = mb_trim(strip_tags($value));
            }
        }

        $user = User::query()->create([
            ...$data,
            'password' => Hash::make(is_string($data['password']) ? $data['password'] : ''), // fixed: línea 57
        ]);

        $token = $user->createToken('api-token')->plainTextToken;

        return response()->json(['token' => $token, 'user' => $user], 201);
    }

    public function login(Request $request): JsonResponse
    {
        $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required'],
        ]);

        $user = User::query()->where('email', $request->email)->first();

        if (! $user) {
            return response()->json([
                'message' => 'Usuario no encontrado.',
                'errors' => ['email' => ['No existe ninguna cuenta asociada a este correo electrónico.']],
            ], 404);
        }

        if (! Auth::attempt($request->only('email', 'password'))) {
            return response()->json([
                'message' => 'Credenciales incorrectas.',
                'errors' => ['password' => ['La contraseña introducida es incorrecta.']],
            ], 401);
        }

        $token = $user->createToken('api-token')->plainTextToken;

        return response()->json(['token' => $token, 'user' => $user]);
    }

    public function logout(Request $request): JsonResponse
    {
        $user = $request->user();
        assert($user instanceof User);
        $user->currentAccessToken()->delete();

        return response()->json(['message' => 'Sesión cerrada']);
    }
}
