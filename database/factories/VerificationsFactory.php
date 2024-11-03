<?php

namespace Database\Factories;

use App\Models\User;
use App\Models\Doctor;
use App\Models\SkinAnalysis;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Verifications>
 */
class VerificationsFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'doctor_id' => Doctor::factory(),
            'skin_analysis_id' => SkinAnalysis::factory(),
            'verified' => $this->faker->boolean,
            'verification_date' => $this->faker->dateTime,
            'verified_melanoma' => $this->faker->boolean,
        ];
    }
}
