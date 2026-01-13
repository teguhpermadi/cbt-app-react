import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\QuestionBankController::index
 * @see app/Http/Controllers/Admin/QuestionBankController.php:17
 * @route '/admin/question-banks'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/admin/question-banks',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\QuestionBankController::index
 * @see app/Http/Controllers/Admin/QuestionBankController.php:17
 * @route '/admin/question-banks'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\QuestionBankController::index
 * @see app/Http/Controllers/Admin/QuestionBankController.php:17
 * @route '/admin/question-banks'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\QuestionBankController::index
 * @see app/Http/Controllers/Admin/QuestionBankController.php:17
 * @route '/admin/question-banks'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\QuestionBankController::create
 * @see app/Http/Controllers/Admin/QuestionBankController.php:37
 * @route '/admin/question-banks/create'
 */
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/admin/question-banks/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\QuestionBankController::create
 * @see app/Http/Controllers/Admin/QuestionBankController.php:37
 * @route '/admin/question-banks/create'
 */
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\QuestionBankController::create
 * @see app/Http/Controllers/Admin/QuestionBankController.php:37
 * @route '/admin/question-banks/create'
 */
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\QuestionBankController::create
 * @see app/Http/Controllers/Admin/QuestionBankController.php:37
 * @route '/admin/question-banks/create'
 */
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\QuestionBankController::store
 * @see app/Http/Controllers/Admin/QuestionBankController.php:61
 * @route '/admin/question-banks'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/admin/question-banks',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\QuestionBankController::store
 * @see app/Http/Controllers/Admin/QuestionBankController.php:61
 * @route '/admin/question-banks'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\QuestionBankController::store
 * @see app/Http/Controllers/Admin/QuestionBankController.php:61
 * @route '/admin/question-banks'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\QuestionBankController::show
 * @see app/Http/Controllers/Admin/QuestionBankController.php:81
 * @route '/admin/question-banks/{question_bank}'
 */
export const show = (args: { question_bank: string | number } | [question_bank: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/admin/question-banks/{question_bank}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\QuestionBankController::show
 * @see app/Http/Controllers/Admin/QuestionBankController.php:81
 * @route '/admin/question-banks/{question_bank}'
 */
show.url = (args: { question_bank: string | number } | [question_bank: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { question_bank: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    question_bank: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        question_bank: args.question_bank,
                }

    return show.definition.url
            .replace('{question_bank}', parsedArgs.question_bank.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\QuestionBankController::show
 * @see app/Http/Controllers/Admin/QuestionBankController.php:81
 * @route '/admin/question-banks/{question_bank}'
 */
show.get = (args: { question_bank: string | number } | [question_bank: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\QuestionBankController::show
 * @see app/Http/Controllers/Admin/QuestionBankController.php:81
 * @route '/admin/question-banks/{question_bank}'
 */
show.head = (args: { question_bank: string | number } | [question_bank: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\QuestionBankController::edit
 * @see app/Http/Controllers/Admin/QuestionBankController.php:107
 * @route '/admin/question-banks/{question_bank}/edit'
 */
export const edit = (args: { question_bank: string | number } | [question_bank: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/admin/question-banks/{question_bank}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\QuestionBankController::edit
 * @see app/Http/Controllers/Admin/QuestionBankController.php:107
 * @route '/admin/question-banks/{question_bank}/edit'
 */
edit.url = (args: { question_bank: string | number } | [question_bank: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { question_bank: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    question_bank: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        question_bank: args.question_bank,
                }

    return edit.definition.url
            .replace('{question_bank}', parsedArgs.question_bank.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\QuestionBankController::edit
 * @see app/Http/Controllers/Admin/QuestionBankController.php:107
 * @route '/admin/question-banks/{question_bank}/edit'
 */
edit.get = (args: { question_bank: string | number } | [question_bank: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\QuestionBankController::edit
 * @see app/Http/Controllers/Admin/QuestionBankController.php:107
 * @route '/admin/question-banks/{question_bank}/edit'
 */
edit.head = (args: { question_bank: string | number } | [question_bank: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\QuestionBankController::update
 * @see app/Http/Controllers/Admin/QuestionBankController.php:148
 * @route '/admin/question-banks/{question_bank}'
 */
export const update = (args: { question_bank: string | number } | [question_bank: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/admin/question-banks/{question_bank}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\Admin\QuestionBankController::update
 * @see app/Http/Controllers/Admin/QuestionBankController.php:148
 * @route '/admin/question-banks/{question_bank}'
 */
update.url = (args: { question_bank: string | number } | [question_bank: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { question_bank: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    question_bank: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        question_bank: args.question_bank,
                }

    return update.definition.url
            .replace('{question_bank}', parsedArgs.question_bank.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\QuestionBankController::update
 * @see app/Http/Controllers/Admin/QuestionBankController.php:148
 * @route '/admin/question-banks/{question_bank}'
 */
update.put = (args: { question_bank: string | number } | [question_bank: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})
/**
* @see \App\Http\Controllers\Admin\QuestionBankController::update
 * @see app/Http/Controllers/Admin/QuestionBankController.php:148
 * @route '/admin/question-banks/{question_bank}'
 */
update.patch = (args: { question_bank: string | number } | [question_bank: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\Admin\QuestionBankController::destroy
 * @see app/Http/Controllers/Admin/QuestionBankController.php:166
 * @route '/admin/question-banks/{question_bank}'
 */
export const destroy = (args: { question_bank: string | number } | [question_bank: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/admin/question-banks/{question_bank}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Admin\QuestionBankController::destroy
 * @see app/Http/Controllers/Admin/QuestionBankController.php:166
 * @route '/admin/question-banks/{question_bank}'
 */
destroy.url = (args: { question_bank: string | number } | [question_bank: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { question_bank: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    question_bank: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        question_bank: args.question_bank,
                }

    return destroy.definition.url
            .replace('{question_bank}', parsedArgs.question_bank.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\QuestionBankController::destroy
 * @see app/Http/Controllers/Admin/QuestionBankController.php:166
 * @route '/admin/question-banks/{question_bank}'
 */
destroy.delete = (args: { question_bank: string | number } | [question_bank: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})
const questionBanks = {
    index: Object.assign(index, index),
create: Object.assign(create, create),
store: Object.assign(store, store),
show: Object.assign(show, show),
edit: Object.assign(edit, edit),
update: Object.assign(update, update),
destroy: Object.assign(destroy, destroy),
}

export default questionBanks