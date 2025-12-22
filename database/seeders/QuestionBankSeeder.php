<?php

namespace Database\Seeders;

use App\Models\QuestionBank;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class QuestionBankSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $banks = QuestionBank::factory(5)->create();

        foreach ($banks as $bank) {
            foreach (\App\Enums\QuestionTypeEnum::cases() as $type) {
                \App\Models\Question::factory()
                    ->withType($type)
                    ->create([
                        'question_bank_id' => $bank->id,
                    ]);
            }
        }
    }
}
