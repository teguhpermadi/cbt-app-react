import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\GradeStudentController::index
 * @see app/Http/Controllers/Admin/GradeStudentController.php:17
 * @route '/admin/grades/{grade}/students'
 */
export const index = (args: { grade: string | { id: string } } | [grade: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
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
index.url = (args: { grade: string | { id: string } } | [grade: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions) => {
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
index.get = (args: { grade: string | { id: string } } | [grade: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\GradeStudentController::index
 * @see app/Http/Controllers/Admin/GradeStudentController.php:17
 * @route '/admin/grades/{grade}/students'
 */
index.head = (args: { grade: string | { id: string } } | [grade: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\GradeStudentController::store
 * @see app/Http/Controllers/Admin/GradeStudentController.php:43
 * @route '/admin/grades/{grade}/students'
 */
export const store = (args: { grade: string | { id: string } } | [grade: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
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
store.url = (args: { grade: string | { id: string } } | [grade: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions) => {
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
store.post = (args: { grade: string | { id: string } } | [grade: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\GradeStudentController::destroy
 * @see app/Http/Controllers/Admin/GradeStudentController.php:102
 * @route '/admin/grades/{grade}/students/{student}'
 */
export const destroy = (args: { grade: string | { id: string }, student: string | { id: string } } | [grade: string | { id: string }, student: string | { id: string } ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
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
destroy.url = (args: { grade: string | { id: string }, student: string | { id: string } } | [grade: string | { id: string }, student: string | { id: string } ], options?: RouteQueryOptions) => {
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
destroy.delete = (args: { grade: string | { id: string }, student: string | { id: string } } | [grade: string | { id: string }, student: string | { id: string } ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})
const GradeStudentController = { index, store, destroy }

export default GradeStudentController