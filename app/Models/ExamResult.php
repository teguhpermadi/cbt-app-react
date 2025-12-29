<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ExamResult extends Model
{
    use HasFactory, HasUlids;

    protected $fillable = [
        'exam_id',
        'user_id',              // ID Siswa
        'exam_session_id',      // ID sesi pengerjaan terbaik/terakhir (BARU)
        'total_score',          // Skor akhir resmi/terbaik
        'score_percent',        // Persentase skor
        'is_passed',            // Status kelulusan
        'result_type',          // BARU: 'official', 'best_attempt', 'latest_attempt'
    ];

    protected $casts = [
        'total_score' => 'float',
        'score_percent' => 'float',
        'is_passed' => 'boolean',
    ];

    protected $appends = ['final_score'];

    public function getFinalScoreAttribute()
    {
        return round($this->score_percent);
    }

    // --- RELATIONS ---

    public function exam(): BelongsTo
    {
        return $this->belongsTo(Exam::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(\App\Models\User::class, 'user_id');
    }

    // Relasi ke sesi pengerjaan yang dijadikan rujukan hasil resmi
    public function officialSession(): BelongsTo
    {
        return $this->belongsTo(ExamSession::class, 'exam_session_id');
    }
}
