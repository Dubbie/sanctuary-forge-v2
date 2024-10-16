<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Model;

class ItemCommonRecord extends Model
{
    public $timestamps = false;

    protected $fillable = [
        'name',
        'category',
        'min_ac',
        'max_ac',
        'absorbs',
        'speed',
        'required_strength',
        'block',
        'level',
        'required_level',
        'code',
        'name_string',
        'magic_level',
        'auto_prefix',
        'alternate_gfx',
        'open_beta_gfx',
        'normal_code',
        'uber_code',
        'ultra_code',
        'inventory_file',
        'unique_inventory_file',
        'set_inventory_file',
        'inventory_width',
        'inventory_height',
        'has_inventory',
        'sockets',
        'gem_apply_type',
        'is_throwable',
        'type',
        'type2',
        'unique',
        'quivered',
        'min_damage',
        'max_damage',
        'str_bonus',
        'dex_bonus',
        'barb_one_or_two_handed',
        'uses_two_hands',
        'min_2hand_damage',
        'max_2hand_damage',
        'min_missile_damage',
        'max_missile_damage',
        'extra_range',
        'required_dexterity',
    ];

    protected $with = ['itemType'];
    protected $appends = ['image_url', 'hardcoded_affixes'];

    public function imageUrl(): Attribute
    {
        return Attribute::make(
            get: fn() => $this->getImageUrl(),
        );
    }

    public function hardcodedAffixes(): Attribute
    {
        return Attribute::make(
            get: fn() => $this->getHardcodedAffixes(),
        );
    }

    public function itemType()
    {
        return $this->hasOne(ItemTypeRecord::class, 'code', 'type');
    }

    /**
     * Recursively get all equivalent types for the item.
     *
     * @return array
     */
    public function getAllEquivTypes()
    {
        $types = [$this->type];

        foreach ($this->itemType->equivRecords as $equivRecord) {
            $equivTypes = $this->getEquivTypesRecursive([$equivRecord->equiv_code]);

            foreach ($equivTypes as $equivType) {
                if (!in_array($equivType, $types)) {
                    $types[] = $equivType;
                }
            }
        }

        return array_unique($types);
    }

    /**
     * Recursive function to fetch all equivalent types.
     *
     * @param array $types
     * @return array
     */
    protected function getEquivTypesRecursive(array $types)
    {
        $allTypes = $types;

        foreach ($types as $type) {
            $itemType = ItemTypeRecord::where('code', $type)->first();
            if ($itemType) {
                $equivTypes = $itemType->equivRecords->pluck('equiv_code')->toArray();

                foreach ($equivTypes as $equivType) {
                    if (!in_array($equivType, $allTypes)) {
                        $allTypes[] = $equivType;
                        $allTypes = array_merge($allTypes, $this->getEquivTypesRecursive([$equivType]));
                    }
                }
            }
        }

        return array_unique($allTypes);
    }

    private function getImageUrl(): string
    {
        return '/img/' . $this->inventory_file . '.png';
    }

    private function getHardcodedAffixes(): array
    {
        $props = [];

        // Early return if the item type doesn't match
        if ($this->type !== 'blun' && !in_array('blun', $this->itemType->equivRecords->pluck('equiv_code')->toArray())) {
            return $props;
        }

        // Create the affix for blunt weapons
        $affix = new ItemAffixCommon([
            'name' => 'Blunt Weapon',
            'spawnable' => true,
            'spawn_on_rare' => false,
            'min_level' => 1,
            'max_level' => 99,
            'required_level' => 1,
            'class' => 'Any',
            'class_required_level' => 1,
            'class_specific' => false,
            'group' => 'Undead',
            'include_item_types' => [],
            'exclude_item_types' => [],
            'automagic' => true,
            'type' => 'prefix',
        ]);

        // Create the property descriptor
        $pd = $this->createPropertyDescriptor('dmg-undead', 50, 50);

        // Set the property relation for the affix
        $affix->setRelation('properties', collect([$pd]));

        // Add the affix to the list
        $props[] = $affix;

        return $props;
    }

    /**
     * Create a PropertyDescriptor instance with the given parameters.
     *
     * @param string $code
     * @param int $min
     * @param int $max
     * @return PropertyDescriptor
     */
    private function createPropertyDescriptor(string $code, int $min, int $max): PropertyDescriptor
    {
        $property = PropertyRecord::find($code);
        $pd = new PropertyDescriptor([
            'code' => $property->code,
            'parameter' => null,
            'min' => $min,
            'max' => $max,
        ]);

        return $pd->setRelation('propertyRecord', $property);
    }
}
