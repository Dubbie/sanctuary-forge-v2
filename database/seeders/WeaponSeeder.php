<?php

namespace Database\Seeders;

class WeaponSeeder extends ItemCommonSeeder
{
    protected function getCategory(): string
    {
        return 'weapon';
    }

    protected function getFilePath(): string
    {
        return 'app/Weapons.txt';
    }
}
