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
        Schema::create('item_affix_commons', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->boolean('spawnable');
            $table->boolean('spawn_on_rare');
            $table->unsignedInteger('min_level');
            $table->unsignedInteger('max_level')->nullable();
            $table->unsignedInteger('required_level');
            $table->string('class')->nullable();
            $table->string('class_required_level')->nullable();
            $table->boolean('class_specific');
            $table->unsignedInteger('group');
            $table->string('include_item_types');
            $table->string('exclude_item_types');
            $table->boolean('automagic')->default(false)->comment("Is this from AutoMagic?");
            $table->string('type');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('item_affix_commons');
    }
};
