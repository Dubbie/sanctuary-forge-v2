<?php

namespace App\Items;

use App\Models\ItemCommonRecord;
use JsonSerializable;

class Item implements JsonSerializable
{
    public $name;
    public $slotType;

    public $typeCode;
    public $commonCode;
    public $uniqueCode;
    public $setCode;
    public $setItemCode;
    public $image;

    public $prefixCodes = [];
    public $suffixCodes = [];

    public $properties = [];
    public $statContext;
    public $statList = [];
    public $uniqueStatList = [];
    public $setItemStatList = [];

    public $attributes;

    public $gridX;
    public $gridY;

    public $sockets = [];

    // Constructor to initialize fields
    public function __construct(array $data)
    {
        $this->name = $data['name'] ?? '';
        $this->slotType = $data['slotType'] ?? null;
        $this->image = $data['image'] ?? '';

        $this->typeCode = $data['typeCode'] ?? '';
        $this->commonCode = $data['commonCode'] ?? '';
        $this->uniqueCode = $data['uniqueCode'] ?? '';
        $this->setCode = $data['setCode'] ?? '';
        $this->setItemCode = $data['setItemCode'] ?? '';

        $this->prefixCodes = $data['prefixCodes'] ?? [];
        $this->suffixCodes = $data['suffixCodes'] ?? [];

        $this->properties = $data['properties'] ?? [];
        $this->statContext = $data['statContext'] ?? null;
        $this->statList = $data['statList'] ?? [];
        $this->uniqueStatList = $data['uniqueStatList'] ?? [];
        $this->setItemStatList = $data['setItemStatList'] ?? [];

        $this->attributes = $data['attributes'] ?? null;

        $this->gridX = $data['gridX'] ?? 0;
        $this->gridY = $data['gridY'] ?? 0;

        $this->sockets = $data['sockets'] ?? [];
    }

    public function getCommonRecord()
    {
        return ItemCommonRecord::where('code', $this->commonCode)->first();
    }

    public function getLabel()
    {
        $str = $this->name;

        return $str;
    }

    public function getItemDescription()
    {
        $lines = [];

        $common = $this->getCommonRecord();

        $lines[] = $this->getLabel();

        if ($common->min_ac > 0) {
            $min = $common->min_ac;
            $max = $common->max_ac;

            $lines[] = sprintf('%s %d %s %d', 'Defense:', $min, 'to', $max);
        }

        if ($common->min_damage > 0) {
            $min = $common->min_damage;
            $max = $common->max_damage;

            $lines[] = sprintf('%s %d %s %d', 'One-Hand Damage:', $min, 'to', $max);
        }

        if ($common->min_2hand_damage > 0) {
            $min = $common->min_2hand_damage;
            $max = $common->max_2hand_damage;

            $lines[] = sprintf('%s %d %s %d', 'Two-Hand Damage:', $min, 'to', $max);
        }

        if ($common->min_missile_damage > 0) {
            $min = $common->min_missile_damage;
            $max = $common->max_missile_damage;

            $lines[] = sprintf('%s %d %s %d', 'Throwing Damage:', $min, 'to', $max);
        }

        if ($common->required_strength > 1) {
            $lines[] = sprintf('%s %d', 'Required Strength:', $common->required_strength);
        }

        if ($common->required_dexterity > 1) {
            $lines[] = sprintf('%s %d', 'Required Dexterity:', $common->required_dexterity);
        }

        if ($common->required_level > 1) {
            $lines[] = sprintf('%s %d', 'Required Level:', $common->required_level);
        }

        // Stat strings here
        // TODO: Implement

        return $lines;
    }

    public function toArray()
    {
        return [
            'name' => $this->name,
            'code' => $this->commonCode,
            'image' => $this->image,
            'description' => $this->getItemDescription(),
        ];
    }

    public function jsonSerialize(): mixed
    {
        return $this->toArray();
    }
}
