<?php

namespace App\Http\Controllers;

use App\Models\SkinAnalysis;
use App\Models\Verifications;
use Illuminate\Http\Request;

class VerificationsController extends Controller
{
    public function getPasienVerificationListByID($id)
    {
        $verifications = Verifications::where('user_id', $id)
            ->with(['skinAnalysis', 'doctor'])
            ->get();

        return response()->json($verifications);
    }

    public function getVerificationBySkinAnalysisID($id)
    {
        $verification = Verifications::where('skin_analysis_id', $id)
            ->with(['skinAnalysis', 'doctor', 'user'])
            ->first();

        if (!$verification) {
            return response()->json(['message' => 'Verification not found'], 404);
        }

        return response()->json($verification);
    }

    public function getPengajuanUmum()
    {
        $verifications = Verifications::where('verified', 0)
            ->whereNull('doctor_id')
            ->with('skinAnalysis', 'user')
            ->get();

        return response()->json($verifications);
    }


    public function verifikasi(int $id, Request $request)
    {
        $verif = Verifications::where('skin_analysis_id', $id)->first();
        $skinAnalysis = SkinAnalysis::find($id);

        if (!$skinAnalysis) {
            return response()->json(['message' => 'Skin analysis not found'], 404);
        }

        if ($verif) {
            $verif->verified = true;
            $verif->verified_melanoma = $request->input('verifiedMelanoma');
            $verif->verification_date = date('Y-m-d H:i:s');
            $verif->doctor_id = $request->input('doctor_id');
            $verif->save();

            $skinAnalysis->verified = true;
            $skinAnalysis->verified_by = $verif->doctor_id;
            $skinAnalysis->catatanDokter = $request->input('catatanDokter');
            $skinAnalysis->verification_date = date('Y-m-d H:i:s');
            $skinAnalysis->save();

            return response()->json(['message' => 'Berhasil verifikasi'], 200);
        } else {
            return response()->json(['message' => 'Verifikasi tidak ditemukan'], 404);
        }
    }

    public function getAllVerification()
    {
        $daftarPasien = SkinAnalysis::where('skin_analysis.verified', 0)
            ->join('verifications', 'skin_analysis.id', '=', 'verifications.skin_analysis_id')
            ->join('users', 'skin_analysis.user_id', '=', 'users.id')
            ->leftJoin('doctors', 'skin_analysis.verified_by', '=', 'doctors.id')
            ->select([
                'verifications.created_at',
                'users.firstName as userFirstName',
                'users.lastName as userLastName',
                'doctors.firstName as doctorFirstName',
                'doctors.lastName as doctorLastName',
                'skin_analysis.analysis_percentage',
                'verifications.verified_melanoma',
                'skin_analysis.catatanDokter'
            ])
            ->get();

        return response()->json($daftarPasien);
    }
    public function updateVerification(int $id, Request $request)
    {
        $verif = Verifications::where('skin_analysis_id', $id)->first();
        $skinAnalysis = SkinAnalysis::find($id);

        if (!$skinAnalysis) {
            return response()->json(['message' => 'Skin analysis not found'], 404);
        }
        if ($verif) {
            $verif->verified_melanoma = $request->input('verifiedMelanoma');
            $verif->doctor_id = $request->input('doctor_id');
            $verif->save();
            $skinAnalysis->catatanDokter = $request->input('catatanDokter');
            $skinAnalysis->save();

            return response()->json(['message' => 'Berhasil memperbarui verifikasi'], 200);
        } else {
            return response()->json(['message' => 'Verifikasi tidak ditemukan'], 404);
        }
    }

    public function deleteVerificationBySkinAnalysisId($id)
    {
        $verif = Verifications::where('skin_analysis_id', $id)->first();
        $skinAnalysis = SkinAnalysis::find($id);

        if (!$skinAnalysis) {
            return response()->json(['message' => 'Skin analysis not found'], 404);
        }
        if ($verif) {
            $verif->delete();
            $skinAnalysis->verified = false;
            $skinAnalysis->verified_by = null;
            $skinAnalysis->catatanDokter = null;
            $skinAnalysis->save();

            return response()->json(['message' => 'Berhasil menghapus verifikasi'], 200);
        } else {
            return response()->json(['message' => 'Verifikasi tidak ditemukan'], 404);
        }
    }
}
