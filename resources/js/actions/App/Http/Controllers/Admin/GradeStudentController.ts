import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\GradeStudentController::index
 * @see app/Http/Controllers/Admin/GradeStudentController.php:17
 * @route '/admin/grades/{grade}/students'
 */
export const index = (args: { grade: string | number | { id: string | number } } | [grade: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(args, options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/admin/grades/{grade}/students',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\GradeStudentController::index
 * @see app/Http/Controllers/Admin/GradeStudentController.php:17
 * @route '/admin/grades/{grade}/students'
 */
index.url = (args: { grade: string | number | { id: string | number } } | [grade: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { grade: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { grade: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    grade: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        grade: typeof args.grade === 'object'
                ? args.grade.id
                : args.grade,
                }

    return index.definition.url
            .replace('{grade}', parsedArgs.grade.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\GradeStudentController::index
 * @see app/Http/Controllers/Admin/GradeStudentController.php:17
 * @route '/admin/grades/{grade}/students'
 */
index.get = (args: { grade: string | number | { id: string | number } } | [grade: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\GradeStudentController::index
 * @see app/Http/Controllers/Admin/GradeStudentController.php:17
 * @route '/admin/grades/{grade}/students'
 */
index.head = (args: { grade: string | number | { id: string | number } } | [grade: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\GradeStudentController::index
 * @see app/Http/Controllers/Admin/GradeStudentController.php:17
 * @route '/admin/grades/{grade}/students'
 */
    const indexForm = (args: { grade: string | number | { id: string | number } } | [grade: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\GradeStudentController::index
 * @see app/Http/Controllers/Admin/GradeStudentController.php:17
 * @route '/admin/grades/{grade}/students'
 */
        indexForm.get = (args: { grade: string | number | { id: string | number } } | [grade: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\GradeStudentController::index
 * @see app/Http/Controllers/Admin/GradeStudentController.php:17
 * @route '/admin/grades/{grade}/students'
 */
        indexForm.head = (args: { grade: string | number | { id: string | number } } | [grade: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\Admin\GradeStudentController::store
 * @see app/Http/Controllers/Admin/GradeStudentController.php:43
 * @route '/admin/grades/{grade}/students'
 */
export const store = (args: { grade: string | number | { id: string | number } } | [grade: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/admin/grades/{grade}/students',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\GradeStudentController::store
 * @see app/Http/Controllers/Admin/GradeStudentController.php:43
 * @route '/admin/grades/{grade}/students'
 */
store.url = (args: { grade: string | number | { id: string | number } } | [grade: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { grade: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { grade: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    grade: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        grade: typeof args.grade === 'object'
                ? args.grade.id
                : args.grade,
                }

    return store.definition.url
            .replace('{grade}', parsedArgs.grade.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\GradeStudentController::store
 * @see app/Http/Controllers/Admin/GradeStudentController.php:43
 * @route '/admin/grades/{grade}/students'
 */
store.post = (args: { grade: string | number | { id: string | number } } | [grade: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Admin\GradeStudentController::store
 * @see app/Http/Controllers/Admin/GradeStudentController.php:43
 * @route '/admin/grades/{grade}/students'
 */
    const storeForm = (args: { grade: string | number | { id: string | number } } | [grade: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\GradeStudentController::store
 * @see app/Http/Controllers/Admin/GradeStudentController.php:43
 * @route '/admin/grades/{grade}/students'
 */
        storeForm.post = (args: { grade: string | number | { id: string | number } } | [grade: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(args, options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\Admin\GradeStudentController::destroy
 * @see app/Http/Controllers/Admin/GradeStudentController.php:102
 * @route '/admin/grades/{grade}/students/{student}'
 */
export const destroy = (args: { grade: string | number | { id: string | number }, student: string | number | { id: string | number } } | [grade: string | number | { id: string | number }, student: string | number | { id: string | number } ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/admin/grades/{grade}/students/{student}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Admin\GradeStudentController::destroy
 * @see app/Http/Controllers/Admin/GradeStudentController.php:102
 * @route '/admin/grades/{grade}/students/{student}'
 */
destroy.url = (args: { grade: string | number | { id: string | number }, student: string | number | { id: string | number } } | [grade: string | number | { id: string | number }, student: string | number | { id: string | number } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
                    grade: args[0],
                    student: args[1],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        grade: typeof args.grade === 'object'
                ? args.grade.id
                : args.grade,
                                student: typeof args.student === 'object'
                ? args.student.id
                : args.student,
                }

    return destroy.definition.url
            .replace('{grade}', parsedArgs.grade.toString())
            .replace('{student}', parsedArgs.student.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\GradeStudentController::destroy
 * @see app/Http/Controllers/Admin/GradeStudentController.php:102
 * @route '/admin/grades/{grade}/students/{student}'
 */
destroy.delete = (args: { grade: string | number | { id: string | number }, student: string | number | { id: string | number } } | [grade: string | number | { id: string | number }, student: string | number | { id: string | number } ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\Admin\GradeStudentController::destroy
 * @see app/Http/Controllers/Admin/GradeStudentController.php:102
 * @route '/admin/grades/{grade}/students/{student}'
 */
    const destroyForm = (args: { grade: string | number | { id: string | number }, student: string | number | { id: string | number } } | [grade: string | number | { id: string | number }, student: string | number | { id: string | number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\GradeStudentController::destroy
 * @see app/Http/Controllers/Admin/GradeStudentController.php:102
 * @route '/admin/grades/{grade}/students/{student}'
 */
        destroyForm.delete = (args: { grade: string | number | { id: string | number }, student: string | number | { id: string | number } } | [grade: string | number | { id: string | number }, student: string | number | { id: string | number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy.form = destroyForm
const GradeStudentController = { index, store, destroy }

export default GradeStudentController