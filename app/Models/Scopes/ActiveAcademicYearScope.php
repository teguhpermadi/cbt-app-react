<?php

namespace App\Models\Scopes;

use App\Models\AcademicYear;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Scope;
use Illuminate\Support\Facades\Schema;

class ActiveAcademicYearScope implements Scope
{
    /**
     * Apply the scope to a given Eloquent query builder.
     *
     * @param  \Illuminate\Database\Eloquent\Builder  $builder
     * @param  \Illuminate\Database\Eloquent\Model  $model
     * @return void
     */
    public function apply(Builder $builder, Model $model)
    {
        // First, check if the model's table has the 'academic_year_id' column
        if (Schema::hasColumn($model->getTable(), 'academic_year_id')) {
            // Then, find the active academic year
            $activeAcademicYear = AcademicYear::where('is_active', true)->first();

            // If an active academic year is found, apply the where clause
            if ($activeAcademicYear) {
                $builder->where($model->getTable() . '.academic_year_id', $activeAcademicYear->id);
            }
        }
    }
}
