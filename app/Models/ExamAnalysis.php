<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ExamAnalysis extends Model
{
    use HasFactory, HasUlids;

    protected $fillable = [
        'exam_id',
        'status',
        'student_count',
        'reliability_coefficient',
        'average_score',
        'standard_deviation',
        'highest_score',
        'lowest_score',
    ];

    protected $casts = [
        'student_count' => 'integer',
        'reliability_coefficient' => 'float',
        'average_score' => 'float',
        'standard_deviation' => 'float',
        'highest_score' => 'float',
        'lowest_score' => 'float',
    ];

    public function exam(): BelongsTo
    {
        return $this->belongsTo(Exam::class);
    }

    public function itemAnalyses(): HasMany
    {
        return $this->hasMany(ItemAnalysis::class);
    }
}
