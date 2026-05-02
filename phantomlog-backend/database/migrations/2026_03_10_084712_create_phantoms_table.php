<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('phantoms', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string("name")->unique();
            $table->string("type");
            $table->text("description");
            $table->text("strengths")->nullable();
            $table->text("weaknesses")->nullable();
            $table->text("evidence")->nullable();
            $table->string("location")->nullable();
            $table->string("image")->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('phantoms');
    }
};
