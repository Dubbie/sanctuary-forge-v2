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

    protected $appends = ['image_url', 'automagic_affix'];

    public function imageUrl(): Attribute
    {
        return Attribute::make(
            get: fn() => $this->getImageUrl(),
        );
    }

    public function automagicAffix(): Attribute
    {
        return Attribute::make(
            get: fn() => $this->getAutomagicAffix(),
        );
    }

    private function getImageUrl(): string
    {
        return '/img/' . $this->inventory_file . '.png';
    }

    private function getAutomagicAffix(): ?ItemAffixCommon
    {
        if ($this->auto_prefix) {
            $affix = ItemAffixCommon::where('group', '=', $this->auto_prefix)->orderBy('min_level', 'desc')->first();
            return $affix;
        }

        return null;
    }
}
