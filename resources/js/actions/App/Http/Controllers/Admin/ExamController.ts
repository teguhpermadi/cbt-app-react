import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\ExamController::regenerateToken
 * @see app/Http/Controllers/Admin/ExamController.php:154
 * @route '/admin/exams/{exam}/regenerate-token'
 */
export const regenerateToken = (args: { exam: string | number | { id: string | number } } | [exam: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: regenerateToken.url(args, options),
    method: 'put',
})

regenerateToken.definition = {
    methods: ["put"],
    url: '/admin/exams/{exam}/regenerate-token',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\Admin\ExamController::regenerateToken
 * @see app/Http/Controllers/Admin/ExamController.php:154
 * @route '/admin/exams/{exam}/regenerate-token'
 */
regenerateToken.url = (args: { exam: string | number | { id: string | number } } | [exam: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
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

    return regenerateToken.definition.url
            .replace('{exam}', parsedArgs.exam.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\ExamController::regenerateToken
 * @see app/Http/Controllers/Admin/ExamController.php:154
 * @route '/admin/exams/{exam}/regenerate-token'
 */
regenerateToken.put = (args: { exam: string | number | { id: string | number } } | [exam: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: regenerateToken.url(args, options),
    method: 'put',
})

    /**
* @see \App\Http\Controllers\Admin\ExamController::regenerateToken
 * @see app/Http/Controllers/Admin/ExamController.php:154
 * @route '/admin/exams/{exam}/regenerate-token'
 */
    const regenerateTokenForm = (args: { exam: string | number | { id: string | number } } | [exam: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: regenerateToken.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\ExamController::regenerateToken
 * @see app/Http/Controllers/Admin/ExamController.php:154
 * @route '/admin/exams/{exam}/regenerate-token'
 */
        regenerateTokenForm.put = (args: { exam: string | number | { id: string | number } } | [exam: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: regenerateToken.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    regenerateToken.form = regenerateTokenForm
/**
* @see \App\Http\Controllers\Admin\ExamController::toggleTokenVisibility
 * @see app/Http/Controllers/Admin/ExamController.php:163
 * @route '/admin/exams/{exam}/toggle-token-visibility'
 */
export const toggleTokenVisibility = (args: { exam: string | number | { id: string | number } } | [exam: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: toggleTokenVisibility.url(args, options),
    method: 'put',
})

toggleTokenVisibility.definition = {
    methods: ["put"],
    url: '/admin/exams/{exam}/toggle-token-visibility',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\Admin\ExamController::toggleTokenVisibility
 * @see app/Http/Controllers/Admin/ExamController.php:163
 * @route '/admin/exams/{exam}/toggle-token-visibility'
 */
toggleTokenVisibility.url = (args: { exam: string | number | { id: string | number } } | [exam: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
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

    return toggleTokenVisibility.definition.url
            .replace('{exam}', parsedArgs.exam.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\ExamController::toggleTokenVisibility
 * @see app/Http/Controllers/Admin/ExamController.php:163
 * @route '/admin/exams/{exam}/toggle-token-visibility'
 */
toggleTokenVisibility.put = (args: { exam: string | number | { id: string | number } } | [exam: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: toggleTokenVisibility.url(args, options),
    method: 'put',
})

    /**
* @see \App\Http\Controllers\Admin\ExamController::toggleTokenVisibility
 * @see app/Http/Controllers/Admin/ExamController.php:163
 * @route '/admin/exams/{exam}/toggle-token-visibility'
 */
    const toggleTokenVisibilityForm = (args: { exam: string | number | { id: string | number } } | [exam: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: toggleTokenVisibility.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\ExamController::toggleTokenVisibility
 * @see app/Http/Controllers/Admin/ExamController.php:163
 * @route '/admin/exams/{exam}/toggle-token-visibility'
 */
        toggleTokenVisibilityForm.put = (args: { exam: string | number | { id: string | number } } | [exam: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: toggleTokenVisibility.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    toggleTokenVisibility.form = toggleTokenVisibilityForm
/**
* @see \App\Http\Controllers\Admin\ExamController::monitor
 * @see app/Http/Controllers/Admin/ExamController.php:172
 * @route '/admin/exams/{exam}/monitor'
 */
export const monitor = (args: { exam: string | number | { id: string | number } } | [exam: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: monitor.url(args, options),
    method: 'get',
})

monitor.definition = {
    methods: ["get","head"],
    url: '/admin/exams/{exam}/monitor',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\ExamController::monitor
 * @see app/Http/Controllers/Admin/ExamController.php:172
 * @route '/admin/exams/{exam}/monitor'
 */
monitor.url = (args: { exam: string | number | { id: string | number } } | [exam: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
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

    return monitor.definition.url
            .replace('{exam}', parsedArgs.exam.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\ExamController::monitor
 * @see app/Http/Controllers/Admin/ExamController.php:172
 * @route '/admin/exams/{exam}/monitor'
 */
monitor.get = (args: { exam: string | number | { id: string | number } } | [exam: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: monitor.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\ExamController::monitor
 * @see app/Http/Controllers/Admin/ExamController.php:172
 * @route '/admin/exams/{exam}/monitor'
 */
monitor.head = (args: { exam: string | number | { id: string | number } } | [exam: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: monitor.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\ExamController::monitor
 * @see app/Http/Controllers/Admin/ExamController.php:172
 * @route '/admin/exams/{exam}/monitor'
 */
    const monitorForm = (args: { exam: string | number | { id: string | number } } | [exam: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: monitor.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\ExamController::monitor
 * @see app/Http/Controllers/Admin/ExamController.php:172
 * @route '/admin/exams/{exam}/monitor'
 */
        monitorForm.get = (args: { exam: string | number | { id: string | number } } | [exam: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: monitor.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\ExamController::monitor
 * @see app/Http/Controllers/Admin/ExamController.php:172
 * @route '/admin/exams/{exam}/monitor'
 */
        monitorForm.head = (args: { exam: string | number | { id: string | number } } | [exam: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: monitor.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    monitor.form = monitorForm
/**
* @see \App\Http\Controllers\Admin\ExamController::correction
 * @see app/Http/Controllers/Admin/ExamController.php:210
 * @route '/admin/exams/sessions/{session}/correction'
 */
export const correction = (args: { session: string | number | { id: string | number } } | [session: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
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
correction.url = (args: { session: string | number | { id: string | number } } | [session: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
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
correction.get = (args: { session: string | number | { id: string | number } } | [session: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: correction.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\ExamController::correction
 * @see app/Http/Controllers/Admin/ExamController.php:210
 * @route '/admin/exams/sessions/{session}/correction'
 */
correction.head = (args: { session: string | number | { id: string | number } } | [session: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: correction.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\ExamController::correction
 * @see app/Http/Controllers/Admin/ExamController.php:210
 * @route '/admin/exams/sessions/{session}/correction'
 */
    const correctionForm = (args: { session: string | number | { id: string | number } } | [session: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: correction.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\ExamController::correction
 * @see app/Http/Controllers/Admin/ExamController.php:210
 * @route '/admin/exams/sessions/{session}/correction'
 */
        correctionForm.get = (args: { session: string | number | { id: string | number } } | [session: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: correction.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\ExamController::correction
 * @see app/Http/Controllers/Admin/ExamController.php:210
 * @route '/admin/exams/sessions/{session}/correction'
 */
        correctionForm.head = (args: { session: string | number | { id: string | number } } | [session: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\Admin\ExamController::calculateScores
 * @see app/Http/Controllers/Admin/ExamController.php:265
 * @route '/admin/exams/sessions/{session}/recalculate'
 */
export const calculateScores = (args: { session: string | number | { id: string | number } } | [session: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: calculateScores.url(args, options),
    method: 'post',
})

calculateScores.definition = {
    methods: ["post"],
    url: '/admin/exams/sessions/{session}/recalculate',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\ExamController::calculateScores
 * @see app/Http/Controllers/Admin/ExamController.php:265
 * @route '/admin/exams/sessions/{session}/recalculate'
 */
calculateScores.url = (args: { session: string | number | { id: string | number } } | [session: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
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

    return calculateScores.definition.url
            .replace('{session}', parsedArgs.session.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\ExamController::calculateScores
 * @see app/Http/Controllers/Admin/ExamController.php:265
 * @route '/admin/exams/sessions/{session}/recalculate'
 */
calculateScores.post = (args: { session: string | number | { id: string | number } } | [session: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: calculateScores.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Admin\ExamController::calculateScores
 * @see app/Http/Controllers/Admin/ExamController.php:265
 * @route '/admin/exams/sessions/{session}/recalculate'
 */
    const calculateScoresForm = (args: { session: string | number | { id: string | number } } | [session: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: calculateScores.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\ExamController::calculateScores
 * @see app/Http/Controllers/Admin/ExamController.php:265
 * @route '/admin/exams/sessions/{session}/recalculate'
 */
        calculateScoresForm.post = (args: { session: string | number | { id: string | number } } | [session: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: calculateScores.url(args, options),
            method: 'post',
        })
    
    calculateScores.form = calculateScoresForm
/**
* @see \App\Http\Controllers\Admin\ExamController::calculateAllScores
 * @see app/Http/Controllers/Admin/ExamController.php:298
 * @route '/admin/exams/{exam}/recalculate-all'
 */
export const calculateAllScores = (args: { exam: string | number | { id: string | number } } | [exam: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: calculateAllScores.url(args, options),
    method: 'post',
})

calculateAllScores.definition = {
    methods: ["post"],
    url: '/admin/exams/{exam}/recalculate-all',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\ExamController::calculateAllScores
 * @see app/Http/Controllers/Admin/ExamController.php:298
 * @route '/admin/exams/{exam}/recalculate-all'
 */
calculateAllScores.url = (args: { exam: string | number | { id: string | number } } | [exam: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
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

    return calculateAllScores.definition.url
            .replace('{exam}', parsedArgs.exam.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\ExamController::calculateAllScores
 * @see app/Http/Controllers/Admin/ExamController.php:298
 * @route '/admin/exams/{exam}/recalculate-all'
 */
calculateAllScores.post = (args: { exam: string | number | { id: string | number } } | [exam: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: calculateAllScores.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Admin\ExamController::calculateAllScores
 * @see app/Http/Controllers/Admin/ExamController.php:298
 * @route '/admin/exams/{exam}/recalculate-all'
 */
    const calculateAllScoresForm = (args: { exam: string | number | { id: string | number } } | [exam: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: calculateAllScores.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\ExamController::calculateAllScores
 * @see app/Http/Controllers/Admin/ExamController.php:298
 * @route '/admin/exams/{exam}/recalculate-all'
 */
        calculateAllScoresForm.post = (args: { exam: string | number | { id: string | number } } | [exam: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: calculateAllScores.url(args, options),
            method: 'post',
        })
    
    calculateAllScores.form = calculateAllScoresForm
/**
* @see \App\Http\Controllers\Admin\ExamController::index
 * @see app/Http/Controllers/Admin/ExamController.php:30
 * @route '/admin/exams'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/admin/exams',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\ExamController::index
 * @see app/Http/Controllers/Admin/ExamController.php:30
 * @route '/admin/exams'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\ExamController::index
 * @see app/Http/Controllers/Admin/ExamController.php:30
 * @route '/admin/exams'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\ExamController::index
 * @see app/Http/Controllers/Admin/ExamController.php:30
 * @route '/admin/exams'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\ExamController::index
 * @see app/Http/Controllers/Admin/ExamController.php:30
 * @route '/admin/exams'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\ExamController::index
 * @see app/Http/Controllers/Admin/ExamController.php:30
 * @route '/admin/exams'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\ExamController::index
 * @see app/Http/Controllers/Admin/ExamController.php:30
 * @route '/admin/exams'
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
* @see \App\Http\Controllers\Admin\ExamController::create
 * @see app/Http/Controllers/Admin/ExamController.php:57
 * @route '/admin/exams/create'
 */
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/admin/exams/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\ExamController::create
 * @see app/Http/Controllers/Admin/ExamController.php:57
 * @route '/admin/exams/create'
 */
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\ExamController::create
 * @see app/Http/Controllers/Admin/ExamController.php:57
 * @route '/admin/exams/create'
 */
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\ExamController::create
 * @see app/Http/Controllers/Admin/ExamController.php:57
 * @route '/admin/exams/create'
 */
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\ExamController::create
 * @see app/Http/Controllers/Admin/ExamController.php:57
 * @route '/admin/exams/create'
 */
    const createForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: create.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\ExamController::create
 * @see app/Http/Controllers/Admin/ExamController.php:57
 * @route '/admin/exams/create'
 */
        createForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: create.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\ExamController::create
 * @see app/Http/Controllers/Admin/ExamController.php:57
 * @route '/admin/exams/create'
 */
        createForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: create.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    create.form = createForm
/**
* @see \App\Http\Controllers\Admin\ExamController::store
 * @see app/Http/Controllers/Admin/ExamController.php:83
 * @route '/admin/exams'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/admin/exams',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\ExamController::store
 * @see app/Http/Controllers/Admin/ExamController.php:83
 * @route '/admin/exams'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\ExamController::store
 * @see app/Http/Controllers/Admin/ExamController.php:83
 * @route '/admin/exams'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Admin\ExamController::store
 * @see app/Http/Controllers/Admin/ExamController.php:83
 * @route '/admin/exams'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\ExamController::store
 * @see app/Http/Controllers/Admin/ExamController.php:83
 * @route '/admin/exams'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\Admin\ExamController::show
 * @see app/Http/Controllers/Admin/ExamController.php:0
 * @route '/admin/exams/{exam}'
 */
export const show = (args: { exam: string | number } | [exam: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/admin/exams/{exam}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\ExamController::show
 * @see app/Http/Controllers/Admin/ExamController.php:0
 * @route '/admin/exams/{exam}'
 */
show.url = (args: { exam: string | number } | [exam: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { exam: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    exam: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        exam: args.exam,
                }

    return show.definition.url
            .replace('{exam}', parsedArgs.exam.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\ExamController::show
 * @see app/Http/Controllers/Admin/ExamController.php:0
 * @route '/admin/exams/{exam}'
 */
show.get = (args: { exam: string | number } | [exam: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\ExamController::show
 * @see app/Http/Controllers/Admin/ExamController.php:0
 * @route '/admin/exams/{exam}'
 */
show.head = (args: { exam: string | number } | [exam: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\ExamController::show
 * @see app/Http/Controllers/Admin/ExamController.php:0
 * @route '/admin/exams/{exam}'
 */
    const showForm = (args: { exam: string | number } | [exam: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\ExamController::show
 * @see app/Http/Controllers/Admin/ExamController.php:0
 * @route '/admin/exams/{exam}'
 */
        showForm.get = (args: { exam: string | number } | [exam: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\ExamController::show
 * @see app/Http/Controllers/Admin/ExamController.php:0
 * @route '/admin/exams/{exam}'
 */
        showForm.head = (args: { exam: string | number } | [exam: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\Admin\ExamController::edit
 * @see app/Http/Controllers/Admin/ExamController.php:103
 * @route '/admin/exams/{exam}/edit'
 */
export const edit = (args: { exam: string | number | { id: string | number } } | [exam: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/admin/exams/{exam}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\ExamController::edit
 * @see app/Http/Controllers/Admin/ExamController.php:103
 * @route '/admin/exams/{exam}/edit'
 */
edit.url = (args: { exam: string | number | { id: string | number } } | [exam: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
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

    return edit.definition.url
            .replace('{exam}', parsedArgs.exam.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\ExamController::edit
 * @see app/Http/Controllers/Admin/ExamController.php:103
 * @route '/admin/exams/{exam}/edit'
 */
edit.get = (args: { exam: string | number | { id: string | number } } | [exam: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\ExamController::edit
 * @see app/Http/Controllers/Admin/ExamController.php:103
 * @route '/admin/exams/{exam}/edit'
 */
edit.head = (args: { exam: string | number | { id: string | number } } | [exam: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\ExamController::edit
 * @see app/Http/Controllers/Admin/ExamController.php:103
 * @route '/admin/exams/{exam}/edit'
 */
    const editForm = (args: { exam: string | number | { id: string | number } } | [exam: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: edit.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\ExamController::edit
 * @see app/Http/Controllers/Admin/ExamController.php:103
 * @route '/admin/exams/{exam}/edit'
 */
        editForm.get = (args: { exam: string | number | { id: string | number } } | [exam: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: edit.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\ExamController::edit
 * @see app/Http/Controllers/Admin/ExamController.php:103
 * @route '/admin/exams/{exam}/edit'
 */
        editForm.head = (args: { exam: string | number | { id: string | number } } | [exam: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: edit.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    edit.form = editForm
/**
* @see \App\Http\Controllers\Admin\ExamController::update
 * @see app/Http/Controllers/Admin/ExamController.php:128
 * @route '/admin/exams/{exam}'
 */
export const update = (args: { exam: string | number | { id: string | number } } | [exam: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/admin/exams/{exam}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\Admin\ExamController::update
 * @see app/Http/Controllers/Admin/ExamController.php:128
 * @route '/admin/exams/{exam}'
 */
update.url = (args: { exam: string | number | { id: string | number } } | [exam: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
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

    return update.definition.url
            .replace('{exam}', parsedArgs.exam.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\ExamController::update
 * @see app/Http/Controllers/Admin/ExamController.php:128
 * @route '/admin/exams/{exam}'
 */
update.put = (args: { exam: string | number | { id: string | number } } | [exam: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})
/**
* @see \App\Http\Controllers\Admin\ExamController::update
 * @see app/Http/Controllers/Admin/ExamController.php:128
 * @route '/admin/exams/{exam}'
 */
update.patch = (args: { exam: string | number | { id: string | number } } | [exam: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\Admin\ExamController::update
 * @see app/Http/Controllers/Admin/ExamController.php:128
 * @route '/admin/exams/{exam}'
 */
    const updateForm = (args: { exam: string | number | { id: string | number } } | [exam: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\ExamController::update
 * @see app/Http/Controllers/Admin/ExamController.php:128
 * @route '/admin/exams/{exam}'
 */
        updateForm.put = (args: { exam: string | number | { id: string | number } } | [exam: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
            /**
* @see \App\Http\Controllers\Admin\ExamController::update
 * @see app/Http/Controllers/Admin/ExamController.php:128
 * @route '/admin/exams/{exam}'
 */
        updateForm.patch = (args: { exam: string | number | { id: string | number } } | [exam: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PATCH',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    update.form = updateForm
/**
* @see \App\Http\Controllers\Admin\ExamController::destroy
 * @see app/Http/Controllers/Admin/ExamController.php:148
 * @route '/admin/exams/{exam}'
 */
export const destroy = (args: { exam: string | number | { id: string | number } } | [exam: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/admin/exams/{exam}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Admin\ExamController::destroy
 * @see app/Http/Controllers/Admin/ExamController.php:148
 * @route '/admin/exams/{exam}'
 */
destroy.url = (args: { exam: string | number | { id: string | number } } | [exam: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
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

    return destroy.definition.url
            .replace('{exam}', parsedArgs.exam.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\ExamController::destroy
 * @see app/Http/Controllers/Admin/ExamController.php:148
 * @route '/admin/exams/{exam}'
 */
destroy.delete = (args: { exam: string | number | { id: string | number } } | [exam: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\Admin\ExamController::destroy
 * @see app/Http/Controllers/Admin/ExamController.php:148
 * @route '/admin/exams/{exam}'
 */
    const destroyForm = (args: { exam: string | number | { id: string | number } } | [exam: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\ExamController::destroy
 * @see app/Http/Controllers/Admin/ExamController.php:148
 * @route '/admin/exams/{exam}'
 */
        destroyForm.delete = (args: { exam: string | number | { id: string | number } } | [exam: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy.form = destroyForm
const ExamController = { regenerateToken, toggleTokenVisibility, monitor, correction, calculateScores, calculateAllScores, index, create, store, show, edit, update, destroy }

export default ExamController