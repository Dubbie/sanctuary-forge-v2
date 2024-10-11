<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ItemStatCostOpStatRecord extends Model
{
    public $timestamps = false;

    protected $fillable = [
        'stat',
        'op_stat',
        'stat_number'
    ];
}
