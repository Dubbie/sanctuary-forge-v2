<?php

namespace App\Services;

use App\Items\ItemTransformer;
use App\Models\ItemCommonRecord;

class ItemService
{
    public function getAllTransformed()
    {
        $records = ItemCommonRecord::all();

        $items = $records->map(function ($record) {
            return ItemTransformer::transformCommonItem($record);
        });

        return $items;
    }
}
