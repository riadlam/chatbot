<?php

// Simple script to check for orphaned messages
// Run this in the Laravel backend directory

require_once 'vendor/autoload.php';

use Illuminate\Support\Facades\DB;

echo "🔍 Checking for orphaned messages...\n\n";

// Check for messages that don't have any associated keywords
$orphanedMessages = DB::table('bot_messages as bm')
    ->leftJoin('bot_keywords as bk', 'bm.id', '=', 'bk.message_id')
    ->whereNull('bk.message_id')
    ->select('bm.id', 'bm.bot_id', 'bm.type', 'bm.message', 'bm.created_at')
    ->get();

echo "📊 Found " . $orphanedMessages->count() . " orphaned messages:\n\n";

if ($orphanedMessages->count() > 0) {
    foreach ($orphanedMessages as $message) {
        echo "Message ID: {$message->id}\n";
        echo "Bot ID: {$message->bot_id}\n";
        echo "Type: {$message->type}\n";
        echo "Message: " . substr($message->message, 0, 50) . "...\n";
        echo "Created: {$message->created_at}\n";
        echo "---\n";
    }
} else {
    echo "✅ No orphaned messages found!\n";
}

echo "\n🔍 Checking for keywords without messages...\n\n";

// Check for keywords that don't have associated messages
$orphanedKeywords = DB::table('bot_keywords as bk')
    ->leftJoin('bot_messages as bm', 'bk.message_id', '=', 'bm.id')
    ->whereNull('bm.id')
    ->select('bk.id', 'bk.bot_id', 'bk.keyword', 'bk.message_id', 'bk.created_at')
    ->get();

echo "📊 Found " . $orphanedKeywords->count() . " orphaned keywords:\n\n";

if ($orphanedKeywords->count() > 0) {
    foreach ($orphanedKeywords as $keyword) {
        echo "Keyword ID: {$keyword->id}\n";
        echo "Bot ID: {$keyword->bot_id}\n";
        echo "Keyword: {$keyword->keyword}\n";
        echo "Message ID: {$keyword->message_id}\n";
        echo "Created: {$keyword->created_at}\n";
        echo "---\n";
    }
} else {
    echo "✅ No orphaned keywords found!\n";
}

echo "\n📈 Database Statistics:\n";
echo "Total messages: " . DB::table('bot_messages')->count() . "\n";
echo "Total keywords: " . DB::table('bot_keywords')->count() . "\n";
echo "Total bots: " . DB::table('bots')->count() . "\n";
