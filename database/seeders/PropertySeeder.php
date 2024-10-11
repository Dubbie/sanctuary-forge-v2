<?php

namespace Database\Seeders;

use App\Models\PropertyRecord;
use Exception;
use Illuminate\Support\Facades\DB;

class PropertySeeder extends FromFileSeeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $records = $this->readFile('app/Properties.txt');

        $this->createFromRecords($records);
    }

    private function createFromRecords(array $records): void
    {
        foreach ($records as $record) {
            try {
                DB::beginTransaction();

                $fill = [
                    'code' => $this->getString($record['code']),
                    'is_active' => $this->getNumber($record['*done']) > 0,
                ];

                $propertyRecord = PropertyRecord::create($fill);

                // Get the property stats
                for ($i = 1; $i <= PropertyRecord::PROPERTY_STAT_MAX; $i++) {
                    $propertyStatFill = [
                        'set_id' => $this->getNumber($record["set{$i}"]),
                        'value' => $this->getNumber($record["val{$i}"]),
                        'function_id' => $this->getNumber($record["func{$i}"]),
                        'stat' => $this->getString($record["stat{$i}"]),
                    ];

                    if (!$propertyStatFill['function_id']) {
                        continue;
                    }

                    $propertyRecord->propertyStatRecords()->create($propertyStatFill);
                }

                DB::commit();
            } catch (Exception $e) {
                DB::rollBack();
                $this->command->error($e->getMessage());
            }
        }


        $this->command->info(sprintf('%d records created', PropertyRecord::all()->count()));
    }
}
