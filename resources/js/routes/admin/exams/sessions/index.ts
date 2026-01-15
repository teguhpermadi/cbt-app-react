import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\ExamController::correction
 * @see app/Http/Controllers/Admin/ExamController.php:210
 * @route '/admin/exams/sessions/{session}/correction'
 */
export const correction = (args: { session: string | { id: string } } | [session: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: correction.url(args, options),
    method: 'get',
})

correction.definition = {
    methods: ["get","head"],
    url: '/admin/exams/sessions/{session}/correction',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\ExamController::correction
 * @see app/Http/Controllers/Admin/ExamController.php:210
 * @route '/admin/exams/sessions/{session}/correction'
 */
correction.url = (args: { session: string | { id: string } } | [session: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { session: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { session: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    session: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        session: typeof args.session === 'object'
                ? args.session.id
                : args.session,
                }

    return correction.definition.url
            .replace('{session}', parsedArgs.session.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\ExamController::correction
 * @see app/Http/Controllers/Admin/ExamController.php:210
 * @route '/admin/exams/sessions/{session}/correction'
 */
correction.get = (args: { session: string | { id: string } } | [session: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: correction.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\ExamController::correction
 * @see app/Http/Controllers/Admin/ExamController.php:210
 * @route '/admin/exams/sessions/{session}/correction'
 */
correction.head = (args: { session: string | { id: string } } | [session: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: correction.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\ExamController::correction
 * @see app/Http/Controllers/Admin/ExamController.php:210
 * @route '/admin/exams/sessions/{session}/correction'
 */
    const correctionForm = (args: { session: string | { id: string } } | [session: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: correction.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\ExamController::correction
 * @see app/Http/Controllers/Admin/ExamController.php:210
 * @route '/admin/exams/sessions/{session}/correction'
 */
        correctionForm.get = (args: { session: string | { id: string } } | [session: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: correction.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\ExamController::correction
 * @see app/Http/Controllers/Admin/ExamController.php:210
 * @route '/admin/exams/sessions/{session}/correction'
 */
        correctionForm.head = (args: { session: string | { id: string } } | [session: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: correction.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    correction.form = correctionForm
/**
* @see \App\Http\Controllers\Admin\ExamController::recalculate
 * @see app/Http/Controllers/Admin/ExamController.php:265
 * @route '/admin/exams/sessions/{session}/recalculate'
 */
export const recalculate = (args: { session: string | { id: string } } | [session: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: recalculate.url(args, options),
    method: 'post',
})

recalculate.definition = {
    methods: ["post"],
    url: '/admin/exams/sessions/{session}/recalculate',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\ExamController::recalculate
 * @see app/Http/Controllers/Admin/ExamController.php:265
 * @route '/admin/exams/sessions/{session}/recalculate'
 */
recalculate.url = (args: { session: string | { id: string } } | [session: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { session: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { session: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    session: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        session: typeof args.session === 'object'
                ? args.session.id
                : args.session,
                }

    return recalculate.definition.url
            .replace('{session}', parsedArgs.session.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\ExamController::recalculate
 * @see app/Http/Controllers/Admin/ExamController.php:265
 * @route '/admin/exams/sessions/{session}/recalculate'
 */
recalculate.post = (args: { session: string | { id: string } } | [session: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: recalculate.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Admin\ExamController::recalculate
 * @see app/Http/Controllers/Admin/ExamController.php:265
 * @route '/admin/exams/sessions/{session}/recalculate'
 */
    const recalculateForm = (args: { session: string | { id: string } } | [session: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: recalculate.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\ExamController::recalculate
 * @see app/Http/Controllers/Admin/ExamController.php:265
 * @route '/admin/exams/sessions/{session}/recalculate'
 */
        recalculateForm.post = (args: { session: string | { id: string } } | [session: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: recalculate.url(args, options),
            method: 'post',
        })
    
    recalculate.form = recalculateForm
const sessions = {
    correction: Object.assign(correction, correction),
recalculate: Object.assign(recalculate, recalculate),
}

export default sessions