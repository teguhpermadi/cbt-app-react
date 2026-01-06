<?php

namespace Database\Seeders;

use App\Models\Permission;
use App\Models\Role;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class RoleAndPermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Reset cached roles and permissions
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        // Create Permissions
        $permissions = [
            'access-admin',
            'access-student',
            'manage-users',
            'manage-exams',
            'manage-grades',
            'manage-settings',
            'view-results',
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate(['name' => $permission]);
        }

        // Create Roles and Assign Permissions

        // Admin: All permissions
        $admin = Role::firstOrCreate(['name' => 'admin']);
        $admin->givePermissionTo(Permission::all());

        // Teacher: Specific permissions
        $teacher = Role::firstOrCreate(['name' => 'teacher']);
        $teacher->givePermissionTo([
            'access-admin',
            'manage-exams',
            'manage-grades',
            'view-results'
        ]);

        // Student: Student access only
        $student = Role::firstOrCreate(['name' => 'student']);
        $student->givePermissionTo([
            'access-student',
            'view-results'
        ]);

        // Parent
        $parent = Role::firstOrCreate(['name' => 'parent']);
        $parent->givePermissionTo([
            // Define parent permissions later if needed
            'view-results'
        ]);
    }
}
