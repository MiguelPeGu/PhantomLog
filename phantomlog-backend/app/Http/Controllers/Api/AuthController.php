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
            'dni'        => 'required|string|unique:users',
            'username'   => 'required|string|unique:users',
            'firstname'  => 'required|string',
            'lastname'   => 'required|string',
            'email'      => 'required|email|unique:users',
            'password'   => 'required|string|min:8|confirmed',
            'address'    => 'nullable|string',
            'postalCode' => 'nullable|string',
        ]);

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
            'username'   => 'sometimes|string|unique:users,username,' . $user->id,
            'firstname'  => 'sometimes|string',
            'lastname'   => 'sometimes|string',
            'dni'        => 'sometimes|string|unique:users,dni,' . $user->id,
            'address'    => 'sometimes|string',
            'postalCode' => 'sometimes|string',
            'img'        => 'sometimes|string', 
        ]);

        if ($request->has('password') && $request->password) {
            $request->validate(['password' => 'string|min:8|confirmed']);
            $data['password'] = Hash::make($request->password);
        }

        $user->update($data);

        return response()->json($user);
    }
}