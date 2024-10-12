<?php

namespace Database\Seeders;

class MagicPrefixSeeder extends ItemAffixCommonSeeder
{
    protected function isAutomagic(): bool
    {
        return false;
    }

    protected function getFilePath(): string
    {
        return 'app/MagicPrefix.txt';
    }
}
