<?php

require_once 'laravel-backend/vendor/autoload.php';

$app = require_once 'laravel-backend/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

use App\Models\Bot;
use App\Models\BotKeyword;
use App\Models\BotMessage;

echo "Adding test keywords to bot...\n\n";

try {
    // Get bot 2 (your connected bot)
    $bot = Bot::find(2);
    if (!$bot) {
        echo "❌ Bot 2 not found!\n";
        exit(1);
    }
    
    echo "✅ Found bot: {$bot->bot_type} (ID: {$bot->id})\n";
    
    // Check if keywords already exist
    $existingKeywords = $bot->keywords()->count();
    echo "Existing keywords: {$existingKeywords}\n";
    
    if ($existingKeywords > 0) {
        echo "Keywords already exist, skipping...\n";
        exit(0);
    }
    
    // Create test messages first
    echo "\n📝 Creating test messages...\n";
    
    $messages = [
        [
            'type' => 'text',
            'message' => 'Hello! Welcome to our customer support. How can I help you today?'
        ],
        [
            'type' => 'text', 
            'message' => 'Thank you for contacting us! Our team will get back to you soon.'
        ],
        [
            'type' => 'text',
            'message' => 'Hi there! I\'m here to help. What do you need assistance with?'
        ],
        [
            'type' => 'text',
            'message' => 'Thanks for your message! We\'re currently processing your request.'
        ]
    ];
    
    $createdMessages = [];
    foreach ($messages as $index => $messageData) {
        $message = $bot->messages()->create($messageData);
        $createdMessages[] = $message;
        $messageNumber = $index + 1;
        echo "✅ Created message {$messageNumber}: " . substr($messageData['message'], 0, 50) . "...\n";
    }
    
    // Create keywords
    echo "\n🔑 Creating keywords...\n";
    
    $keywords = [
        ['keyword' => 'hello', 'message' => $createdMessages[0]],
        ['keyword' => 'hi', 'message' => $createdMessages[0]],
        ['keyword' => 'hey', 'message' => $createdMessages[0]],
        ['keyword' => 'help', 'message' => $createdMessages[2]],
        ['keyword' => 'support', 'message' => $createdMessages[2]],
        ['keyword' => 'thanks', 'message' => $createdMessages[1]],
        ['keyword' => 'thank you', 'message' => $createdMessages[1]],
        ['keyword' => 'bye', 'message' => $createdMessages[3]],
        ['keyword' => 'goodbye', 'message' => $createdMessages[3]]
    ];
    
    foreach ($keywords as $keywordData) {
        $keyword = $bot->keywords()->create([
            'keyword' => $keywordData['keyword'],
            'message_id' => $keywordData['message']->id
        ]);
        echo "✅ Created keyword: '{$keywordData['keyword']}' -> Message ID: {$keywordData['message']->id}\n";
    }
    
    echo "\n🎉 Test keywords added successfully!\n";
    echo "Total keywords created: " . count($keywords) . "\n";
    echo "Total messages created: " . count($createdMessages) . "\n";
    
    echo "\n📱 Now you can test by sending these messages to your WhatsApp:\n";
    echo "- hello\n";
    echo "- hi\n";
    echo "- help\n";
    echo "- thanks\n";
    echo "- bye\n";
    
} catch (Exception $e) {
    echo "❌ Error: " . $e->getMessage() . "\n";
    echo "Stack trace: " . $e->getTraceAsString() . "\n";
} 