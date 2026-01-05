<?php

namespace App\Models;

use App\Enums\ExamTypeEnum;
use App\Enums\TimerTypeEnum;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;
use App\Models\Scopes\ActiveAcademicYearScope;

class Exam extends Model
{
    use HasFactory, HasUlids, LogsActivity, SoftDeletes;

    /**
     * The "booted" method of the model.
     *
     * @return void
     */
    protected static function booted()
    {
        static::addGlobalScope(new ActiveAcademicYearScope);
    }

    protected $fillable = [
        'academic_year_id',
        // 'grade_id', // Removed
        'subject_id',
        'teacher_id',       // Guru yang membuat ujian
        'question_bank_id', // Bank soal yang digunakan (opsional)
        'title',
        'exam_type',        // Tipe ujian (Harian, UTS, UAS, dll.)
        'duration',         // Durasi ujian dalam menit
        'token',            // Token ujian
        'is_token_visible', // Status visibilitas token
        'is_published',     // Status ujian: draft/terbit
        'is_randomized',    // Apakah urutan soal diacak
        'is_answer_randomized', // Apakah urutan jawaban diacak
        'show_result_on_finish', // Apakah hasil ditampilkan setelah selesai
        'is_hint_visible', // Apakah hint ditampilkan
        'max_attempts',     // Jumlah maksimal upaya siswa (null = unlimited)
        'timer_type',       // Jenis timer: strict/flexible
        'passing_score',    // Nilai minimum kelulusan
        'start_time',       // Waktu mulai ujian
        'end_time',         // Waktu berakhir ujian
    ];

    protected $casts = [
        'exam_type' => ExamTypeEnum::class,
        'duration' => 'integer',
        'is_token_visible' => 'boolean',

        'is_published' => 'boolean',
        'is_randomized' => 'boolean',
        'is_answer_randomized' => 'boolean',
        'show_result_on_finish' => 'boolean',
        'is_hint_visible' => 'boolean',
        'max_attempts' => 'integer',
        'timer_type' => TimerTypeEnum::class,
        'start_time' => 'datetime',
        'end_time' => 'datetime',
    ];

    protected $appends = ['status'];

    /**
     * Accessor untuk menentukan status ujian berdasarkan waktu saat ini.
     */
    public function getStatusAttribute(): \App\Enums\ExamStatusEnum
    {
        $now = now();

        if ($now < $this->start_time) {
            return \App\Enums\ExamStatusEnum::Scheduled;
        }

        if ($now >= $this->start_time && $now <= $this->end_time) {
            return \App\Enums\ExamStatusEnum::Ongoing;
        }

        return \App\Enums\ExamStatusEnum::Finished;
    }

    // --- RELATIONS ---

    public function academicYear(): BelongsTo
    {
        return $this->belongsTo(AcademicYear::class);
    }

    public function grades(): \Illuminate\Database\Eloquent\Relations\BelongsToMany
    {
        return $this->belongsToMany(Grade::class, 'exam_grade');
    }

    public function subject(): BelongsTo
    {
        return $this->belongsTo(Subject::class);
    }

    public function teacher(): BelongsTo
    {
        // Guru yang membuat/mengawasi ujian
        return $this->belongsTo(User::class, 'teacher_id');
    }

    public function questionBank(): BelongsTo
    {
        return $this->belongsTo(QuestionBank::class);
    }

    /**
     * Relasi ke model ExamQuestion (Salinan soal yang digunakan dalam ujian ini).
     */
    public function examQuestions(): HasMany
    {
        return $this->hasMany(ExamQuestion::class);
    }

    /**
     * Relasi ke model ExamResult (Hasil ujian siswa).
     */
    public function examResults(): HasMany
    {
        return $this->hasMany(ExamResult::class);
    }

    public function examSessions(): HasMany
    {
        return $this->hasMany(ExamSession::class);
    }

    // --- SPATIE CONFIGURATIONS ---

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logOnly(['title', 'exam_type', 'duration', 'is_published'])
            ->logOnlyDirty()
            ->setDescriptionForEvent(fn(string $eventName) => "Ujian '{$this->title}' ({$this->exam_type->value}) di-{$eventName}")
            ->useLogName('exam_configuration');
    }

    /**
     * Generate token random 6 digit angka
     */
    public static function generateToken(): string
    {
        return str_pad((string) random_int(0, 999999), 6, '0', STR_PAD_LEFT);
    }
}
