<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PropertyStatRecord extends Model
{
    public $timestamps = false;

    protected $fillable = [
        'property_code',
        'stat',
        'value',
        'set_id',
        'function_id'
    ];

    protected $with = ['statRecord'];

    public function statRecord()
    {
        return $this->belongsTo(ItemStatCostRecord::class, 'stat', 'name');
    }
}
