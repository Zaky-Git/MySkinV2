<?php

namespace Database\Seeders;

use App\Models\Admin;
use App\Models\Doctor;
use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Faker\Factory as Faker;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        User::create([
            'firstName' => 'Zaky',
            'lastName' => 'Pasien',
            'number' => '081311828829',
            'email' => 'mzakyf@pasien.myskin.ac.id',
            'password' => bcrypt('123'),
            'verified' => true,
            'birthdate' => '2003-05-05',
        ]);

        Doctor::create([
            'firstName' => 'Zaky',
            'lastName' => 'Dokter',
            'number' => '081311828829',
            'email' => 'mzakyf@dokter.myskin.ac.id',
            'password' => bcrypt('123'),
            'verified' => true,
            'birthdate' => '2003-05-05',
            'profile_picture_path' => 'images/doctor/default.jpg'
        ]);

        $faker = Faker::create();
        for ($i = 1; $i <= 20; $i++) {
            Doctor::create([
                'firstName' => $faker->firstName,
                'lastName' => $faker->lastName,
                'number' => $faker->phoneNumber,
                'email' => $i . '@dokter.myskin.ac.id',
                'password' => bcrypt('123'),
                'verified' => true,
                'birthdate' => $faker->date(),
                'profile_picture_path' => 'images/doctor/default.jpg'
            ]);
        }


        Admin::create([
            'firstName' => 'Zaky',
            'lastName' => 'Admin',
            'number' => '081311828829',
            'email' => 'mzakyf@admin.myskin.ac.id',
            'password' => bcrypt('123'),
        ]);
    }
}
