<?php

namespace App\Http\Controllers;

use App\Models\DoctorComment;
use App\Models\DoctorComments;
use App\Models\SkinAnalysis;
use Illuminate\Http\Request;

class DoctorCommentsController extends Controller
{
    public function menambahkanKomentar(int $id, Request $request)
    {
        $skinAnalysisResult = SkinAnalysis::find($id);

        if ($skinAnalysisResult) {
            $comment = new DoctorComments();
            $comment->skin_analysis_result_id = $id;
            $comment->doctor_id = $request->input('userId');
            $comment->comment = $request->input('comment');
            $comment->created_at = date('Y-m-d H:i:s');
            $comment->updated_at = date('Y-m-d H:i:s');
            $comment->save();

            return response()->json(['message' => 'Berhasil menambahkan komentar'], 200);
        }

        return response()->json(['message' => 'Skin analysis result not found'], 404);
    }

    public function getAllKomentarById(int $id)
    {
        $comments = DoctorComments::where('skin_analysis_result_id', $id)->get();

        return response()->json($comments);
    }
}
