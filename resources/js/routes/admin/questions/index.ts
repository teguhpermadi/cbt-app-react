import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
import suggestions from './suggestions'
/**
* @see \App\Http\Controllers\Admin\QuestionController::reorder
 * @see app/Http/Controllers/Admin/QuestionController.php:280
 * @route '/admin/questions/reorder'
 */
export const reorder = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: reorder.url(options),
    method: 'post',
})

reorder.definition = {
    methods: ["post"],
    url: '/admin/questions/reorder',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\QuestionController::reorder
 * @see app/Http/Controllers/Admin/QuestionController.php:280
 * @route '/admin/questions/reorder'
 */
reorder.url = (options?: RouteQueryOptions) => {
    return reorder.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\QuestionController::reorder
 * @see app/Http/Controllers/Admin/QuestionController.php:280
 * @route '/admin/questions/reorder'
 */
reorder.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: reorder.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Admin\QuestionController::reorder
 * @see app/Http/Controllers/Admin/QuestionController.php:280
 * @route '/admin/questions/reorder'
 */
    const reorderForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: reorder.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\QuestionController::reorder
 * @see app/Http/Controllers/Admin/QuestionController.php:280
 * @route '/admin/questions/reorder'
 */
        reorderForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: reorder.url(options),
            method: 'post',
        })
    
    reorder.form = reorderForm
/**
* @see \App\Http\Controllers\Admin\QuestionController::index
 * @see app/Http/Controllers/Admin/QuestionController.php:0
 * @route '/admin/questions'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/admin/questions',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\QuestionController::index
 * @see app/Http/Controllers/Admin/QuestionController.php:0
 * @route '/admin/questions'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\QuestionController::index
 * @see app/Http/Controllers/Admin/QuestionController.php:0
 * @route '/admin/questions'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\QuestionController::index
 * @see app/Http/Controllers/Admin/QuestionController.php:0
 * @route '/admin/questions'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\QuestionController::index
 * @see app/Http/Controllers/Admin/QuestionController.php:0
 * @route '/admin/questions'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\QuestionController::index
 * @see app/Http/Controllers/Admin/QuestionController.php:0
 * @route '/admin/questions'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\QuestionController::index
 * @see app/Http/Controllers/Admin/QuestionController.php:0
 * @route '/admin/questions'
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
* @see \App\Http\Controllers\Admin\QuestionController::create
 * @see app/Http/Controllers/Admin/QuestionController.php:21
 * @route '/admin/questions/create'
 */
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/admin/questions/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\QuestionController::create
 * @see app/Http/Controllers/Admin/QuestionController.php:21
 * @route '/admin/questions/create'
 */
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\QuestionController::create
 * @see app/Http/Controllers/Admin/QuestionController.php:21
 * @route '/admin/questions/create'
 */
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\QuestionController::create
 * @see app/Http/Controllers/Admin/QuestionController.php:21
 * @route '/admin/questions/create'
 */
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\QuestionController::create
 * @see app/Http/Controllers/Admin/QuestionController.php:21
 * @route '/admin/questions/create'
 */
    const createForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: create.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\QuestionController::create
 * @see app/Http/Controllers/Admin/QuestionController.php:21
 * @route '/admin/questions/create'
 */
        createForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: create.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\QuestionController::create
 * @see app/Http/Controllers/Admin/QuestionController.php:21
 * @route '/admin/questions/create'
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
* @see \App\Http\Controllers\Admin\QuestionController::store
 * @see app/Http/Controllers/Admin/QuestionController.php:40
 * @route '/admin/questions'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/admin/questions',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\QuestionController::store
 * @see app/Http/Controllers/Admin/QuestionController.php:40
 * @route '/admin/questions'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\QuestionController::store
 * @see app/Http/Controllers/Admin/QuestionController.php:40
 * @route '/admin/questions'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Admin\QuestionController::store
 * @see app/Http/Controllers/Admin/QuestionController.php:40
 * @route '/admin/questions'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\QuestionController::store
 * @see app/Http/Controllers/Admin/QuestionController.php:40
 * @route '/admin/questions'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\Admin\QuestionController::show
 * @see app/Http/Controllers/Admin/QuestionController.php:0
 * @route '/admin/questions/{question}'
 */
export const show = (args: { question: string | number } | [question: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/admin/questions/{question}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\QuestionController::show
 * @see app/Http/Controllers/Admin/QuestionController.php:0
 * @route '/admin/questions/{question}'
 */
show.url = (args: { question: string | number } | [question: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { question: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    question: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        question: args.question,
                }

    return show.definition.url
            .replace('{question}', parsedArgs.question.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\QuestionController::show
 * @see app/Http/Controllers/Admin/QuestionController.php:0
 * @route '/admin/questions/{question}'
 */
show.get = (args: { question: string | number } | [question: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\QuestionController::show
 * @see app/Http/Controllers/Admin/QuestionController.php:0
 * @route '/admin/questions/{question}'
 */
show.head = (args: { question: string | number } | [question: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\QuestionController::show
 * @see app/Http/Controllers/Admin/QuestionController.php:0
 * @route '/admin/questions/{question}'
 */
    const showForm = (args: { question: string | number } | [question: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\QuestionController::show
 * @see app/Http/Controllers/Admin/QuestionController.php:0
 * @route '/admin/questions/{question}'
 */
        showForm.get = (args: { question: string | number } | [question: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\QuestionController::show
 * @see app/Http/Controllers/Admin/QuestionController.php:0
 * @route '/admin/questions/{question}'
 */
        showForm.head = (args: { question: string | number } | [question: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\Admin\QuestionController::edit
 * @see app/Http/Controllers/Admin/QuestionController.php:133
 * @route '/admin/questions/{question}/edit'
 */
export const edit = (args: { question: string | { id: string } } | [question: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/admin/questions/{question}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\QuestionController::edit
 * @see app/Http/Controllers/Admin/QuestionController.php:133
 * @route '/admin/questions/{question}/edit'
 */
edit.url = (args: { question: string | { id: string } } | [question: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions) => {
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

    return edit.definition.url
            .replace('{question}', parsedArgs.question.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\QuestionController::edit
 * @see app/Http/Controllers/Admin/QuestionController.php:133
 * @route '/admin/questions/{question}/edit'
 */
edit.get = (args: { question: string | { id: string } } | [question: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\QuestionController::edit
 * @see app/Http/Controllers/Admin/QuestionController.php:133
 * @route '/admin/questions/{question}/edit'
 */
edit.head = (args: { question: string | { id: string } } | [question: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\QuestionController::edit
 * @see app/Http/Controllers/Admin/QuestionController.php:133
 * @route '/admin/questions/{question}/edit'
 */
    const editForm = (args: { question: string | { id: string } } | [question: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: edit.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\QuestionController::edit
 * @see app/Http/Controllers/Admin/QuestionController.php:133
 * @route '/admin/questions/{question}/edit'
 */
        editForm.get = (args: { question: string | { id: string } } | [question: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: edit.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\QuestionController::edit
 * @see app/Http/Controllers/Admin/QuestionController.php:133
 * @route '/admin/questions/{question}/edit'
 */
        editForm.head = (args: { question: string | { id: string } } | [question: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\Admin\QuestionController::update
 * @see app/Http/Controllers/Admin/QuestionController.php:157
 * @route '/admin/questions/{question}'
 */
export const update = (args: { question: string | { id: string } } | [question: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/admin/questions/{question}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\Admin\QuestionController::update
 * @see app/Http/Controllers/Admin/QuestionController.php:157
 * @route '/admin/questions/{question}'
 */
update.url = (args: { question: string | { id: string } } | [question: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions) => {
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

    return update.definition.url
            .replace('{question}', parsedArgs.question.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\QuestionController::update
 * @see app/Http/Controllers/Admin/QuestionController.php:157
 * @route '/admin/questions/{question}'
 */
update.put = (args: { question: string | { id: string } } | [question: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})
/**
* @see \App\Http\Controllers\Admin\QuestionController::update
 * @see app/Http/Controllers/Admin/QuestionController.php:157
 * @route '/admin/questions/{question}'
 */
update.patch = (args: { question: string | { id: string } } | [question: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\Admin\QuestionController::update
 * @see app/Http/Controllers/Admin/QuestionController.php:157
 * @route '/admin/questions/{question}'
 */
    const updateForm = (args: { question: string | { id: string } } | [question: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\QuestionController::update
 * @see app/Http/Controllers/Admin/QuestionController.php:157
 * @route '/admin/questions/{question}'
 */
        updateForm.put = (args: { question: string | { id: string } } | [question: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
            /**
* @see \App\Http\Controllers\Admin\QuestionController::update
 * @see app/Http/Controllers/Admin/QuestionController.php:157
 * @route '/admin/questions/{question}'
 */
        updateForm.patch = (args: { question: string | { id: string } } | [question: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\Admin\QuestionController::destroy
 * @see app/Http/Controllers/Admin/QuestionController.php:297
 * @route '/admin/questions/{question}'
 */
export const destroy = (args: { question: string | { id: string } } | [question: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/admin/questions/{question}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Admin\QuestionController::destroy
 * @see app/Http/Controllers/Admin/QuestionController.php:297
 * @route '/admin/questions/{question}'
 */
destroy.url = (args: { question: string | { id: string } } | [question: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions) => {
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

    return destroy.definition.url
            .replace('{question}', parsedArgs.question.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\QuestionController::destroy
 * @see app/Http/Controllers/Admin/QuestionController.php:297
 * @route '/admin/questions/{question}'
 */
destroy.delete = (args: { question: string | { id: string } } | [question: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\Admin\QuestionController::destroy
 * @see app/Http/Controllers/Admin/QuestionController.php:297
 * @route '/admin/questions/{question}'
 */
    const destroyForm = (args: { question: string | { id: string } } | [question: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\QuestionController::destroy
 * @see app/Http/Controllers/Admin/QuestionController.php:297
 * @route '/admin/questions/{question}'
 */
        destroyForm.delete = (args: { question: string | { id: string } } | [question: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy.form = destroyForm
const questions = {
    reorder: Object.assign(reorder, reorder),
index: Object.assign(index, index),
create: Object.assign(create, create),
store: Object.assign(store, store),
show: Object.assign(show, show),
edit: Object.assign(edit, edit),
update: Object.assign(update, update),
destroy: Object.assign(destroy, destroy),
suggestions: Object.assign(suggestions, suggestions),
}

export default questions