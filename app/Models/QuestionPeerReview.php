<?php

namespace App\Models;

use App\Enums\ReviewStatusEnum; // Import Enum
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;

class QuestionPeerReview extends Model
{
    use HasFactory, HasUlids, LogsActivity;

    protected $fillable = [
        'question_id',
        'reviewer_id', 
        'status',      // Menggunakan Enum
        'notes',       
        'reviewed_at', 
    ];

    protected $casts = [
        'status' => ReviewStatusEnum::class, // Menggunakan Enum
        'reviewed_at' => 'datetime',
    ];

    public function question(): BelongsTo
    {
        return $this->belongsTo(Question::class);
    }

    public function reviewer(): BelongsTo
    {
        return $this->belongsTo(\App\Models\User::class, 'reviewer_id');
    }
    
    public function getActivitylogOptions(): LogOptions
    {
        // Akses nilai Enum menggunakan ->value
        $statusValue = $this->status ? $this->status->value : 'N/A';
        
        return LogOptions::defaults()
            ->logOnly(['status', 'notes'])
            ->logOnlyDirty()
            ->setDescriptionForEvent(fn(string $eventName) => "Review Soal ID: {$this->question_id} diubah ke status {$statusValue}")
            ->useLogName('question_peer_review');
    }
}