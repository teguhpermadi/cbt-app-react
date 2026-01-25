<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;

class QuestionBank extends Model
{
    /** @use HasFactory<\Database\Factories\QuestionBankFactory> */
    use HasFactory, HasUlids, LogsActivity, SoftDeletes;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */

    protected $fillable = [
        'subject_id',
        'user_id',
        'name',
        'description',
        'is_public',
    ];

    protected $casts = [
        'is_public' => 'boolean',
    ];

    /**
     * Relasi One-to-Many: Bank Soal milik satu Subject.
     */
    public function subject(): BelongsTo
    {
        return $this->belongsTo(Subject::class);
    }

    /**
     * Relasi One-to-One: Bank Soal dibuat oleh satu User (Guru).
     */
    public function teacher(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    /**
     * Scope untuk menampilkan Question Bank berdasarkan Subject yang memiliki academic_year_id yang sedang aktif
     */
    public function scopeSubjectActive($query)
    {
        return $query->whereHas('subject', function ($subjectQuery) {
            $subjectQuery->whereHas('academicYear', function ($academicYearQuery) {
                $academicYearQuery->where('is_active', true);
            });
        });
    }

    /**
     * Scope untuk memfilter Bank Soal berdasarkan role user.
     * Admin: Melihat semua.
     * Teacher: Melihat milik sendiri atau yang public.
     */
    public function scopeAccessibleBy($query, User $user)
    {
        if ($user->hasRole('admin')) {
            return $query;
        }

        if ($user->hasRole('teacher')) {
            return $query->where(function ($q) use ($user) {
                $q->where('user_id', $user->id)
                    ->orWhere('is_public', true);
            });
        }

        // Default: tidak menampilkan apa-apa (atau sesuaikan dengan kebutuhan role lain)
        return $query->where('id', null);
    }

    /**
     * Relasi One-to-Many: Satu Bank Soal memiliki banyak Question.
     */
    public function questions(): HasMany
    {
        return $this->hasMany(Question::class)->orderBy('order', 'asc');
    }

    /**
     * Relasi HasManyThrough: Bank Soal memiliki banyak Saran melalui Question.
     */
    public function suggestions(): \Illuminate\Database\Eloquent\Relations\HasManyThrough
    {
        return $this->hasManyThrough(QuestionSuggestion::class, Question::class);
    }

    /**
     * Relasi One-to-Many: Bank Soal memiliki banyak Bahan Bacaan
     */
    public function readingMaterials(): HasMany
    {
        return $this->hasMany(ReadingMaterial::class);
    }

    /**
     * Konfigurasi untuk Spatie Activity Log
     */
    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logOnly(['subject_id', 'user_id', 'name', 'description', 'is_public'])
            ->logOnlyDirty()
            ->setDescriptionForEvent(fn(string $eventName) => "Bank Soal '{$this->name}' telah di-{$eventName}")
            ->useLogName('question_bank');
    }
}
