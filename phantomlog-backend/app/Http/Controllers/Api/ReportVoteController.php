<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Models\Report;
use App\Models\ReportVote;
use Illuminate\Support\Facades\Auth;

class ReportVoteController extends Controller
{
    public function vote(Request $request, $reportId)
    {
        $request->validate([
            'value' => 'required|integer|in:1,-1',
        ]);

        $existingVote = ReportVote::where('report_id', $reportId)
            ->where('user_id', Auth::id())
            ->first();

        if ($existingVote && $existingVote->value == $request->value) {
            $existingVote->delete();
            $newValue = 0;
            $message = 'Voto retirado';
        } else {
            $vote = ReportVote::updateOrCreate(
                ['report_id' => $reportId, 'user_id' => Auth::id()],
                ['value' => $request->value]
            );
            $newValue = $vote->value;
            $message = 'Voto registrado';
        }

        $report = Report::find($reportId);
        
        return response()->json([
            'message' => $message,
            'score' => $report->score,
            'votes_count' => $report->votes_count,
            'user_vote' => $newValue
        ]);
    }

    public function getVote(Request $request, $reportId)
    {
        $vote = ReportVote::where('report_id', $reportId)
            ->where('user_id', Auth::id())
            ->first();

        return response()->json([
            'user_vote' => $vote ? $vote->value : 0
        ]);
    }
}
