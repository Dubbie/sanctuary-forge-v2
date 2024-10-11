<?php

namespace Database\Seeders;

use App\Models\ItemTypeEquivRecord;
use App\Models\ItemTypeRecord;
use Exception;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class ItemTypeSeeder extends FromFileSeeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $records = $this->readFile('app/ItemTypes.txt');

        $this->createFromRecords($records);
    }

    private function createFromRecords(array $records): void
    {
        $equivalents = [];

        foreach ($records as $record) {
            $fill = [
                'item_type' => $this->getString($record['ItemType']),
                'code' => $this->getString($record['Code']),
                'is_repairable' => $this->getNumber($record['Repair']) > 0,
                'is_equippable' => $this->getNumber($record['Body']) > 0,
                'body_loc_1' => $this->getString($record['BodyLoc1']),
                'body_loc_2' => $this->getString($record['BodyLoc2']),
                'shoots' => $this->getString($record['Shoots']),
                'quiver' => $this->getString($record['Quiver']),
                'is_throwable' => $this->getNumber($record['Throwable']) > 0,
                'is_reloadable' => $this->getNumber($record['Reload']) > 0,
                'is_reequippable' => $this->getNumber($record['ReEquip']) > 0,
                'is_autostacking' => $this->getNumber($record['AutoStack']) > 0,
                'magic' => $this->getNumber($record['Magic']) > 0,
                'rare' => $this->getNumber($record['Rare']) > 0,
                'normal' => $this->getNumber($record['Normal']) > 0,
                'is_charm' => $this->getNumber($record['Charm']) > 0,
                'is_socketable' => $this->getNumber($record['Gem']) > 0,
                'is_beltable' => $this->getNumber($record['Beltable']) > 0,
                'rarity' => $this->getNumber($record['Rarity']),
                'staff_mods' => $this->getString($record['StaffMods']),
                'class' => $this->getString($record['Class']),
                'var_inv_gfx' => $this->getNumber($record['VarInvGfx']),
            ];

            // Skip unused stuff
            if (!$fill['code']) {
                continue;
            }

            $itr = ItemTypeRecord::create($fill);

            // Add the equivalents
            for ($i = 1; $i <= ItemTypeRecord::EQUIV_MAX; $i++) {
                $equivName = $this->getString($record["Equiv{$i}"]);
                if (!$equivName) {
                    continue;
                }

                $equivalents[] = [
                    'item_type' => $fill['item_type'],
                    'equiv_code' => $equivName,
                    'equiv_code_number' => $i,
                ];
            }

            // Add the variable gfxs
            for ($i = 1; $i <= ItemTypeRecord::GFX_MAX; $i++) {
                $gfx = $this->getString($record["InvGfx{$i}"]);
                if (!$gfx) {
                    continue;
                }

                $itr->invGfxRecords()->create([
                    'inv_gfx' => $gfx,
                    'inv_gfx_number' => $i,
                ]);
            }
        }

        // Create the equivalents
        if ($equivalents) {
            ItemTypeEquivRecord::insert($equivalents);
        }

        $this->command->info(sprintf('%d records created', ItemTypeRecord::all()->count()));
    }
}
