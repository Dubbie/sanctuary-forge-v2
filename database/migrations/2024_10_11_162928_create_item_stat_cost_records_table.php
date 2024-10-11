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
        Schema::create('item_stat_cost_records', function (Blueprint $table) {
            $table->string('name')->primary();
            $table->string('op_base')->nullable();

            $table->string('max_stat')->nullable();
            $table->string('desc_str_pos')->nullable();
            $table->string('desc_str_neg')->nullable();
            $table->string('desc_str_2')->nullable();
            $table->string('desc_group_str_pos')->nullable();
            $table->string('desc_group_str_neg')->nullable();
            $table->string('desc_group_str_2')->nullable();

            $table->unsignedBigInteger('index');

            $table->integer('min_accr')->nullable();
            $table->unsignedInteger('operator_type')->nullable();
            $table->integer('op_param')->nullable();

            $table->unsignedInteger('desc_priority')->nullable();
            $table->unsignedInteger('desc_func_id')->nullable();

            $table->unsignedInteger('desc_val')->nullable();

            $table->unsignedInteger('desc_group')->nullable();
            $table->unsignedInteger('desc_group_val')->nullable();
            $table->unsignedInteger('desc_group_func_id')->nullable();

            $table->boolean('direct')->default(false);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('item_stat_cost_records');
    }
};
