<?php

namespace Database\Seeders;

use App\Models\ReadingMaterial;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ReadingMaterialSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        ReadingMaterial::factory(10)->create();
    }
}
