<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::create('versions', function (Blueprint $table) {
            // Package generates UUID for version ID, so use uuid()
            $table->uuid('id')->primary();

            // Explicitly support ULIDs for User and Versionable
            $table->foreignUlid('user_id')->nullable();

            // versionable_id for Question is ULID
            $table->ulidMorphs('versionable');

            $table->json('contents')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down()
    {
        Schema::dropIfExists('versions');
    }
};
