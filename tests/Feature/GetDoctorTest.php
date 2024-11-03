<?php

namespace Tests\Feature;

use App\Models\Doctor;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class GetDoctorTest extends TestCase
{
    use RefreshDatabase;
    public function test_can_get_doctors(): void
    {
        // Arrange: Create some test data
        $doctor = Doctor::factory()->create([
            'firstName' => 'Muhammad',
            'lastName' => 'Ali',
            'email' => 'm.ali@dokter.myskin.ac.id',
            'number' => '082112212'
        ]);

        // Act: Send a GET request to the doctors endpoint
        $response = $this->get('/api/doctors');

        // Assert: Check the response status and structure
        $response->assertStatus(200)
            ->assertJsonFragment([
                'firstName' => 'Muhammad',
                'lastName' => 'Ali',
                'email' => 'm.ali@dokter.myskin.ac.id',
                'number' => '082112212'
            ])
            ->assertJsonCount(1); // Assert that one doctor is returned
    }

    public function test_get_doctor_by_name()
    {
        // Arrange: Create a doctor in the database
        $doctor = Doctor::factory()->create([
            'firstName' => 'Chris',
            'lastName' => 'John',
            'email' => 'c.john@dokter.myskin.ac.id',
            'number' => '1234567890',
            'password' => bcrypt('123')
        ]);

        // Act: Send a GET request to the endpoint
        $response = $this->get('/api/doctors/search?name=John');

        // Assert: Check the response status and the returned data
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
        // Act: Send a GET request to the endpoint with a non-existing name
        $response = $this->get('/api/doctors/search?name=tidakAda');

        // Assert: Check that the response indicates no data found
        $response->assertStatus(200);
        $this->assertEmpty($response->json());
    }
}
