<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ItemTypeInvGfxRecord extends Model
{
    public $timestamps = false;

    protected $fillable = [
        'item_type',
        'inv_gfx',
        'inv_gfx_number',
    ];
}
