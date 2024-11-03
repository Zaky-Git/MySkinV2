<?php

namespace Tests\Feature;

use App\Models\Doctor;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class DaftarDokterFiturTest extends TestCase
{
    use RefreshDatabase;

    public function test_default_pagination()
    {
        Doctor::factory()->count(15)->create();

        $response = $this->getJson('/api/doctors/paginate');

        $response->assertStatus(200)
            ->assertJsonCount(10, 'data')
            ->assertJsonPath('meta.per_page', 10);
    }

    public function test_custom_pagination_size()
    {
        Doctor::factory()->count(20)->create();

        $response = $this->getJson('/api/doctors/paginate?perPage=5');

        $response->assertStatus(200)
            ->assertJsonCount(5, 'data')
            ->assertJsonPath('meta.per_page', 5);
    }

    public function test_search_by_first_name()
    {
        Doctor::factory()->create(['firstName' => 'Surya']);
        Doctor::factory()->create(['firstName' => 'Aulia']);
        Doctor::factory()->create(['firstName' => 'SUI']);

        $response = $this->getJson('/api/doctors/paginate?search=SUI');

        $response->assertStatus(200)
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.firstName', 'SUI');
    }

    public function test_search_by_last_name()
    {
        Doctor::factory()->create(['lastName' => 'Surya']);
        Doctor::factory()->create(['lastName' => 'Aulia']);
        Doctor::factory()->create(['lastName' => 'SUI']);

        $response = $this->getJson('/api/doctors/paginate?search=Aulia');

        $response->assertStatus(200)
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.lastName', 'Aulia');
    }

    public function test_sorting_by_first_name_ascending()
    {
        Doctor::factory()->create(['firstName' => 'Surya']);
        Doctor::factory()->create(['firstName' => 'Aulia']);
        Doctor::factory()->create(['firstName' => 'SUI']);

        $response = $this->getJson('/api/doctors/paginate?sortBy=firstName&sortOrder=asc');

        $response->assertStatus(200)
            ->assertJsonPath('data.0.firstName', 'Aulia')
            ->assertJsonPath('data.1.firstName', 'SUI')
            ->assertJsonPath('data.2.firstName', 'Surya');
    }

    public function test_sorting_by_last_name_descending()
    {
        Doctor::factory()->create(['lastName' => 'Surya']);
        Doctor::factory()->create(['lastName' => 'Aulia']);
        Doctor::factory()->create(['lastName' => 'SUI']);

        $response = $this->getJson('/api/doctors/paginate?sortBy=lastName&sortOrder=desc');

        $response->assertStatus(200)
            ->assertJsonPath('data.0.lastName', 'Surya')
            ->assertJsonPath('data.1.lastName', 'SUI')
            ->assertJsonPath('data.2.lastName', 'Aulia');
    }
}
