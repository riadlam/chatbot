<?php

require_once 'vendor/autoload.php';

$app = require_once 'bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

use App\Models\Bot;
use App\Models\BotKeyword;
use App\Models\BotMessage;

echo "Bot Keywords and Messages:\n";
echo "=========================\n\n";

$bots = Bot::with(['keywords.message'])->get();

foreach ($bots as $bot) {
    echo "Bot ID: {$bot->id}\n";
    echo "Bot Type: {$bot->bot_type}\n";
    echo "Status: {$bot->status}\n";
    echo "Keywords: " . $bot->keywords->count() . "\n";
    
    foreach ($bot->keywords as $keyword) {
        echo "  - Keyword: '{$keyword->keyword}'\n";
        if ($keyword->message) {
            echo "    Message ID: {$keyword->message->id}\n";
            echo "    Message Type: {$keyword->message->type}\n";
            $messageContent = is_array($keyword->message->message) ? json_encode($keyword->message->message) : $keyword->message->message;
            echo "    Message Content: " . substr($messageContent, 0, 100) . "...\n";
        } else {
            echo "    ❌ No message associated!\n";
        }
    }
    echo "---\n";
}

echo "\nTotal bots: " . $bots->count() . "\n"; 