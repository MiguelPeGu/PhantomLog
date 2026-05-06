<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

use Carbon\CarbonInterface;

/**
 * @property-read int $id
 * @property-read string $report_id
 * @property-read string $user_id
 * @property-read int $value
 * @property-read CarbonInterface $created_at
 * @property-read CarbonInterface $updated_at
 */
class ReportVote extends Model
{
    protected $fillable = [
        'report_id',
        'user_id',
        'value',
    ];

    protected static function booted()
    {
        static::created(function ($vote) {
            $vote->report->updateScore();
        });

        static::updated(function ($vote) {
            $vote->report->updateScore();
        });

        static::deleted(function ($vote) {
            $vote->report->updateScore();
        });
    }

    public function report()
    {
        return $this->belongsTo(Report::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
