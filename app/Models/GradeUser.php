<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Relations\Pivot;

class GradeUser extends Pivot
{
    /** @use HasFactory<\Database\Factories\GradeUserFactory> */
    use HasFactory, HasUlids;

    protected $table = 'grade_user';

    public $incrementing = false;

    protected $fillable = [
        'grade_id',
        'user_id',
        'academic_year_id',
        'is_active',
    ];

    public function grade()
    {
        return $this->belongsTo(Grade::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
