<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class WhatsAppSession extends Model
{
    use HasFactory;

    protected $fillable = [
        'shop_id',
        'session_id',
        'phone_number',
        'status',
        'qr_code',
        'qr_code_path',
        'last_activity',
        'session_data',
        'error_message',
        'is_active',
    ];

    protected $casts = [
        'last_activity' => 'datetime',
        'session_data' => 'array',
        'is_active' => 'boolean',
    ];

    public function shop(): BelongsTo
    {
        return $this->belongsTo(Shop::class);
    }

    public function isConnected(): bool
    {
        return $this->status === 'connected';
    }

    public function isConnecting(): bool
    {
        return $this->status === 'connecting';
    }

    public function hasError(): bool
    {
        return $this->status === 'error';
    }

    public function updateActivity(): void
    {
        $this->update(['last_activity' => now()]);
    }

    public function setConnected(string $phoneNumber = null): void
    {
        $this->update([
            'status' => 'connected',
            'phone_number' => $phoneNumber,
            'last_activity' => now(),
            'error_message' => null,
        ]);
    }

    public function setError(string $errorMessage): void
    {
        $this->update([
            'status' => 'error',
            'error_message' => $errorMessage,
            'last_activity' => now(),
        ]);
    }

    public function setDisconnected(): void
    {
        $this->update([
            'status' => 'disconnected',
            'last_activity' => now(),
        ]);
    }
}
