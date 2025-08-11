<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Support\Str;
use App\Models\Message;

class Shop extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'name',
        'slug',
        'description',
        'phone_number',
        'business_type',
        'email',
        'website',
        'address',
        'logo_path',
        'qr_code_path',
        'status',
        'is_verified',
        'subscription_expires_at',
        'free_trial_started',
        'active_plan',
        'plan_date_expired',
        'settings',
    ];

    protected $casts = [
        'is_verified' => 'boolean',
        'subscription_expires_at' => 'datetime',
        'free_trial_started' => 'date',
        'plan_date_expired' => 'date',
        'settings' => 'array',
    ];

    /**
     * Get the user that owns the shop.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function bots(): HasMany
    {
        return $this->hasMany(Bot::class);
    }

    public function messages(): HasMany
    {
        return $this->hasMany(Message::class);
    }

    public function whatsappSession(): HasOne
    {
        return $this->hasOne(WhatsAppSession::class);
    }

    public function getActiveBots()
    {
        return $this->bots()->where('status', 'active')->get();
    }

    public function isSubscriptionActive(): bool
    {
        return $this->subscription_expires_at && $this->subscription_expires_at->isFuture();
    }

    public function isFreeTrialActive(): bool
    {
        if (!$this->free_trial_started) {
            return false;
        }
        
        // Free trial lasts for 14 days
        $trialEndDate = $this->free_trial_started->addDays(14);
        return $trialEndDate->isFuture();
    }

    public function getFreeTrialDaysRemaining(): int
    {
        if (!$this->free_trial_started) {
            return 0;
        }
        
        $trialEndDate = $this->free_trial_started->addDays(14);
        $daysRemaining = now()->diffInDays($trialEndDate, false);
        
        return max(0, $daysRemaining);
    }

    public function getSetting(string $key, $default = null)
    {
        return data_get($this->settings, $key, $default);
    }

    public function setSetting(string $key, $value): void
    {
        $settings = $this->settings ?? [];
        $settings[$key] = $value;
        $this->update(['settings' => $settings]);
    }

    /**
     * Boot method to automatically generate slug and set trial start date
     */
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($shop) {
            // Generate slug if not provided
            if (empty($shop->slug)) {
                $baseSlug = Str::slug($shop->name);
                $slug = $baseSlug;
                $counter = 1;
                
                // Check if slug exists and make it unique
                while (static::where('slug', $slug)->exists()) {
                    $slug = $baseSlug . '-' . $counter;
                    $counter++;
                }
                
                $shop->slug = $slug;
            }
            
            // Set free trial start date if not provided
            if (empty($shop->free_trial_started)) {
                $shop->free_trial_started = now();
            }
        });
    }
}
