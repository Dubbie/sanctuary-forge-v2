<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BodyLocationRecord extends Model
{
    public $timestamps = false;
    public $incrementing = false;
    protected $primaryKey = 'body_location';

    protected $fillable = [
        'body_location',
        'code',
    ];
}
