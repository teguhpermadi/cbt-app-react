import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../../wayfinder'
/**
* @see \Spatie\WebTinker\Http\Controllers\WebTinkerController::index
 * @see vendor/spatie/laravel-web-tinker/src/Http/Controllers/WebTinkerController.php:11
 * @route '/tinker'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/tinker',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \Spatie\WebTinker\Http\Controllers\WebTinkerController::index
 * @see vendor/spatie/laravel-web-tinker/src/Http/Controllers/WebTinkerController.php:11
 * @route '/tinker'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \Spatie\WebTinker\Http\Controllers\WebTinkerController::index
 * @see vendor/spatie/laravel-web-tinker/src/Http/Controllers/WebTinkerController.php:11
 * @route '/tinker'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \Spatie\WebTinker\Http\Controllers\WebTinkerController::index
 * @see vendor/spatie/laravel-web-tinker/src/Http/Controllers/WebTinkerController.php:11
 * @route '/tinker'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \Spatie\WebTinker\Http\Controllers\WebTinkerController::index
 * @see vendor/spatie/laravel-web-tinker/src/Http/Controllers/WebTinkerController.php:11
 * @route '/tinker'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \Spatie\WebTinker\Http\Controllers\WebTinkerController::index
 * @see vendor/spatie/laravel-web-tinker/src/Http/Controllers/WebTinkerController.php:11
 * @route '/tinker'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \Spatie\WebTinker\Http\Controllers\WebTinkerController::index
 * @see vendor/spatie/laravel-web-tinker/src/Http/Controllers/WebTinkerController.php:11
 * @route '/tinker'
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
* @see \Spatie\WebTinker\Http\Controllers\WebTinkerController::execute
 * @see vendor/spatie/laravel-web-tinker/src/Http/Controllers/WebTinkerController.php:18
 * @route '/tinker'
 */
export const execute = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: execute.url(options),
    method: 'post',
})

execute.definition = {
    methods: ["post"],
    url: '/tinker',
} satisfies RouteDefinition<["post"]>

/**
* @see \Spatie\WebTinker\Http\Controllers\WebTinkerController::execute
 * @see vendor/spatie/laravel-web-tinker/src/Http/Controllers/WebTinkerController.php:18
 * @route '/tinker'
 */
execute.url = (options?: RouteQueryOptions) => {
    return execute.definition.url + queryParams(options)
}

/**
* @see \Spatie\WebTinker\Http\Controllers\WebTinkerController::execute
 * @see vendor/spatie/laravel-web-tinker/src/Http/Controllers/WebTinkerController.php:18
 * @route '/tinker'
 */
execute.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: execute.url(options),
    method: 'post',
})

    /**
* @see \Spatie\WebTinker\Http\Controllers\WebTinkerController::execute
 * @see vendor/spatie/laravel-web-tinker/src/Http/Controllers/WebTinkerController.php:18
 * @route '/tinker'
 */
    const executeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: execute.url(options),
        method: 'post',
    })

            /**
* @see \Spatie\WebTinker\Http\Controllers\WebTinkerController::execute
 * @see vendor/spatie/laravel-web-tinker/src/Http/Controllers/WebTinkerController.php:18
 * @route '/tinker'
 */
        executeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: execute.url(options),
            method: 'post',
        })
    
    execute.form = executeForm
const WebTinkerController = { index, execute }

export default WebTinkerController