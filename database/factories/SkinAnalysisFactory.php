<?php

namespace Database\Factories;

use App\Models\SkinAnalysis;
use Illuminate\Database\Eloquent\Factories\Factory;

class SkinAnalysisFactory extends Factory
{
    protected $model = SkinAnalysis::class;

    public function definition(): array
    {
        return [
            'user_id' => \App\Models\User::factory(),
            'image_path' => 'images/skin_analysis/default_image.jpg',
            'analysis_percentage' => $this->faker->randomFloat(2, 0, 100),
            'catatanDokter' => $this->faker->sentence,
            'verified' => false,
            'verified_by' => null,
            'melanoma_detected' => false,
            'keluhan' => $this->faker->sentence,
            'is_sudah_pengajuan' => false,
            'verification_date' => now(),
        ];
    }
}
