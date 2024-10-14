<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PropertyRecord extends Model
{
    public $timestamps = false;
    public $incrementing = false;
    protected $primaryKey = 'code';

    public const PROPERTY_STAT_MAX = 7;

    protected $fillable = [
        'code',
        'is_active'
    ];

    protected $with = [
        'propertyStatRecords'
    ];

    public function propertyStatRecords()
    {
        return $this->hasMany(PropertyStatRecord::class, 'property_code', 'code');
    }
}
