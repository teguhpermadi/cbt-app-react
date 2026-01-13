import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\StudentController::downloadTemplate
 * @see app/Http/Controllers/Admin/StudentController.php:19
 * @route '/admin/students/import/template'
 */
export const downloadTemplate = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: downloadTemplate.url(options),
    method: 'get',
})

downloadTemplate.definition = {
    methods: ["get","head"],
    url: '/admin/students/import/template',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\StudentController::downloadTemplate
 * @see app/Http/Controllers/Admin/StudentController.php:19
 * @route '/admin/students/import/template'
 */
downloadTemplate.url = (options?: RouteQueryOptions) => {
    return downloadTemplate.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\StudentController::downloadTemplate
 * @see app/Http/Controllers/Admin/StudentController.php:19
 * @route '/admin/students/import/template'
 */
downloadTemplate.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: downloadTemplate.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\StudentController::downloadTemplate
 * @see app/Http/Controllers/Admin/StudentController.php:19
 * @route '/admin/students/import/template'
 */
downloadTemplate.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: downloadTemplate.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\StudentController::storeImport
 * @see app/Http/Controllers/Admin/StudentController.php:97
 * @route '/admin/students/import'
 */
export const storeImport = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeImport.url(options),
    method: 'post',
})

storeImport.definition = {
    methods: ["post"],
    url: '/admin/students/import',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\StudentController::storeImport
 * @see app/Http/Controllers/Admin/StudentController.php:97
 * @route '/admin/students/import'
 */
storeImport.url = (options?: RouteQueryOptions) => {
    return storeImport.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\StudentController::storeImport
 * @see app/Http/Controllers/Admin/StudentController.php:97
 * @route '/admin/students/import'
 */
storeImport.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeImport.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\StudentController::index
 * @see app/Http/Controllers/Admin/StudentController.php:24
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
 * @see app/Http/Controllers/Admin/StudentController.php:24
 * @route '/admin/students'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\StudentController::index
 * @see app/Http/Controllers/Admin/StudentController.php:24
 * @route '/admin/students'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\StudentController::index
 * @see app/Http/Controllers/Admin/StudentController.php:24
 * @route '/admin/students'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

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
* @see \App\Http\Controllers\Admin\StudentController::store
 * @see app/Http/Controllers/Admin/StudentController.php:38
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
 * @see app/Http/Controllers/Admin/StudentController.php:38
 * @route '/admin/students'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\StudentController::store
 * @see app/Http/Controllers/Admin/StudentController.php:38
 * @route '/admin/students'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

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
* @see \App\Http\Controllers\Admin\StudentController::update
 * @see app/Http/Controllers/Admin/StudentController.php:70
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
 * @see app/Http/Controllers/Admin/StudentController.php:70
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
 * @see app/Http/Controllers/Admin/StudentController.php:70
 * @route '/admin/students/{student}'
 */
update.put = (args: { student: string | { id: string } } | [student: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})
/**
* @see \App\Http\Controllers\Admin\StudentController::update
 * @see app/Http/Controllers/Admin/StudentController.php:70
 * @route '/admin/students/{student}'
 */
update.patch = (args: { student: string | { id: string } } | [student: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\Admin\StudentController::destroy
 * @see app/Http/Controllers/Admin/StudentController.php:91
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
 * @see app/Http/Controllers/Admin/StudentController.php:91
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
 * @see app/Http/Controllers/Admin/StudentController.php:91
 * @route '/admin/students/{student}'
 */
destroy.delete = (args: { student: string | { id: string } } | [student: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})
const StudentController = { downloadTemplate, storeImport, index, create, store, show, edit, update, destroy }

export default StudentController