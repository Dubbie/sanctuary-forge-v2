<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ItemTypeRecord extends Model
{
    public $timestamps = false;
    public $incrementing = false;
    protected $primaryKey = 'item_type';

    public const EQUIV_MAX = 2;
    public const GFX_MAX = 6;

    protected $fillable = [
        'item_type',
        'code',
        'is_repairable',
        'is_equippable',
        'body_loc_1',
        'body_loc_2',
        'shoots',
        'quiver',
        'is_throwable',
        'is_reloadable',
        'is_reequippable',
        'is_autostacking',
        'is_stackable',
        'magic',
        'rare',
        'normal',
        "is_charm",
        "is_socketable",
        "is_beltable",
        'rarity',
        'class',
        'staff_mods',
        'var_inv_gfx',
    ];

    public function invGfxRecords()
    {
        return $this->hasMany(ItemTypeInvGfxRecord::class, 'item_type', 'item_type');
    }

    public function equivRecords()
    {
        return $this->hasMany(ItemTypeEquivRecord::class, 'item_type', 'item_type');
    }
}
