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
        Schema::create('property_descriptors', function (Blueprint $table) {
            $table->id();

            // Polymorphic relationship
            $table->morphs('property_holder', 'prop_holder_type_id_index'); // This creates property_holder_type and property_holder_id

            // Property fields
            $table->string('code');            // The key for the property (e.g., "fire_damage")
            $table->string('parameter')->nullable(); // Optional parameter, sometimes properties have an extra param
            $table->integer('min')->nullable(); // Min value for the property
            $table->integer('max')->nullable(); // Max value for the property

            // FK
            $table->foreign('code')->references('code')->on('property_records');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('property_descriptors');
    }
};
