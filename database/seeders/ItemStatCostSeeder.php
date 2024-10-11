<?php

namespace Database\Seeders;

use App\Models\ItemStatCostOpStatRecord;
use App\Models\ItemStatCostRecord;

class ItemStatCostSeeder extends FromFileSeeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $records = $this->readFile('app/ItemStatCost.txt');

        $this->createFromRecords($records);
    }

    private function createFromRecords(array $records): void
    {
        $operations = [];

        foreach ($records as $record) {
            $fill = [
                'name' => $this->getString($record['Stat']),
                'index' => $this->getNumber($record['ID']),

                'min_accr' => $this->getNumber($record['MinAccr']),

                'operator_type' => $this->getNumber($record['op']),
                'op_param' => $this->getNumber($record['op param']),
                'op_base' => $this->getString($record['op base']),

                'desc_priority' => $this->getNumber($record['descpriority']),
                'desc_func_id' => $this->getNumber($record['descfunc']),
                'desc_str_pos' => $this->getString($record['descstrpos']),
                'desc_str_neg' => $this->getString($record['descstrneg']),
                'desc_str_2' => $this->getString($record['descstr2']),

                'desc_group' => $this->getNumber($record['dgrp']),
                'desc_group_func_id' => $this->getNumber($record['dgrpfunc']),

                'desc_group_val' => $this->getNumber($record['dgrpval']),
                'desc_group_str_pos' => $this->getString($record['dgrpstrpos']),
                'desc_group_str_neg' => $this->getString($record['dgrpstrneg']),
                'desc_group_str_2' => $this->getString($record['dgrpstr2']),
            ];

            $descValStr = $this->getString('descval');
            switch ($descValStr) {
                case '2':
                    $fill['desc_val'] = 2;
                    break;
                case '0':
                    $fill['desc_val'] = 0;
                    break;
                default:
                    $fill['desc_val'] = 1;
                    break;
            }

            // Get the op stats
            for ($i = 1; $i <= ItemStatCostRecord::OP_STAT_MAX; $i++) {
                $opStatName = $this->getString($record["op stat{$i}"]);

                if (!$opStatName) {
                    continue;
                }

                $operations[] = [
                    'stat' => $fill['name'],
                    'op_stat' => $opStatName,
                    'stat_number' => $i,
                ];
            }

            ItemStatCostRecord::create($fill);
        }

        ItemStatCostOpStatRecord::insert($operations);

        $this->command->info(sprintf('%d records created', ItemStatCostRecord::all()->count()));
    }
}
