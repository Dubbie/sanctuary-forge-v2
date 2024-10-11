<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

abstract class FromFileSeeder extends Seeder
{
    protected function readFile(string $path): array
    {
        // Read the file line by line
        $properties = file(storage_path($path), FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);

        // Get headers
        $headers = explode("\t", $properties[0]);

        // Loop through the lines
        $data = [];
        for ($line = 1; $line < count($properties); $line++) {
            $split = explode("\t", $properties[$line]);

            if ($split[0] === 'Expansion') {
                continue;
            }

            $property = [];
            foreach ($split as $index => $value) {
                $header = $headers[$index];
                $property[$header] = $value;
            }

            $data[] = $property;
        }

        return $data;
    }

    protected function getString(mixed $value): ?string
    {
        if ($value === '') {
            return null;
        }

        return $value;
    }

    protected function getNumber(mixed $value): ?int
    {
        if ($value === '') {
            return 0;
        }

        return (int) $value;
    }
}
