import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\QuestionSuggestionController::store
 * @see app/Http/Controllers/Admin/QuestionSuggestionController.php:62
 * @route '/admin/questions/{question}/suggestions'
 */
export const store = (args: { question: string | { id: string } } | [question: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/admin/questions/{question}/suggestions',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\QuestionSuggestionController::store
 * @see app/Http/Controllers/Admin/QuestionSuggestionController.php:62
 * @route '/admin/questions/{question}/suggestions'
 */
store.url = (args: { question: string | { id: string } } | [question: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { question: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { question: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    question: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        question: typeof args.question === 'object'
                ? args.question.id
                : args.question,
                }

    return store.definition.url
            .replace('{question}', parsedArgs.question.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\QuestionSuggestionController::store
 * @see app/Http/Controllers/Admin/QuestionSuggestionController.php:62
 * @route '/admin/questions/{question}/suggestions'
 */
store.post = (args: { question: string | { id: string } } | [question: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Admin\QuestionSuggestionController::store
 * @see app/Http/Controllers/Admin/QuestionSuggestionController.php:62
 * @route '/admin/questions/{question}/suggestions'
 */
    const storeForm = (args: { question: string | { id: string } } | [question: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\QuestionSuggestionController::store
 * @see app/Http/Controllers/Admin/QuestionSuggestionController.php:62
 * @route '/admin/questions/{question}/suggestions'
 */
        storeForm.post = (args: { question: string | { id: string } } | [question: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(args, options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\Admin\QuestionSuggestionController::update
 * @see app/Http/Controllers/Admin/QuestionSuggestionController.php:174
 * @route '/admin/question-suggestions/{suggestion}'
 */
export const update = (args: { suggestion: string | { id: string } } | [suggestion: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put"],
    url: '/admin/question-suggestions/{suggestion}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\Admin\QuestionSuggestionController::update
 * @see app/Http/Controllers/Admin/QuestionSuggestionController.php:174
 * @route '/admin/question-suggestions/{suggestion}'
 */
update.url = (args: { suggestion: string | { id: string } } | [suggestion: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { suggestion: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { suggestion: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    suggestion: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        suggestion: typeof args.suggestion === 'object'
                ? args.suggestion.id
                : args.suggestion,
                }

    return update.definition.url
            .replace('{suggestion}', parsedArgs.suggestion.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\QuestionSuggestionController::update
 * @see app/Http/Controllers/Admin/QuestionSuggestionController.php:174
 * @route '/admin/question-suggestions/{suggestion}'
 */
update.put = (args: { suggestion: string | { id: string } } | [suggestion: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

    /**
* @see \App\Http\Controllers\Admin\QuestionSuggestionController::update
 * @see app/Http/Controllers/Admin/QuestionSuggestionController.php:174
 * @route '/admin/question-suggestions/{suggestion}'
 */
    const updateForm = (args: { suggestion: string | { id: string } } | [suggestion: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\QuestionSuggestionController::update
 * @see app/Http/Controllers/Admin/QuestionSuggestionController.php:174
 * @route '/admin/question-suggestions/{suggestion}'
 */
        updateForm.put = (args: { suggestion: string | { id: string } } | [suggestion: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    update.form = updateForm
/**
* @see \App\Http\Controllers\Admin\QuestionSuggestionController::destroy
 * @see app/Http/Controllers/Admin/QuestionSuggestionController.php:215
 * @route '/admin/question-suggestions/{suggestion}'
 */
export const destroy = (args: { suggestion: string | { id: string } } | [suggestion: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/admin/question-suggestions/{suggestion}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Admin\QuestionSuggestionController::destroy
 * @see app/Http/Controllers/Admin/QuestionSuggestionController.php:215
 * @route '/admin/question-suggestions/{suggestion}'
 */
destroy.url = (args: { suggestion: string | { id: string } } | [suggestion: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { suggestion: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { suggestion: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    suggestion: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        suggestion: typeof args.suggestion === 'object'
                ? args.suggestion.id
                : args.suggestion,
                }

    return destroy.definition.url
            .replace('{suggestion}', parsedArgs.suggestion.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\QuestionSuggestionController::destroy
 * @see app/Http/Controllers/Admin/QuestionSuggestionController.php:215
 * @route '/admin/question-suggestions/{suggestion}'
 */
destroy.delete = (args: { suggestion: string | { id: string } } | [suggestion: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\Admin\QuestionSuggestionController::destroy
 * @see app/Http/Controllers/Admin/QuestionSuggestionController.php:215
 * @route '/admin/question-suggestions/{suggestion}'
 */
    const destroyForm = (args: { suggestion: string | { id: string } } | [suggestion: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\QuestionSuggestionController::destroy
 * @see app/Http/Controllers/Admin/QuestionSuggestionController.php:215
 * @route '/admin/question-suggestions/{suggestion}'
 */
        destroyForm.delete = (args: { suggestion: string | { id: string } } | [suggestion: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy.form = destroyForm
/**
* @see \App\Http\Controllers\Admin\QuestionSuggestionController::approve
 * @see app/Http/Controllers/Admin/QuestionSuggestionController.php:87
 * @route '/admin/question-suggestions/{suggestion}/approve'
 */
export const approve = (args: { suggestion: string | { id: string } } | [suggestion: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: approve.url(args, options),
    method: 'post',
})

approve.definition = {
    methods: ["post"],
    url: '/admin/question-suggestions/{suggestion}/approve',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\QuestionSuggestionController::approve
 * @see app/Http/Controllers/Admin/QuestionSuggestionController.php:87
 * @route '/admin/question-suggestions/{suggestion}/approve'
 */
approve.url = (args: { suggestion: string | { id: string } } | [suggestion: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { suggestion: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { suggestion: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    suggestion: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        suggestion: typeof args.suggestion === 'object'
                ? args.suggestion.id
                : args.suggestion,
                }

    return approve.definition.url
            .replace('{suggestion}', parsedArgs.suggestion.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\QuestionSuggestionController::approve
 * @see app/Http/Controllers/Admin/QuestionSuggestionController.php:87
 * @route '/admin/question-suggestions/{suggestion}/approve'
 */
approve.post = (args: { suggestion: string | { id: string } } | [suggestion: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: approve.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Admin\QuestionSuggestionController::approve
 * @see app/Http/Controllers/Admin/QuestionSuggestionController.php:87
 * @route '/admin/question-suggestions/{suggestion}/approve'
 */
    const approveForm = (args: { suggestion: string | { id: string } } | [suggestion: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: approve.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\QuestionSuggestionController::approve
 * @see app/Http/Controllers/Admin/QuestionSuggestionController.php:87
 * @route '/admin/question-suggestions/{suggestion}/approve'
 */
        approveForm.post = (args: { suggestion: string | { id: string } } | [suggestion: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: approve.url(args, options),
            method: 'post',
        })
    
    approve.form = approveForm
/**
* @see \App\Http\Controllers\Admin\QuestionSuggestionController::reject
 * @see app/Http/Controllers/Admin/QuestionSuggestionController.php:157
 * @route '/admin/question-suggestions/{suggestion}/reject'
 */
export const reject = (args: { suggestion: string | { id: string } } | [suggestion: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: reject.url(args, options),
    method: 'post',
})

reject.definition = {
    methods: ["post"],
    url: '/admin/question-suggestions/{suggestion}/reject',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\QuestionSuggestionController::reject
 * @see app/Http/Controllers/Admin/QuestionSuggestionController.php:157
 * @route '/admin/question-suggestions/{suggestion}/reject'
 */
reject.url = (args: { suggestion: string | { id: string } } | [suggestion: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { suggestion: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { suggestion: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    suggestion: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        suggestion: typeof args.suggestion === 'object'
                ? args.suggestion.id
                : args.suggestion,
                }

    return reject.definition.url
            .replace('{suggestion}', parsedArgs.suggestion.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\QuestionSuggestionController::reject
 * @see app/Http/Controllers/Admin/QuestionSuggestionController.php:157
 * @route '/admin/question-suggestions/{suggestion}/reject'
 */
reject.post = (args: { suggestion: string | { id: string } } | [suggestion: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: reject.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Admin\QuestionSuggestionController::reject
 * @see app/Http/Controllers/Admin/QuestionSuggestionController.php:157
 * @route '/admin/question-suggestions/{suggestion}/reject'
 */
    const rejectForm = (args: { suggestion: string | { id: string } } | [suggestion: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: reject.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\QuestionSuggestionController::reject
 * @see app/Http/Controllers/Admin/QuestionSuggestionController.php:157
 * @route '/admin/question-suggestions/{suggestion}/reject'
 */
        rejectForm.post = (args: { suggestion: string | { id: string } } | [suggestion: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: reject.url(args, options),
            method: 'post',
        })
    
    reject.form = rejectForm
const suggestions = {
    store: Object.assign(store, store),
update: Object.assign(update, update),
destroy: Object.assign(destroy, destroy),
approve: Object.assign(approve, approve),
reject: Object.assign(reject, reject),
}

export default suggestions