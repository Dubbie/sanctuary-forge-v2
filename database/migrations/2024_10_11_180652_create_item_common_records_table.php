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
        Schema::create('item_common_records', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('category'); // Weapon, Armor, Misc.
            $table->unsignedInteger('min_ac');
            $table->unsignedInteger('max_ac');
            $table->unsignedInteger('absorbs');
            $table->integer('speed');
            $table->unsignedInteger('required_strength');
            $table->unsignedInteger('block');
            $table->unsignedInteger('level');
            $table->unsignedInteger('required_level');
            $table->string('code');
            $table->string('name_string');
            $table->unsignedInteger('magic_level')->nullable();
            $table->unsignedInteger('auto_prefix')->nullable();
            $table->string('alternate_gfx')->nullable();
            $table->string('open_beta_gfx')->nullable();
            $table->string('normal_code');
            $table->string('uber_code')->nullable();
            $table->string('ultra_code')->nullable();
            $table->string('inventory_file');
            $table->string('unique_inventory_file')->nullable();
            $table->string('set_inventory_file')->nullable();

            $table->unsignedInteger('inventory_width');
            $table->unsignedInteger('inventory_height');
            $table->boolean('has_inventory');
            $table->unsignedInteger('sockets');
            $table->unsignedInteger('gem_apply_type');
            $table->boolean('is_throwable');
            $table->string('type');
            $table->string('type2')->nullable();
            $table->boolean('unique');
            $table->boolean('quivered');

            $table->unsignedInteger('min_damage');
            $table->unsignedInteger('max_damage');
            $table->unsignedInteger('str_bonus');
            $table->unsignedInteger('dex_bonus');

            // Weapon params
            $table->boolean('barb_one_or_two_handed');
            $table->boolean('uses_two_hands');
            $table->unsignedInteger('min_2hand_damage');
            $table->unsignedInteger('max_2hand_damage');
            $table->unsignedInteger('min_missile_damage');
            $table->unsignedInteger('max_missile_damage');
            $table->unsignedInteger('extra_range');
            $table->unsignedInteger('required_dexterity');

            $table->string('weapon_class')->nullable();
            $table->string('weapon_class_2hand')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('item_common_records');
    }
};
