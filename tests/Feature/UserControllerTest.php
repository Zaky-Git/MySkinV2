<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;
use App\Models\User;
use App\Models\Verifications;
use App\Models\SkinAnalysis;

class UserControllerTest extends TestCase
{
    use RefreshDatabase;

    public function test_search_users_by_doctor(): void
    {
        $doctorId = 1;
        $doctor = \App\Models\Doctor::factory()->create(['id' => $doctorId]);

        $user1 = User::factory()->create([
            'firstName' => 'Japran',
            'lastName' => 'Jawa',
        ]);

        $user2 = User::factory()->create([
            'firstName' => 'Zaky',
            'lastName' => 'Pasien',
        ]);

        $skinAnalysis1 = SkinAnalysis::factory()->create();
        $skinAnalysis2 = SkinAnalysis::factory()->create();

        Verifications::factory()->create([
            'doctor_id' => $doctorId,
            'user_id' => $user1->id,
            'skin_analysis_id' => $skinAnalysis1->id,
        ]);

        Verifications::factory()->create([
            'doctor_id' => $doctorId,
            'user_id' => $user2->id,
            'skin_analysis_id' => $skinAnalysis2->id,
        ]);

        $response = $this->getJson("/api/users/?doctor_id={$doctorId}&search=Japran Jawa");

        $response->assertStatus(200);
        $response->assertJsonFragment([
            'firstName' => 'Japran',
            'lastName' => 'Jawa',
        ]);

        $response = $this->getJson("/api/users/?doctor_id={$doctorId}&search=Zaky Pasien");

        $response->assertStatus(200);
        $response->assertJsonFragment([
            'firstName' => 'Zaky',
            'lastName' => 'Pasien',
        ]);
    }
}
