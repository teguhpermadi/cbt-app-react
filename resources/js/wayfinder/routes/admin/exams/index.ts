import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../wayfinder'
import sessions from './sessions'
/**
* @see \App\Http\Controllers\Admin\ExamController::regenerateToken
 * @see app/Http/Controllers/Admin/ExamController.php:145
 * @route '/admin/exams/{exam}/regenerate-token'
 */
export const regenerateToken = (args: { exam: string | { id: string } } | [exam: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: regenerateToken.url(args, options),
    method: 'put',
})

regenerateToken.definition = {
    methods: ["put"],
    url: '/admin/exams/{exam}/regenerate-token',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\Admin\ExamController::regenerateToken
 * @see app/Http/Controllers/Admin/ExamController.php:145
 * @route '/admin/exams/{exam}/regenerate-token'
 */
regenerateToken.url = (args: { exam: string | { id: string } } | [exam: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions) => {
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
 * @see app/Http/Controllers/Admin/ExamController.php:145
 * @route '/admin/exams/{exam}/regenerate-token'
 */
regenerateToken.put = (args: { exam: string | { id: string } } | [exam: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: regenerateToken.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\Admin\ExamController::toggleTokenVisibility
 * @see app/Http/Controllers/Admin/ExamController.php:154
 * @route '/admin/exams/{exam}/toggle-token-visibility'
 */
export const toggleTokenVisibility = (args: { exam: string | { id: string } } | [exam: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: toggleTokenVisibility.url(args, options),
    method: 'put',
})

toggleTokenVisibility.definition = {
    methods: ["put"],
    url: '/admin/exams/{exam}/toggle-token-visibility',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\Admin\ExamController::toggleTokenVisibility
 * @see app/Http/Controllers/Admin/ExamController.php:154
 * @route '/admin/exams/{exam}/toggle-token-visibility'
 */
toggleTokenVisibility.url = (args: { exam: string | { id: string } } | [exam: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions) => {
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
 * @see app/Http/Controllers/Admin/ExamController.php:154
 * @route '/admin/exams/{exam}/toggle-token-visibility'
 */
toggleTokenVisibility.put = (args: { exam: string | { id: string } } | [exam: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: toggleTokenVisibility.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\Admin\ExamController::monitor
 * @see app/Http/Controllers/Admin/ExamController.php:163
 * @route '/admin/exams/{exam}/monitor'
 */
export const monitor = (args: { exam: string | { id: string } } | [exam: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: monitor.url(args, options),
    method: 'get',
})

monitor.definition = {
    methods: ["get","head"],
    url: '/admin/exams/{exam}/monitor',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\ExamController::monitor
 * @see app/Http/Controllers/Admin/ExamController.php:163
 * @route '/admin/exams/{exam}/monitor'
 */
monitor.url = (args: { exam: string | { id: string } } | [exam: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions) => {
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
 * @see app/Http/Controllers/Admin/ExamController.php:163
 * @route '/admin/exams/{exam}/monitor'
 */
monitor.get = (args: { exam: string | { id: string } } | [exam: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: monitor.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\ExamController::monitor
 * @see app/Http/Controllers/Admin/ExamController.php:163
 * @route '/admin/exams/{exam}/monitor'
 */
monitor.head = (args: { exam: string | { id: string } } | [exam: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: monitor.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\ExamController::index
 * @see app/Http/Controllers/Admin/ExamController.php:23
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
 * @see app/Http/Controllers/Admin/ExamController.php:23
 * @route '/admin/exams'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\ExamController::index
 * @see app/Http/Controllers/Admin/ExamController.php:23
 * @route '/admin/exams'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\ExamController::index
 * @see app/Http/Controllers/Admin/ExamController.php:23
 * @route '/admin/exams'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\ExamController::create
 * @see app/Http/Controllers/Admin/ExamController.php:50
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
 * @see app/Http/Controllers/Admin/ExamController.php:50
 * @route '/admin/exams/create'
 */
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\ExamController::create
 * @see app/Http/Controllers/Admin/ExamController.php:50
 * @route '/admin/exams/create'
 */
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\ExamController::create
 * @see app/Http/Controllers/Admin/ExamController.php:50
 * @route '/admin/exams/create'
 */
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\ExamController::store
 * @see app/Http/Controllers/Admin/ExamController.php:76
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
 * @see app/Http/Controllers/Admin/ExamController.php:76
 * @route '/admin/exams'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\ExamController::store
 * @see app/Http/Controllers/Admin/ExamController.php:76
 * @route '/admin/exams'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

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
* @see \App\Http\Controllers\Admin\ExamController::edit
 * @see app/Http/Controllers/Admin/ExamController.php:90
 * @route '/admin/exams/{exam}/edit'
 */
export const edit = (args: { exam: string | { id: string } } | [exam: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/admin/exams/{exam}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\ExamController::edit
 * @see app/Http/Controllers/Admin/ExamController.php:90
 * @route '/admin/exams/{exam}/edit'
 */
edit.url = (args: { exam: string | { id: string } } | [exam: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions) => {
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
 * @see app/Http/Controllers/Admin/ExamController.php:90
 * @route '/admin/exams/{exam}/edit'
 */
edit.get = (args: { exam: string | { id: string } } | [exam: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\ExamController::edit
 * @see app/Http/Controllers/Admin/ExamController.php:90
 * @route '/admin/exams/{exam}/edit'
 */
edit.head = (args: { exam: string | { id: string } } | [exam: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\ExamController::update
 * @see app/Http/Controllers/Admin/ExamController.php:115
 * @route '/admin/exams/{exam}'
 */
export const update = (args: { exam: string | { id: string } } | [exam: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/admin/exams/{exam}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\Admin\ExamController::update
 * @see app/Http/Controllers/Admin/ExamController.php:115
 * @route '/admin/exams/{exam}'
 */
update.url = (args: { exam: string | { id: string } } | [exam: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions) => {
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
 * @see app/Http/Controllers/Admin/ExamController.php:115
 * @route '/admin/exams/{exam}'
 */
update.put = (args: { exam: string | { id: string } } | [exam: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})
/**
* @see \App\Http\Controllers\Admin\ExamController::update
 * @see app/Http/Controllers/Admin/ExamController.php:115
 * @route '/admin/exams/{exam}'
 */
update.patch = (args: { exam: string | { id: string } } | [exam: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\Admin\ExamController::destroy
 * @see app/Http/Controllers/Admin/ExamController.php:139
 * @route '/admin/exams/{exam}'
 */
export const destroy = (args: { exam: string | { id: string } } | [exam: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/admin/exams/{exam}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Admin\ExamController::destroy
 * @see app/Http/Controllers/Admin/ExamController.php:139
 * @route '/admin/exams/{exam}'
 */
destroy.url = (args: { exam: string | { id: string } } | [exam: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions) => {
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
 * @see app/Http/Controllers/Admin/ExamController.php:139
 * @route '/admin/exams/{exam}'
 */
destroy.delete = (args: { exam: string | { id: string } } | [exam: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})
const exams = {
    regenerateToken: Object.assign(regenerateToken, regenerateToken),
toggleTokenVisibility: Object.assign(toggleTokenVisibility, toggleTokenVisibility),
monitor: Object.assign(monitor, monitor),
sessions: Object.assign(sessions, sessions),
index: Object.assign(index, index),
create: Object.assign(create, create),
store: Object.assign(store, store),
show: Object.assign(show, show),
edit: Object.assign(edit, edit),
update: Object.assign(update, update),
destroy: Object.assign(destroy, destroy),
}

export default exams