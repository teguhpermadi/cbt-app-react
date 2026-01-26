import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\StudentController::exportMethod
 * @see app/Http/Controllers/Admin/StudentController.php:26
 * @route '/admin/students/export'
 */
export const exportMethod = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: exportMethod.url(options),
    method: 'get',
})

exportMethod.definition = {
    methods: ["get","head"],
    url: '/admin/students/export',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\StudentController::exportMethod
 * @see app/Http/Controllers/Admin/StudentController.php:26
 * @route '/admin/students/export'
 */
exportMethod.url = (options?: RouteQueryOptions) => {
    return exportMethod.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\StudentController::exportMethod
 * @see app/Http/Controllers/Admin/StudentController.php:26
 * @route '/admin/students/export'
 */
exportMethod.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: exportMethod.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\StudentController::exportMethod
 * @see app/Http/Controllers/Admin/StudentController.php:26
 * @route '/admin/students/export'
 */
exportMethod.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: exportMethod.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\StudentController::exportMethod
 * @see app/Http/Controllers/Admin/StudentController.php:26
 * @route '/admin/students/export'
 */
    const exportMethodForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: exportMethod.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\StudentController::exportMethod
 * @see app/Http/Controllers/Admin/StudentController.php:26
 * @route '/admin/students/export'
 */
        exportMethodForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: exportMethod.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\StudentController::exportMethod
 * @see app/Http/Controllers/Admin/StudentController.php:26
 * @route '/admin/students/export'
 */
        exportMethodForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: exportMethod.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    exportMethod.form = exportMethodForm
/**
* @see \App\Http\Controllers\Admin\StudentController::importMethod
 * @see app/Http/Controllers/Admin/StudentController.php:127
 * @route '/admin/students/import'
 */
export const importMethod = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: importMethod.url(options),
    method: 'post',
})

importMethod.definition = {
    methods: ["post"],
    url: '/admin/students/import',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\StudentController::importMethod
 * @see app/Http/Controllers/Admin/StudentController.php:127
 * @route '/admin/students/import'
 */
importMethod.url = (options?: RouteQueryOptions) => {
    return importMethod.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\StudentController::importMethod
 * @see app/Http/Controllers/Admin/StudentController.php:127
 * @route '/admin/students/import'
 */
importMethod.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: importMethod.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Admin\StudentController::importMethod
 * @see app/Http/Controllers/Admin/StudentController.php:127
 * @route '/admin/students/import'
 */
    const importMethodForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: importMethod.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\StudentController::importMethod
 * @see app/Http/Controllers/Admin/StudentController.php:127
 * @route '/admin/students/import'
 */
        importMethodForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: importMethod.url(options),
            method: 'post',
        })
    
    importMethod.form = importMethodForm
/**
* @see \App\Http\Controllers\Admin\StudentController::bulkAction
 * @see app/Http/Controllers/Admin/StudentController.php:220
 * @route '/admin/students/bulk-action'
 */
export const bulkAction = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: bulkAction.url(options),
    method: 'post',
})

bulkAction.definition = {
    methods: ["post"],
    url: '/admin/students/bulk-action',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\StudentController::bulkAction
 * @see app/Http/Controllers/Admin/StudentController.php:220
 * @route '/admin/students/bulk-action'
 */
bulkAction.url = (options?: RouteQueryOptions) => {
    return bulkAction.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\StudentController::bulkAction
 * @see app/Http/Controllers/Admin/StudentController.php:220
 * @route '/admin/students/bulk-action'
 */
bulkAction.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: bulkAction.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Admin\StudentController::bulkAction
 * @see app/Http/Controllers/Admin/StudentController.php:220
 * @route '/admin/students/bulk-action'
 */
    const bulkActionForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: bulkAction.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\StudentController::bulkAction
 * @see app/Http/Controllers/Admin/StudentController.php:220
 * @route '/admin/students/bulk-action'
 */
        bulkActionForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: bulkAction.url(options),
            method: 'post',
        })
    
    bulkAction.form = bulkActionForm
/**
* @see \App\Http\Controllers\Admin\StudentController::create
 * @see app/Http/Controllers/Admin/StudentController.php:0
 * @route '/admin/students/create'
 */
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/admin/students/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\StudentController::create
 * @see app/Http/Controllers/Admin/StudentController.php:0
 * @route '/admin/students/create'
 */
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\StudentController::create
 * @see app/Http/Controllers/Admin/StudentController.php:0
 * @route '/admin/students/create'
 */
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\StudentController::create
 * @see app/Http/Controllers/Admin/StudentController.php:0
 * @route '/admin/students/create'
 */
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\StudentController::create
 * @see app/Http/Controllers/Admin/StudentController.php:0
 * @route '/admin/students/create'
 */
    const createForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: create.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\StudentController::create
 * @see app/Http/Controllers/Admin/StudentController.php:0
 * @route '/admin/students/create'
 */
        createForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: create.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\StudentController::create
 * @see app/Http/Controllers/Admin/StudentController.php:0
 * @route '/admin/students/create'
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
* @see \App\Http\Controllers\Admin\StudentController::store
 * @see app/Http/Controllers/Admin/StudentController.php:46
 * @route '/admin/students'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/admin/students',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\StudentController::store
 * @see app/Http/Controllers/Admin/StudentController.php:46
 * @route '/admin/students'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\StudentController::store
 * @see app/Http/Controllers/Admin/StudentController.php:46
 * @route '/admin/students'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Admin\StudentController::store
 * @see app/Http/Controllers/Admin/StudentController.php:46
 * @route '/admin/students'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\StudentController::store
 * @see app/Http/Controllers/Admin/StudentController.php:46
 * @route '/admin/students'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\Admin\StudentController::edit
 * @see app/Http/Controllers/Admin/StudentController.php:0
 * @route '/admin/students/{student}/edit'
 */
export const edit = (args: { student: string | number } | [student: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/admin/students/{student}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\StudentController::edit
 * @see app/Http/Controllers/Admin/StudentController.php:0
 * @route '/admin/students/{student}/edit'
 */
edit.url = (args: { student: string | number } | [student: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { student: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    student: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        student: args.student,
                }

    return edit.definition.url
            .replace('{student}', parsedArgs.student.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\StudentController::edit
 * @see app/Http/Controllers/Admin/StudentController.php:0
 * @route '/admin/students/{student}/edit'
 */
edit.get = (args: { student: string | number } | [student: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\StudentController::edit
 * @see app/Http/Controllers/Admin/StudentController.php:0
 * @route '/admin/students/{student}/edit'
 */
edit.head = (args: { student: string | number } | [student: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\StudentController::edit
 * @see app/Http/Controllers/Admin/StudentController.php:0
 * @route '/admin/students/{student}/edit'
 */
    const editForm = (args: { student: string | number } | [student: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: edit.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\StudentController::edit
 * @see app/Http/Controllers/Admin/StudentController.php:0
 * @route '/admin/students/{student}/edit'
 */
        editForm.get = (args: { student: string | number } | [student: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: edit.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\StudentController::edit
 * @see app/Http/Controllers/Admin/StudentController.php:0
 * @route '/admin/students/{student}/edit'
 */
        editForm.head = (args: { student: string | number } | [student: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\Admin\StudentController::update
 * @see app/Http/Controllers/Admin/StudentController.php:91
 * @route '/admin/students/{student}'
 */
export const update = (args: { student: string | { id: string } } | [student: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/admin/students/{student}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\Admin\StudentController::update
 * @see app/Http/Controllers/Admin/StudentController.php:91
 * @route '/admin/students/{student}'
 */
update.url = (args: { student: string | { id: string } } | [student: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { student: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { student: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    student: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        student: typeof args.student === 'object'
                ? args.student.id
                : args.student,
                }

    return update.definition.url
            .replace('{student}', parsedArgs.student.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\StudentController::update
 * @see app/Http/Controllers/Admin/StudentController.php:91
 * @route '/admin/students/{student}'
 */
update.put = (args: { student: string | { id: string } } | [student: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})
/**
* @see \App\Http\Controllers\Admin\StudentController::update
 * @see app/Http/Controllers/Admin/StudentController.php:91
 * @route '/admin/students/{student}'
 */
update.patch = (args: { student: string | { id: string } } | [student: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\Admin\StudentController::update
 * @see app/Http/Controllers/Admin/StudentController.php:91
 * @route '/admin/students/{student}'
 */
    const updateForm = (args: { student: string | { id: string } } | [student: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\StudentController::update
 * @see app/Http/Controllers/Admin/StudentController.php:91
 * @route '/admin/students/{student}'
 */
        updateForm.put = (args: { student: string | { id: string } } | [student: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
            /**
* @see \App\Http\Controllers\Admin\StudentController::update
 * @see app/Http/Controllers/Admin/StudentController.php:91
 * @route '/admin/students/{student}'
 */
        updateForm.patch = (args: { student: string | { id: string } } | [student: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\Admin\StudentController::destroy
 * @see app/Http/Controllers/Admin/StudentController.php:121
 * @route '/admin/students/{student}'
 */
export const destroy = (args: { student: string | { id: string } } | [student: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/admin/students/{student}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Admin\StudentController::destroy
 * @see app/Http/Controllers/Admin/StudentController.php:121
 * @route '/admin/students/{student}'
 */
destroy.url = (args: { student: string | { id: string } } | [student: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { student: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { student: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    student: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        student: typeof args.student === 'object'
                ? args.student.id
                : args.student,
                }

    return destroy.definition.url
            .replace('{student}', parsedArgs.student.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\StudentController::destroy
 * @see app/Http/Controllers/Admin/StudentController.php:121
 * @route '/admin/students/{student}'
 */
destroy.delete = (args: { student: string | { id: string } } | [student: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\Admin\StudentController::destroy
 * @see app/Http/Controllers/Admin/StudentController.php:121
 * @route '/admin/students/{student}'
 */
    const destroyForm = (args: { student: string | { id: string } } | [student: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\StudentController::destroy
 * @see app/Http/Controllers/Admin/StudentController.php:121
 * @route '/admin/students/{student}'
 */
        destroyForm.delete = (args: { student: string | { id: string } } | [student: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\Admin\StudentController::index
 * @see app/Http/Controllers/Admin/StudentController.php:31
 * @route '/admin/students'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/admin/students',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\StudentController::index
 * @see app/Http/Controllers/Admin/StudentController.php:31
 * @route '/admin/students'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\StudentController::index
 * @see app/Http/Controllers/Admin/StudentController.php:31
 * @route '/admin/students'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\StudentController::index
 * @see app/Http/Controllers/Admin/StudentController.php:31
 * @route '/admin/students'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\StudentController::index
 * @see app/Http/Controllers/Admin/StudentController.php:31
 * @route '/admin/students'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\StudentController::index
 * @see app/Http/Controllers/Admin/StudentController.php:31
 * @route '/admin/students'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\StudentController::index
 * @see app/Http/Controllers/Admin/StudentController.php:31
 * @route '/admin/students'
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
* @see \App\Http\Controllers\Admin\StudentController::show
 * @see app/Http/Controllers/Admin/StudentController.php:0
 * @route '/admin/students/{student}'
 */
export const show = (args: { student: string | number } | [student: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/admin/students/{student}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\StudentController::show
 * @see app/Http/Controllers/Admin/StudentController.php:0
 * @route '/admin/students/{student}'
 */
show.url = (args: { student: string | number } | [student: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { student: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    student: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        student: args.student,
                }

    return show.definition.url
            .replace('{student}', parsedArgs.student.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\StudentController::show
 * @see app/Http/Controllers/Admin/StudentController.php:0
 * @route '/admin/students/{student}'
 */
show.get = (args: { student: string | number } | [student: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\StudentController::show
 * @see app/Http/Controllers/Admin/StudentController.php:0
 * @route '/admin/students/{student}'
 */
show.head = (args: { student: string | number } | [student: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\StudentController::show
 * @see app/Http/Controllers/Admin/StudentController.php:0
 * @route '/admin/students/{student}'
 */
    const showForm = (args: { student: string | number } | [student: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\StudentController::show
 * @see app/Http/Controllers/Admin/StudentController.php:0
 * @route '/admin/students/{student}'
 */
        showForm.get = (args: { student: string | number } | [student: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\StudentController::show
 * @see app/Http/Controllers/Admin/StudentController.php:0
 * @route '/admin/students/{student}'
 */
        showForm.head = (args: { student: string | number } | [student: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    show.form = showForm
const students = {
    import: Object.assign(importMethod, importMethod),
export: Object.assign(exportMethod, exportMethod),
bulkAction: Object.assign(bulkAction, bulkAction),
create: Object.assign(create, create),
store: Object.assign(store, store),
edit: Object.assign(edit, edit),
update: Object.assign(update, update),
destroy: Object.assign(destroy, destroy),
index: Object.assign(index, index),
show: Object.assign(show, show),
}

export default students