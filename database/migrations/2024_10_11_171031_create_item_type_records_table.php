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
        Schema::create('item_type_records', function (Blueprint $table) {
            $table->string('item_type')->primary();
            $table->string('code')->unique();
            $table->boolean('is_repairable');
            $table->boolean('is_equippable');
            $table->string('body_loc_1')->nullable();
            $table->string('body_loc_2')->nullable();
            $table->string('shoots')->nullable();
            $table->string('quiver')->nullable();
            $table->boolean('is_throwable');
            $table->boolean('is_reloadable');
            $table->boolean('is_reequippable');
            $table->boolean('is_autostacking');
            $table->boolean('magic')->comment("Magic only.");
            $table->boolean('rare')->comment("Can be rare");
            $table->boolean('normal')->comment("Normal only.");
            $table->boolean("is_charm");
            $table->boolean("is_socketable");
            $table->boolean("is_beltable");
            $table->unsignedInteger('rarity');
            $table->string('class')->nullable();
            $table->string('staff_mods')->nullable();
            $table->unsignedInteger('var_inv_gfx');

            $table->foreign('body_loc_1')->references('code')->on('body_location_records');
            $table->foreign('body_loc_2')->references('code')->on('body_location_records');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('item_type_records');
    }
};
