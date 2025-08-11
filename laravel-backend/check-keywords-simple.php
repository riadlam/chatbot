<?php

require_once 'vendor/autoload.php';

$app = require_once 'bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

use Illuminate\Support\Facades\DB;

echo "Checking keywords in database...\n\n";

// Check bot_keywords table
$keywords = DB::table('bot_keywords')->get();
echo "Total keywords: " . $keywords->count() . "\n";

foreach ($keywords as $keyword) {
    echo "Keyword ID: {$keyword->id}\n";
    echo "Bot ID: {$keyword->bot_id}\n";
    echo "Keyword: '{$keyword->keyword}'\n";
    echo "Message ID: {$keyword->message_id}\n";
    echo "---\n";
}

// Check bot_messages table
$messages = DB::table('bot_messages')->get();
echo "\nTotal messages: " . $messages->count() . "\n";

foreach ($messages as $message) {
    echo "Message ID: {$message->id}\n";
    echo "Bot ID: {$message->bot_id}\n";
    echo "Type: {$message->type}\n";
    echo "Message: " . substr($message->message, 0, 50) . "...\n";
    echo "---\n";
} 