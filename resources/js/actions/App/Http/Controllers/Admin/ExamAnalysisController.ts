import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\ExamAnalysisController::show
 * @see app/Http/Controllers/Admin/ExamAnalysisController.php:47
 * @route '/admin/exams/{exam}/analysis'
 */
export const show = (args: { exam: string | { id: string } } | [exam: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/admin/exams/{exam}/analysis',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\ExamAnalysisController::show
 * @see app/Http/Controllers/Admin/ExamAnalysisController.php:47
 * @route '/admin/exams/{exam}/analysis'
 */
show.url = (args: { exam: string | { id: string } } | [exam: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions) => {
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

    return show.definition.url
            .replace('{exam}', parsedArgs.exam.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\ExamAnalysisController::show
 * @see app/Http/Controllers/Admin/ExamAnalysisController.php:47
 * @route '/admin/exams/{exam}/analysis'
 */
show.get = (args: { exam: string | { id: string } } | [exam: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\ExamAnalysisController::show
 * @see app/Http/Controllers/Admin/ExamAnalysisController.php:47
 * @route '/admin/exams/{exam}/analysis'
 */
show.head = (args: { exam: string | { id: string } } | [exam: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\ExamAnalysisController::show
 * @see app/Http/Controllers/Admin/ExamAnalysisController.php:47
 * @route '/admin/exams/{exam}/analysis'
 */
    const showForm = (args: { exam: string | { id: string } } | [exam: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\ExamAnalysisController::show
 * @see app/Http/Controllers/Admin/ExamAnalysisController.php:47
 * @route '/admin/exams/{exam}/analysis'
 */
        showForm.get = (args: { exam: string | { id: string } } | [exam: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\ExamAnalysisController::show
 * @see app/Http/Controllers/Admin/ExamAnalysisController.php:47
 * @route '/admin/exams/{exam}/analysis'
 */
        showForm.head = (args: { exam: string | { id: string } } | [exam: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    show.form = showForm
/**
* @see \App\Http\Controllers\Admin\ExamAnalysisController::exportMethod
 * @see app/Http/Controllers/Admin/ExamAnalysisController.php:61
 * @route '/admin/exams/{exam}/analysis/export'
 */
export const exportMethod = (args: { exam: string | { id: string } } | [exam: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: exportMethod.url(args, options),
    method: 'get',
})

exportMethod.definition = {
    methods: ["get","head"],
    url: '/admin/exams/{exam}/analysis/export',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\ExamAnalysisController::exportMethod
 * @see app/Http/Controllers/Admin/ExamAnalysisController.php:61
 * @route '/admin/exams/{exam}/analysis/export'
 */
exportMethod.url = (args: { exam: string | { id: string } } | [exam: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions) => {
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

    return exportMethod.definition.url
            .replace('{exam}', parsedArgs.exam.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\ExamAnalysisController::exportMethod
 * @see app/Http/Controllers/Admin/ExamAnalysisController.php:61
 * @route '/admin/exams/{exam}/analysis/export'
 */
exportMethod.get = (args: { exam: string | { id: string } } | [exam: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: exportMethod.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\ExamAnalysisController::exportMethod
 * @see app/Http/Controllers/Admin/ExamAnalysisController.php:61
 * @route '/admin/exams/{exam}/analysis/export'
 */
exportMethod.head = (args: { exam: string | { id: string } } | [exam: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: exportMethod.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\ExamAnalysisController::exportMethod
 * @see app/Http/Controllers/Admin/ExamAnalysisController.php:61
 * @route '/admin/exams/{exam}/analysis/export'
 */
    const exportMethodForm = (args: { exam: string | { id: string } } | [exam: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: exportMethod.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\ExamAnalysisController::exportMethod
 * @see app/Http/Controllers/Admin/ExamAnalysisController.php:61
 * @route '/admin/exams/{exam}/analysis/export'
 */
        exportMethodForm.get = (args: { exam: string | { id: string } } | [exam: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: exportMethod.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\ExamAnalysisController::exportMethod
 * @see app/Http/Controllers/Admin/ExamAnalysisController.php:61
 * @route '/admin/exams/{exam}/analysis/export'
 */
        exportMethodForm.head = (args: { exam: string | { id: string } } | [exam: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: exportMethod.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    exportMethod.form = exportMethodForm
/**
* @see \App\Http\Controllers\Admin\ExamAnalysisController::store
 * @see app/Http/Controllers/Admin/ExamAnalysisController.php:21
 * @route '/admin/exams/{exam}/analysis'
 */
export const store = (args: { exam: string | { id: string } } | [exam: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/admin/exams/{exam}/analysis',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\ExamAnalysisController::store
 * @see app/Http/Controllers/Admin/ExamAnalysisController.php:21
 * @route '/admin/exams/{exam}/analysis'
 */
store.url = (args: { exam: string | { id: string } } | [exam: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions) => {
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

    return store.definition.url
            .replace('{exam}', parsedArgs.exam.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\ExamAnalysisController::store
 * @see app/Http/Controllers/Admin/ExamAnalysisController.php:21
 * @route '/admin/exams/{exam}/analysis'
 */
store.post = (args: { exam: string | { id: string } } | [exam: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Admin\ExamAnalysisController::store
 * @see app/Http/Controllers/Admin/ExamAnalysisController.php:21
 * @route '/admin/exams/{exam}/analysis'
 */
    const storeForm = (args: { exam: string | { id: string } } | [exam: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\ExamAnalysisController::store
 * @see app/Http/Controllers/Admin/ExamAnalysisController.php:21
 * @route '/admin/exams/{exam}/analysis'
 */
        storeForm.post = (args: { exam: string | { id: string } } | [exam: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(args, options),
            method: 'post',
        })
    
    store.form = storeForm
const ExamAnalysisController = { show, exportMethod, store, export: exportMethod }

export default ExamAnalysisController