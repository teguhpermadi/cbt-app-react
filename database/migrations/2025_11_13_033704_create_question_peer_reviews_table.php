<?php

use App\Enums\ReviewStatusEnum;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Predis\Command\Traits\Rev;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('question_peer_reviews', function (Blueprint $table) {
            $table->ulid('id')->primary(); 
                        
            $table->foreignUlid('question_id')->references('id')->on('questions')->onDelete('cascade');            
            $table->foreignUlid('reviewer_id')->references('id')->on('users')->onDelete('cascade');

            // Menggunakan nilai dari Enum
            $table->string('status')->default(ReviewStatusEnum::Pending->value);
            $table->text('notes')->nullable();
            
            $table->timestamp('reviewed_at')->nullable(); // Ditambahkan nullable agar bisa diset di Factory
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('question_peer_reviews');
    }
};
