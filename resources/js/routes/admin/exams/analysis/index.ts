import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\ExamAnalysisController::index
 * @see app/Http/Controllers/Admin/ExamAnalysisController.php:47
 * @route '/admin/exams/{exam}/analysis'
 */
export const index = (args: { exam: string | number | { id: string | number } } | [exam: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(args, options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/admin/exams/{exam}/analysis',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\ExamAnalysisController::index
 * @see app/Http/Controllers/Admin/ExamAnalysisController.php:47
 * @route '/admin/exams/{exam}/analysis'
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
* @see \App\Http\Controllers\Admin\ExamAnalysisController::index
 * @see app/Http/Controllers/Admin/ExamAnalysisController.php:47
 * @route '/admin/exams/{exam}/analysis'
 */
index.get = (args: { exam: string | number | { id: string | number } } | [exam: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\ExamAnalysisController::index
 * @see app/Http/Controllers/Admin/ExamAnalysisController.php:47
 * @route '/admin/exams/{exam}/analysis'
 */
index.head = (args: { exam: string | number | { id: string | number } } | [exam: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\ExamAnalysisController::index
 * @see app/Http/Controllers/Admin/ExamAnalysisController.php:47
 * @route '/admin/exams/{exam}/analysis'
 */
    const indexForm = (args: { exam: string | number | { id: string | number } } | [exam: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\ExamAnalysisController::index
 * @see app/Http/Controllers/Admin/ExamAnalysisController.php:47
 * @route '/admin/exams/{exam}/analysis'
 */
        indexForm.get = (args: { exam: string | number | { id: string | number } } | [exam: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\ExamAnalysisController::index
 * @see app/Http/Controllers/Admin/ExamAnalysisController.php:47
 * @route '/admin/exams/{exam}/analysis'
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
* @see \App\Http\Controllers\Admin\ExamAnalysisController::exportMethod
 * @see app/Http/Controllers/Admin/ExamAnalysisController.php:61
 * @route '/admin/exams/{exam}/analysis/export'
 */
export const exportMethod = (args: { exam: string | number | { id: string | number } } | [exam: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
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
exportMethod.url = (args: { exam: string | number | { id: string | number } } | [exam: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
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
exportMethod.get = (args: { exam: string | number | { id: string | number } } | [exam: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: exportMethod.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\ExamAnalysisController::exportMethod
 * @see app/Http/Controllers/Admin/ExamAnalysisController.php:61
 * @route '/admin/exams/{exam}/analysis/export'
 */
exportMethod.head = (args: { exam: string | number | { id: string | number } } | [exam: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: exportMethod.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\ExamAnalysisController::exportMethod
 * @see app/Http/Controllers/Admin/ExamAnalysisController.php:61
 * @route '/admin/exams/{exam}/analysis/export'
 */
    const exportMethodForm = (args: { exam: string | number | { id: string | number } } | [exam: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: exportMethod.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\ExamAnalysisController::exportMethod
 * @see app/Http/Controllers/Admin/ExamAnalysisController.php:61
 * @route '/admin/exams/{exam}/analysis/export'
 */
        exportMethodForm.get = (args: { exam: string | number | { id: string | number } } | [exam: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: exportMethod.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\ExamAnalysisController::exportMethod
 * @see app/Http/Controllers/Admin/ExamAnalysisController.php:61
 * @route '/admin/exams/{exam}/analysis/export'
 */
        exportMethodForm.head = (args: { exam: string | number | { id: string | number } } | [exam: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
export const store = (args: { exam: string | number | { id: string | number } } | [exam: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
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
store.url = (args: { exam: string | number | { id: string | number } } | [exam: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
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
store.post = (args: { exam: string | number | { id: string | number } } | [exam: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Admin\ExamAnalysisController::store
 * @see app/Http/Controllers/Admin/ExamAnalysisController.php:21
 * @route '/admin/exams/{exam}/analysis'
 */
    const storeForm = (args: { exam: string | number | { id: string | number } } | [exam: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\ExamAnalysisController::store
 * @see app/Http/Controllers/Admin/ExamAnalysisController.php:21
 * @route '/admin/exams/{exam}/analysis'
 */
        storeForm.post = (args: { exam: string | number | { id: string | number } } | [exam: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(args, options),
            method: 'post',
        })
    
    store.form = storeForm
const analysis = {
    index: Object.assign(index, index),
export: Object.assign(exportMethod, exportMethod),
store: Object.assign(store, store),
}

export default analysis