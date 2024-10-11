<?php

namespace Database\Seeders;

use App\Models\BodyLocationRecord;
use Exception;
use Illuminate\Support\Facades\DB;

class BodyLocationSeeder extends FromFileSeeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $records = $this->readFile('app/BodyLocs.txt');

        $this->createFromRecords($records);
    }

    private function createFromRecords(array $records): void
    {
        foreach ($records as $record) {
            $fill = [
                'body_location' => $this->getString($record['Body Location']),
                'code' => $this->getString($record['Code']),
            ];

            BodyLocationRecord::create($fill);
        }


        $this->command->info(sprintf('%d records created', BodyLocationRecord::all()->count()));
    }
}
