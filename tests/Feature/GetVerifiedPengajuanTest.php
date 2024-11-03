<?php

namespace Tests\Feature;

use App\Models\Doctor;
use App\Models\User;
use App\Models\SkinAnalysis;
use App\Models\Verifications;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class GetVerifiedPengajuanTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function fetches_verified_pengajuan_correctly()
    {
        $doctor = Doctor::factory()->create();
        $user = User::factory()->create(['firstName' => 'Zaky', 'lastName' => 'Pasien']);
        $skinAnalysis = SkinAnalysis::factory()->create([
            'user_id' => $user->id,
            'verified_by' => $doctor->id,
            'analysis_percentage' => 76.82,
            'catatanDokter' => 'gunakan obattttt',
        ]);

        Verifications::factory()->create([
            'doctor_id' => $doctor->id,
            'user_id' => $user->id,
            'skin_analysis_id' => $skinAnalysis->id,
            'verified' => true,
            'verified_melanoma' => true,
        ]);

        $response = $this->getJson("/api/riwayatVerified/{$doctor->id}");

        $response->assertStatus(200)
            ->assertJsonStructure([
                'data' => [
                    '*' => [
                        'id',
                        'created_at',
                        'user' => [
                            'firstName',
                            'lastName'
                        ],
                        'skin_analysis' => [
                            'analysis_percentage',
                            'catatanDokter'
                        ],
                        'verified_melanoma'
                    ]
                ],
                'current_page',
                'from',
                'last_page',
                'per_page',
                'to',
                'total'
            ])
            ->assertJsonFragment([
                'firstName' => 'Zaky',
                'lastName' => 'Pasien',
                'analysis_percentage' => 76.82,
                'verified_melanoma' => 1,
                'catatanDokter' => 'gunakan obattttt',
            ]);
    }

    /** @test */
    public function can_search_pengajuan_by_user_name()
    {
        $doctor = Doctor::factory()->create();
        $user1 = User::factory()->create(['firstName' => 'Raychan', 'lastName' => 'Fathurahim']);
        $user2 = User::factory()->create(['firstName' => 'Muhammad', 'lastName' => 'Fathurahim']);

        $skinAnalysis1 = SkinAnalysis::factory()->create(['user_id' => $user1->id]);
        $skinAnalysis2 = SkinAnalysis::factory()->create(['user_id' => $user2->id]);

        Verifications::factory()->create([
            'doctor_id' => $doctor->id,
            'user_id' => $user1->id,
            'skin_analysis_id' => $skinAnalysis1->id,
            'verified' => true,
        ]);

        Verifications::factory()->create([
            'doctor_id' => $doctor->id,
            'user_id' => $user2->id,
            'skin_analysis_id' => $skinAnalysis2->id,
            'verified' => true,
        ]);

        $response = $this->getJson("/api/riwayatVerified/{$doctor->id}?search=Ray");

        $response->assertStatus(200)
            ->assertJsonFragment(['firstName' => 'Raychan'])
            ->assertJsonMissing(['firstName' => 'Muhammad']);
    }

    /** @test */
    public function sorts_pengajuan_by_created_at()
    {
        $doctor = Doctor::factory()->create();
        $user1 = User::factory()->create(['firstName' => 'Zaky']);
        $user2 = User::factory()->create(['firstName' => 'Muhammad']);

        $skinAnalysis1 = SkinAnalysis::factory()->create(['user_id' => $user1->id]);
        $skinAnalysis2 = SkinAnalysis::factory()->create(['user_id' => $user2->id]);

        Verifications::factory()->create([
            'doctor_id' => $doctor->id,
            'user_id' => $user1->id,
            'skin_analysis_id' => $skinAnalysis1->id,
            'created_at' => now()->subDay(),
            'verified' => true,
        ]);

        Verifications::factory()->create([
            'doctor_id' => $doctor->id,
            'user_id' => $user2->id,
            'skin_analysis_id' => $skinAnalysis2->id,
            'created_at' => now(),
            'verified' => true,
        ]);

        $response = $this->getJson("/api/riwayatVerified/{$doctor->id}?sort_field=created_at&sort_order=asc");

        $response->assertStatus(200)
            ->assertSeeInOrder(['Zaky', 'Muhammad']);
    }

    /** @test */
    public function paginates_the_results()
    {
        $doctor = Doctor::factory()->create();
        User::factory(15)->create()->each(function ($user) use ($doctor) {
            $skinAnalysis = SkinAnalysis::factory()->create(['user_id' => $user->id]);
            Verifications::factory()->create([
                'doctor_id' => $doctor->id,
                'user_id' => $user->id,
                'skin_analysis_id' => $skinAnalysis->id,
                'verified' => true,
            ]);
        });

        $response = $this->getJson("/api/riwayatVerified/{$doctor->id}?per_page=10");

        $response->assertStatus(200)
            ->assertJsonCount(10, 'data');
    }

    /** @test */
    public function can_filter_by_verification_date_from()
    {
        $doctor = Doctor::factory()->create();
        $user = User::factory()->create();
        $skinAnalysis = SkinAnalysis::factory()->create(['user_id' => $user->id]);

        Verifications::factory()->create([
            'doctor_id' => $doctor->id,
            'user_id' => $user->id,
            'skin_analysis_id' => $skinAnalysis->id,
            'verification_date' => "2024-06-18 20:32:20",
            'verified' => true,
        ]);

        Verifications::factory()->create([
            'doctor_id' => $doctor->id,
            'user_id' => $user->id,
            'skin_analysis_id' => $skinAnalysis->id,
            'verification_date' => "2024-06-19 20:32:20",
            'verified' => true,
        ]);

        $response = $this->getJson("/api/riwayatVerified/{$doctor->id}?verification_date_from=2024-06-15");

        $response->assertStatus(200)
            ->assertJsonCount(2, 'data')
            ->assertJsonFragment(['verification_date' => "2024-06-18 20:32:20"])
            ->assertJsonFragment(['verification_date' => "2024-06-19 20:32:20"]);
    }

    /** @test */
    public function can_filter_by_verification_date_to()
    {
        $doctor = Doctor::factory()->create();
        $user = User::factory()->create();
        $skinAnalysis = SkinAnalysis::factory()->create(['user_id' => $user->id]);

        Verifications::factory()->create([
            'doctor_id' => $doctor->id,
            'user_id' => $user->id,
            'skin_analysis_id' => $skinAnalysis->id,
            'verification_date' => "2024-06-18 20:32:20",
            'verified' => true,
        ]);

        Verifications::factory()->create([
            'doctor_id' => $doctor->id,
            'user_id' => $user->id,
            'skin_analysis_id' => $skinAnalysis->id,
            'verification_date' => "2024-06-30 20:32:20",
            'verified' => true,
        ]);

        $response = $this->getJson("/api/riwayatVerified/{$doctor->id}?verification_date_to=2024-06-20 20:32:20");

        $response->assertStatus(200)
            ->assertJsonCount(1, 'data')
            ->assertJsonFragment(['verification_date' => "2024-06-18 20:32:20"]);
    }

    /** @test */
    public function can_filter_by_analysis_percentage_min()
    {
        $doctor = Doctor::factory()->create();
        $user = User::factory()->create();
        $skinAnalysis1 = SkinAnalysis::factory()->create(['user_id' => $user->id, 'analysis_percentage' => 70]);
        $skinAnalysis2 = SkinAnalysis::factory()->create(['user_id' => $user->id, 'analysis_percentage' => 80]);

        Verifications::factory()->create([
            'doctor_id' => $doctor->id,
            'user_id' => $user->id,
            'skin_analysis_id' => $skinAnalysis1->id,
            'verified' => true,
        ]);

        Verifications::factory()->create([
            'doctor_id' => $doctor->id,
            'user_id' => $user->id,
            'skin_analysis_id' => $skinAnalysis2->id,
            'verified' => true,
        ]);

        $response = $this->getJson("/api/riwayatVerified/{$doctor->id}?analysis_percentage_min=75");

        $response->assertStatus(200)
            ->assertJsonCount(1, 'data')
            ->assertJsonFragment(['analysis_percentage' => 80]);
    }

    /** @test */
    public function can_filter_by_analysis_percentage_max()
    {
        $doctor = Doctor::factory()->create();
        $user = User::factory()->create();
        $skinAnalysis1 = SkinAnalysis::factory()->create(['user_id' => $user->id, 'analysis_percentage' => 70]);
        $skinAnalysis2 = SkinAnalysis::factory()->create(['user_id' => $user->id, 'analysis_percentage' => 80]);

        Verifications::factory()->create([
            'doctor_id' => $doctor->id,
            'user_id' => $user->id,
            'skin_analysis_id' => $skinAnalysis1->id,
            'verified' => true,
        ]);

        Verifications::factory()->create([
            'doctor_id' => $doctor->id,
            'user_id' => $user->id,
            'skin_analysis_id' => $skinAnalysis2->id,
            'verified' => true,
        ]);

        $response = $this->getJson("/api/riwayatVerified/{$doctor->id}?analysis_percentage_max=75");

        $response->assertStatus(200)
            ->assertJsonCount(1, 'data')
            ->assertJsonFragment(['analysis_percentage' => 70]);
    }
}
