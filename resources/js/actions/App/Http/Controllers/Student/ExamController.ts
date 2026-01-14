import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
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
* @see \App\Http\Controllers\Student\ExamController::index
 * @see app/Http/Controllers/Student/ExamController.php:16
 * @route '/student/exams'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Student\ExamController::index
 * @see app/Http/Controllers/Student/ExamController.php:16
 * @route '/student/exams'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Student\ExamController::index
 * @see app/Http/Controllers/Student/ExamController.php:16
 * @route '/student/exams'
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
* @see \App\Http\Controllers\Student\ExamController::show
 * @see app/Http/Controllers/Student/ExamController.php:95
 * @route '/student/exams/{exam}'
 */
export const show = (args: { exam: string | number | { id: string | number } } | [exam: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/student/exams/{exam}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Student\ExamController::show
 * @see app/Http/Controllers/Student/ExamController.php:95
 * @route '/student/exams/{exam}'
 */
show.url = (args: { exam: string | number | { id: string | number } } | [exam: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
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
 * @see app/Http/Controllers/Student/ExamController.php:95
 * @route '/student/exams/{exam}'
 */
show.get = (args: { exam: string | number | { id: string | number } } | [exam: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Student\ExamController::show
 * @see app/Http/Controllers/Student/ExamController.php:95
 * @route '/student/exams/{exam}'
 */
show.head = (args: { exam: string | number | { id: string | number } } | [exam: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Student\ExamController::show
 * @see app/Http/Controllers/Student/ExamController.php:95
 * @route '/student/exams/{exam}'
 */
    const showForm = (args: { exam: string | number | { id: string | number } } | [exam: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Student\ExamController::show
 * @see app/Http/Controllers/Student/ExamController.php:95
 * @route '/student/exams/{exam}'
 */
        showForm.get = (args: { exam: string | number | { id: string | number } } | [exam: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Student\ExamController::show
 * @see app/Http/Controllers/Student/ExamController.php:95
 * @route '/student/exams/{exam}'
 */
        showForm.head = (args: { exam: string | number | { id: string | number } } | [exam: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\Student\ExamController::take
 * @see app/Http/Controllers/Student/ExamController.php:227
 * @route '/student/exams/{exam}/take'
 */
export const take = (args: { exam: string | number | { id: string | number } } | [exam: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: take.url(args, options),
    method: 'get',
})

take.definition = {
    methods: ["get","head"],
    url: '/student/exams/{exam}/take',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Student\ExamController::take
 * @see app/Http/Controllers/Student/ExamController.php:227
 * @route '/student/exams/{exam}/take'
 */
take.url = (args: { exam: string | number | { id: string | number } } | [exam: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
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
 * @see app/Http/Controllers/Student/ExamController.php:227
 * @route '/student/exams/{exam}/take'
 */
take.get = (args: { exam: string | number | { id: string | number } } | [exam: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: take.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Student\ExamController::take
 * @see app/Http/Controllers/Student/ExamController.php:227
 * @route '/student/exams/{exam}/take'
 */
take.head = (args: { exam: string | number | { id: string | number } } | [exam: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: take.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Student\ExamController::take
 * @see app/Http/Controllers/Student/ExamController.php:227
 * @route '/student/exams/{exam}/take'
 */
    const takeForm = (args: { exam: string | number | { id: string | number } } | [exam: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: take.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Student\ExamController::take
 * @see app/Http/Controllers/Student/ExamController.php:227
 * @route '/student/exams/{exam}/take'
 */
        takeForm.get = (args: { exam: string | number | { id: string | number } } | [exam: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: take.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Student\ExamController::take
 * @see app/Http/Controllers/Student/ExamController.php:227
 * @route '/student/exams/{exam}/take'
 */
        takeForm.head = (args: { exam: string | number | { id: string | number } } | [exam: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: take.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    take.form = takeForm
/**
* @see \App\Http\Controllers\Student\ExamController::saveAnswer
 * @see app/Http/Controllers/Student/ExamController.php:311
 * @route '/student/exams/{exam}/save-answer'
 */
export const saveAnswer = (args: { exam: string | number | { id: string | number } } | [exam: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: saveAnswer.url(args, options),
    method: 'post',
})

saveAnswer.definition = {
    methods: ["post"],
    url: '/student/exams/{exam}/save-answer',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Student\ExamController::saveAnswer
 * @see app/Http/Controllers/Student/ExamController.php:311
 * @route '/student/exams/{exam}/save-answer'
 */
saveAnswer.url = (args: { exam: string | number | { id: string | number } } | [exam: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
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
 * @see app/Http/Controllers/Student/ExamController.php:311
 * @route '/student/exams/{exam}/save-answer'
 */
saveAnswer.post = (args: { exam: string | number | { id: string | number } } | [exam: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: saveAnswer.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Student\ExamController::saveAnswer
 * @see app/Http/Controllers/Student/ExamController.php:311
 * @route '/student/exams/{exam}/save-answer'
 */
    const saveAnswerForm = (args: { exam: string | number | { id: string | number } } | [exam: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: saveAnswer.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Student\ExamController::saveAnswer
 * @see app/Http/Controllers/Student/ExamController.php:311
 * @route '/student/exams/{exam}/save-answer'
 */
        saveAnswerForm.post = (args: { exam: string | number | { id: string | number } } | [exam: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: saveAnswer.url(args, options),
            method: 'post',
        })
    
    saveAnswer.form = saveAnswerForm
/**
* @see \App\Http\Controllers\Student\ExamController::start
 * @see app/Http/Controllers/Student/ExamController.php:122
 * @route '/student/exams/{exam}/start'
 */
export const start = (args: { exam: string | number | { id: string | number } } | [exam: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: start.url(args, options),
    method: 'post',
})

start.definition = {
    methods: ["post"],
    url: '/student/exams/{exam}/start',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Student\ExamController::start
 * @see app/Http/Controllers/Student/ExamController.php:122
 * @route '/student/exams/{exam}/start'
 */
start.url = (args: { exam: string | number | { id: string | number } } | [exam: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
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
 * @see app/Http/Controllers/Student/ExamController.php:122
 * @route '/student/exams/{exam}/start'
 */
start.post = (args: { exam: string | number | { id: string | number } } | [exam: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: start.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Student\ExamController::start
 * @see app/Http/Controllers/Student/ExamController.php:122
 * @route '/student/exams/{exam}/start'
 */
    const startForm = (args: { exam: string | number | { id: string | number } } | [exam: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: start.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Student\ExamController::start
 * @see app/Http/Controllers/Student/ExamController.php:122
 * @route '/student/exams/{exam}/start'
 */
        startForm.post = (args: { exam: string | number | { id: string | number } } | [exam: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: start.url(args, options),
            method: 'post',
        })
    
    start.form = startForm
/**
* @see \App\Http\Controllers\Student\ExamController::finish
 * @see app/Http/Controllers/Student/ExamController.php:404
 * @route '/student/exams/{exam}/finish'
 */
export const finish = (args: { exam: string | number | { id: string | number } } | [exam: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: finish.url(args, options),
    method: 'post',
})

finish.definition = {
    methods: ["post"],
    url: '/student/exams/{exam}/finish',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Student\ExamController::finish
 * @see app/Http/Controllers/Student/ExamController.php:404
 * @route '/student/exams/{exam}/finish'
 */
finish.url = (args: { exam: string | number | { id: string | number } } | [exam: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
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
 * @see app/Http/Controllers/Student/ExamController.php:404
 * @route '/student/exams/{exam}/finish'
 */
finish.post = (args: { exam: string | number | { id: string | number } } | [exam: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: finish.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Student\ExamController::finish
 * @see app/Http/Controllers/Student/ExamController.php:404
 * @route '/student/exams/{exam}/finish'
 */
    const finishForm = (args: { exam: string | number | { id: string | number } } | [exam: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: finish.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Student\ExamController::finish
 * @see app/Http/Controllers/Student/ExamController.php:404
 * @route '/student/exams/{exam}/finish'
 */
        finishForm.post = (args: { exam: string | number | { id: string | number } } | [exam: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: finish.url(args, options),
            method: 'post',
        })
    
    finish.form = finishForm
/**
* @see \App\Http\Controllers\Student\ExamController::finished
 * @see app/Http/Controllers/Student/ExamController.php:444
 * @route '/student/exams/{exam}/finished'
 */
export const finished = (args: { exam: string | number | { id: string | number } } | [exam: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: finished.url(args, options),
    method: 'get',
})

finished.definition = {
    methods: ["get","head"],
    url: '/student/exams/{exam}/finished',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Student\ExamController::finished
 * @see app/Http/Controllers/Student/ExamController.php:444
 * @route '/student/exams/{exam}/finished'
 */
finished.url = (args: { exam: string | number | { id: string | number } } | [exam: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
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

    return finished.definition.url
            .replace('{exam}', parsedArgs.exam.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Student\ExamController::finished
 * @see app/Http/Controllers/Student/ExamController.php:444
 * @route '/student/exams/{exam}/finished'
 */
finished.get = (args: { exam: string | number | { id: string | number } } | [exam: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: finished.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Student\ExamController::finished
 * @see app/Http/Controllers/Student/ExamController.php:444
 * @route '/student/exams/{exam}/finished'
 */
finished.head = (args: { exam: string | number | { id: string | number } } | [exam: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: finished.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Student\ExamController::finished
 * @see app/Http/Controllers/Student/ExamController.php:444
 * @route '/student/exams/{exam}/finished'
 */
    const finishedForm = (args: { exam: string | number | { id: string | number } } | [exam: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: finished.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Student\ExamController::finished
 * @see app/Http/Controllers/Student/ExamController.php:444
 * @route '/student/exams/{exam}/finished'
 */
        finishedForm.get = (args: { exam: string | number | { id: string | number } } | [exam: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: finished.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Student\ExamController::finished
 * @see app/Http/Controllers/Student/ExamController.php:444
 * @route '/student/exams/{exam}/finished'
 */
        finishedForm.head = (args: { exam: string | number | { id: string | number } } | [exam: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: finished.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    finished.form = finishedForm
const ExamController = { index, show, take, saveAnswer, start, finish, finished }

export default ExamController