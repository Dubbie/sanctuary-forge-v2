<?php

namespace App\Http\Controllers;

use App\Services\ItemService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ItemController extends Controller
{
    private ItemService $itemService;

    public function __construct(ItemService $itemService)
    {
        $this->itemService = $itemService;
    }

    public function index()
    {
        return Inertia::render('Items/Index', [
            'items' => $this->itemService->getAllTransformed(),
        ]);
    }
}
