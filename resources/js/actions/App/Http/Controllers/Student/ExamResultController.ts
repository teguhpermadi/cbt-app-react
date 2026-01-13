import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Student\ExamResultController::index
 * @see app/Http/Controllers/Student/ExamResultController.php:24
 * @route '/student/results'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/student/results',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Student\ExamResultController::index
 * @see app/Http/Controllers/Student/ExamResultController.php:24
 * @route '/student/results'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Student\ExamResultController::index
 * @see app/Http/Controllers/Student/ExamResultController.php:24
 * @route '/student/results'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Student\ExamResultController::index
 * @see app/Http/Controllers/Student/ExamResultController.php:24
 * @route '/student/results'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Student\ExamResultController::index
 * @see app/Http/Controllers/Student/ExamResultController.php:24
 * @route '/student/results'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Student\ExamResultController::index
 * @see app/Http/Controllers/Student/ExamResultController.php:24
 * @route '/student/results'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Student\ExamResultController::index
 * @see app/Http/Controllers/Student/ExamResultController.php:24
 * @route '/student/results'
 */
        indexForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    index.form = indexForm
/**
* @see \App\Http\Controllers\Student\ExamResultController::show
 * @see app/Http/Controllers/Student/ExamResultController.php:61
 * @route '/student/exams/{exam}/result'
 */
export const show = (args: { exam: string | { id: string } } | [exam: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/student/exams/{exam}/result',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Student\ExamResultController::show
 * @see app/Http/Controllers/Student/ExamResultController.php:61
 * @route '/student/exams/{exam}/result'
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
* @see \App\Http\Controllers\Student\ExamResultController::show
 * @see app/Http/Controllers/Student/ExamResultController.php:61
 * @route '/student/exams/{exam}/result'
 */
show.get = (args: { exam: string | { id: string } } | [exam: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Student\ExamResultController::show
 * @see app/Http/Controllers/Student/ExamResultController.php:61
 * @route '/student/exams/{exam}/result'
 */
show.head = (args: { exam: string | { id: string } } | [exam: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Student\ExamResultController::show
 * @see app/Http/Controllers/Student/ExamResultController.php:61
 * @route '/student/exams/{exam}/result'
 */
    const showForm = (args: { exam: string | { id: string } } | [exam: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Student\ExamResultController::show
 * @see app/Http/Controllers/Student/ExamResultController.php:61
 * @route '/student/exams/{exam}/result'
 */
        showForm.get = (args: { exam: string | { id: string } } | [exam: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Student\ExamResultController::show
 * @see app/Http/Controllers/Student/ExamResultController.php:61
 * @route '/student/exams/{exam}/result'
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
* @see \App\Http\Controllers\Student\ExamResultController::showSession
 * @see app/Http/Controllers/Student/ExamResultController.php:80
 * @route '/student/results/session/{session}'
 */
export const showSession = (args: { session: string | { id: string } } | [session: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: showSession.url(args, options),
    method: 'get',
})

showSession.definition = {
    methods: ["get","head"],
    url: '/student/results/session/{session}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Student\ExamResultController::showSession
 * @see app/Http/Controllers/Student/ExamResultController.php:80
 * @route '/student/results/session/{session}'
 */
showSession.url = (args: { session: string | { id: string } } | [session: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions) => {
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

    return showSession.definition.url
            .replace('{session}', parsedArgs.session.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Student\ExamResultController::showSession
 * @see app/Http/Controllers/Student/ExamResultController.php:80
 * @route '/student/results/session/{session}'
 */
showSession.get = (args: { session: string | { id: string } } | [session: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: showSession.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Student\ExamResultController::showSession
 * @see app/Http/Controllers/Student/ExamResultController.php:80
 * @route '/student/results/session/{session}'
 */
showSession.head = (args: { session: string | { id: string } } | [session: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: showSession.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Student\ExamResultController::showSession
 * @see app/Http/Controllers/Student/ExamResultController.php:80
 * @route '/student/results/session/{session}'
 */
    const showSessionForm = (args: { session: string | { id: string } } | [session: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: showSession.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Student\ExamResultController::showSession
 * @see app/Http/Controllers/Student/ExamResultController.php:80
 * @route '/student/results/session/{session}'
 */
        showSessionForm.get = (args: { session: string | { id: string } } | [session: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: showSession.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Student\ExamResultController::showSession
 * @see app/Http/Controllers/Student/ExamResultController.php:80
 * @route '/student/results/session/{session}'
 */
        showSessionForm.head = (args: { session: string | { id: string } } | [session: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: showSession.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    showSession.form = showSessionForm
const ExamResultController = { index, show, showSession }

export default ExamResultController