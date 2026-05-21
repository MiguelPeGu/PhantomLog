<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Models\Report;
use App\Models\ReportVote;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

final class ReportVoteController
{
    public function vote(Request $request, string $reportId): JsonResponse
    {
        $request->validate([
            'value' => ['required', 'integer', 'in:1,-1'],
        ]);

        $existingVote = ReportVote::query()->where('report_id', $reportId)
            ->where('user_id', Auth::id())
            ->first();

        if ($existingVote && $existingVote->value === $request->value) {
            $existingVote->delete();
            $newValue = 0;
            $message = 'Voto retirado';
        } else {
            $vote = ReportVote::query()->updateOrCreate(['report_id' => $reportId, 'user_id' => Auth::id()], ['value' => $request->value]);
            $newValue = $vote->value;
            $message = 'Voto registrado';
        }

        $report = Report::query()->withCount('votes')->findOrFail($reportId);

        return response()->json([
            'message' => $message,
            'score' => $report->score,
            'votes_count' => $report->votes_count,
            'user_vote' => $newValue,
        ]);
    }

    public function getVote(Request $request, string $reportId): JsonResponse
    {
        $vote = ReportVote::query()->where('report_id', $reportId)
            ->where('user_id', Auth::id())
            ->first();

        return response()->json([
            'user_vote' => $vote ? $vote->value : 0,
        ]);
    }
}
