<?php


namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use App\Models\SkinAnalysis;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;

class SearchByDateTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        // Buat user dan login untuk menjalankan pengujian
        $this->user = User::factory()->create();
        $this->actingAs($this->user);
    }

    public function test_search_by_date_returns_results()// memastikan bahwa ketika ada data SkinAnalysis yang dibuat pada tanggal tertentu untuk user yang sedang login dengan mengembalikan 200
    {
        // Buat data SkinAnalysis untuk user yang sedang login pada tanggal tertentu
        $date = Carbon::today();
        SkinAnalysis::factory()->create([
            'user_id' => $this->user->id,
            'created_at' => $date,
        ]);

        // request searchByDate dengan parameter tanggal yang sesuai
        $response = $this->json('GET', 'api/skinAnalysis/searchByDate', ['date' => $date->toDateString()]);

        // response berstatus 200 dan data ditemukan
        $response->assertStatus(200)
            ->assertJsonStructure([
                '*' => ['id', 'user_id', 'created_at', 'image_path', 'analysis_percentage', 'keluhan']
            ]);
    }

    public function test_search_by_date_returns_results_only_for_logged_in_user() // memastikan bahwa hanya data SkinAnalysis yang dibuat oleh user yang sedang login yang akan dikembalikan, meskipun ada data lain dengan tanggal yang sama untuk user yang berbeda.
    {
        $date = Carbon::today();
        SkinAnalysis::factory()->create([
            'user_id' => $this->user->id,
            'created_at' => $date,
        ]);

        SkinAnalysis::factory()->create([
            'user_id' => User::factory()->create()->id,
            'created_at' => $date,
        ]);

        // request searchByDate dengan parameter tanggal yang sesuai
        $response = $this->json('GET', 'api/skinAnalysis/searchByDate', ['date' => $date->toDateString()]);
        // response berstatus 200 dan hanya mengembalikan data untuk user yang login
        $response->assertStatus(200)
            ->assertJsonCount(1) // Hanya satu hasil untuk user yang sedang login
            ->assertJsonStructure([
                '*' => ['id', 'user_id', 'created_at', 'image_path', 'analysis_percentage', 'keluhan']
            ]);

        // hasil yang dikembalikan hanya untuk user yang login
        $response->assertJsonFragment(['user_id' => $this->user->id]);
    }




    public function test_search_by_date_returns_error_when_date_not_provided()//jika request tidak menyediakan parameter date, fungsi akan mengembalikan status 400 dengan pesan error yang sesuai.
    {
        $response = $this->json('GET', 'api/skinAnalysis/searchByDate');

        $response->assertStatus(400)
            ->assertJson(['message' => 'Tanggal tidak ditemukan']);
    }

    public function test_search_by_date_expects_200_when_no_data_found()// kita mengharapkan respons 200 ketika sebenarnya data tidak ada
    {
        $response = $this->json('GET', 'api/skinAnalysis/searchByDate', ['date' => Carbon::today()->toDateString()]);

        //  mengharapkan status 200 padahal harusnya 404
        $response->assertStatus(200);
    }

    public function test_search_by_date_returns_data_for_different_user()// kita mencoba mengambil data SkinAnalysis untuk user lain yang tidak sedang login,
    {
        $date = Carbon::today();
        $otherUser = User::factory()->create();
        SkinAnalysis::factory()->create([
            'user_id' => $otherUser->id,
            'created_at' => $date,
        ]);

        // Lakukan request searchByDate dengan tanggal yang sesuai, namun untuk user yang sedang login (bukan pemilik data)
        $response = $this->json('GET', 'api/skinAnalysis/searchByDate', ['date' => $date->toDateString()]);

        // mengharapkan status 200 padahal harusnya 404 (tidak ada data untuk user yang login)
        $response->assertStatus(200);
    }


}
