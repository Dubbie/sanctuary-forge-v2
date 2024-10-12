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

    /**
     * Get the owning propertyHolder model (SetItem, UniqueItem, Set, MagicPrefix, etc.).
     */
    public function propertyHolder()
    {
        return $this->morphTo();
    }
}
