<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BotKeyword extends Model
{
    use HasFactory;

    protected $fillable = [
        'bot_id',
        'message_id',
        'keyword'
    ];

    /**
     * Get the bot that owns the keyword.
     */
    public function bot()
    {
        return $this->belongsTo(Bot::class);
    }

    /**
     * Get the message that this keyword triggers.
     */
    public function message()
    {
        return $this->belongsTo(BotMessage::class, 'message_id');
    }
}
