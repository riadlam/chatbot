<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BotMessage extends Model
{
    use HasFactory;

    protected $fillable = [
        'bot_id',
        'type',
        'message',
        'images',
        'is_contain', // If true, keyword can be contained in message; if false, must match exactly
        'duration' // Response delay in seconds (8-15)
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
        return $this->hasMany(BotKeyword::class, 'message_id');
    }

    /**
     * Get the message content as text.
     */
    public function getTextContent()
    {
        // Message is now stored as plain text
        return $this->message;
    }

    /**
     * Get the message content directly.
     */
    public function getContent()
    {
        return $this->message;
    }

    /**
     * Get the images as an array.
     */
    public function getImages()
    {
        if (empty($this->images)) {
            return [];
        }
        
        return json_decode($this->images, true) ?: [];
    }

    /**
     * Set the images as a JSON string.
     */
    public function setImages(array $images)
    {
        $this->images = json_encode($images);
    }
    

} 