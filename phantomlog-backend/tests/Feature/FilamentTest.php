<?php

declare(strict_types=1);

use App\Filament\Resources\Expeditions\ExpeditionResource;
use App\Filament\Resources\Forums\ForumResource;
use App\Filament\Resources\Invoices\InvoiceResource;
use App\Filament\Resources\Phantoms\PhantomResource;
use App\Filament\Resources\Products\ProductResource;
use App\Filament\Resources\Users\Pages\ListUsers;
use App\Filament\Resources\Users\UserResource;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Livewire\Livewire;

uses(RefreshDatabase::class);

// ─── PANEL ACCESS ────────────────────────────────────────────────────────────

describe('Filament Panel Access', function (): void {

    test('admin can access the admin panel', function (): void {
        $admin = User::factory()->create(['role' => 'admin']);
        $this->actingAs($admin)
            ->get('/admin')
            ->assertOk();
    });

    test('regular user is redirected from admin panel', function (): void {
        $user = User::factory()->create(['role' => 'user']);
        $this->actingAs($user)
            ->get('/admin')
            ->assertRedirect();
    });

    test('guest cannot access admin panel', function (): void {
        $this->get('/admin')->assertRedirect('/admin/login');
    });

});

// ─── NAVIGATION GROUPS ───────────────────────────────────────────────────────

describe('Filament Navigation Groups', function (): void {

    test('UserResource is in Gestion de Usuarios group', function (): void {
        expect(UserResource::getNavigationGroup())->toBe('Gestion de Usuarios');
    });

    test('ForumResource is in Comunidad group', function (): void {
        expect(ForumResource::getNavigationGroup())->toBe('Comunidad');
    });

    test('ExpeditionResource is in Operaciones de Campo group', function (): void {
        expect(ExpeditionResource::getNavigationGroup())->toBe('Operaciones de Campo');
    });

    test('ProductResource is in Tienda group', function (): void {
        expect(ProductResource::getNavigationGroup())->toBe('Tienda');
    });

    test('InvoiceResource is in Tienda group', function (): void {
        expect(InvoiceResource::getNavigationGroup())->toBe('Tienda');
    });

    test('PhantomResource is in Operaciones de Campo group', function (): void {
        expect(PhantomResource::getNavigationGroup())->toBe('Operaciones de Campo');
    });

});

// ─── RESOURCE LABELS ─────────────────────────────────────────────────────────

describe('Filament Resource Labels', function (): void {

    test('UserResource has correct model label', function (): void {
        expect(UserResource::getModelLabel())->toBe('Usuario');
        expect(UserResource::getPluralModelLabel())->toBe('Usuarios');
    });

    test('ForumResource has correct model label', function (): void {
        expect(ForumResource::getModelLabel())->toBe('Foro');
    });

    test('ProductResource has correct model label', function (): void {
        expect(ProductResource::getModelLabel())->toBe('Producto');
    });

});

// ─── USER LIST TABLE ─────────────────────────────────────────────────────────

describe('Filament User Resource Table', function (): void {

    test('admin can see the users list table', function (): void {
        $admin = User::factory()->create(['role' => 'admin']);
        User::factory()->count(5)->create();

        Livewire::actingAs($admin)
            ->test(ListUsers::class)
            ->assertCanSeeTableRecords(User::all());
    });

    test('admin can search users by username', function (): void {
        $admin = User::factory()->create(['role' => 'admin', 'username' => 'admin_user']);
        $target = User::factory()->create(['username' => 'findme_user']);
        User::factory()->create(['username' => 'other_user']);

        Livewire::actingAs($admin)
            ->test(ListUsers::class)
            ->searchTable('findme')
            ->assertCanSeeTableRecords([$target])
            ->assertCanNotSeeTableRecords(User::query()->where('username', 'other_user')->get());
    });

    test('admin can delete a user from Filament', function (): void {
        $admin = User::factory()->create(['role' => 'admin']);
        $target = User::factory()->create();

        Livewire::actingAs($admin)
            ->test(ListUsers::class)
            ->callTableAction('delete', $target);

        $this->assertDatabaseMissing('users', ['id' => $target->id]);
    });

});
