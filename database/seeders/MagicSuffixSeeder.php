<?php

namespace Database\Seeders;

class MagicSuffixSeeder extends ItemAffixCommonSeeder
{
    protected function isAutomagic(): bool
    {
        return false;
    }

    protected function getFilePath(): string
    {
        return 'app/MagicSuffix.txt';
    }
}
