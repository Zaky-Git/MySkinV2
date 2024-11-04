<?php

namespace Database\Factories;

use App\Models\Doctor;
use App\Models\SkinAnalysis;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\DoctorComments>
 */
class DoctorCommentsFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'skin_analysis_id' => 5,
            'doctor_id' => Doctor::query()->inRandomOrder()->value('id') 
            ?? Doctor::factory(),
            'comment' => $this->faker->sentence(10),
        ];
    }
}
