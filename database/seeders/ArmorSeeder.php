<?php

namespace Database\Seeders;

class ArmorSeeder extends ItemCommonSeeder
{
    protected function getCategory(): string
    {
        return 'armor';
    }

    protected function getFilePath(): string
    {
        return 'app/Armor.txt';
    }
}
