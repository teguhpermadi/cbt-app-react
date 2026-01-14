import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\ExamManualCorrectionController::index
 * @see app/Http/Controllers/Admin/ExamManualCorrectionController.php:17
 * @route '/admin/exams/{exam}/manual-correction'
 */
export const index = (args: { exam: string | number | { id: string | number } } | [exam: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(args, options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/admin/exams/{exam}/manual-correction',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\ExamManualCorrectionController::index
 * @see app/Http/Controllers/Admin/ExamManualCorrectionController.php:17
 * @route '/admin/exams/{exam}/manual-correction'
 */
index.url = (args: { exam: string | number | { id: string | number } } | [exam: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { exam: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { exam: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    exam: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        exam: typeof args.exam === 'object'
                ? args.exam.id
                : args.exam,
                }

    return index.definition.url
            .replace('{exam}', parsedArgs.exam.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\ExamManualCorrectionController::index
 * @see app/Http/Controllers/Admin/ExamManualCorrectionController.php:17
 * @route '/admin/exams/{exam}/manual-correction'
 */
index.get = (args: { exam: string | number | { id: string | number } } | [exam: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\ExamManualCorrectionController::index
 * @see app/Http/Controllers/Admin/ExamManualCorrectionController.php:17
 * @route '/admin/exams/{exam}/manual-correction'
 */
index.head = (args: { exam: string | number | { id: string | number } } | [exam: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\ExamManualCorrectionController::index
 * @see app/Http/Controllers/Admin/ExamManualCorrectionController.php:17
 * @route '/admin/exams/{exam}/manual-correction'
 */
    const indexForm = (args: { exam: string | number | { id: string | number } } | [exam: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\ExamManualCorrectionController::index
 * @see app/Http/Controllers/Admin/ExamManualCorrectionController.php:17
 * @route '/admin/exams/{exam}/manual-correction'
 */
        indexForm.get = (args: { exam: string | number | { id: string | number } } | [exam: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\ExamManualCorrectionController::index
 * @see app/Http/Controllers/Admin/ExamManualCorrectionController.php:17
 * @route '/admin/exams/{exam}/manual-correction'
 */
        indexForm.head = (args: { exam: string | number | { id: string | number } } | [exam: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    index.form = indexForm
/**
* @see \App\Http\Controllers\Admin\ExamManualCorrectionController::storeScore
 * @see app/Http/Controllers/Admin/ExamManualCorrectionController.php:110
 * @route '/admin/exams/manual-correction/score'
 */
export const storeScore = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeScore.url(options),
    method: 'post',
})

storeScore.definition = {
    methods: ["post"],
    url: '/admin/exams/manual-correction/score',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\ExamManualCorrectionController::storeScore
 * @see app/Http/Controllers/Admin/ExamManualCorrectionController.php:110
 * @route '/admin/exams/manual-correction/score'
 */
storeScore.url = (options?: RouteQueryOptions) => {
    return storeScore.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\ExamManualCorrectionController::storeScore
 * @see app/Http/Controllers/Admin/ExamManualCorrectionController.php:110
 * @route '/admin/exams/manual-correction/score'
 */
storeScore.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeScore.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Admin\ExamManualCorrectionController::storeScore
 * @see app/Http/Controllers/Admin/ExamManualCorrectionController.php:110
 * @route '/admin/exams/manual-correction/score'
 */
    const storeScoreForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: storeScore.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\ExamManualCorrectionController::storeScore
 * @see app/Http/Controllers/Admin/ExamManualCorrectionController.php:110
 * @route '/admin/exams/manual-correction/score'
 */
        storeScoreForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: storeScore.url(options),
            method: 'post',
        })
    
    storeScore.form = storeScoreForm
/**
* @see \App\Http\Controllers\Admin\ExamManualCorrectionController::bulkScore
 * @see app/Http/Controllers/Admin/ExamManualCorrectionController.php:152
 * @route '/admin/exams/manual-correction/bulk-score'
 */
export const bulkScore = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: bulkScore.url(options),
    method: 'post',
})

bulkScore.definition = {
    methods: ["post"],
    url: '/admin/exams/manual-correction/bulk-score',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\ExamManualCorrectionController::bulkScore
 * @see app/Http/Controllers/Admin/ExamManualCorrectionController.php:152
 * @route '/admin/exams/manual-correction/bulk-score'
 */
bulkScore.url = (options?: RouteQueryOptions) => {
    return bulkScore.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\ExamManualCorrectionController::bulkScore
 * @see app/Http/Controllers/Admin/ExamManualCorrectionController.php:152
 * @route '/admin/exams/manual-correction/bulk-score'
 */
bulkScore.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: bulkScore.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Admin\ExamManualCorrectionController::bulkScore
 * @see app/Http/Controllers/Admin/ExamManualCorrectionController.php:152
 * @route '/admin/exams/manual-correction/bulk-score'
 */
    const bulkScoreForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: bulkScore.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\ExamManualCorrectionController::bulkScore
 * @see app/Http/Controllers/Admin/ExamManualCorrectionController.php:152
 * @route '/admin/exams/manual-correction/bulk-score'
 */
        bulkScoreForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: bulkScore.url(options),
            method: 'post',
        })
    
    bulkScore.form = bulkScoreForm
/**
* @see \App\Http\Controllers\Admin\ExamManualCorrectionController::aiGrade
 * @see app/Http/Controllers/Admin/ExamManualCorrectionController.php:198
 * @route '/admin/exams/manual-correction/ai-grade'
 */
export const aiGrade = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: aiGrade.url(options),
    method: 'post',
})

aiGrade.definition = {
    methods: ["post"],
    url: '/admin/exams/manual-correction/ai-grade',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\ExamManualCorrectionController::aiGrade
 * @see app/Http/Controllers/Admin/ExamManualCorrectionController.php:198
 * @route '/admin/exams/manual-correction/ai-grade'
 */
aiGrade.url = (options?: RouteQueryOptions) => {
    return aiGrade.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\ExamManualCorrectionController::aiGrade
 * @see app/Http/Controllers/Admin/ExamManualCorrectionController.php:198
 * @route '/admin/exams/manual-correction/ai-grade'
 */
aiGrade.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: aiGrade.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Admin\ExamManualCorrectionController::aiGrade
 * @see app/Http/Controllers/Admin/ExamManualCorrectionController.php:198
 * @route '/admin/exams/manual-correction/ai-grade'
 */
    const aiGradeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: aiGrade.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\ExamManualCorrectionController::aiGrade
 * @see app/Http/Controllers/Admin/ExamManualCorrectionController.php:198
 * @route '/admin/exams/manual-correction/ai-grade'
 */
        aiGradeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: aiGrade.url(options),
            method: 'post',
        })
    
    aiGrade.form = aiGradeForm
const manualCorrection = {
    index: Object.assign(index, index),
storeScore: Object.assign(storeScore, storeScore),
bulkScore: Object.assign(bulkScore, bulkScore),
aiGrade: Object.assign(aiGrade, aiGrade),
}

export default manualCorrection