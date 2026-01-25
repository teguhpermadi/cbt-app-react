<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;

use Spatie\MediaLibrary\HasMedia;

class ReadingMaterial extends Model implements HasMedia
{
    /** @use HasFactory<\Database\Factories\ReadingMaterialFactory> */
    use HasFactory, HasUlids, SoftDeletes, LogsActivity, \Spatie\MediaLibrary\InteractsWithMedia;

    protected $fillable = [
        'subject_id',
        'question_bank_id',
        'user_id',
        'title',
        'content',
    ];

    protected $appends = ['media_url', 'media_type'];

    public function getMediaUrlAttribute()
    {
        return $this->getFirstMediaUrl('reading_material_file');
    }

    public function getMediaTypeAttribute()
    {
        return $this->getFirstMedia('reading_material_file')?->mime_type;
    }

    /**
     * Relasi One-to-Many ke Subject
     */
    public function subject(): BelongsTo
    {
        return $this->belongsTo(Subject::class, 'subject_id');
    }

    /**
     * Relasi ke Bank Soal
     */
    public function questionBank(): BelongsTo
    {
        return $this->belongsTo(QuestionBank::class);
    }

    /**
     * Relasi One-to-Many ke User (Pembuat)
     */
    public function author(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    /**
     * Relasi One-to-Many ke Question
     */
    public function questions(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(Question::class);
    }

    /**
     * Konfigurasi untuk Media Library
     */
    public function registerMediaCollections(): void
    {
        $this->addMediaCollection('reading_material_file')
            ->singleFile()
            ->useDisk('public');
    }

    /**
     * Konfigurasi untuk Spatie Activity Log
     */
    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logOnly(['subject_id', 'user_id', 'title']) // Konten dihindari karena terlalu panjang
            ->logOnlyDirty()
            ->setDescriptionForEvent(fn(string $eventName) => "Materi Bacaan '{$this->title}' telah di-{$eventName}")
            ->useLogName('reading_material');
    }
}
