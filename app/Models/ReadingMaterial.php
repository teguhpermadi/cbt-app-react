<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;

class ReadingMaterial extends Model
{
    /** @use HasFactory<\Database\Factories\ReadingMaterialFactory> */
    use HasFactory, HasUlids, SoftDeletes, LogsActivity;

    protected $fillable = [
        'subject_id',
        'title',
        'content',
    ];

    /**
     * Relasi One-to-Many ke Subject
     */
    public function subject(): BelongsTo
    {
        return $this->belongsTo(Subject::class, 'subject_id');
    }

    /**
     * Konfigurasi untuk Spatie Activity Log
     */
    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logOnly(['subject_id', 'title']) // Konten dihindari karena terlalu panjang
            ->logOnlyDirty()
            ->setDescriptionForEvent(fn(string $eventName) => "Materi Bacaan '{$this->title}' telah di-{$eventName}")
            ->useLogName('reading_material');
    }
}
