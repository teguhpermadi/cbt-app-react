import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Student\ExamController::index
 * @see app/Http/Controllers/Student/ExamController.php:16
 * @route '/student/exams'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/student/exams',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Student\ExamController::index
 * @see app/Http/Controllers/Student/ExamController.php:16
 * @route '/student/exams'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Student\ExamController::index
 * @see app/Http/Controllers/Student/ExamController.php:16
 * @route '/student/exams'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Student\ExamController::index
 * @see app/Http/Controllers/Student/ExamController.php:16
 * @route '/student/exams'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Student\ExamController::show
 * @see app/Http/Controllers/Student/ExamController.php:84
 * @route '/student/exams/{exam}'
 */
export const show = (args: { exam: string | { id: string } } | [exam: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/student/exams/{exam}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Student\ExamController::show
 * @see app/Http/Controllers/Student/ExamController.php:84
 * @route '/student/exams/{exam}'
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
* @see \App\Http\Controllers\Student\ExamController::show
 * @see app/Http/Controllers/Student/ExamController.php:84
 * @route '/student/exams/{exam}'
 */
show.get = (args: { exam: string | { id: string } } | [exam: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Student\ExamController::show
 * @see app/Http/Controllers/Student/ExamController.php:84
 * @route '/student/exams/{exam}'
 */
show.head = (args: { exam: string | { id: string } } | [exam: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Student\ExamController::take
 * @see app/Http/Controllers/Student/ExamController.php:191
 * @route '/student/exams/{exam}/take'
 */
export const take = (args: { exam: string | { id: string } } | [exam: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: take.url(args, options),
    method: 'get',
})

take.definition = {
    methods: ["get","head"],
    url: '/student/exams/{exam}/take',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Student\ExamController::take
 * @see app/Http/Controllers/Student/ExamController.php:191
 * @route '/student/exams/{exam}/take'
 */
take.url = (args: { exam: string | { id: string } } | [exam: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions) => {
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

    return take.definition.url
            .replace('{exam}', parsedArgs.exam.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Student\ExamController::take
 * @see app/Http/Controllers/Student/ExamController.php:191
 * @route '/student/exams/{exam}/take'
 */
take.get = (args: { exam: string | { id: string } } | [exam: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: take.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Student\ExamController::take
 * @see app/Http/Controllers/Student/ExamController.php:191
 * @route '/student/exams/{exam}/take'
 */
take.head = (args: { exam: string | { id: string } } | [exam: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: take.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Student\ExamController::saveAnswer
 * @see app/Http/Controllers/Student/ExamController.php:257
 * @route '/student/exams/{exam}/save-answer'
 */
export const saveAnswer = (args: { exam: string | { id: string } } | [exam: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: saveAnswer.url(args, options),
    method: 'post',
})

saveAnswer.definition = {
    methods: ["post"],
    url: '/student/exams/{exam}/save-answer',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Student\ExamController::saveAnswer
 * @see app/Http/Controllers/Student/ExamController.php:257
 * @route '/student/exams/{exam}/save-answer'
 */
saveAnswer.url = (args: { exam: string | { id: string } } | [exam: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions) => {
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

    return saveAnswer.definition.url
            .replace('{exam}', parsedArgs.exam.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Student\ExamController::saveAnswer
 * @see app/Http/Controllers/Student/ExamController.php:257
 * @route '/student/exams/{exam}/save-answer'
 */
saveAnswer.post = (args: { exam: string | { id: string } } | [exam: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: saveAnswer.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Student\ExamController::start
 * @see app/Http/Controllers/Student/ExamController.php:97
 * @route '/student/exams/{exam}/start'
 */
export const start = (args: { exam: string | { id: string } } | [exam: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: start.url(args, options),
    method: 'post',
})

start.definition = {
    methods: ["post"],
    url: '/student/exams/{exam}/start',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Student\ExamController::start
 * @see app/Http/Controllers/Student/ExamController.php:97
 * @route '/student/exams/{exam}/start'
 */
start.url = (args: { exam: string | { id: string } } | [exam: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions) => {
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

    return start.definition.url
            .replace('{exam}', parsedArgs.exam.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Student\ExamController::start
 * @see app/Http/Controllers/Student/ExamController.php:97
 * @route '/student/exams/{exam}/start'
 */
start.post = (args: { exam: string | { id: string } } | [exam: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: start.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Student\ExamController::finish
 * @see app/Http/Controllers/Student/ExamController.php:301
 * @route '/student/exams/{exam}/finish'
 */
export const finish = (args: { exam: string | { id: string } } | [exam: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: finish.url(args, options),
    method: 'post',
})

finish.definition = {
    methods: ["post"],
    url: '/student/exams/{exam}/finish',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Student\ExamController::finish
 * @see app/Http/Controllers/Student/ExamController.php:301
 * @route '/student/exams/{exam}/finish'
 */
finish.url = (args: { exam: string | { id: string } } | [exam: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions) => {
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

    return finish.definition.url
            .replace('{exam}', parsedArgs.exam.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Student\ExamController::finish
 * @see app/Http/Controllers/Student/ExamController.php:301
 * @route '/student/exams/{exam}/finish'
 */
finish.post = (args: { exam: string | { id: string } } | [exam: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: finish.url(args, options),
    method: 'post',
})
const exams = {
    index: Object.assign(index, index),
show: Object.assign(show, show),
take: Object.assign(take, take),
saveAnswer: Object.assign(saveAnswer, saveAnswer),
start: Object.assign(start, start),
finish: Object.assign(finish, finish),
}

export default exams