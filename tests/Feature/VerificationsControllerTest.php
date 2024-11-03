<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Doctor;
use App\Models\SkinAnalysis;
use App\Models\Verifications;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class VerificationsControllerTest extends TestCase
{
    use RefreshDatabase;

    public function test_get_pasien_verification_list_by_id()
    {
        // Create a user
        $user = User::factory()->create();

        // Create related models
        $doctor = Doctor::factory()->create();
        $skinAnalysis = SkinAnalysis::factory()->create(['user_id' => $user->id]);

        // Create verifications
        $verification = Verifications::factory()->create([
            'user_id' => $user->id,
            'doctor_id' => $doctor->id,
            'skin_analysis_id' => $skinAnalysis->id,
        ]);

        // Make a request to the controller method
        $response = $this->getJson("/api/pasienVerificationList/{$user->id}");

        // Assert the response status and structure
        $response->assertStatus(200)
                 ->assertJsonStructure([
                     '*' => [
                         'id',
                         'user_id',
                         'doctor_id',
                         'skin_analysis_id',
                         'verified',
                         'verification_date',
                         'verified_melanoma',
                         'skin_analysis' => [
                             'id',
                             'user_id',
                             'verified',
                             'verified_by',
                             'catatanDokter',
                             'verification_date',
                         ],
                         'doctor' => [
                             'id',
                             'firstName',
                             'lastName',
                         ],
                     ],
                 ]);
    }

    public function test_get_pasien_verification_list_by_id_with_search()
    {
        // Create a user
        $user = User::factory()->create();

        // Create related models
        $doctor1 = Doctor::factory()->create(['firstName' => 'John', 'lastName' => 'Doe']);
        $doctor2 = Doctor::factory()->create(['firstName' => 'Jane', 'lastName' => 'Smith']);
        $skinAnalysis1 = SkinAnalysis::factory()->create(['user_id' => $user->id]);
        $skinAnalysis2 = SkinAnalysis::factory()->create(['user_id' => $user->id]);

        // Create verifications
        Verifications::factory()->create([
            'user_id' => $user->id,
            'doctor_id' => $doctor1->id,
            'skin_analysis_id' => $skinAnalysis1->id,
        ]);
        Verifications::factory()->create([
            'user_id' => $user->id,
            'doctor_id' => $doctor2->id,
            'skin_analysis_id' => $skinAnalysis2->id,
        ]);

        // Make a request to the controller method with search term
        $response = $this->getJson("/api/pasienVerificationList/{$user->id}?searchTerm=John");

        // Assert the response status and structure
        $response->assertStatus(200)
                 ->assertJsonCount(1)
                 ->assertJsonFragment(['firstName' => 'John', 'lastName' => 'Doe']);
    }

    public function test_get_pasien_verification_list_by_id_with_sorting_by_submission_date()
    {
        // Create a user
        $user = User::factory()->create();

        // Create related models
        $doctor1 = Doctor::factory()->create();
        $doctor2 = Doctor::factory()->create();
        $skinAnalysis1 = SkinAnalysis::factory()->create(['user_id' => $user->id]);
        $skinAnalysis2 = SkinAnalysis::factory()->create(['user_id' => $user->id]);

        // Create verifications
        Verifications::factory()->create([
            'user_id' => $user->id,
            'doctor_id' => $doctor1->id,
            'skin_analysis_id' => $skinAnalysis1->id,
            'created_at' => now()->subDays(1),
        ]);
        Verifications::factory()->create([
            'user_id' => $user->id,
            'doctor_id' => $doctor2->id,
            'skin_analysis_id' => $skinAnalysis2->id,
            'created_at' => now(),
        ]);

        // Make a request to the controller method with sorting by submission date
        $response = $this->getJson("/api/pasienVerificationList/{$user->id}?sortKey=created_at");

        // Assert the response status and structure
        $response->assertStatus(200)
                 ->assertJsonStructure([
                     '*' => [
                         'id',
                         'user_id',
                         'doctor_id',
                         'skin_analysis_id',
                         'verified',
                         'verification_date',
                         'verified_melanoma',
                         'skin_analysis' => [
                             'id',
                             'user_id',
                             'verified',
                             'verified_by',
                             'catatanDokter',
                             'verification_date',
                         ],
                         'doctor' => [
                             'id',
                             'firstName',
                             'lastName',
                         ],
                     ],
                 ]);

        // Assert the order of the verifications
        $responseData = $response->json();
        $this->assertTrue($responseData[0]['created_at'] > $responseData[1]['created_at']);
    }

    public function test_get_pasien_verification_list_by_id_with_sorting_by_verification_status()
    {
        // Create a user
        $user = User::factory()->create();

        // Create related models
        $doctor1 = Doctor::factory()->create();
        $doctor2 = Doctor::factory()->create();
        $skinAnalysis1 = SkinAnalysis::factory()->create(['user_id' => $user->id]);
        $skinAnalysis2 = SkinAnalysis::factory()->create(['user_id' => $user->id]);

        // Create verifications
        Verifications::factory()->create([
            'user_id' => $user->id,
            'doctor_id' => $doctor1->id,
            'skin_analysis_id' => $skinAnalysis1->id,
            'verified' => false,
        ]);
        Verifications::factory()->create([
            'user_id' => $user->id,
            'doctor_id' => $doctor2->id,
            'skin_analysis_id' => $skinAnalysis2->id,
            'verified' => true,
        ]);

        // Make a request to the controller method with sorting by verification status
        $response = $this->getJson("/api/pasienVerificationList/{$user->id}?sortKey=verified");

        // Assert the response status and structure
        $response->assertStatus(200)
                 ->assertJsonStructure([
                     '*' => [
                         'id',
                         'user_id',
                         'doctor_id',
                         'skin_analysis_id',
                         'verified',
                         'verification_date',
                         'verified_melanoma',
                         'skin_analysis' => [
                             'id',
                             'user_id',
                             'verified',
                             'verified_by',
                             'catatanDokter',
                             'verification_date',
                         ],
                         'doctor' => [
                             'id',
                             'firstName',
                             'lastName',
                         ],
                     ],
                 ]);

        // Assert the order of the verifications
        $responseData = $response->json();
        $this->assertTrue($responseData[0]['verified'] <= $responseData[1]['verified']);
    }
}