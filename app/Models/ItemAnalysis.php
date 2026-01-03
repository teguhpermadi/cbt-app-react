<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ItemAnalysis extends Model
{
    use HasFactory, HasUlids;

    protected $fillable = [
        'exam_analysis_id',
        'exam_question_id',
        'question_id',
        'difficulty_index',
        'discrimination_index',
        'discrimination_status',
        'distractor_analysis',
        'analysis_recommendation',
    ];

    protected $casts = [
        'difficulty_index' => 'float',
        'discrimination_index' => 'float',
        'distractor_analysis' => 'array',
    ];

    public function examAnalysis(): BelongsTo
    {
        return $this->belongsTo(ExamAnalysis::class);
    }

    public function examQuestion(): BelongsTo
    {
        return $this->belongsTo(ExamQuestion::class);
    }

    public function question(): BelongsTo
    {
        return $this->belongsTo(Question::class);
    }
}
