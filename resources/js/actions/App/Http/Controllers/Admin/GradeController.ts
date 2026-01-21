import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\GradeController::index
 * @see app/Http/Controllers/Admin/GradeController.php:16
 * @route '/admin/grades'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/admin/grades',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\GradeController::index
 * @see app/Http/Controllers/Admin/GradeController.php:16
 * @route '/admin/grades'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\GradeController::index
 * @see app/Http/Controllers/Admin/GradeController.php:16
 * @route '/admin/grades'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\GradeController::index
 * @see app/Http/Controllers/Admin/GradeController.php:16
 * @route '/admin/grades'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\GradeController::index
 * @see app/Http/Controllers/Admin/GradeController.php:16
 * @route '/admin/grades'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\GradeController::index
 * @see app/Http/Controllers/Admin/GradeController.php:16
 * @route '/admin/grades'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\GradeController::index
 * @see app/Http/Controllers/Admin/GradeController.php:16
 * @route '/admin/grades'
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
* @see \App\Http\Controllers\Admin\GradeController::create
 * @see app/Http/Controllers/Admin/GradeController.php:0
 * @route '/admin/grades/create'
 */
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/admin/grades/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\GradeController::create
 * @see app/Http/Controllers/Admin/GradeController.php:0
 * @route '/admin/grades/create'
 */
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\GradeController::create
 * @see app/Http/Controllers/Admin/GradeController.php:0
 * @route '/admin/grades/create'
 */
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\GradeController::create
 * @see app/Http/Controllers/Admin/GradeController.php:0
 * @route '/admin/grades/create'
 */
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\GradeController::create
 * @see app/Http/Controllers/Admin/GradeController.php:0
 * @route '/admin/grades/create'
 */
    const createForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: create.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\GradeController::create
 * @see app/Http/Controllers/Admin/GradeController.php:0
 * @route '/admin/grades/create'
 */
        createForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: create.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\GradeController::create
 * @see app/Http/Controllers/Admin/GradeController.php:0
 * @route '/admin/grades/create'
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
* @see \App\Http\Controllers\Admin\GradeController::store
 * @see app/Http/Controllers/Admin/GradeController.php:34
 * @route '/admin/grades'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/admin/grades',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\GradeController::store
 * @see app/Http/Controllers/Admin/GradeController.php:34
 * @route '/admin/grades'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\GradeController::store
 * @see app/Http/Controllers/Admin/GradeController.php:34
 * @route '/admin/grades'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Admin\GradeController::store
 * @see app/Http/Controllers/Admin/GradeController.php:34
 * @route '/admin/grades'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\GradeController::store
 * @see app/Http/Controllers/Admin/GradeController.php:34
 * @route '/admin/grades'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\Admin\GradeController::show
 * @see app/Http/Controllers/Admin/GradeController.php:0
 * @route '/admin/grades/{grade}'
 */
export const show = (args: { grade: string | number } | [grade: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/admin/grades/{grade}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\GradeController::show
 * @see app/Http/Controllers/Admin/GradeController.php:0
 * @route '/admin/grades/{grade}'
 */
show.url = (args: { grade: string | number } | [grade: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { grade: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    grade: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        grade: args.grade,
                }

    return show.definition.url
            .replace('{grade}', parsedArgs.grade.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\GradeController::show
 * @see app/Http/Controllers/Admin/GradeController.php:0
 * @route '/admin/grades/{grade}'
 */
show.get = (args: { grade: string | number } | [grade: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\GradeController::show
 * @see app/Http/Controllers/Admin/GradeController.php:0
 * @route '/admin/grades/{grade}'
 */
show.head = (args: { grade: string | number } | [grade: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\GradeController::show
 * @see app/Http/Controllers/Admin/GradeController.php:0
 * @route '/admin/grades/{grade}'
 */
    const showForm = (args: { grade: string | number } | [grade: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\GradeController::show
 * @see app/Http/Controllers/Admin/GradeController.php:0
 * @route '/admin/grades/{grade}'
 */
        showForm.get = (args: { grade: string | number } | [grade: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\GradeController::show
 * @see app/Http/Controllers/Admin/GradeController.php:0
 * @route '/admin/grades/{grade}'
 */
        showForm.head = (args: { grade: string | number } | [grade: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\Admin\GradeController::edit
 * @see app/Http/Controllers/Admin/GradeController.php:0
 * @route '/admin/grades/{grade}/edit'
 */
export const edit = (args: { grade: string | number } | [grade: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/admin/grades/{grade}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\GradeController::edit
 * @see app/Http/Controllers/Admin/GradeController.php:0
 * @route '/admin/grades/{grade}/edit'
 */
edit.url = (args: { grade: string | number } | [grade: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { grade: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    grade: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        grade: args.grade,
                }

    return edit.definition.url
            .replace('{grade}', parsedArgs.grade.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\GradeController::edit
 * @see app/Http/Controllers/Admin/GradeController.php:0
 * @route '/admin/grades/{grade}/edit'
 */
edit.get = (args: { grade: string | number } | [grade: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\GradeController::edit
 * @see app/Http/Controllers/Admin/GradeController.php:0
 * @route '/admin/grades/{grade}/edit'
 */
edit.head = (args: { grade: string | number } | [grade: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\GradeController::edit
 * @see app/Http/Controllers/Admin/GradeController.php:0
 * @route '/admin/grades/{grade}/edit'
 */
    const editForm = (args: { grade: string | number } | [grade: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: edit.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\GradeController::edit
 * @see app/Http/Controllers/Admin/GradeController.php:0
 * @route '/admin/grades/{grade}/edit'
 */
        editForm.get = (args: { grade: string | number } | [grade: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: edit.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\GradeController::edit
 * @see app/Http/Controllers/Admin/GradeController.php:0
 * @route '/admin/grades/{grade}/edit'
 */
        editForm.head = (args: { grade: string | number } | [grade: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\Admin\GradeController::update
 * @see app/Http/Controllers/Admin/GradeController.php:50
 * @route '/admin/grades/{grade}'
 */
export const update = (args: { grade: string | { id: string } } | [grade: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/admin/grades/{grade}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\Admin\GradeController::update
 * @see app/Http/Controllers/Admin/GradeController.php:50
 * @route '/admin/grades/{grade}'
 */
update.url = (args: { grade: string | { id: string } } | [grade: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions) => {
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

    return update.definition.url
            .replace('{grade}', parsedArgs.grade.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\GradeController::update
 * @see app/Http/Controllers/Admin/GradeController.php:50
 * @route '/admin/grades/{grade}'
 */
update.put = (args: { grade: string | { id: string } } | [grade: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})
/**
* @see \App\Http\Controllers\Admin\GradeController::update
 * @see app/Http/Controllers/Admin/GradeController.php:50
 * @route '/admin/grades/{grade}'
 */
update.patch = (args: { grade: string | { id: string } } | [grade: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\Admin\GradeController::update
 * @see app/Http/Controllers/Admin/GradeController.php:50
 * @route '/admin/grades/{grade}'
 */
    const updateForm = (args: { grade: string | { id: string } } | [grade: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\GradeController::update
 * @see app/Http/Controllers/Admin/GradeController.php:50
 * @route '/admin/grades/{grade}'
 */
        updateForm.put = (args: { grade: string | { id: string } } | [grade: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
            /**
* @see \App\Http\Controllers\Admin\GradeController::update
 * @see app/Http/Controllers/Admin/GradeController.php:50
 * @route '/admin/grades/{grade}'
 */
        updateForm.patch = (args: { grade: string | { id: string } } | [grade: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\Admin\GradeController::destroy
 * @see app/Http/Controllers/Admin/GradeController.php:66
 * @route '/admin/grades/{grade}'
 */
export const destroy = (args: { grade: string | { id: string } } | [grade: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/admin/grades/{grade}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Admin\GradeController::destroy
 * @see app/Http/Controllers/Admin/GradeController.php:66
 * @route '/admin/grades/{grade}'
 */
destroy.url = (args: { grade: string | { id: string } } | [grade: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions) => {
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

    return destroy.definition.url
            .replace('{grade}', parsedArgs.grade.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\GradeController::destroy
 * @see app/Http/Controllers/Admin/GradeController.php:66
 * @route '/admin/grades/{grade}'
 */
destroy.delete = (args: { grade: string | { id: string } } | [grade: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\Admin\GradeController::destroy
 * @see app/Http/Controllers/Admin/GradeController.php:66
 * @route '/admin/grades/{grade}'
 */
    const destroyForm = (args: { grade: string | { id: string } } | [grade: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\GradeController::destroy
 * @see app/Http/Controllers/Admin/GradeController.php:66
 * @route '/admin/grades/{grade}'
 */
        destroyForm.delete = (args: { grade: string | { id: string } } | [grade: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy.form = destroyForm
const GradeController = { index, create, store, show, edit, update, destroy }

export default GradeController