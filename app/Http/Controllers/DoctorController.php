<?php

namespace App\Http\Controllers;

use App\Models\Doctor;
use App\Models\Verifications;
use Illuminate\Http\Request;

class DoctorController extends Controller
{
    public function getAllDoctor(Request $request)
    {
        $doctor = Doctor::all()->sortBy('created');
        return response()->json($doctor);
    }

    public function getPaginateDoctor(Request $request)
    {
        $query = Doctor::query();

        if ($request->has('search') && !empty($request->search)) {
            $searchTerm = $request->search;
            $query->where(function ($q) use ($searchTerm) {
                $q->where('firstName', 'like', '%' . $searchTerm . '%')
                ->orWhere('lastName', 'like', '%' . $searchTerm . '%');
            });
        }

        if ($request->has('sortBy') && $request->sortBy) {
            $sortOrder = $request->input('sortOrder', 'asc');
            $query->orderBy($request->sortBy, $sortOrder);
        } else {
            $query->orderBy('created_at', 'asc'); 
        }

        $perPage = $request->input('perPage', 10);
        $doctors = $query->paginate($perPage);

        return response()->json([
            'data' => $doctors->items(),
            'meta' => [
                'current_page' => $doctors->currentPage(),
                'last_page' => $doctors->lastPage(),
                'total' => $doctors->total(),
                'per_page' => $doctors->perPage()
            ]
        ]);
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

    public function getVerifiedPengajuan(Request $request, $doctor_id)
    {
        $query = Verifications::where('verifications.doctor_id', $doctor_id)
            ->where('verifications.verified', 1)
            ->with('doctor', 'user', 'skinAnalysis');

        if ($request->filled('search')) {
            $search = $request->search;
            $query->whereHas('user', function ($q) use ($search) {
                $q->where('firstName', 'LIKE', '%' . $search . '%')
                    ->orWhere('lastName', 'LIKE', '%' . $search . '%');
            });
        }

        if ($request->filled('melanoma_detected')) {
            $query->whereHas('skinAnalysis', function ($q) use ($request) {
                $q->where('melanoma_detected', $request->melanoma_detected);
            });
        }

        if ($request->filled('verification_date_from') || $request->filled('verification_date_to')) {
            $query->where(function ($q) use ($request) {
                if ($request->filled('verification_date_from')) {
                    $q->where('verification_date', '>=', $request->verification_date_from);
                }
                if ($request->filled('verification_date_to')) {
                    $q->where('verification_date', '<=', $request->verification_date_to);
                }
            });
        }

        if ($request->filled('analysis_percentage_min')) {
            $query->whereHas('skinAnalysis', function ($q) use ($request) {
                $q->where('analysis_percentage', '>=', $request->analysis_percentage_min);
            });
        }

        if ($request->filled('analysis_percentage_max')) {
            $query->whereHas('skinAnalysis', function ($q) use ($request) {
                $q->where('analysis_percentage', '<=', $request->analysis_percentage_max);
            });
        }


        $sortField = $request->get('sort_field', 'verifications.created_at');
        $sortOrder = $request->get('sort_order', 'desc');

        if (str_contains($sortField, 'user.')) {
            $sortField = str_replace('user.', 'users.', $sortField);
            $query->join('users', 'verifications.user_id', '=', 'users.id');
        } elseif (str_contains($sortField, 'skinAnalysis.')) {
            $sortField = str_replace('skinAnalysis.', 'skin_analysis.', $sortField);
            $query->join('skin_analysis', 'verifications.skin_analysis_id', '=', 'skin_analysis.id');
        }

        $query->orderBy($sortField, $sortOrder);

        $perPage = $request->get('per_page', 10);
        $daftarPasien = $query->paginate($perPage);

        return response()->json($daftarPasien);
    }
}
