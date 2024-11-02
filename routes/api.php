<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\DoctorController;
use App\Http\Controllers\ImageController;
use App\Http\Controllers\SkinAnalysisController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\UserController;
use App\Http\Controllers\VerificationsController;

#verifikasi
Route::get('/countPengajuan', [SkinAnalysisController::class, 'countPengajuanVerifikasi']);
Route::get('/pasienVerificationList/{id}', [VerificationsController::class, 'getPasienVerificationListByID']);
Route::get('/pengajuanUmum', [VerificationsController::class, 'getPengajuanUmum']);
Route::get('/verification/{id}', [VerificationsController::class, 'getVerificationBySkinAnalysisID']);
Route::post('/verifikasiSkin/{id}', [VerificationsController::class, 'verifikasi']);
Route::put('/updateVerification/{id}', [VerificationsController::class, 'updateVerification']);
Route::delete('/verification/{id}', [VerificationsController::class, 'deleteVerificationBySkinAnalysisId']);

# doctor
Route::get('/doctors', [DoctorController::class, 'getAllDoctor']);
Route::get('/doctor/{id}', [DoctorController::class, 'getDoctor']);
Route::get('/allUserByDoctor/{id}', [UserController::class, 'getAllUserByDoctor']);
Route::get('/doctor/{doctor_id}/patients', [DoctorController::class, 'getPatients']);
Route::put('/doctor/{id}', [DoctorController::class, 'updateDoctor']);
Route::get('/doctor/{doctor_id}/patients-count', [DoctorController::class, 'getJumlahPasien']);
Route::get('/doctor/{doctor_id}/countUserUnver', [DoctorController::class, 'countUnverified']);
Route::get('/doctor/{doctor_id}/countUserVer', [DoctorController::class, 'countVerified']);
Route::get('/countDoctor', [DoctorController::class, 'countDoctor']);
Route::get('/ajuanVerifikasi/{doctor_id}', [DoctorController::class, 'getPasienByDoctor']);
Route::get('/listPasien/{doctor_id}', [UserController::class, 'getUserByDoctor']);
Route::get('/riwayatVerified/{doctor_id}', [DoctorController::class, 'getVerifiedPengajuan']);

# user
Route::get('/users', [UserController::class, 'getAllUser']);
Route::get('/countUser', [UserController::class, 'countUser']);
Route::middleware('auth:sanctum')->get('/verifications', [SkinAnalysisController::class, 'getVerificationByUserId']);
Route::get('/penggunaUnver', [UserController::class, 'getUnverifiedUsers']);
Route::put('/verifikasi-pengguna/{id}', [UserController::class, 'verifyUser']);

# auth
Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);
Route::post('/checkEmail', [AuthController::class, 'checkEmail']);
Route::post('/changePassword', [AuthController::class, 'gantiPassword']);
Route::post('/verifUser/{id}', [AuthController::class, 'verifikasiIdentitas']);
Route::post('/registerUser', [AuthController::class, 'mendaftarkanUser']);

#skinAnalysis
Route::post('/skinAnalysis', [SkinAnalysisController::class, 'skinAnalysis']);
Route::post('/mengajukanVerifikasi/{id}', [SkinAnalysisController::class, 'mengajukanVerifikasi']);
Route::get('/mySkinAnalysis/{id}', [SkinAnalysisController::class, 'getMySkinAnalysis']);
Route::get('/getSkinAnalysis/{id}', [SkinAnalysisController::class, 'getSkinAnalysisById']);
Route::delete('/skinAnalysis/{id}', [SkinAnalysisController::class, 'deleteSkinAnalysisById']);
Route::put('/updateKeluhanSkinAnalysis/{id}', [SkinAnalysisController::class, 'updateKeluhanById']);


#doctor
Route::get('/doctors', [DoctorController::class, 'getAllDoctor']);

Route::get('/image/{filePath}', [ImageController::class, 'getImage']);
#admin
Route::get('/allVerifikasi', [VerificationsController::class, 'getAllVerification']);
