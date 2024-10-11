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
        Schema::create('property_stat_records', function (Blueprint $table) {
            $table->id();
            $table->string('property_code');
            $table->integer('set_id')->nullable();
            $table->integer('value')->nullable();
            $table->integer('function_id')->nullable();
            $table->string('stat')->nullable();

            $table->foreign('stat')->references('name')->on('item_stat_cost_records');
            $table->foreign('property_code')->references('code')->on('property_records');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('property_stat_records');
    }
};
