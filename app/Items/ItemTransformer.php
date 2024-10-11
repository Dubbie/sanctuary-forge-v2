<?php

namespace App\Items;

use App\Models\ItemCommonRecord;

class ItemTransformer
{
    public static function transformCommonItem(ItemCommonRecord $record)
    {
        return new Item([
            'name' => $record->name,
            'commonCode' => $record->code,
            'image' => $record->inventory_file,
        ]);
    }
}
