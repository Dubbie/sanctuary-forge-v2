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
        Schema::create('item_type_inv_gfx_records', function (Blueprint $table) {
            $table->id();
            $table->string('item_type');
            $table->string('inv_gfx');
            $table->unsignedInteger('inv_gfx_number');

            $table->foreign('item_type')->references('item_type')->on('item_type_records');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('item_type_inv_gfx_records');
    }
};
