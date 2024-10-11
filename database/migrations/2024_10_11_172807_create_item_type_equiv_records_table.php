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
        Schema::create('item_type_equiv_records', function (Blueprint $table) {
            $table->id();
            $table->string('item_type');
            $table->string('equiv_code');
            $table->unsignedInteger('equiv_code_number');

            $table->foreign('item_type')->references('item_type')->on('item_type_records');
            $table->foreign('equiv_code')->references('code')->on('item_type_records');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('item_type_equiv_records');
    }
};
