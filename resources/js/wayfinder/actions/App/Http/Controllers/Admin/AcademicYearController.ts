import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\AcademicYearController::index
 * @see app/Http/Controllers/Admin/AcademicYearController.php:17
 * @route '/admin/academic-years'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/admin/academic-years',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\AcademicYearController::index
 * @see app/Http/Controllers/Admin/AcademicYearController.php:17
 * @route '/admin/academic-years'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\AcademicYearController::index
 * @see app/Http/Controllers/Admin/AcademicYearController.php:17
 * @route '/admin/academic-years'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\AcademicYearController::index
 * @see app/Http/Controllers/Admin/AcademicYearController.php:17
 * @route '/admin/academic-years'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\AcademicYearController::create
 * @see app/Http/Controllers/Admin/AcademicYearController.php:0
 * @route '/admin/academic-years/create'
 */
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/admin/academic-years/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\AcademicYearController::create
 * @see app/Http/Controllers/Admin/AcademicYearController.php:0
 * @route '/admin/academic-years/create'
 */
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\AcademicYearController::create
 * @see app/Http/Controllers/Admin/AcademicYearController.php:0
 * @route '/admin/academic-years/create'
 */
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\AcademicYearController::create
 * @see app/Http/Controllers/Admin/AcademicYearController.php:0
 * @route '/admin/academic-years/create'
 */
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\AcademicYearController::store
 * @see app/Http/Controllers/Admin/AcademicYearController.php:29
 * @route '/admin/academic-years'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/admin/academic-years',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\AcademicYearController::store
 * @see app/Http/Controllers/Admin/AcademicYearController.php:29
 * @route '/admin/academic-years'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\AcademicYearController::store
 * @see app/Http/Controllers/Admin/AcademicYearController.php:29
 * @route '/admin/academic-years'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\AcademicYearController::show
 * @see app/Http/Controllers/Admin/AcademicYearController.php:0
 * @route '/admin/academic-years/{academic_year}'
 */
export const show = (args: { academic_year: string | number } | [academic_year: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/admin/academic-years/{academic_year}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\AcademicYearController::show
 * @see app/Http/Controllers/Admin/AcademicYearController.php:0
 * @route '/admin/academic-years/{academic_year}'
 */
show.url = (args: { academic_year: string | number } | [academic_year: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { academic_year: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    academic_year: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        academic_year: args.academic_year,
                }

    return show.definition.url
            .replace('{academic_year}', parsedArgs.academic_year.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\AcademicYearController::show
 * @see app/Http/Controllers/Admin/AcademicYearController.php:0
 * @route '/admin/academic-years/{academic_year}'
 */
show.get = (args: { academic_year: string | number } | [academic_year: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\AcademicYearController::show
 * @see app/Http/Controllers/Admin/AcademicYearController.php:0
 * @route '/admin/academic-years/{academic_year}'
 */
show.head = (args: { academic_year: string | number } | [academic_year: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\AcademicYearController::edit
 * @see app/Http/Controllers/Admin/AcademicYearController.php:0
 * @route '/admin/academic-years/{academic_year}/edit'
 */
export const edit = (args: { academic_year: string | number } | [academic_year: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/admin/academic-years/{academic_year}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\AcademicYearController::edit
 * @see app/Http/Controllers/Admin/AcademicYearController.php:0
 * @route '/admin/academic-years/{academic_year}/edit'
 */
edit.url = (args: { academic_year: string | number } | [academic_year: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { academic_year: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    academic_year: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        academic_year: args.academic_year,
                }

    return edit.definition.url
            .replace('{academic_year}', parsedArgs.academic_year.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\AcademicYearController::edit
 * @see app/Http/Controllers/Admin/AcademicYearController.php:0
 * @route '/admin/academic-years/{academic_year}/edit'
 */
edit.get = (args: { academic_year: string | number } | [academic_year: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\AcademicYearController::edit
 * @see app/Http/Controllers/Admin/AcademicYearController.php:0
 * @route '/admin/academic-years/{academic_year}/edit'
 */
edit.head = (args: { academic_year: string | number } | [academic_year: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\AcademicYearController::update
 * @see app/Http/Controllers/Admin/AcademicYearController.php:50
 * @route '/admin/academic-years/{academic_year}'
 */
export const update = (args: { academic_year: string | number } | [academic_year: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/admin/academic-years/{academic_year}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\Admin\AcademicYearController::update
 * @see app/Http/Controllers/Admin/AcademicYearController.php:50
 * @route '/admin/academic-years/{academic_year}'
 */
update.url = (args: { academic_year: string | number } | [academic_year: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { academic_year: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    academic_year: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        academic_year: args.academic_year,
                }

    return update.definition.url
            .replace('{academic_year}', parsedArgs.academic_year.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\AcademicYearController::update
 * @see app/Http/Controllers/Admin/AcademicYearController.php:50
 * @route '/admin/academic-years/{academic_year}'
 */
update.put = (args: { academic_year: string | number } | [academic_year: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})
/**
* @see \App\Http\Controllers\Admin\AcademicYearController::update
 * @see app/Http/Controllers/Admin/AcademicYearController.php:50
 * @route '/admin/academic-years/{academic_year}'
 */
update.patch = (args: { academic_year: string | number } | [academic_year: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\Admin\AcademicYearController::destroy
 * @see app/Http/Controllers/Admin/AcademicYearController.php:71
 * @route '/admin/academic-years/{academic_year}'
 */
export const destroy = (args: { academic_year: string | number } | [academic_year: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/admin/academic-years/{academic_year}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Admin\AcademicYearController::destroy
 * @see app/Http/Controllers/Admin/AcademicYearController.php:71
 * @route '/admin/academic-years/{academic_year}'
 */
destroy.url = (args: { academic_year: string | number } | [academic_year: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { academic_year: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    academic_year: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        academic_year: args.academic_year,
                }

    return destroy.definition.url
            .replace('{academic_year}', parsedArgs.academic_year.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\AcademicYearController::destroy
 * @see app/Http/Controllers/Admin/AcademicYearController.php:71
 * @route '/admin/academic-years/{academic_year}'
 */
destroy.delete = (args: { academic_year: string | number } | [academic_year: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})
const AcademicYearController = { index, create, store, show, edit, update, destroy }

export default AcademicYearController