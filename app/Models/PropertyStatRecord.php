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
        'function_id'
    ];
}
