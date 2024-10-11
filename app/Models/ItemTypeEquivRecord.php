<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ItemTypeEquivRecord extends Model
{
    public $timestamps = false;

    protected $fillable = [
        'item_type',
        'equiv_code',
        'equiv_code_number',
    ];
}
