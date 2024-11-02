<?php

namespace App\Http\Controllers;

use App\Models\Doctor;
use App\Models\User;
use App\Models\Verifications;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class UserController extends Controller
{
    public function getAllUser()
    {
        $users = User::all();

        return response()->json($users);
    }
    public function countUser(){
        $userCount = User::all()->count();
        return response()->json($userCount);
    }
    public function getUserByDoctor($doctor_id)
    {
        $daftarPasien = Verifications::where('verifications.doctor_id', $doctor_id)
            ->join('skin_analysis', 'verifications.skin_analysis_id', '=', 'skin_analysis.id')
            ->join('users', 'verifications.user_id', '=', 'users.id')
            ->select(
                'verifications.user_id',
                'users.firstName',
                'users.lastName',
                'users.number',
                DB::raw('COUNT(verifications.id) as jumlah_ajuan'),
            )
            ->groupBy('verifications.user_id', 'users.firstName', 'users.lastName', 'users.number')
            ->get();

        return response()->json($daftarPasien);
    }


    public function getAllUserByDoctor($doctor_id)
    {
        $daftarPasien = Verifications::where('verifications.doctor_id', $doctor_id)
            ->join('skin_analysis', 'verifications.skin_analysis_id', '=', 'skin_analysis.id')
            ->join('users', 'verifications.user_id', '=', 'users.id')
            ->with(['doctor', 'skinAnalysis', 'user'])
            ->distinct()
            ->get([
                'verifications.user_id',
                'verifications.created_at',
                'skin_analysis.analysis_percentage',
                'users.firstName',
                'users.lastName',
                'users.number'
            ]);

        return response()->json($daftarPasien);
    }
    public function getUnverifiedUsers(Request $request)
    {
        $role = $request->query('role', null);

        $usersQuery = User::where('verified', 0);
        $doctorsQuery = Doctor::where('verified', 0);

        if ($role === 'pasien') {
            $unverifiedUsers = $usersQuery->get();
        } elseif ($role === 'dokter') {
            $unverifiedUsers = $doctorsQuery->get();
        } else {
            $unverifiedUsers = $usersQuery->get()->merge($doctorsQuery->get());
        }

        return response()->json($unverifiedUsers);
    }
    public function verifyUser($id)
    {
        $user = User::find($id);

        if ($user) {
            $user->verified = 1;
            $user->save();
            return response()->json(['message' => 'User verified successfully'], 200);
        }

        $doctor = Doctor::find($id);

        if ($doctor) {
            $doctor->verified = 1;
            $doctor->save();
            return response()->json(['message' => 'Doctor verified successfully'], 200);
        }

        return response()->json(['message' => 'User or Doctor not found'], 404);
    }
}
