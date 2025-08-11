<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Message extends Model
{
    use HasFactory;

    protected $fillable = [
        'bot_id',
        'type',
        'message'
    ];

    protected $casts = [
        'message' => 'array'
    ];

    /**
     * Get the bot that owns the message.
     */
    public function bot()
    {
        return $this->belongsTo(Bot::class);
    }

    /**
     * Get the keywords that trigger this message.
     */
    public function keywords()
    {
        return $this->hasMany(BotKeyword::class);
    }

    /**
     * Get the message content as text.
     */
    public function getTextContent()
    {
        if ($this->type === 'text' && isset($this->message['text'])) {
            return $this->message['text'];
        }
        return null;
    }

    /**
     * Get the message content as media URL.
     */
    public function getMediaUrl()
    {
        if (in_array($this->type, ['image', 'video', 'audio', 'document']) && isset($this->message['url'])) {
            return $this->message['url'];
        }
        return null;
    }

    /**
     * Get the message caption.
     */
    public function getCaption()
    {
        if (isset($this->message['caption'])) {
            return $this->message['caption'];
        }
        return null;
    }

    /**
     * Get the message content directly from the message array.
     */
    public function getContent($key = null)
    {
        if ($key) {
            return $this->message[$key] ?? null;
        }
        return $this->message;
    }
}
