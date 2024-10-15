<?php

namespace App\Services;

use App\Models\ItemAffixCommon;
use App\Models\ItemCommonRecord;
use App\Models\ItemTypeRecord;

class AffixService
{
    public static function getAvailableAffixes(ItemCommonRecord $item)
    {
        $types = self::getAllEquivTypes($item->itemType->equivRecords->pluck('equiv_code')->toArray());
        $types[] = $item->type;

        $affixes = self::getFilteredAffixes($types, $item);

        // Filter prefixes, suffixes, and automagic affixes
        // $prefixes = $affixes->filter(function ($affix) {
        //     return $affix->type === 'prefix' && $affix->automagic === 0;
        // });
        // $suffixes = $affixes->filter(function ($affix) {
        //     return $affix->type === 'suffix' && $affix->automagic === 0;
        // });
        $automagic = $affixes->filter(function ($affix) use ($item) {
            return $affix->automagic === 1 && $affix->group === $item->auto_prefix;
        });

        return $automagic;
    }

    /**
     * The helper method that filters affixes.
     *
     * @param array $types
     * @param ItemCommonRecord $item
     * @return \Illuminate\Support\Collection
     */
    public static function getFilteredAffixes(array $types, ItemCommonRecord $item)
    {
        return ItemAffixCommon::where(function ($query) use ($types, $item) {
            foreach ($types as $type) {
                // Check if any of the types are included in the 'include_item_types' field
                $query->orWhereJsonContains('include_item_types', $type);
            }
        })
            ->where(function ($query) use ($types) {
                foreach ($types as $type) {
                    // Make sure none of the types are in the 'exclude_item_types' field
                    $query->whereJsonDoesntContain('exclude_item_types', $type);
                }
            })
            ->where(function ($query) use ($item) {
                // Handle automagic and non-automagic affixes
                $query->where(function ($query) use ($item) {
                    $query->where('automagic', 1)
                        ->where('group', $item->auto_prefix);
                })
                    ->orWhere(function ($query) {
                        $query->where('automagic', 0);
                    });
            })
            ->where('spawnable', 1)
            ->get();
    }

    /**
     * Recursively collect all equivalent item types.
     *
     * @param array $types
     * @return array
     */
    protected static function getAllEquivTypes(array $types)
    {
        $allTypes = $types;

        foreach ($types as $type) {
            $itemType = ItemTypeRecord::where('code', $type)->first();
            if ($itemType) {
                $equivTypes = $itemType->equivRecords->pluck('equiv_code')->toArray();

                foreach ($equivTypes as $equivType) {
                    if (!in_array($equivType, $allTypes)) {
                        $allTypes[] = $equivType;
                        $allTypes = array_merge($allTypes, self::getAllEquivTypes([$equivType]));
                    }
                }
            }
        }

        return array_unique($allTypes);
    }
}
