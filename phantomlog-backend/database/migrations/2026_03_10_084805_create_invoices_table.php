<?php

declare(strict_types=1);

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
        Schema::create('invoices', function (Blueprint $table): void {
            $table->uuid('id')->primary();
            $table->string('n_invoice')->unique();
            $table->foreignUuid('user_id')->constrained()->cascadeOnDelete();
            $table->string('dni', 9);
            $table->string('first_name');
            $table->string('last_name');
            $table->string('address');
            $table->string('postal_code');
            $table->integer('tax')->default(21);
            $table->decimal('total', 10, 2)->default(0);
            $table->string('payment_method')->default('credito');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('invoices');
    }
};
