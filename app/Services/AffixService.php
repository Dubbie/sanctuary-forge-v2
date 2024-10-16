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

        // Check for missing stat maps
        foreach ($affixes as $affix) {
            $propertyDescriptors = $affix->properties;

            foreach ($propertyDescriptors as $propertyDescriptor) {
                if (in_array($propertyDescriptor->code, array_keys(PseudoPropertyStatService::PROPERTY_STAT_MAP))) {
                    $modifiedPropertyDescriptor = PseudoPropertyStatService::attachPseudoPropertyStats($propertyDescriptor);

                    // Update the existing property descriptor in place
                    $index = $propertyDescriptors->search($propertyDescriptor);
                    if ($index !== false) {
                        $propertyDescriptors[$index] = $modifiedPropertyDescriptor; // Replace the old descriptor with the updated one
                    }
                }
            }

            // Return the updated properties back to the affix
            $affix->setRelation('properties', $propertyDescriptors);
        }

        // Filter prefixes, suffixes, and automagic affixes
        $prefixes = $affixes->filter(fn($affix) => $affix->type === 'prefix' && $affix->automagic === 0);
        $suffixes = $affixes->filter(fn($affix) => $affix->type === 'suffix' && $affix->automagic === 0);
        $automagic = $affixes->filter(fn($affix) => $affix->automagic === 1 && $affix->group === $item->auto_prefix);

        return [
            'prefixes' => array_values($prefixes->toArray()),
            'suffixes' => array_values($suffixes->toArray()),
            'automagic' => array_values($automagic->toArray()),
        ];
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
