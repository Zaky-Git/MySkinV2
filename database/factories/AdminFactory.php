<?php

namespace Database\Factories;

use App\Models\Admin;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;

class AdminFactory extends Factory
{
    protected $model = Admin::class;

    public function definition(): array
    {
        return [
            'firstName' => $this->faker->firstName,
            'lastName' => $this->faker->lastName,
            'number' => $this->faker->phoneNumber,
            'email' => $this->faker->unique()->userName() . '@admin.myskin.ac.id',
            'password' => Hash::make('password'),
        ];
    }
}
