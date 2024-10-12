<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ItemAffixCommon extends Model
{
    public $timestamps = false;

    public const MOD_MAX = 3;
    public const INCLUDE_MAX = 7;
    public const EXCLUDE_MAX = 3;

    protected $fillable = [
        'name',
        'spawnable',
        'spawn_on_rare',
        'min_level',
        'max_level',
        'required_level',
        'class',
        'class_required_level',
        'class_specific',
        'group',
        'include_item_types',
        'exclude_item_types',
        'automagic',
        'type',
    ];

    protected $casts = [
        'include_item_types' => 'array',
        'exclude_item_types' => 'array',
    ];

    /**
     * Get all the properties for the affix.
     */
    public function properties()
    {
        return $this->morphMany(PropertyDescriptor::class, 'property_holder');
    }

    /**
     * Boot method for the model.
     * Automatically deletes related property descriptors when affix is deleted.
     */
    protected static function boot()
    {
        parent::boot();

        static::deleting(function ($affix) {
            $affix->properties()->delete();
        });
    }
}
