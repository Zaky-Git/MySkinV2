<?php

namespace App\Http\Controllers;

use GuzzleHttp\Client;
use App\Models\Doctor;
use App\Models\SkinAnalysis;
use App\Models\Verifications;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class SkinAnalysisController extends Controller
{
    public function skinAnalysis(Request $request)
    {
        if ($request->hasFile('image')) {

            $skinAnalysis = SkinAnalysis::find($request->input('skinAnalysisId'));

            if ($skinAnalysis) {
                if (file_exists(public_path($skinAnalysis->image_path))) {
                    unlink(public_path($skinAnalysis->image_path));
                }
            }
            $image = $request->file('image');

            $client = new Client();
            // $response = $client->post('https://39d8-103-233-100-230.ngrok-free.app', [
            //     'multipart' => [
            //         [
            //             'name'     => 'image',
            //             'contents' => fopen($image->getPathname(), 'r'),
            //             'filename' => $image->getClientOriginalName()
            //         ]
            //     ]
            // ]);

            $response = $client->post('http://127.0.0.1:7000/predict', [
                'multipart' => [
                    [
                        'name'     => 'image',
                        'contents' => fopen($image->getPathname(), 'r'),
                        'filename' => $image->getClientOriginalName()
                    ]
                ]
            ]);

            $responseData = json_decode($response->getBody(), true);
            if (isset($responseData['prediction'])) {
                $percentage = $responseData['prediction'];
            } else {
                return response()->json(['message' => 'Error in Flask API response'], 500);
            }

            if ($percentage > 65) {
                $melanoma_detected = true;
            } else {
                $melanoma_detected = false;
            }

            if (!$skinAnalysis) {
                $skinAnalysis = new SkinAnalysis();
            }

            $skinAnalysis->melanoma_detected = $melanoma_detected;
            $skinAnalysis->verified = false;
            $skinAnalysis->analysis_percentage = $percentage;

            if ($request->has('userId')) {

                $imageName = time() . '.' . $image->getClientOriginalExtension();
                $image->move(public_path('images/skinAnalysis'), $imageName);
                $imagePath = 'images/skinAnalysis/' . $imageName;

                $skinAnalysis->image_path = $imagePath;
                $skinAnalysis->user_id = $request->input('userId');

                $skinAnalysis->save();

                $skinAnalysisId = $skinAnalysis->id;
            } else {
                $skinAnalysisId = null;
            }

            $response = [
                'message' => 'Success',
                'data' => [
                    'skinAnalysis' => $skinAnalysis,
                    'skinAnalysisId' => $skinAnalysisId
                ]
            ];

            return response()->json($response, 200);
        } else {
            return response()->json(['message' => 'Gambar tidak ditemukan'], 400);
        }
    }


    public function mengajukanVerifikasi(int $id, Request $request)
    {

        $alreadyReqVerif = Verifications::where('skin_analysis_id', $id)->first();

        if ($alreadyReqVerif) {
            return response()->json(['message' => 'Sedang mengajukan verifikasi'], 400);
        } else {

            $skinAnalysis = SkinAnalysis::find($request->input('skinAnalysisId'));

            if (!$skinAnalysis) {
                return response()->json(['message' => 'Skin analysis result not found'], 404);
            }

            $verif = new Verifications();
            $verif->skin_analysis_id = $id;
            $verif->user_id = $request->input('userId');

            if ($request->input('doctorId') == null) {
                $verif->doctor_id = null;
            } else {

                $dokter = Doctor::find($request->input('doctorId'));

                if (!$dokter) {
                    return response()->json(['message' => 'Dokter tidak ditemukan'], 404);
                }

                $verif->doctor_id = $request->input('doctorId');
            }
            $verif->verified = false;
            $verif->save();

            $skinAnalysis->is_sudah_pengajuan = true;
            $skinAnalysis->keluhan = $request->input('keluhan');
            $skinAnalysis->save();

            return response()->json(['message' => 'Berhasil mengajukan verifikasi'], 200);
        }
    }


    public function getMySkinAnalysis(int $id)
    {
        $skinAnalysis = SkinAnalysis::where('user_id', $id)->get();
        return response()->json($skinAnalysis);
    }

    public function getSkinAnalysisById(int $id)
    {
        $skinAnalysis = SkinAnalysis::find($id);
        $isSudahDiajukan = Verifications::where('skin_analysis_id', $id)->exists();
        $doctor = Doctor::find($skinAnalysis->verified_by);

        return response()->json([
            'skin_analysis' => $skinAnalysis,
            'is_sudah_diajukan' => $isSudahDiajukan,
            'doctor' => $doctor
        ]);
    }

    public function countSkinAnalysis()
    {
        $skinAnalysisCount = SkinAnalysis::all()->count();
        return response()->json($skinAnalysisCount);
    }

    public function countPengajuanVerifikasi()
    {
        $pengajuanVerifikasiCount = Verifications::where('verified', 0)->count();
        return response()->json($pengajuanVerifikasiCount);
    }
    public function getVerificationByUserId()
    {
        $userId = Auth::id();

        $verifications = Verifications::where('user_id', $userId)->get();

        return response()->json($verifications);
    }

    public function deleteSkinAnalysisById($id)
    {
        $skinAnalysis = SkinAnalysis::find($id);

        if (!$skinAnalysis) {
            return response()->json(['message' => 'Skin analysis not found'], 404);
        }

        if (file_exists(public_path($skinAnalysis->image_path))) {
            unlink(public_path($skinAnalysis->image_path));
        }

        if (Verifications::where('skin_analysis_id', $id)->exists()) {
            $verifications = Verifications::where('skin_analysis_id', $id)->get();
            foreach ($verifications as $verification) {
                $verification->delete();
            }
        }

        $skinAnalysis->delete();
        return response()->json(['message' => 'Skin analysis deleted'], 200);
    }

    public function updateKeluhanById($id, Request $request)
    {
        $skinAnalysis = SkinAnalysis::find($id);

        if (!$skinAnalysis) {
            return response()->json(['message' => 'Skin analysis not found'], 404);
        }

        $skinAnalysis->keluhan = $request->input('keluhan');
        $skinAnalysis->save();

        return response()->json(['message' => 'Keluhan updated'], 200);
    }
}
