<?php

require_once 'vendor/autoload.php';

$app = require_once 'bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

use App\Models\Shop;
use App\Models\Bot;

echo "Shops in Database:\n";
echo "==================\n";

$shops = Shop::with('bots')->get();

foreach ($shops as $shop) {
    echo "Shop ID: {$shop->id}\n";
    echo "Name: {$shop->name}\n";
    echo "Description: {$shop->description}\n";
    echo "Status: {$shop->status}\n";
    echo "Bots: " . $shop->bots->count() . "\n";
    
    foreach ($shop->bots as $bot) {
        echo "  - Bot ID: {$bot->id}, Type: {$bot->bot_type}, Status: {$bot->status}\n";
    }
    echo "---\n";
}

echo "Total shops: " . $shops->count() . "\n"; 