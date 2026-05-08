<?php

declare(strict_types=1);

use App\Models\Expedition;
use App\Models\Forum;
use App\Models\Phantom;
use App\Models\Product;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

use function Pest\Laravel\withHeader;

uses(RefreshDatabase::class);

// ─── HELPERS ────────────────────────────────────────────────────────────────

function actingAsUser(): User
{
    $user = User::factory()->create(['role' => 'user']);
    $token = $user->createToken('test')->plainTextToken;
    withHeader('Authorization', 'Bearer '.$token);

    return $user;
}

function actingAsAdmin(): User
{
    $user = User::factory()->create(['role' => 'admin']);
    $token = $user->createToken('test')->plainTextToken;
    withHeader('Authorization', 'Bearer '.$token);

    return $user;
}

// ─── AUTH ────────────────────────────────────────────────────────────────────

describe('Auth API', function (): void {

    test('user can register with valid data', function (): void {
        $res = $this->postJson('/api/register', [
            'username' => 'testuser',
            'email' => 'test@example.com',
            'password' => 'Password123!',
            'password_confirmation' => 'Password123!',
            'firstname' => 'Test',
            'lastname' => 'User',
            'dni' => '12345678A',
            'address' => 'Calle Mayor 1',
            'postalCode' => '28001',
        ]);
        $res->assertStatus(201)
            ->assertJsonStructure(['token', 'user' => ['id', 'username', 'email']]);
    });

    test('register fails with duplicate email', function (): void {
        User::factory()->create(['email' => 'dup@example.com']);
        $this->postJson('/api/register', [
            'username' => 'newuser',
            'email' => 'dup@example.com',
            'password' => 'Password123!',
            'password_confirmation' => 'Password123!',
            'firstname' => 'Dup',
            'lastname' => 'User',
            'dni' => '99999999Z',
            'address' => 'Calle Otra 2',
            'postalCode' => '28002',
        ])->assertStatus(422);
    });

    test('user can login with correct credentials', function (): void {
        $user = User::factory()->create(['password' => bcrypt('secret123')]);
        $this->postJson('/api/login', [
            'email' => $user->email,
            'password' => 'secret123',
        ])->assertOk()->assertJsonStructure(['token', 'user']);
    });

    test('login fails with wrong password', function (): void {
        $user = User::factory()->create(['password' => bcrypt('correct')]);
        $this->postJson('/api/login', [
            'email' => $user->email,
            'password' => 'wrong',
        ])->assertStatus(401);
    });

    test('authenticated user can fetch own profile with relations', function (): void {
        $user = actingAsUser();
        $this->getJson('/api/user')
            ->assertOk()
            ->assertJsonStructure(['id', 'username', 'forums', 'invoices', 'created_expeditions']);
    });

    test('unauthenticated request to /api/user returns 401', function (): void {
        $this->getJson('/api/user')->assertStatus(401);
    });

    test('authenticated user can update profile', function (): void {
        $user = actingAsUser();
        $this->putJson('/api/user', ['username' => 'updated_name'])
            ->assertOk()
            ->assertJsonPath('username', 'updated_name');
    });

});

// ─── FORUMS ──────────────────────────────────────────────────────────────────

describe('Forums API', function (): void {

    test('anyone can list forums', function (): void {
        Forum::factory()->count(3)->create();
        actingAsUser();
        $this->getJson('/api/forums')
            ->assertOk()
            ->assertJsonStructure(['data']);
    });

    test('authenticated user can create a forum', function (): void {
        actingAsUser();
        $this->postJson('/api/forums', [
            'title' => 'Test Forum',
            'description' => 'Some content here',
            'image' => 'data:image/png;base64,'.base64_encode('fake-image'),
        ])->assertStatus(201)
            ->assertJsonPath('title', 'Test Forum');
    });

    test('forum creation fails without title', function (): void {
        actingAsUser();
        $this->postJson('/api/forums', ['description' => 'No title'])
            ->assertStatus(422);
    });

    test('owner can update their forum', function (): void {
        $user = actingAsUser();
        $forum = Forum::factory()->create(['user_id' => $user->id]);
        $this->putJson('/api/forums/'.$forum->id, ['title' => 'Updated Title'])
            ->assertOk()
            ->assertJsonPath('title', 'Updated Title');
    });

    test('non-owner cannot update forum', function (): void {
        actingAsUser();
        $other = User::factory()->create();
        $forum = Forum::factory()->create(['user_id' => $other->id]);
        $this->putJson('/api/forums/'.$forum->id, ['title' => 'Hack'])
            ->assertStatus(403);
    });

    test('owner can delete their forum', function (): void {
        $user = actingAsUser();
        $forum = Forum::factory()->create(['user_id' => $user->id]);
        $this->deleteJson('/api/forums/'.$forum->id)->assertStatus(204);
        $this->assertDatabaseMissing('forums', ['id' => $forum->id]);
    });

});

// ─── EXPEDITIONS ─────────────────────────────────────────────────────────────

describe('Expeditions API', function (): void {

    test('anyone can list expeditions', function (): void {
        actingAsUser();
        $this->getJson('/api/expeditions')->assertOk()->assertJsonStructure(['data']);
    });

    test('authenticated user can create an expedition', function (): void {
        $phantom = Phantom::factory()->create();
        actingAsUser();
        $this->postJson('/api/expeditions', [
            'name' => 'Ghost Hunt',
            'description' => 'We will find them',
            'location' => 'Abandoned Asylum',
            'date' => now()->addDays(10)->toDateTimeString(),
            'phantom_id' => $phantom->id,
        ])->assertStatus(201);
    });

    test('user can join and leave an expedition', function (): void {
        $user = actingAsUser();
        $owner = User::factory()->create();
        $expedition = Expedition::factory()->create([
            'user_id' => $owner->id,
            'date' => now()->addDays(3),
        ]);

        $this->postJson(sprintf('/api/expeditions/%s/join', $expedition->id))
            ->assertOk();
        $this->assertDatabaseHas('enrollment', [
            'user_id' => $user->id,
            'expedition_id' => $expedition->id,
        ]);

        $this->postJson(sprintf('/api/expeditions/%s/join', $expedition->id))
            ->assertOk();
        $this->assertDatabaseMissing('enrollment', [
            'user_id' => $user->id,
            'expedition_id' => $expedition->id,
        ]);
    });

});

// ─── PRODUCTS & CART ─────────────────────────────────────────────────────────

describe('Products API', function (): void {

    test('anyone can list products', function (): void {
        Product::factory()->count(3)->create();
        actingAsUser();
        $this->getJson('/api/products')->assertOk()->assertJsonStructure(['data']);
    });

    test('product search filter works', function (): void {
        Product::factory()->create([
            'title' => 'Ghost Detector Pro',
            'provider' => 'Arcane Industries',
            'sku' => 'PL-AAAA-1111',
        ]);
        Product::factory()->create([
            'title' => 'Thermal Camera',
            'provider' => 'Specter Tech',
            'sku' => 'PL-BBBB-2222',
        ]);
        actingAsUser();
        $this->getJson('/api/products?search=Ghost')
            ->assertOk()
            ->assertJsonCount(1, 'data');
    });

    test('authenticated user can add product to cart', function (): void {
        $product = Product::factory()->create(['stock' => 5]);
        actingAsUser();
        $this->postJson('/api/cart/add/'.$product->id, [
            'quantity' => 2,
        ])->assertOk();
    });

    test('cannot add out-of-stock product to cart', function (): void {
        $product = Product::factory()->create(['stock' => 0]);
        actingAsUser();
        $this->postJson('/api/cart/add/'.$product->id, [
            'quantity' => 1,
        ])->assertStatus(422);
    });

});

// ─── PHANTOMS ────────────────────────────────────────────────────────────────

describe('Phantoms API', function (): void {

    test('anyone can list phantoms', function (): void {
        Phantom::factory()->count(3)->create();
        actingAsUser();
        $this->getJson('/api/phantoms')->assertOk();
    });

    test('admin can create a phantom', function (): void {
        actingAsAdmin();
        $this->postJson('/api/phantoms', [
            'name' => 'Shadow Entity',
            'type' => 'Shadow',
            'evidence' => 'EMF, Spirit Box',
            'danger_level' => 'High',
            'description' => 'Very dangerous entity',
        ])->assertStatus(201);
    });

    test('regular user cannot create a phantom', function (): void {
        actingAsUser();
        $this->postJson('/api/phantoms', [
            'name' => 'Hacked Ghost',
            'type' => 'Unknown',
        ])->assertStatus(403);
    });

});
