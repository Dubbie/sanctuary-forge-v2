<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ItemCommonRecord;
use App\Services\AffixService;
use Illuminate\Http\Request;

class AffixController extends Controller
{
    public function getAvailableAffixes(ItemCommonRecord $item)
    {
        return AffixService::getAvailableAffixes($item);
    }
}
