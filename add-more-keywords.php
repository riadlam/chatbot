<?php

require_once 'laravel-backend/vendor/autoload.php';

$app = require_once 'laravel-backend/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

use App\Models\Bot;
use App\Models\BotKeyword;
use App\Models\BotMessage;

echo "Adding more test keywords to bot...\n\n";

try {
    // Get bot 2 (your connected bot)
    $bot = Bot::find(2);
    if (!$bot) {
        echo "❌ Bot 2 not found!\n";
        exit(1);
    }
    
    echo "✅ Found bot: {$bot->bot_type} (ID: {$bot->id})\n";
    
    // Create additional test messages
    echo "\n📝 Creating additional test messages...\n";
    
    $additionalMessages = [
        [
            'type' => 'text',
            'message' => 'Hi there! How can I help you today?'
        ],
        [
            'type' => 'text', 
            'message' => 'Thank you for your message! We appreciate it.'
        ],
        [
            'type' => 'text',
            'message' => 'Need help? I\'m here to assist you!'
        ]
    ];
    
    $createdMessages = [];
    foreach ($additionalMessages as $index => $messageData) {
        $message = $bot->messages()->create($messageData);
        $createdMessages[] = $message;
        $messageNumber = $index + 1;
        echo "✅ Created message {$messageNumber}: " . substr($messageData['message'], 0, 50) . "...\n";
    }
    
    // Create additional keywords
    echo "\n🔑 Creating additional keywords...\n";
    
    $additionalKeywords = [
        ['keyword' => 'hi', 'message' => $createdMessages[0]],
        ['keyword' => 'hey', 'message' => $createdMessages[0]],
        ['keyword' => 'help', 'message' => $createdMessages[2]],
        ['keyword' => 'support', 'message' => $createdMessages[2]],
        ['keyword' => 'thanks', 'message' => $createdMessages[1]],
        ['keyword' => 'thank you', 'message' => $createdMessages[1]]
    ];
    
    foreach ($additionalKeywords as $keywordData) {
        $keyword = $bot->keywords()->create([
            'keyword' => $keywordData['keyword'],
            'message_id' => $keywordData['message']->id
        ]);
        echo "✅ Created keyword: '{$keywordData['keyword']}' -> Message ID: {$keywordData['message']->id}\n";
    }
    
    echo "\n🎉 Additional keywords added successfully!\n";
    echo "Total new keywords created: " . count($additionalKeywords) . "\n";
    
    echo "\n📱 Now you can test with these messages:\n";
    echo "- hello (should respond with 'sama')\n";
    echo "- hi (should respond with 'Hi there! How can I help you today?')\n";
    echo "- help (should respond with 'Need help? I\'m here to assist you!')\n";
    echo "- thanks (should respond with 'Thank you for your message! We appreciate it.')\n";
    
} catch (Exception $e) {
    echo "❌ Error: " . $e->getMessage() . "\n";
    echo "Stack trace: " . $e->getTraceAsString() . "\n";
} 