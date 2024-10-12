<?php

namespace Database\Seeders;

class AutoMagicSeeder extends ItemAffixCommonSeeder
{
    protected function isAutomagic(): bool
    {
        return true;
    }

    protected function getFilePath(): string
    {
        return 'app/AutoMagic.txt';
    }
}
