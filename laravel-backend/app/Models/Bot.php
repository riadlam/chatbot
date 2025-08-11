<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Bot extends Model
{
    use HasFactory;

    protected $fillable = [
        'shop_id',
        'bot_type',
        'description',
        'status',
        'messages_id'
    ];

    /**
     * Get the shop that owns the bot.
     */
    public function shop()
    {
        return $this->belongsTo(Shop::class);
    }

    /**
     * Get the messages associated with this bot.
     */
    public function messages()
    {
        return $this->hasMany(BotMessage::class);
    }

    /**
     * Get the keywords for this bot.
     */
    public function keywords()
    {
        return $this->hasMany(BotKeyword::class);
    }

    /**
     * Get the WhatsApp session for this bot.
     */
    public function whatsappSession()
    {
        return $this->hasOne(WhatsAppSession::class, 'shop_id', 'shop_id');
    }

    /**
     * Create or get WhatsApp session for this bot
     */
    public function createWhatsAppSession()
    {
        return $this->whatsappSession()->create([
            'session_id' => 'bot_' . $this->id . '_' . time(),
            'status' => 'connecting',
            'is_active' => true,
        ]);
    }

    /**
     * Check if bot is active
     */
    public function isActive()
    {
        return $this->status === 'active';
    }

    /**
     * Get keywords as array
     */
    public function getKeywordsArray()
    {
        return $this->keywords()->pluck('keyword')->toArray();
    }

    /**
     * Get messages as array
     */
    public function getMessagesArray()
    {
        return $this->messages()->get()->toArray();
    }

    /**
     * Add a keyword to the bot
     */
    public function addKeyword($keyword, $messageId)
    {
        return $this->keywords()->create([
            'keyword' => $keyword,
            'message_id' => $messageId
        ]);
    }

    /**
     * Remove a keyword from the bot
     */
    public function removeKeyword($keyword)
    {
        return $this->keywords()->where('keyword', $keyword)->delete();
    }

    /**
     * Remove a message and all its associated keywords from the bot
     */
    public function removeKeywordAndMessage($messageId)
    {
        \Log::info('Deleting message and keywords', [
            'bot_id' => $this->id,
            'message_id' => $messageId
        ]);

        // First, check if the message belongs to this bot
        $message = $this->messages()->where('id', $messageId)->first();
        
        if (!$message) {
            \Log::warning('Message not found or does not belong to bot', [
                'bot_id' => $this->id,
                'message_id' => $messageId
            ]);
            return false;
        }

        // Get keywords to be deleted for logging
        $keywordsToDelete = $this->keywords()->where('message_id', $messageId)->get();
        
        \Log::info('Deleting keywords and message', [
            'bot_id' => $this->id,
            'message_id' => $messageId,
            'keywords_count' => $keywordsToDelete->count(),
            'keywords' => $keywordsToDelete->pluck('keyword')->toArray()
        ]);

        // Delete all keywords associated with this message
        $deletedKeywords = $this->keywords()->where('message_id', $messageId)->delete();
        
        // Delete the message itself
        $messageDeleted = $message->delete();
        
        \Log::info('Delete operation completed', [
            'bot_id' => $this->id,
            'message_id' => $messageId,
            'keywords_deleted' => $deletedKeywords,
            'message_deleted' => $messageDeleted
        ]);
        
        return true;
    }

    /**
     * Add a message to the bot
     */
    public function addMessage($messageData)
    {
        \Log::info('Adding message to bot', [
            'bot_id' => $this->id,
            'message_data' => $messageData
        ]);

        // Create a new bot message record
        $message = BotMessage::create([
            'bot_id' => $this->id,
            'type' => $messageData['type'] ?? 'text',
            'message' => $messageData['message'] ?? $messageData,
            'images' => $messageData['images'] ?? null,
            'is_contain' => $messageData['is_contain'] ?? true,
            'duration' => $messageData['duration'] ?? 8
        ]);

        \Log::info('Message created successfully', [
            'message_id' => $message->id,
            'images_stored' => $message->images
        ]);

        return $message;
    }

    /**
     * Update the bot's message
     */
    public function updateMessage($messageData)
    {
        $message = $this->messages()->first();
        if ($message) {
            $message->update([
                'type' => $messageData['type'] ?? 'text',
                'message' => $messageData['message'] ?? $messageData,
                'images' => $messageData['images'] ?? null,
                'is_contain' => $messageData['is_contain'] ?? true,
                'duration' => $messageData['duration'] ?? 8
            ]);
        } else {
            $this->addMessage($messageData);
        }
    }
}
