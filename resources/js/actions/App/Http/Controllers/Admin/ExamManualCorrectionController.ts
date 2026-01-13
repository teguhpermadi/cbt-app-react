import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\ExamManualCorrectionController::index
 * @see app/Http/Controllers/Admin/ExamManualCorrectionController.php:17
 * @route '/admin/exams/{exam}/manual-correction'
 */
export const index = (args: { exam: string | { id: string } } | [exam: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
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
index.url = (args: { exam: string | { id: string } } | [exam: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions) => {
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
index.get = (args: { exam: string | { id: string } } | [exam: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\ExamManualCorrectionController::index
 * @see app/Http/Controllers/Admin/ExamManualCorrectionController.php:17
 * @route '/admin/exams/{exam}/manual-correction'
 */
index.head = (args: { exam: string | { id: string } } | [exam: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\ExamManualCorrectionController::index
 * @see app/Http/Controllers/Admin/ExamManualCorrectionController.php:17
 * @route '/admin/exams/{exam}/manual-correction'
 */
    const indexForm = (args: { exam: string | { id: string } } | [exam: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\ExamManualCorrectionController::index
 * @see app/Http/Controllers/Admin/ExamManualCorrectionController.php:17
 * @route '/admin/exams/{exam}/manual-correction'
 */
        indexForm.get = (args: { exam: string | { id: string } } | [exam: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\ExamManualCorrectionController::index
 * @see app/Http/Controllers/Admin/ExamManualCorrectionController.php:17
 * @route '/admin/exams/{exam}/manual-correction'
 */
        indexForm.head = (args: { exam: string | { id: string } } | [exam: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\Admin\ExamManualCorrectionController::bulkStoreScore
 * @see app/Http/Controllers/Admin/ExamManualCorrectionController.php:152
 * @route '/admin/exams/manual-correction/bulk-score'
 */
export const bulkStoreScore = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: bulkStoreScore.url(options),
    method: 'post',
})

bulkStoreScore.definition = {
    methods: ["post"],
    url: '/admin/exams/manual-correction/bulk-score',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\ExamManualCorrectionController::bulkStoreScore
 * @see app/Http/Controllers/Admin/ExamManualCorrectionController.php:152
 * @route '/admin/exams/manual-correction/bulk-score'
 */
bulkStoreScore.url = (options?: RouteQueryOptions) => {
    return bulkStoreScore.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\ExamManualCorrectionController::bulkStoreScore
 * @see app/Http/Controllers/Admin/ExamManualCorrectionController.php:152
 * @route '/admin/exams/manual-correction/bulk-score'
 */
bulkStoreScore.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: bulkStoreScore.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Admin\ExamManualCorrectionController::bulkStoreScore
 * @see app/Http/Controllers/Admin/ExamManualCorrectionController.php:152
 * @route '/admin/exams/manual-correction/bulk-score'
 */
    const bulkStoreScoreForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: bulkStoreScore.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\ExamManualCorrectionController::bulkStoreScore
 * @see app/Http/Controllers/Admin/ExamManualCorrectionController.php:152
 * @route '/admin/exams/manual-correction/bulk-score'
 */
        bulkStoreScoreForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: bulkStoreScore.url(options),
            method: 'post',
        })
    
    bulkStoreScore.form = bulkStoreScoreForm
/**
* @see \App\Http\Controllers\Admin\ExamManualCorrectionController::gradeWithAI
 * @see app/Http/Controllers/Admin/ExamManualCorrectionController.php:198
 * @route '/admin/exams/manual-correction/ai-grade'
 */
export const gradeWithAI = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: gradeWithAI.url(options),
    method: 'post',
})

gradeWithAI.definition = {
    methods: ["post"],
    url: '/admin/exams/manual-correction/ai-grade',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\ExamManualCorrectionController::gradeWithAI
 * @see app/Http/Controllers/Admin/ExamManualCorrectionController.php:198
 * @route '/admin/exams/manual-correction/ai-grade'
 */
gradeWithAI.url = (options?: RouteQueryOptions) => {
    return gradeWithAI.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\ExamManualCorrectionController::gradeWithAI
 * @see app/Http/Controllers/Admin/ExamManualCorrectionController.php:198
 * @route '/admin/exams/manual-correction/ai-grade'
 */
gradeWithAI.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: gradeWithAI.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Admin\ExamManualCorrectionController::gradeWithAI
 * @see app/Http/Controllers/Admin/ExamManualCorrectionController.php:198
 * @route '/admin/exams/manual-correction/ai-grade'
 */
    const gradeWithAIForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: gradeWithAI.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\ExamManualCorrectionController::gradeWithAI
 * @see app/Http/Controllers/Admin/ExamManualCorrectionController.php:198
 * @route '/admin/exams/manual-correction/ai-grade'
 */
        gradeWithAIForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: gradeWithAI.url(options),
            method: 'post',
        })
    
    gradeWithAI.form = gradeWithAIForm
const ExamManualCorrectionController = { index, storeScore, bulkStoreScore, gradeWithAI }

export default ExamManualCorrectionController