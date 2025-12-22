<?php

namespace App\Models;

use App\Enums\DifficultyLevelEnum;
use App\Enums\QuestionTypeEnum;
use App\Enums\TimerEnum;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;
use Spatie\MediaLibrary\MediaCollections\Models\Media;

class Question extends Model implements HasMedia
{
    use HasFactory, HasUlids, LogsActivity, InteractsWithMedia, SoftDeletes;

    protected $fillable = [
        'question_bank_id',
        'reading_material_id',
        'question_type',
        'difficulty_level',
        'timer',
        'content',
        'score_value',
        'order',        // Nomor urut
        'is_active',
        'is_approved',
    ];

    protected $casts = [
        'question_type' => QuestionTypeEnum::class,
        'difficulty_level' => DifficultyLevelEnum::class,
        'timer' => TimerEnum::class,
        'is_active' => 'boolean',
        'is_approved' => 'boolean', // Status persetujuan Peer Review
    ];

    // --- RELATIONS ---

    public function questionBank(): BelongsTo
    {
        return $this->belongsTo(QuestionBank::class);
    }

    public function readingMaterial(): BelongsTo
    {
        return $this->belongsTo(ReadingMaterial::class);
    }

    public function peerReviews(): HasMany
    {
        return $this->hasMany(QuestionPeerReview::class);
    }

    public function options(): HasMany
    {
        return $this->hasMany(Option::class)->orderBy('order');
    }

    
    // --- ACCESSORS & MUTATORS ---
    // Note: Enum accessors removed as they're redundant with the $casts array
    // Laravel automatically handles enum casting when defined in $casts

    // --- SPATIE CONFIGURATIONS ---

    /**
     * Konfigurasi untuk Media Library (Media di Soal)
     */
    public function registerMediaCollections(): void
    {
        // Koleksi untuk media yang muncul di Konten Soal (gambar, audio, video)
        $this->addMediaCollection('question_content')
            ->useDisk('public');
    }

    /**
     * Konfigurasi untuk Spatie Activity Log
     */
    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logOnly(['question_bank_id', 'question_type', 'difficulty_level', 'score_value', 'is_active'])
            ->logOnlyDirty()
            ->setDescriptionForEvent(fn(string $eventName) => "Soal tipe {$this->question_type->value} telah di-{$eventName} di Bank Soal: {$this->questionBank->name}")
            ->useLogName('question');
    }

    // --- HELPER METHODS FOR EXAM SNAPSHOT ---

    /**
     * Mengambil opsi jawaban dalam format array untuk snapshot ExamQuestion.
     * Mengkonversi dari relasi options ke format array yang kompatibel dengan JSON.
     */
    public function getOptionsForExam(): array
    {
        $options = [];

        // Eager load options jika belum di-load
        if (!$this->relationLoaded('options')) {
            $this->load('options');
        }

        foreach ($this->options as $option) {
            $optionData = [
                'id' => $option->id, // Sertakan ID asli untuk referensi
                'key' => $option->option_key,
                'content' => $option->content,
                'media' => $option->getMediaUrl(), // URL media jika ada
                'type' => $option->getMetadata('type'), // Untuk matching (left/right)
            ];

            // Tambahkan metadata khusus jika ada
            if ($option->metadata) {
                $optionData = array_merge($optionData, $option->metadata);
            }

            // Format khusus berdasarkan tipe soal
            if ($this->question_type === QuestionTypeEnum::Matching) {
                // Untuk matching, kita butuh struktur yang jelas antara left dan right
                // Tapi untuk snapshot, kita simpan flat array dengan key L1, R1, dst.
                // Nanti di frontend yang akan memisahkan
            }

            $options[$option->option_key] = $optionData;
        }

        return $options;
    }

    /**
     * Mengambil kunci jawaban dalam format array untuk snapshot ExamQuestion.
     * Mengkonversi dari relasi options ke format array yang kompatibel dengan JSON.
     */
    public function getKeyAnswerForExam(): array
    {
        // Eager load options jika belum di-load
        if (!$this->relationLoaded('options')) {
            $this->load('options');
        }

        return match ($this->question_type) {
            QuestionTypeEnum::MultipleChoice => [
                'answer' => $this->options->where('is_correct', true)->first()?->option_key
            ],

            QuestionTypeEnum::MultipleSelection => [
                'answers' => $this->options->where('is_correct', true)->pluck('option_key')->values()->toArray()
            ],

            QuestionTypeEnum::TrueFalse => [
                'answer' => $this->options->where('is_correct', true)->first()?->option_key
            ],

            QuestionTypeEnum::Matching => [
                'pairs' => $this->options->filter(function ($option) {
                    return str_starts_with($option->option_key, 'L');
                })
                    ->mapWithKeys(function ($option) {
                        return [$option->option_key => $option->getMetadata('match_with')];
                    })->toArray()
            ],

            QuestionTypeEnum::Ordering => [
                'order' => $this->options->sortBy(function ($option) {
                    return $option->getMetadata('correct_position');
                })->pluck('option_key')->values()->toArray()
            ],

            QuestionTypeEnum::NumericalInput => [
                'answer' => $this->options->first()?->getMetadata('correct_answer'),
                'tolerance' => $this->options->first()?->getMetadata('tolerance', 0),
                'unit' => $this->options->first()?->getMetadata('unit'),
            ],

            QuestionTypeEnum::Essay => [
                // Essay mungkin punya rubrik di metadata opsi atau null
                'rubric' => $this->options->first()?->metadata
            ],

            default => []
        };
    }
}
