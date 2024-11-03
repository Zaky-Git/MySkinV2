<?php

namespace Tests\Feature;

use App\Models\Doctor;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class GetDoctorTest extends TestCase
{
    use RefreshDatabase;
    public function test_can_get_doctors()
    {
        $doctor = Doctor::factory()->create([
            'firstName' => 'Muhammad',
            'lastName' => 'Ali',
            'email' => 'm.ali@dokter.myskin.ac.id',
            'number' => '082112212'
        ]);

        $response = $this->get('/api/doctors');

        $response->assertStatus(200)
            ->assertJsonFragment([
                'firstName' => 'Muhammad',
                'lastName' => 'Ali',
                'email' => 'm.ali@dokter.myskin.ac.id',
                'number' => '082112212'
            ])
            ->assertJsonCount(1);
    }

    public function test_get_doctor_by_name()
    {
        $doctor = Doctor::factory()->create([
            'firstName' => 'Chris',
            'lastName' => 'John',
            'email' => 'c.john@dokter.myskin.ac.id',
            'number' => '1234567890',
            'password' => bcrypt('123')
        ]);

        $response = $this->get('/api/doctors/search?name=John');

        $response->assertStatus(200);
        $response->assertJsonFragment([
            'firstName' => 'Chris',
            'lastName' => 'John',
            'email' => 'c.john@dokter.myskin.ac.id',
            'number' => '1234567890',
        ]);
    }

    public function test_get_doctor_by_name_not_found()
    {
        $response = $this->get('/api/doctors/search?name=tidakAda');

        $response->assertStatus(200);
        $this->assertEmpty($response->json());
    }
}
