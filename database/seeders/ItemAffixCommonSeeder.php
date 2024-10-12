<?php

namespace Database\Seeders;

use App\Models\ItemAffixCommon;
use Exception;

abstract class ItemAffixCommonSeeder extends FromFileSeeder
{
    /**
     * Get if we need to set automagic to true.
     */
    abstract protected function isAutomagic(): bool;

    /**
     * Get the file path for the records.
     */
    abstract protected function getFilePath(): string;

    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $records = $this->readFile($this->getFilePath());
        $this->createFromRecords($records);
    }

    private function createFromRecords(array $records): void
    {
        foreach ($records as $record) {
            $fill = [
                'name' => $this->getString($record['Name']),
                'spawnable' => $this->getNumber($record['spawnable']) > 0,
                'spawn_on_rare' => $this->getNumber($record['rare']) > 0,
                'min_level' => $this->getNumber($record['level']),
                'max_level' => $this->getNumber($record['maxlevel']) > 0 ? $this->getNumber($record['maxlevel']) : null,
                'required_level' => $this->getNumber($record['levelreq']),
                'class' => $this->getString($record['class']),
                'class_required_level' => $this->getNumber($record['classlevelreq']),
                'class_specific' => $this->getNumber($record['classspecific'] ?? 0) > 0,
                'group' => $this->getNumber($record['group']),
                'automagic' => $this->isAutomagic(),
                'type' => $this->getTypeByName($record['Name']),
                'include_item_types' => [],
                'exclude_item_types' => [],
            ];

            // Include item types
            for ($i = 1; $i <= ItemAffixCommon::INCLUDE_MAX; $i++) {
                $itemType = $this->getString($record["itype{$i}"]);
                if (!$itemType) {
                    continue;
                }

                $fill['include_item_types'][] = $itemType;
            }

            // Exclude item types
            for ($i = 1; $i <= ItemAffixCommon::EXCLUDE_MAX; $i++) {
                $itemType = $this->getString($record["etype{$i}"]);
                if (!$itemType) {
                    continue;
                }

                $fill['exclude_item_types'][] = $itemType;
            }

            // Create the record
            $iacRecord = ItemAffixCommon::create($fill);

            // Mods (properties)
            try {
                for ($i = 1; $i <= ItemAffixCommon::MOD_MAX; $i++) {
                    $pdFill = [
                        'code' => $this->getString($record["mod{$i}code"]),
                        'parameter' => $this->getString($record["mod{$i}param"]),
                        'min' => $this->getNumber($record["mod{$i}min"]),
                        'max' => $this->getNumber($record["mod{$i}max"]),
                    ];

                    if (!$pdFill['code']) {
                        continue;
                    }

                    $this->command->info("Creating {$pdFill['code']} for {$iacRecord->name}");

                    $iacRecord->properties()->create($pdFill);
                }
            } catch (Exception $e) {
                $this->command->error($e->getMessage());
                $iacRecord->delete();
            }
        }
    }

    private function getTypeByName(string $name): string
    {
        $split = explode(' ', $name);
        return $split[0] === 'of' ? 'suffix' : 'prefix';
    }
}
