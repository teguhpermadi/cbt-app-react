import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\QuestionController::search
 * @see app/Http/Controllers/Admin/QuestionController.php:306
 * @route '/admin/tags/search'
 */
export const search = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: search.url(options),
    method: 'get',
})

search.definition = {
    methods: ["get","head"],
    url: '/admin/tags/search',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\QuestionController::search
 * @see app/Http/Controllers/Admin/QuestionController.php:306
 * @route '/admin/tags/search'
 */
search.url = (options?: RouteQueryOptions) => {
    return search.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\QuestionController::search
 * @see app/Http/Controllers/Admin/QuestionController.php:306
 * @route '/admin/tags/search'
 */
search.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: search.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\QuestionController::search
 * @see app/Http/Controllers/Admin/QuestionController.php:306
 * @route '/admin/tags/search'
 */
search.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: search.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\QuestionController::search
 * @see app/Http/Controllers/Admin/QuestionController.php:306
 * @route '/admin/tags/search'
 */
    const searchForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: search.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\QuestionController::search
 * @see app/Http/Controllers/Admin/QuestionController.php:306
 * @route '/admin/tags/search'
 */
        searchForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: search.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\QuestionController::search
 * @see app/Http/Controllers/Admin/QuestionController.php:306
 * @route '/admin/tags/search'
 */
        searchForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: search.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    search.form = searchForm
const tags = {
    search: Object.assign(search, search),
}

export default tags