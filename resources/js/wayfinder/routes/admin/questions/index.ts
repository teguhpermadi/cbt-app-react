import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\QuestionController::reorder
 * @see app/Http/Controllers/Admin/QuestionController.php:263
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
 * @see app/Http/Controllers/Admin/QuestionController.php:263
 * @route '/admin/questions/reorder'
 */
reorder.url = (options?: RouteQueryOptions) => {
    return reorder.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\QuestionController::reorder
 * @see app/Http/Controllers/Admin/QuestionController.php:263
 * @route '/admin/questions/reorder'
 */
reorder.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: reorder.url(options),
    method: 'post',
})

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
* @see \App\Http\Controllers\Admin\QuestionController::edit
 * @see app/Http/Controllers/Admin/QuestionController.php:135
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
 * @see app/Http/Controllers/Admin/QuestionController.php:135
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
 * @see app/Http/Controllers/Admin/QuestionController.php:135
 * @route '/admin/questions/{question}/edit'
 */
edit.get = (args: { question: string | { id: string } } | [question: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\QuestionController::edit
 * @see app/Http/Controllers/Admin/QuestionController.php:135
 * @route '/admin/questions/{question}/edit'
 */
edit.head = (args: { question: string | { id: string } } | [question: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\QuestionController::update
 * @see app/Http/Controllers/Admin/QuestionController.php:159
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
 * @see app/Http/Controllers/Admin/QuestionController.php:159
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
 * @see app/Http/Controllers/Admin/QuestionController.php:159
 * @route '/admin/questions/{question}'
 */
update.put = (args: { question: string | { id: string } } | [question: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})
/**
* @see \App\Http\Controllers\Admin\QuestionController::update
 * @see app/Http/Controllers/Admin/QuestionController.php:159
 * @route '/admin/questions/{question}'
 */
update.patch = (args: { question: string | { id: string } } | [question: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\Admin\QuestionController::destroy
 * @see app/Http/Controllers/Admin/QuestionController.php:280
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
 * @see app/Http/Controllers/Admin/QuestionController.php:280
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
 * @see app/Http/Controllers/Admin/QuestionController.php:280
 * @route '/admin/questions/{question}'
 */
destroy.delete = (args: { question: string | { id: string } } | [question: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})
const questions = {
    reorder: Object.assign(reorder, reorder),
index: Object.assign(index, index),
create: Object.assign(create, create),
store: Object.assign(store, store),
show: Object.assign(show, show),
edit: Object.assign(edit, edit),
update: Object.assign(update, update),
destroy: Object.assign(destroy, destroy),
}

export default questions