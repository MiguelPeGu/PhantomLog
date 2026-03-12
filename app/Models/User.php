<?php

declare(strict_types=1);

namespace App\Models;

use Carbon\CarbonInterface;
use Database\Factories\UserFactory;
use Filament\Models\Contracts\FilamentUser;
use Filament\Models\Contracts\HasName;
use Filament\Panel;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

/**
 * @property-read string $id
 * @property-read string $dni
 * @property-read string $username
 * @property-read string $img
 * @property-read string $firstname
 * @property-read string $lastname
 * @property-read string $address
 * @property-read string $postalCode
 * @property-read string $email
 * @property-read CarbonInterface|null $email_verified_at
 * @property-read string $password
 * @property-read string|null $remember_token
 * @property-read CarbonInterface $created_at
 * @property-read CarbonInterface $updated_at
 */
final class User extends Authenticatable implements FilamentUser, HasName, MustVerifyEmail
{
    /** @use HasFactory<UserFactory> */
    use HasFactory;

    use HasUuids;
    use Notifiable;

    /**
     * @var list<string>
     */
    protected $fillable = [
        'id',
        'dni',
        'username',
        'img',
        'firstname',
        'lastname',
        'email',
        'address',
        'postalCode',
        'email',
    ];

    /**
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * @return array<string, string>
     */
    public function casts(): array
    {
        return [
            'id' => 'string',
            'dni' => 'string',
            'username' => 'string',
            'img' => 'string',
            'firstname' => 'string',
            'lastname' => 'string',
            'address' => 'string',
            'postalCode' => 'string',
            'email' => 'string',
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'remember_token' => 'string',
            'created_at' => 'datetime',
            'updated_at' => 'datetime',
        ];
    }

    public function forums()
    {
        return $this->hasMany(Forum::class);
    }

    public function createdExpeditions()
    {
        return $this->hasMany(Expedition::class);
    }

    public function reports()
    {
        return $this->hasMany(Report::class);
    }

    public function comments()
    {
        return $this->hasMany(Comment::class);
    }

    public function invoices()
    {
        return $this->hasMany(Invoice::class);
    }

    public function followedForums()
    {
        return $this->belongsToMany(Forum::class, 'followers');
    }

    public function canAccessPanel(Panel $panel): bool
    {
        return true;
    }

    public function getFilamentName(): string
    {
        return "{$this->firstname} {$this->lastname}";
    }

    public function joinedExpeditions()
    {
        return $this->belongsToMany(Expedition::class, 'enrollment');
    }
}
