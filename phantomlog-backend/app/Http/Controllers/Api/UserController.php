<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Models\User;
use Illuminate\Database\Eloquent\Relations\Relation;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

final class UserController
{
    public function me(Request $request): JsonResponse
    {
        $user = $request->user();
        assert($user instanceof User);

        $user->load([
            'forums' => function (Relation $query): void {
                $query->getQuery()->latest();
            },
            'createdExpeditions' => function (Relation $query): void {
                $query->getQuery()->latest();
            },
            'joinedExpeditions' => function (Relation $query): void {
                $query->getQuery()->latest();
            },
            'invoices' => function (Relation $query): void {
                $query->getQuery()->with('details')->latest();
            },
        ]);

        return response()->json($user);
    }

    public function update(Request $request): JsonResponse
    {
        $user = $request->user();
        assert($user instanceof User);

        /** @var array<string, mixed> $data */
        $data = $request->validate([
            'username' => ['sometimes', 'string', 'min:4', 'max:30', 'unique:users,username,'.$user->id],
            'firstname' => ['sometimes', 'string', 'max:50', 'regex:/^[a-zA-Z\s]+$/'],
            'lastname' => ['sometimes', 'string', 'max:50', 'regex:/^[a-zA-Z\s]+$/'],
            'dni' => ['sometimes', 'string', 'unique:users,dni,'.$user->id, 'regex:/^[0-9]{8}[A-Z]$/i'],
            'address' => ['sometimes', 'string', 'max:255', 'regex:/^[a-zA-Z0-9\s,.\-\/]+$/'],
            'postalCode' => ['sometimes', 'numeric', 'digits:5'],
            'img' => ['sometimes', 'string'],
        ], [
            'firstname.regex' => 'El nombre no puede contener nmeros ni smbolos.',
            'lastname.regex' => 'Los apellidos no pueden contener nmeros ni smbolos.',
            'dni.regex' => 'El DNI debe tener 8 nmeros y una letra.',
            'postalCode.numeric' => 'El cdigo postal debe ser numrico.',
            'postalCode.digits' => 'El cdigo postal debe tener 5 dgitos.',
        ]);

        $imgInput = $request->input('img');
        if (is_string($imgInput) && $imgInput !== '' && str_starts_with($imgInput, 'data:image/') && ! preg_match('/^data:image\/(jpeg|png|webp|jpg);base64,/', $imgInput)) {
            return response()->json([
                'message' => 'El archivo seleccionado no es una imagen vlida (JPG, PNG, WEBP).',
                'errors' => ['img' => ['Formato de imagen no soportado.']],
            ], 422);
        }

        foreach ($data as $key => $value) {
            if (is_string($value) && $key !== 'password' && $key !== 'img') {
                $data[$key] = mb_trim(strip_tags($value));
            }
        }

        if ($request->has('password') && $request->password) {
            $request->validate(['password' => ['string', 'min:8', 'confirmed']], [
                'password.min' => 'La contrasea debe tener al menos 8 caracteres.',
                'password.confirmed' => 'Las contraseas no coinciden.',
            ]);
            $data['password'] = Hash::make((string) ($request->string('password')));
        }

        $user->update($data);

        $user->load([
            'forums' => function (Relation $query): void {
                $query->getQuery()->latest();
            },
            'createdExpeditions' => function (Relation $query): void {
                $query->getQuery()->latest();
            },
            'joinedExpeditions' => function (Relation $query): void {
                $query->getQuery()->latest();
            },
            'invoices' => function (Relation $query): void {
                $query->getQuery()->with('details')->latest();
            },
        ]);

        return response()->json($user);
    }
}
