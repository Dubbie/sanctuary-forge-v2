<?php

namespace App\Http\Controllers;

use App\Models\ItemCommonRecord;
use Inertia\Inertia;

class ItemController extends Controller
{
    public function index()
    {
        return Inertia::render('Items/Index', [
            'items' => ItemCommonRecord::all(),
        ]);
    }

    public function show(ItemCommonRecord $item)
    {
        return Inertia::render('Items/Show', [
            'item' => $item,
        ]);
    }
}
