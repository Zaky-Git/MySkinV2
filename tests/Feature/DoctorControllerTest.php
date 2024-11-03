<?php

namespace Tests\Feature;

use App\Models\Doctor;
use App\Models\DoctorComments;
use App\Models\SkinAnalysis;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class DoctorControllerTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function it_counts_comments_for_each_doctor()
    {

        $user1 = User::factory()->create();
        $user2 = User::factory()->create();
    
        $doctor1 = Doctor::factory()->create(['firstName' => 'John', 'lastName' => 'Doe']);
        $doctor2 = Doctor::factory()->create(['firstName' => 'Jane', 'lastName' => 'Smith']);
    
        $skinAnalysis1 = SkinAnalysis::factory()->create(['user_id' => $user1->id]);
        $skinAnalysis2 = SkinAnalysis::factory()->create(['user_id' => $user2->id]);


        DoctorComments::factory()->count(3)->create([
            'doctor_id' => $doctor1->id,
            'skin_analysis_id' => $skinAnalysis1->id
        ]);
    
        DoctorComments::factory()->count(5)->create([
            'doctor_id' => $doctor2->id,
            'skin_analysis_id' => $skinAnalysis2->id
        ]);

        $response = $this->getJson('/api/doctorsCommentCounts');


        $response->assertStatus(200); 

        $response->assertJsonCount(2); 

        $response->assertJsonFragment([
            'doctor_id' => $doctor1->id,
            'doctor_name' => 'John Doe',
            'comment_count' => 3,
        ]);

        $response->assertJsonFragment([
            'doctor_id' => $doctor2->id,
            'doctor_name' => 'Jane Smith',
            'comment_count' => 5,
        ]);
    }
}
