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
        Schema::create('item_stat_cost_op_stat_records', function (Blueprint $table) {
            $table->id();
            $table->string('stat');
            $table->string('op_stat');
            $table->unsignedSmallInteger('stat_number');

            $table->foreign('stat')->references('name')->on('item_stat_cost_records');
            $table->foreign('op_stat')->references('name')->on('item_stat_cost_records');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('item_stat_cost_op_stat_records');
    }
};
