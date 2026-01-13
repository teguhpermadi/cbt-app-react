import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\StudentController::template
 * @see app/Http/Controllers/Admin/StudentController.php:19
 * @route '/admin/students/import/template'
 */
export const template = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: template.url(options),
    method: 'get',
})

template.definition = {
    methods: ["get","head"],
    url: '/admin/students/import/template',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\StudentController::template
 * @see app/Http/Controllers/Admin/StudentController.php:19
 * @route '/admin/students/import/template'
 */
template.url = (options?: RouteQueryOptions) => {
    return template.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\StudentController::template
 * @see app/Http/Controllers/Admin/StudentController.php:19
 * @route '/admin/students/import/template'
 */
template.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: template.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\StudentController::template
 * @see app/Http/Controllers/Admin/StudentController.php:19
 * @route '/admin/students/import/template'
 */
template.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: template.url(options),
    method: 'head',
})