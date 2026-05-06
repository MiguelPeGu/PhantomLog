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
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Override;

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
 * @property-read string $role
 * @property-read CarbonInterface|null $email_verified_at
 * @property-read string $password
 * @property-read string|null $remember_token
 * @property-read CarbonInterface $created_at
 * @property-read CarbonInterface $updated_at
 */
final class User extends Authenticatable implements FilamentUser, HasName, MustVerifyEmail
{
    use HasApiTokens;

    /** @use HasFactory<UserFactory> */
    use HasFactory;

    use HasUuids;
    use Notifiable;

    /**
     * @var list<string>
     */
    #[Override]
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
        'password',
        'role',
    ];

    /**
     * @var list<string>
     */
    #[Override]
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
            'role' => 'string',
            'remember_token' => 'string',
            'created_at' => 'datetime',
            'updated_at' => 'datetime',
        ];
    }

    /** @return HasMany<Forum, $this> */
    public function forums(): HasMany
    {
        return $this->hasMany(Forum::class);
    }

    /** @return HasMany<Expedition, $this> */
    public function createdExpeditions(): HasMany
    {
        return $this->hasMany(Expedition::class);
    }

    /** @return HasMany<Report, $this> */
    public function reports(): HasMany
    {
        return $this->hasMany(Report::class);
    }

    /** @return HasMany<Comment, $this> */
    public function comments(): HasMany
    {
        return $this->hasMany(Comment::class);
    }

    /** @return HasMany<Invoice, $this> */
    public function invoices(): HasMany
    {
        return $this->hasMany(Invoice::class);
    }

    /** @return BelongsToMany<Forum, $this> */
    public function followedForums(): BelongsToMany
    {
        return $this->belongsToMany(Forum::class, 'followers');
    }

    public function canAccessPanel(Panel $panel): bool
    {
        return $this->role === 'admin';
    }

    public function getFilamentName(): string
    {
        return sprintf('%s %s', $this->firstname, $this->lastname);
    }

    /** @return BelongsToMany<Expedition, $this> */
    public function joinedExpeditions(): BelongsToMany
    {
        return $this->belongsToMany(Expedition::class, 'enrollment');
    }

    protected function getImgAttribute(?string $value): string
    {
        if ($value) {
            return $value;
        }

        return 'https://api.dicebear.com/9.x/lorelei/svg?seed='.urlencode($this->username);
    }
}
