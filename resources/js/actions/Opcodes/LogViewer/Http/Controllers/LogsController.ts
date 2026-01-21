import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../../wayfinder'
/**
* @see \Opcodes\LogViewer\Http\Controllers\LogsController::index
 * @see vendor/opcodesio/log-viewer/src/Http/Controllers/LogsController.php:19
 * @route '/log-viewer/api/logs'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/log-viewer/api/logs',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \Opcodes\LogViewer\Http\Controllers\LogsController::index
 * @see vendor/opcodesio/log-viewer/src/Http/Controllers/LogsController.php:19
 * @route '/log-viewer/api/logs'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \Opcodes\LogViewer\Http\Controllers\LogsController::index
 * @see vendor/opcodesio/log-viewer/src/Http/Controllers/LogsController.php:19
 * @route '/log-viewer/api/logs'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \Opcodes\LogViewer\Http\Controllers\LogsController::index
 * @see vendor/opcodesio/log-viewer/src/Http/Controllers/LogsController.php:19
 * @route '/log-viewer/api/logs'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \Opcodes\LogViewer\Http\Controllers\LogsController::index
 * @see vendor/opcodesio/log-viewer/src/Http/Controllers/LogsController.php:19
 * @route '/log-viewer/api/logs'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \Opcodes\LogViewer\Http\Controllers\LogsController::index
 * @see vendor/opcodesio/log-viewer/src/Http/Controllers/LogsController.php:19
 * @route '/log-viewer/api/logs'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \Opcodes\LogViewer\Http\Controllers\LogsController::index
 * @see vendor/opcodesio/log-viewer/src/Http/Controllers/LogsController.php:19
 * @route '/log-viewer/api/logs'
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
const LogsController = { index }

export default LogsController