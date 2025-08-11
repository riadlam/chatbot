<?php

require_once 'vendor/autoload.php';

$app = require_once 'bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

use App\Models\WhatsAppSession;

echo "WhatsApp Sessions:\n";
echo "==================\n";

$sessions = WhatsAppSession::all();

foreach ($sessions as $session) {
    echo "Session ID: " . $session->session_id . "\n";
    echo "QR Code Path: " . ($session->qr_code_path ?? 'NULL') . "\n";
    echo "Status: " . $session->status . "\n";
    echo "QR Code Available: " . (!empty($session->qr_code) ? 'YES' : 'NO') . "\n";
    echo "---\n";
}

echo "\nTotal sessions: " . $sessions->count() . "\n"; 