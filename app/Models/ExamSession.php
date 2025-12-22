<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ExamSession extends Model
{
    use HasFactory, HasUlids;

    protected $fillable = [
        'exam_id',
        'user_id',             // ID Siswa
        'attempt_number',      // Percobaan ke berapa (1, 2, 3, ...)
        'total_score',         // Skor yang didapat di sesi ini
        'is_finished',         // Sudah selesai atau masih berlangsung
        'is_corrected',        // Status koreksi (untuk soal Essay)
        'start_time',          // Waktu mulai pengerjaan
        'finish_time',         // Waktu selesai pengerjaan
        'duration_taken',      // Durasi pengerjaan dalam menit
        'ip_address',          
    ];

    protected $casts = [
        'total_score' => 'float',
        'is_finished' => 'boolean',
        'is_corrected' => 'boolean',
        'start_time' => 'datetime',
        'finish_time' => 'datetime',
        'duration_taken' => 'integer',
        'attempt_number' => 'integer',
    ];

    // --- RELATIONS ---

    public function exam(): BelongsTo
    {
        return $this->belongsTo(Exam::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(\App\Models\User::class, 'user_id');
    }

    /**
     * Relasi ke detail jawaban siswa (jawaban per soal untuk sesi ini).
     */
    public function details(): HasMany
    {
        return $this->hasMany(ExamResultDetail::class, 'exam_session_id');
    }
}