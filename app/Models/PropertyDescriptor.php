<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PropertyDescriptor extends Model
{
    public $timestamps = false;

    protected $fillable = [
        'code',       // Property key, e.g., "fire_damage"
        'parameter',  // Optional parameter passed to the property
        'min',        // Minimum value
        'max',        // Maximum value
    ];

    protected $with = ['propertyRecord', 'propertyStatRecords'];

    /**
     * Get the owning propertyHolder model (SetItem, UniqueItem, Set, MagicPrefix, etc.).
     */
    public function propertyHolder()
    {
        return $this->morphTo();
    }

    /**
     * Get the property record.
     */
    public function propertyRecord()
    {
        return $this->belongsTo(PropertyRecord::class, 'code');
    }

    /**
     * Get the property stat records.
     */
    public function propertyStatRecords()
    {
        return $this->hasManyThrough(PropertyStatRecord::class, PropertyRecord::class, 'code', 'property_code', 'code', 'code');
    }
}
