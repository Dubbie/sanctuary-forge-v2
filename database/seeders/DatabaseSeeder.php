<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call(ItemStatCostSeeder::class);
        $this->call(PropertySeeder::class);
        $this->call(BodyLocationSeeder::class);
        $this->call(ItemTypeSeeder::class);
        $this->call(ArmorSeeder::class);
        $this->call(WeaponSeeder::class);
    }
}
