import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
import sessions from './sessions'
import analysis from './analysis'
import manualCorrection from './manual-correction'
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
* @see \App\Http\Controllers\Admin\ExamController::recalculateAll
 * @see app/Http/Controllers/Admin/ExamController.php:298
 * @route '/admin/exams/{exam}/recalculate-all'
 */
export const recalculateAll = (args: { exam: string | number | { id: string | number } } | [exam: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: recalculateAll.url(args, options),
    method: 'post',
})

recalculateAll.definition = {
    methods: ["post"],
    url: '/admin/exams/{exam}/recalculate-all',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\ExamController::recalculateAll
 * @see app/Http/Controllers/Admin/ExamController.php:298
 * @route '/admin/exams/{exam}/recalculate-all'
 */
recalculateAll.url = (args: { exam: string | number | { id: string | number } } | [exam: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
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

    return recalculateAll.definition.url
            .replace('{exam}', parsedArgs.exam.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\ExamController::recalculateAll
 * @see app/Http/Controllers/Admin/ExamController.php:298
 * @route '/admin/exams/{exam}/recalculate-all'
 */
recalculateAll.post = (args: { exam: string | number | { id: string | number } } | [exam: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: recalculateAll.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Admin\ExamController::recalculateAll
 * @see app/Http/Controllers/Admin/ExamController.php:298
 * @route '/admin/exams/{exam}/recalculate-all'
 */
    const recalculateAllForm = (args: { exam: string | number | { id: string | number } } | [exam: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: recalculateAll.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\ExamController::recalculateAll
 * @see app/Http/Controllers/Admin/ExamController.php:298
 * @route '/admin/exams/{exam}/recalculate-all'
 */
        recalculateAllForm.post = (args: { exam: string | number | { id: string | number } } | [exam: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: recalculateAll.url(args, options),
            method: 'post',
        })
    
    recalculateAll.form = recalculateAllForm
/**
* @see \App\Http\Controllers\Admin\LiveScoreController::liveScore
 * @see app/Http/Controllers/Admin/LiveScoreController.php:13
 * @route '/admin/exams/{exam}/live-score'
 */
export const liveScore = (args: { exam: string | number | { id: string | number } } | [exam: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: liveScore.url(args, options),
    method: 'get',
})

liveScore.definition = {
    methods: ["get","head"],
    url: '/admin/exams/{exam}/live-score',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\LiveScoreController::liveScore
 * @see app/Http/Controllers/Admin/LiveScoreController.php:13
 * @route '/admin/exams/{exam}/live-score'
 */
liveScore.url = (args: { exam: string | number | { id: string | number } } | [exam: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
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

    return liveScore.definition.url
            .replace('{exam}', parsedArgs.exam.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\LiveScoreController::liveScore
 * @see app/Http/Controllers/Admin/LiveScoreController.php:13
 * @route '/admin/exams/{exam}/live-score'
 */
liveScore.get = (args: { exam: string | number | { id: string | number } } | [exam: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: liveScore.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\LiveScoreController::liveScore
 * @see app/Http/Controllers/Admin/LiveScoreController.php:13
 * @route '/admin/exams/{exam}/live-score'
 */
liveScore.head = (args: { exam: string | number | { id: string | number } } | [exam: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: liveScore.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\LiveScoreController::liveScore
 * @see app/Http/Controllers/Admin/LiveScoreController.php:13
 * @route '/admin/exams/{exam}/live-score'
 */
    const liveScoreForm = (args: { exam: string | number | { id: string | number } } | [exam: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: liveScore.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\LiveScoreController::liveScore
 * @see app/Http/Controllers/Admin/LiveScoreController.php:13
 * @route '/admin/exams/{exam}/live-score'
 */
        liveScoreForm.get = (args: { exam: string | number | { id: string | number } } | [exam: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: liveScore.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\LiveScoreController::liveScore
 * @see app/Http/Controllers/Admin/LiveScoreController.php:13
 * @route '/admin/exams/{exam}/live-score'
 */
        liveScoreForm.head = (args: { exam: string | number | { id: string | number } } | [exam: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: liveScore.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    liveScore.form = liveScoreForm
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
const exams = {
    regenerateToken: Object.assign(regenerateToken, regenerateToken),
toggleTokenVisibility: Object.assign(toggleTokenVisibility, toggleTokenVisibility),
monitor: Object.assign(monitor, monitor),
sessions: Object.assign(sessions, sessions),
recalculateAll: Object.assign(recalculateAll, recalculateAll),
liveScore: Object.assign(liveScore, liveScore),
analysis: Object.assign(analysis, analysis),
manualCorrection: Object.assign(manualCorrection, manualCorrection),
index: Object.assign(index, index),
create: Object.assign(create, create),
store: Object.assign(store, store),
show: Object.assign(show, show),
edit: Object.assign(edit, edit),
update: Object.assign(update, update),
destroy: Object.assign(destroy, destroy),
}

export default exams