<?php

namespace Database\Factories;

use App\Models\Doctor;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;

class DoctorFactory extends Factory
{
    protected $model = Doctor::class;

    public function definition(): array
    {
        return [
            'firstName' => $this->faker->firstName,
            'lastName' => $this->faker->lastName,
            'number' => $this->faker->phoneNumber,
            'email' => $this->faker->unique()->userName() . '@dokter.myskin.ac.id',
            'password' => Hash::make('password'),
            'verified' => true,
            'birthdate' => $this->faker->date(),
            'profile_picture_path' => 'images/doctor/default.jpg',
        ];
    }
}
