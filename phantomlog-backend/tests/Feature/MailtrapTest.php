<?php

declare(strict_types=1);

use App\Mail\InvoicePaid;
use App\Models\Product;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Mail;

use function Pest\Laravel\withHeader;

uses(RefreshDatabase::class);

function actingAsApiUserForMail(): User
{
    $user = User::factory()->create(['role' => 'user']);
    $token = $user->createToken('test')->plainTextToken;
    withHeader('Authorization', 'Bearer '.$token);

    return $user;
}

it('sends invoice email when creating invoice (mailtrap flow)', function (): void {
    Mail::fake();
    $user = actingAsApiUserForMail();
    $product = Product::factory()->create([
        'stock' => 10,
        'price' => 100,
        'tax' => 21,
    ]);

    $response = $this->postJson('/api/invoices', [
        'dni' => '12345678A',
        'first_name' => 'Test',
        'last_name' => 'Buyer',
        'mobile' => '600123123',
        'address' => 'Calle Principal 123',
        'postal_code' => '28001',
        'payment_method' => 'bizum',
        'items' => [
            [
                'product_id' => $product->id,
                'quantity' => 1,
            ],
        ],
    ]);

    $response->assertStatus(201);

    Mail::assertSent(InvoicePaid::class, fn (InvoicePaid $mail): bool => $mail->hasTo($user->email) && $mail->invoice->user_id === $user->id);
});
