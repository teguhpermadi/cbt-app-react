<?php

namespace App\Models;

use App\States\QuestionSuggestion\SuggestionState;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;
use Spatie\ModelStates\HasStates;

class QuestionSuggestion extends Model
{
    use HasFactory, HasUlids, HasStates, SoftDeletes;

    protected $fillable = [
        'question_id',
        'user_id',
        'data',
        'description',
        'state',
    ];

    protected $casts = [
        'data' => 'array',
        'state' => SuggestionState::class,
    ];

    public function question(): BelongsTo
    {
        return $this->belongsTo(Question::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
