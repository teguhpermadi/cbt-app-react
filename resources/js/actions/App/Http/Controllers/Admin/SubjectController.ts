import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\SubjectController::index
 * @see app/Http/Controllers/Admin/SubjectController.php:14
 * @route '/admin/subjects'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/admin/subjects',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\SubjectController::index
 * @see app/Http/Controllers/Admin/SubjectController.php:14
 * @route '/admin/subjects'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\SubjectController::index
 * @see app/Http/Controllers/Admin/SubjectController.php:14
 * @route '/admin/subjects'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\SubjectController::index
 * @see app/Http/Controllers/Admin/SubjectController.php:14
 * @route '/admin/subjects'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\SubjectController::index
 * @see app/Http/Controllers/Admin/SubjectController.php:14
 * @route '/admin/subjects'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\SubjectController::index
 * @see app/Http/Controllers/Admin/SubjectController.php:14
 * @route '/admin/subjects'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\SubjectController::index
 * @see app/Http/Controllers/Admin/SubjectController.php:14
 * @route '/admin/subjects'
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
* @see \App\Http\Controllers\Admin\SubjectController::create
 * @see app/Http/Controllers/Admin/SubjectController.php:0
 * @route '/admin/subjects/create'
 */
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/admin/subjects/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\SubjectController::create
 * @see app/Http/Controllers/Admin/SubjectController.php:0
 * @route '/admin/subjects/create'
 */
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\SubjectController::create
 * @see app/Http/Controllers/Admin/SubjectController.php:0
 * @route '/admin/subjects/create'
 */
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\SubjectController::create
 * @see app/Http/Controllers/Admin/SubjectController.php:0
 * @route '/admin/subjects/create'
 */
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\SubjectController::create
 * @see app/Http/Controllers/Admin/SubjectController.php:0
 * @route '/admin/subjects/create'
 */
    const createForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: create.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\SubjectController::create
 * @see app/Http/Controllers/Admin/SubjectController.php:0
 * @route '/admin/subjects/create'
 */
        createForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: create.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\SubjectController::create
 * @see app/Http/Controllers/Admin/SubjectController.php:0
 * @route '/admin/subjects/create'
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
* @see \App\Http\Controllers\Admin\SubjectController::store
 * @see app/Http/Controllers/Admin/SubjectController.php:30
 * @route '/admin/subjects'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/admin/subjects',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\SubjectController::store
 * @see app/Http/Controllers/Admin/SubjectController.php:30
 * @route '/admin/subjects'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\SubjectController::store
 * @see app/Http/Controllers/Admin/SubjectController.php:30
 * @route '/admin/subjects'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Admin\SubjectController::store
 * @see app/Http/Controllers/Admin/SubjectController.php:30
 * @route '/admin/subjects'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\SubjectController::store
 * @see app/Http/Controllers/Admin/SubjectController.php:30
 * @route '/admin/subjects'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\Admin\SubjectController::show
 * @see app/Http/Controllers/Admin/SubjectController.php:0
 * @route '/admin/subjects/{subject}'
 */
export const show = (args: { subject: string | number } | [subject: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/admin/subjects/{subject}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\SubjectController::show
 * @see app/Http/Controllers/Admin/SubjectController.php:0
 * @route '/admin/subjects/{subject}'
 */
show.url = (args: { subject: string | number } | [subject: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { subject: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    subject: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        subject: args.subject,
                }

    return show.definition.url
            .replace('{subject}', parsedArgs.subject.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\SubjectController::show
 * @see app/Http/Controllers/Admin/SubjectController.php:0
 * @route '/admin/subjects/{subject}'
 */
show.get = (args: { subject: string | number } | [subject: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\SubjectController::show
 * @see app/Http/Controllers/Admin/SubjectController.php:0
 * @route '/admin/subjects/{subject}'
 */
show.head = (args: { subject: string | number } | [subject: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\SubjectController::show
 * @see app/Http/Controllers/Admin/SubjectController.php:0
 * @route '/admin/subjects/{subject}'
 */
    const showForm = (args: { subject: string | number } | [subject: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\SubjectController::show
 * @see app/Http/Controllers/Admin/SubjectController.php:0
 * @route '/admin/subjects/{subject}'
 */
        showForm.get = (args: { subject: string | number } | [subject: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\SubjectController::show
 * @see app/Http/Controllers/Admin/SubjectController.php:0
 * @route '/admin/subjects/{subject}'
 */
        showForm.head = (args: { subject: string | number } | [subject: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\Admin\SubjectController::edit
 * @see app/Http/Controllers/Admin/SubjectController.php:0
 * @route '/admin/subjects/{subject}/edit'
 */
export const edit = (args: { subject: string | number } | [subject: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/admin/subjects/{subject}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\SubjectController::edit
 * @see app/Http/Controllers/Admin/SubjectController.php:0
 * @route '/admin/subjects/{subject}/edit'
 */
edit.url = (args: { subject: string | number } | [subject: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { subject: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    subject: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        subject: args.subject,
                }

    return edit.definition.url
            .replace('{subject}', parsedArgs.subject.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\SubjectController::edit
 * @see app/Http/Controllers/Admin/SubjectController.php:0
 * @route '/admin/subjects/{subject}/edit'
 */
edit.get = (args: { subject: string | number } | [subject: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\SubjectController::edit
 * @see app/Http/Controllers/Admin/SubjectController.php:0
 * @route '/admin/subjects/{subject}/edit'
 */
edit.head = (args: { subject: string | number } | [subject: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\SubjectController::edit
 * @see app/Http/Controllers/Admin/SubjectController.php:0
 * @route '/admin/subjects/{subject}/edit'
 */
    const editForm = (args: { subject: string | number } | [subject: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: edit.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\SubjectController::edit
 * @see app/Http/Controllers/Admin/SubjectController.php:0
 * @route '/admin/subjects/{subject}/edit'
 */
        editForm.get = (args: { subject: string | number } | [subject: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: edit.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\SubjectController::edit
 * @see app/Http/Controllers/Admin/SubjectController.php:0
 * @route '/admin/subjects/{subject}/edit'
 */
        editForm.head = (args: { subject: string | number } | [subject: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\Admin\SubjectController::update
 * @see app/Http/Controllers/Admin/SubjectController.php:47
 * @route '/admin/subjects/{subject}'
 */
export const update = (args: { subject: string | { id: string } } | [subject: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/admin/subjects/{subject}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\Admin\SubjectController::update
 * @see app/Http/Controllers/Admin/SubjectController.php:47
 * @route '/admin/subjects/{subject}'
 */
update.url = (args: { subject: string | { id: string } } | [subject: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { subject: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { subject: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    subject: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        subject: typeof args.subject === 'object'
                ? args.subject.id
                : args.subject,
                }

    return update.definition.url
            .replace('{subject}', parsedArgs.subject.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\SubjectController::update
 * @see app/Http/Controllers/Admin/SubjectController.php:47
 * @route '/admin/subjects/{subject}'
 */
update.put = (args: { subject: string | { id: string } } | [subject: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})
/**
* @see \App\Http\Controllers\Admin\SubjectController::update
 * @see app/Http/Controllers/Admin/SubjectController.php:47
 * @route '/admin/subjects/{subject}'
 */
update.patch = (args: { subject: string | { id: string } } | [subject: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\Admin\SubjectController::update
 * @see app/Http/Controllers/Admin/SubjectController.php:47
 * @route '/admin/subjects/{subject}'
 */
    const updateForm = (args: { subject: string | { id: string } } | [subject: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\SubjectController::update
 * @see app/Http/Controllers/Admin/SubjectController.php:47
 * @route '/admin/subjects/{subject}'
 */
        updateForm.put = (args: { subject: string | { id: string } } | [subject: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
            /**
* @see \App\Http\Controllers\Admin\SubjectController::update
 * @see app/Http/Controllers/Admin/SubjectController.php:47
 * @route '/admin/subjects/{subject}'
 */
        updateForm.patch = (args: { subject: string | { id: string } } | [subject: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\Admin\SubjectController::destroy
 * @see app/Http/Controllers/Admin/SubjectController.php:62
 * @route '/admin/subjects/{subject}'
 */
export const destroy = (args: { subject: string | { id: string } } | [subject: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/admin/subjects/{subject}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Admin\SubjectController::destroy
 * @see app/Http/Controllers/Admin/SubjectController.php:62
 * @route '/admin/subjects/{subject}'
 */
destroy.url = (args: { subject: string | { id: string } } | [subject: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { subject: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { subject: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    subject: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        subject: typeof args.subject === 'object'
                ? args.subject.id
                : args.subject,
                }

    return destroy.definition.url
            .replace('{subject}', parsedArgs.subject.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\SubjectController::destroy
 * @see app/Http/Controllers/Admin/SubjectController.php:62
 * @route '/admin/subjects/{subject}'
 */
destroy.delete = (args: { subject: string | { id: string } } | [subject: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\Admin\SubjectController::destroy
 * @see app/Http/Controllers/Admin/SubjectController.php:62
 * @route '/admin/subjects/{subject}'
 */
    const destroyForm = (args: { subject: string | { id: string } } | [subject: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\SubjectController::destroy
 * @see app/Http/Controllers/Admin/SubjectController.php:62
 * @route '/admin/subjects/{subject}'
 */
        destroyForm.delete = (args: { subject: string | { id: string } } | [subject: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy.form = destroyForm
const SubjectController = { index, create, store, show, edit, update, destroy }

export default SubjectController