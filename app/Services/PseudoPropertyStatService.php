<?php

namespace App\Services;

use App\Models\ItemCommonRecord;
use App\Models\ItemStatCostRecord;
use App\Models\PropertyDescriptor;
use App\Models\PropertyStatRecord;

class PseudoPropertyStatService
{
    public const PROPERTY_STAT_MAP = [
        'dmg%' => [
            'stat' => 'item_mindamage_percent',
            'function_id' => 7,
        ],
        'dmg-min' => [
            'stat' => 'mindamage',
            'function_id' => 5,
        ],
        'dmg-max' => [
            'stat' => 'maxdamage',
            'function_id' => 6,
        ],
    ];

    /**
     * Create pseudo PropertyStatRecords if none exist.
     */
    public static function attachPseudoPropertyStats(PropertyDescriptor $propertyDescriptor)
    {
        foreach (self::PROPERTY_STAT_MAP as $propertyCode => $statData) {
            if ($propertyDescriptor->code === $propertyCode) {
                // Update the propertyStatRecords with pseudo stats
                $propertyRecord = $propertyDescriptor->propertyRecord;

                $isc = ItemStatCostRecord::find($statData['stat']);
                $mockRecord = new PropertyStatRecord([
                    'id' => 0,
                    'property_code' => $propertyCode,
                    'value' => 0,
                    'set_id' => 0,
                    'function_id' => $statData['function_id'],
                    'stat' => $statData['stat'],
                ]);

                $mockRecord->setRelation('statRecord', $isc);
                $propertyRecord->setRelation('propertyStatRecords', collect([$mockRecord]));
                $propertyDescriptor->setRelation('propertyRecord', $propertyRecord);
            }
        }

        return $propertyDescriptor;
    }
}
