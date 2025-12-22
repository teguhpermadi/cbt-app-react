<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;

class Subject extends Model implements HasMedia
{
    /** @use HasFactory<\Database\Factories\SubjectFactory> */
    use HasFactory, HasUlids, LogsActivity, InteractsWithMedia, SoftDeletes;

    protected $fillable = [
        'name',
        'code',
        'description',
        'academic_year_id',
        'grade_id',
        'user_id',
    ];

    /**
     * Konfigurasi untuk Spatie Activity Log
     */
    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logOnly(['name', 'code', 'description'])
            ->logOnlyDirty()
            ->setDescriptionForEvent(fn(string $eventName) => "Mata Pelajaran telah di-{$eventName}")
            ->useLogName('subject');
    }

    /**
     * Konfigurasi untuk Media Library (Gambar/Ikon Mata Pelajaran)
     */
    public function registerMediaCollections(): void
    {
        // Koleksi untuk gambar/ikon mata pelajaran
        $this->addMediaCollection('subject_image')
            ->singleFile() // Hanya boleh ada satu file per subjek
            ->addMediaConversion('thumb')
            ->width(100)
            ->height(100);
    }

    public function academicYear()
    {
        return $this->belongsTo(AcademicYear::class);
    }

    public function grade()
    {
        return $this->belongsTo(Grade::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
