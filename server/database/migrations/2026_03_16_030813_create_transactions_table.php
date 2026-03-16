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
        Schema::create('transactions', function (Blueprint $table) {
            $table->id();
            $table->string('order_id')->unique(); // Nomor struk (Misal: TRX-12345)
            $table->string('game_code'); // Misal: mobilelegend
            $table->string('user_game_id'); // ID Game Pembeli
            $table->string('product_code'); // Kode dari APIGames (Misal: ML3)
            $table->integer('amount'); // Harga
            $table->string('status')->default('pending'); // pending, success, failed
            $table->string('snap_token')->nullable(); // Token dari Midtrans
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('transactions');
    }
};
