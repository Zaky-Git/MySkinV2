<?php

namespace Database\Factories;

use App\Models\Doctor;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Doctor>
 */
class DoctorFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    protected $model = Doctor::class;
    public function definition(): array
    {
        return [
            'firstName' => $this->faker->firstName,
            'lastName' => $this->faker->lastName,
            'number' => $this->faker->phoneNumber,
            'email' => $this->faker->unique()->userName() . '@dokter.myskin.ac.id',
            'password' => Hash::make('123'),
            'verified' => true,
            'birthdate' => $this->faker->date(),
            'profile_picture_path' => 'images/doctor/default.jpg',
        ];
    }
}
