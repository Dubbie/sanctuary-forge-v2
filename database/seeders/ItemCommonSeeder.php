<?php

namespace Database\Seeders;

use App\Models\ItemCommonRecord;

abstract class ItemCommonSeeder extends FromFileSeeder
{
    /**
     * Get the category for the seeder (armor, weapon, etc.).
     */
    abstract protected function getCategory(): string;

    /**
     * Get the file path for the records.
     */
    abstract protected function getFilePath(): string;

    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $items = ItemCommonRecord::where('category', $this->getCategory())->get();
        foreach ($items as $itemRecord) {
            $itemRecord->delete();
        }

        $records = $this->readFile($this->getFilePath());
        $this->createFromRecords($records);
    }

    private function createFromRecords(array $records): void
    {
        foreach ($records as $record) {
            $alternateGfxKey = 'alternategfx';

            if (isset($record['alternateGfx'])) {
                $alternateGfxKey = 'alternateGfx';
            }

            $fill = [
                'name' => $this->getString($record['name']),
                'category' => $this->getCategory(),
                'min_ac' => $this->getNumber($record['minac'] ?? 0),
                'max_ac' => $this->getNumber($record['maxac'] ?? 0),
                'absorbs' => $this->getNumber($record['absorbs'] ?? 0),
                'speed' => $this->getNumber($record['speed']),
                'required_strength' => $this->getNumber($record['reqstr']),
                'block' => $this->getNumber($record['block'] ?? 0),
                'level' => $this->getNumber($record['level']),
                'required_level' => $this->getNumber($record['levelreq']),
                'code' => $this->getString($record['code']),
                'name_string' => $this->getString($record['namestr']),
                'magic_level' => $this->getNumber($record['magic lvl']),
                'auto_prefix' => $this->getNumber($record['auto prefix']),
                'alternate_gfx' => $this->getString($record[$alternateGfxKey]),
                'open_beta_gfx' => $this->getString($record['OpenBetaGfx']),
                'normal_code' => $this->getString($record['normcode']),
                'uber_code' => $this->getString($record['ubercode']),
                'ultra_code' => $this->getString($record['ultracode']),
                'inventory_file' => $this->getString($record['invfile']),
                'unique_inventory_file' => $this->getString($record['uniqueinvfile']),
                'set_inventory_file' => $this->getString($record['setinvfile']),
                'inventory_width' => $this->getNumber($record['invwidth']),
                'inventory_height' => $this->getNumber($record['invheight']),
                'has_inventory' => $this->getNumber($record['hasinv']) > 0,
                'sockets' => $this->getNumber($record['gemsockets']),
                'gem_apply_type' => $this->getNumber($record['gemapplytype']),
                'is_throwable' => $this->getNumber($record['throwable'] ?? 0) > 0,
                'type' => $this->getString($record['type']),
                'type2' => $this->getString($record['type2']),
                'unique' => $this->getNumber($record['unique']) > 0,
                'quivered' => $this->getNumber($record['quivered']) > 0,
                'min_damage' => $this->getNumber($record['mindam']),
                'max_damage' => $this->getNumber($record['maxdam']),
                'str_bonus' => $this->getNumber($record['StrBonus']),
                'dex_bonus' => $this->getNumber($record['DexBonus']),
                'barb_one_or_two_handed' => $this->getNumber($record['1or2handed'] ?? 0) > 0,
                'uses_two_hands' => $this->getNumber($record['2handed'] ?? 0) > 0,
                'min_2hand_damage' => $this->getNumber($record['2handmindam'] ?? 0),
                'max_2hand_damage' => $this->getNumber($record['2handmaxdam'] ?? 0),
                'min_missile_damage' => $this->getNumber($record['minmisdam'] ?? 0),
                'max_missile_damage' => $this->getNumber($record['maxmisdam'] ?? 0),
                'extra_range' => $this->getNumber($record['rangeadder'] ?? 0),
                'required_dexterity' => $this->getNumber($record['reqdex'] ?? 0),
            ];

            ItemCommonRecord::create($fill);
        }

        $this->command->info(sprintf('%d %ss created', ItemCommonRecord::where('category', $this->getCategory())->count(), $this->getCategory()));
    }
}
