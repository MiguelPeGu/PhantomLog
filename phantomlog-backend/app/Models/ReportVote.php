<?php

declare(strict_types=1);

namespace App\Models;

use Carbon\CarbonInterface;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Override;

/**
 * @property-read int $id
 * @property-read string $report_id
 * @property-read string $user_id
 * @property-read int $value
 * @property-read CarbonInterface $created_at
 * @property-read CarbonInterface $updated_at
 */
final class ReportVote extends Model
{
    use HasFactory;
    use HasFactory;

    #[Override]
    protected $fillable = [
        'report_id',
        'user_id',
        'value',
    ];

    public function report()
    {
        return $this->belongsTo(Report::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    protected static function booted()
    {
        self::created(function ($vote): void {
            $vote->report->updateScore();
        });

        self::updated(function ($vote): void {
            $vote->report->updateScore();
        });

        self::deleted(function ($vote): void {
            $vote->report->updateScore();
        });
    }
}
