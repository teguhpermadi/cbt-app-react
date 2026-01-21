import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../../wayfinder'
/**
* @see \Opcodes\LogViewer\Http\Controllers\HostsController::index
 * @see vendor/opcodesio/log-viewer/src/Http/Controllers/HostsController.php:10
 * @route '/log-viewer/api/hosts'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/log-viewer/api/hosts',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \Opcodes\LogViewer\Http\Controllers\HostsController::index
 * @see vendor/opcodesio/log-viewer/src/Http/Controllers/HostsController.php:10
 * @route '/log-viewer/api/hosts'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \Opcodes\LogViewer\Http\Controllers\HostsController::index
 * @see vendor/opcodesio/log-viewer/src/Http/Controllers/HostsController.php:10
 * @route '/log-viewer/api/hosts'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \Opcodes\LogViewer\Http\Controllers\HostsController::index
 * @see vendor/opcodesio/log-viewer/src/Http/Controllers/HostsController.php:10
 * @route '/log-viewer/api/hosts'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \Opcodes\LogViewer\Http\Controllers\HostsController::index
 * @see vendor/opcodesio/log-viewer/src/Http/Controllers/HostsController.php:10
 * @route '/log-viewer/api/hosts'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \Opcodes\LogViewer\Http\Controllers\HostsController::index
 * @see vendor/opcodesio/log-viewer/src/Http/Controllers/HostsController.php:10
 * @route '/log-viewer/api/hosts'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \Opcodes\LogViewer\Http\Controllers\HostsController::index
 * @see vendor/opcodesio/log-viewer/src/Http/Controllers/HostsController.php:10
 * @route '/log-viewer/api/hosts'
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
const HostsController = { index }

export default HostsController