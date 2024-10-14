<?php

namespace App\Models;

use App\Services\TranslationService;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Model;

class ItemStatCostRecord extends Model
{
    public $timestamps = false;
    public $incrementing = false;
    protected $primaryKey = 'name';

    public const OP_STAT_MAX = 3;

    protected $fillable = [
        'name',
        'index',
        'min_accr',
        'operator_type',
        'op_param',
        'op_base',
        'desc_priority',
        'desc_val',
        'desc_func_id',
        'desc_str_pos',
        'desc_str_neg',
        'desc_str_2',
        'desc_group',
        'desc_group_func_id',
        'desc_group_val',
        'desc_group_str_pos',
        'desc_group_str_neg',
        'desc_group_str_2',
    ];

    protected $appends = ['positive', 'negative'];

    public function opStats()
    {
        return $this->hasMany(ItemStatCostRecord::class, 'op_stat_name', 'name');
    }

    public function positive(): Attribute
    {
        return Attribute::make(
            get: fn() => $this->translate('desc_str_pos')
        );
    }

    public function negative(): Attribute
    {
        return Attribute::make(
            get: fn() => $this->translate('desc_str_neg')
        );
    }

    private function translate(string $key): ?string
    {
        $actualKey = $this->$key;
        return $actualKey ? TranslationService::getTranslation($actualKey) : null;
    }
}
