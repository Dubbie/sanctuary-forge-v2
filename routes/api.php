<?php

use App\Http\Controllers\Api\AffixController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::prefix('affixes')->group(function () {
    Route::get('/{item}', [AffixController::class, 'getAvailableAffixes'])->name('api.affixes.available');
});
