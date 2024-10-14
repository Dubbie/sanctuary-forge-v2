<?php

namespace App\Services;

use App\Models\TblEntry;

class TranslationService
{
    public static function getTranslation(string $key): string
    {
        return TblEntry::find($key)->value ?? 'N/A';
    }
}
