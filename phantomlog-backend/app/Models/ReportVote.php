<?php

declare(strict_types=1);

namespace App\Models;

use Carbon\CarbonInterface;
use Database\Factories\ReportVoteFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
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
    /** @use HasFactory<ReportVoteFactory> */
    use HasFactory;

    #[Override]
    protected $fillable = [
        'report_id',
        'user_id',
        'value',
    ];

    /** @return BelongsTo<Report, $this> */
    public function report(): BelongsTo
    {
        return $this->belongsTo(Report::class);
    }

    /** @return BelongsTo<User, $this> */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    protected static function booted(): void
    {
        self::created(function (ReportVote $vote): void {
            $report = $vote->report;
            if ($report instanceof Report) {
                $report->updateScore();
            }
        });

        self::updated(function (ReportVote $vote): void {
            $report = $vote->report;
            if ($report instanceof Report) {
                $report->updateScore();
            }
        });

        self::deleted(function (ReportVote $vote): void {
            $report = $vote->report;
            if ($report instanceof Report) {
                $report->updateScore();
            }
        });
    }
}
