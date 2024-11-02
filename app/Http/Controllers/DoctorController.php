<?php

namespace App\Http\Controllers;

use App\Models\Doctor;
use App\Models\Verifications;
use Illuminate\Http\Request;

class DoctorController extends Controller
{
    public function getAllDoctor()
    {
        $doctor = Doctor::all()->sortBy('created');
        return response()->json($doctor);
    }
    public function getDoctor($id)
    {
        $doctor = Doctor::find($id);
        return response()->json($doctor);
    }
    public function getJumlahPasien($doctor_id)
    {
        $patientCount = Verifications::where('doctor_id', $doctor_id)
            ->distinct('user_id')
            ->count('user_id');
        return response()->json(['patient_count' => $patientCount]);
    }
    public function getPatients($doctor_id)
    {
        $patients = Verifications::where('doctor_id', $doctor_id)
            ->with('user')
            ->get();

        return response()->json($patients);
    }
    public function updateDoctor(Request $request, $id)
    {
        $doctor = Doctor::find($id);

        if (!$doctor) {
            return response()->json(['message' => 'Doctor not found'], 404);
        }

        $doctor->firstName = $request->input('firstName');
        $doctor->lastName = $request->input('lastName');
        $doctor->number = $request->input('number');
        $doctor->email = $request->input('email');

        $doctor->save();

        return response()->json($doctor);
    }
    public function countDoctor()
    {
        $doctorCount = Doctor::all()->count();
        return response()->json($doctorCount);
    }
    public function countVerified($doctor_id)
    {
        $verCount = Verifications::where('doctor_id', $doctor_id)->where('verified', 1)->count();
        return response()->json($verCount);
    }

    public function countUnverified($doctor_id)
    {
        $unverCount = Verifications::where('doctor_id', $doctor_id)->where('verified', 0)->count();
        return response()->json($unverCount);
    }
    public function getPasienByDoctor($doctor_id)
    {
        $daftarPasien = Verifications::where('verifications.doctor_id', $doctor_id)
            ->join('skin_analysis', function ($join) {
                $join->on('verifications.skin_analysis_id', '=', 'skin_analysis.id')
                    ->where('skin_analysis.verified', '=', 0);
            })
            ->join('users', 'verifications.user_id', '=', 'users.id')
            ->with(['doctor', 'skinAnalysis', 'user'])
            ->get([
                'verifications.user_id',
                'verifications.id',
                'verifications.created_at',
                'skin_analysis.analysis_percentage',
                'users.firstName',
                'users.lastName',
                'users.number'
            ]);

        return response()->json($daftarPasien);
    }



    public function getVerifiedPengajuan($doctor_id)
    {
        $daftarPasien = Verifications::where('verifications.doctor_id', $doctor_id)
            ->where('verifications.verified', 1)
            ->join('users', 'verifications.user_id', '=', 'users.id')
            ->join('skin_analysis', 'verifications.skin_analysis_id', '=', 'skin_analysis.id')
            ->with(['doctor', 'skinAnalysis', 'user'])
            ->get([
                'verifications.id',
                'verifications.created_at',
                'users.firstName',
                'users.lastName',
                'skin_analysis.analysis_percentage',
                'verifications.verified_melanoma',
                'skin_analysis.catatanDokter'
            ]);

        return response()->json($daftarPasien);
    }
}
