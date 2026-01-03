<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $admins = User::factory(2)->state(['user_type' => 'admin'])->create();
        foreach ($admins as $admin) {
            $admin->assignRole('admin');
        }

        $teachers = User::factory(5)->state(['user_type' => 'teacher'])->create();
        foreach ($teachers as $teacher) {
            $teacher->assignRole('teacher');
        }

        $students = User::factory(10)->state(['user_type' => 'student'])->create();
        foreach ($students as $student) {
            $student->assignRole('student');
        }

        // admin
        $admin = User::create([
            'name' => 'Admin',
            'email' => 'admin@example.com',
            'username' => 'administrator',
            'password' => Hash::make('password'),
            'user_type' => 'admin',
        ]);
        $admin->assignRole('admin');

        // student
        $student = User::factory()->create([
            'name' => 'Student',
            'email' => 'student@example.com',
            'username' => 'student',
            'password' => Hash::make('password'),
            'user_type' => 'student',
        ]);
        $student->assignRole('student');
    }
}
