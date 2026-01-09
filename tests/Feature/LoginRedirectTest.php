<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role;
use Tests\TestCase;

class LoginRedirectTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        // Create roles if they don't exist (assuming DB might be fresh)
        if (!Role::where('name', 'student')->exists()) {
            Role::create(['name' => 'student']);
        }
        if (!Role::where('name', 'admin')->exists()) {
            Role::create(['name' => 'admin']);
        }
    }

    public function test_student_redirected_to_student_dashboard()
    {
        $student = User::factory()->create([
            'password' => Hash::make('password'),
        ]);
        $student->assignRole('student');

        $response = $this->post('/login', [
            'email' => $student->email,
            'password' => 'password',
        ]);

        $response->assertRedirect(route('student.dashboard'));
    }

    public function test_admin_redirected_to_admin_dashboard()
    {
        $admin = User::factory()->create([
            'password' => Hash::make('password'),
        ]);
        $admin->assignRole('admin');

        $response = $this->post('/login', [
            'email' => $admin->email,
            'password' => 'password',
        ]);

        $response->assertRedirect(route('admin.dashboard'));
    }
}
