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

    public function testGetPasienVerificationListByIDSortedByCreatedAt()
    {
        $user = User::factory()->create();
        $doctor = Doctor::factory()->create();
        $skinAnalysis1 = SkinAnalysis::factory()->create(['user_id' => $user->id, 'created_at' => now()->subDays(1)]);
        $skinAnalysis2 = SkinAnalysis::factory()->create(['user_id' => $user->id, 'created_at' => now()]);
        
        Verifications::factory()->create(['user_id' => $user->id, 'doctor_id' => $doctor->id, 'skin_analysis_id' => $skinAnalysis1->id]);
        Verifications::factory()->create(['user_id' => $user->id, 'doctor_id' => $doctor->id, 'skin_analysis_id' => $skinAnalysis2->id]);

        $response = $this->getJson("/api/pasienVerificationList/{$user->id}?sortKey=created_at");

        $response->assertStatus(200)
                 ->assertJsonPath('0.skin_analysis_id', $skinAnalysis2->id)
                 ->assertJsonPath('1.skin_analysis_id', $skinAnalysis1->id);
    }

    public function testGetPasienVerificationListByIDSortedByVerified()
    {
        $user = User::factory()->create();
        $doctor = Doctor::factory()->create();
        $skinAnalysis1 = SkinAnalysis::factory()->create(['user_id' => $user->id, 'verified' => 1]);
        $skinAnalysis2 = SkinAnalysis::factory()->create(['user_id' => $user->id, 'verified' => 0]);
        
        Verifications::factory()->create(['user_id' => $user->id, 'doctor_id' => $doctor->id, 'skin_analysis_id' => $skinAnalysis1->id]);
        Verifications::factory()->create(['user_id' => $user->id, 'doctor_id' => $doctor->id, 'skin_analysis_id' => $skinAnalysis2->id]);

        $response = $this->getJson("/api/pasienVerificationList/{$user->id}?sortKey=verified");

        $response->assertStatus(200)
                 ->assertJsonPath('0.skin_analysis_id', $skinAnalysis2->id)
                 ->assertJsonPath('1.skin_analysis_id', $skinAnalysis1->id);
    }

    public function testGetPasienVerificationListByIDSearchByDoctorFirstName()
    {
        $user = User::factory()->create();
        $doctor1 = Doctor::factory()->create(['firstName' => 'John']);
        $doctor2 = Doctor::factory()->create(['firstName' => 'Jane']);
        $skinAnalysis1 = SkinAnalysis::factory()->create(['user_id' => $user->id]);
        $skinAnalysis2 = SkinAnalysis::factory()->create(['user_id' => $user->id]);
        
        Verifications::factory()->create(['user_id' => $user->id, 'doctor_id' => $doctor1->id, 'skin_analysis_id' => $skinAnalysis1->id]);
        Verifications::factory()->create(['user_id' => $user->id, 'doctor_id' => $doctor2->id, 'skin_analysis_id' => $skinAnalysis2->id]);

        $response = $this->getJson("/api/pasienVerificationList/{$user->id}?searchTerm=John");

        $response->assertStatus(200)
                 ->assertJsonCount(1)
                 ->assertJsonFragment(['firstName' => 'John']);
    }

    public function testGetPasienVerificationListByIDSearchByDoctorLastName()
    {
        $user = User::factory()->create();
        $doctor1 = Doctor::factory()->create(['lastName' => 'Doe']);
        $doctor2 = Doctor::factory()->create(['lastName' => 'Smith']);
        $skinAnalysis1 = SkinAnalysis::factory()->create(['user_id' => $user->id]);
        $skinAnalysis2 = SkinAnalysis::factory()->create(['user_id' => $user->id]);
        
        Verifications::factory()->create(['user_id' => $user->id, 'doctor_id' => $doctor1->id, 'skin_analysis_id' => $skinAnalysis1->id]);
        Verifications::factory()->create(['user_id' => $user->id, 'doctor_id' => $doctor2->id, 'skin_analysis_id' => $skinAnalysis2->id]);

        $response = $this->getJson("/api/pasienVerificationList/{$user->id}?searchTerm=Doe");

        $response->assertStatus(200)
                 ->assertJsonCount(1)
                 ->assertJsonFragment(['lastName' => 'Doe']);
    }

    // public function testGetPasienVerificationListByIDWithNoSearchTermAndDefaultSorting()
    // {
    //     $user = User::factory()->create();
    //     $doctor = Doctor::factory()->create();
    //     $skinAnalysis1 = SkinAnalysis::factory()->create(['user_id' => $user->id, 'created_at' => now()->subDays(1)]);
    //     $skinAnalysis2 = SkinAnalysis::factory()->create(['user_id' => $user->id, 'created_at' => now()]);
        
    //     Verifications::factory()->create(['user_id' => $user->id, 'doctor_id' => $doctor->id, 'skin_analysis_id' => $skinAnalysis1->id]);
    //     Verifications::factory()->create(['user_id' => $user->id, 'doctor_id' => $doctor->id, 'skin_analysis_id' => $skinAnalysis2->id]);

    //     $response = $this->getJson("/api/pasienVerificationList/{$user->id}");

    //     $response->assertStatus(200)
    //              ->assertJsonPath('0.skin_analysis_id', $skinAnalysis2->id)
    //              ->assertJsonPath('1.skin_analysis_id', $skinAnalysis1->id);
    // }
}