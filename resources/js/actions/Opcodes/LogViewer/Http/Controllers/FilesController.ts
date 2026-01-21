import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \Opcodes\LogViewer\Http\Controllers\FilesController::index
 * @see vendor/opcodesio/log-viewer/src/Http/Controllers/FilesController.php:15
 * @route '/log-viewer/api/files'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/log-viewer/api/files',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \Opcodes\LogViewer\Http\Controllers\FilesController::index
 * @see vendor/opcodesio/log-viewer/src/Http/Controllers/FilesController.php:15
 * @route '/log-viewer/api/files'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \Opcodes\LogViewer\Http\Controllers\FilesController::index
 * @see vendor/opcodesio/log-viewer/src/Http/Controllers/FilesController.php:15
 * @route '/log-viewer/api/files'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \Opcodes\LogViewer\Http\Controllers\FilesController::index
 * @see vendor/opcodesio/log-viewer/src/Http/Controllers/FilesController.php:15
 * @route '/log-viewer/api/files'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \Opcodes\LogViewer\Http\Controllers\FilesController::index
 * @see vendor/opcodesio/log-viewer/src/Http/Controllers/FilesController.php:15
 * @route '/log-viewer/api/files'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \Opcodes\LogViewer\Http\Controllers\FilesController::index
 * @see vendor/opcodesio/log-viewer/src/Http/Controllers/FilesController.php:15
 * @route '/log-viewer/api/files'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \Opcodes\LogViewer\Http\Controllers\FilesController::index
 * @see vendor/opcodesio/log-viewer/src/Http/Controllers/FilesController.php:15
 * @route '/log-viewer/api/files'
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
* @see \Opcodes\LogViewer\Http\Controllers\FilesController::requestDownload
 * @see vendor/opcodesio/log-viewer/src/Http/Controllers/FilesController.php:35
 * @route '/log-viewer/api/files/{fileIdentifier}/download/request'
 */
export const requestDownload = (args: { fileIdentifier: string | number } | [fileIdentifier: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: requestDownload.url(args, options),
    method: 'get',
})

requestDownload.definition = {
    methods: ["get","head"],
    url: '/log-viewer/api/files/{fileIdentifier}/download/request',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \Opcodes\LogViewer\Http\Controllers\FilesController::requestDownload
 * @see vendor/opcodesio/log-viewer/src/Http/Controllers/FilesController.php:35
 * @route '/log-viewer/api/files/{fileIdentifier}/download/request'
 */
requestDownload.url = (args: { fileIdentifier: string | number } | [fileIdentifier: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { fileIdentifier: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    fileIdentifier: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        fileIdentifier: args.fileIdentifier,
                }

    return requestDownload.definition.url
            .replace('{fileIdentifier}', parsedArgs.fileIdentifier.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \Opcodes\LogViewer\Http\Controllers\FilesController::requestDownload
 * @see vendor/opcodesio/log-viewer/src/Http/Controllers/FilesController.php:35
 * @route '/log-viewer/api/files/{fileIdentifier}/download/request'
 */
requestDownload.get = (args: { fileIdentifier: string | number } | [fileIdentifier: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: requestDownload.url(args, options),
    method: 'get',
})
/**
* @see \Opcodes\LogViewer\Http\Controllers\FilesController::requestDownload
 * @see vendor/opcodesio/log-viewer/src/Http/Controllers/FilesController.php:35
 * @route '/log-viewer/api/files/{fileIdentifier}/download/request'
 */
requestDownload.head = (args: { fileIdentifier: string | number } | [fileIdentifier: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: requestDownload.url(args, options),
    method: 'head',
})

    /**
* @see \Opcodes\LogViewer\Http\Controllers\FilesController::requestDownload
 * @see vendor/opcodesio/log-viewer/src/Http/Controllers/FilesController.php:35
 * @route '/log-viewer/api/files/{fileIdentifier}/download/request'
 */
    const requestDownloadForm = (args: { fileIdentifier: string | number } | [fileIdentifier: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: requestDownload.url(args, options),
        method: 'get',
    })

            /**
* @see \Opcodes\LogViewer\Http\Controllers\FilesController::requestDownload
 * @see vendor/opcodesio/log-viewer/src/Http/Controllers/FilesController.php:35
 * @route '/log-viewer/api/files/{fileIdentifier}/download/request'
 */
        requestDownloadForm.get = (args: { fileIdentifier: string | number } | [fileIdentifier: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: requestDownload.url(args, options),
            method: 'get',
        })
            /**
* @see \Opcodes\LogViewer\Http\Controllers\FilesController::requestDownload
 * @see vendor/opcodesio/log-viewer/src/Http/Controllers/FilesController.php:35
 * @route '/log-viewer/api/files/{fileIdentifier}/download/request'
 */
        requestDownloadForm.head = (args: { fileIdentifier: string | number } | [fileIdentifier: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: requestDownload.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    requestDownload.form = requestDownloadForm
/**
* @see \Opcodes\LogViewer\Http\Controllers\FilesController::clearCache
 * @see vendor/opcodesio/log-viewer/src/Http/Controllers/FilesController.php:59
 * @route '/log-viewer/api/files/{fileIdentifier}/clear-cache'
 */
export const clearCache = (args: { fileIdentifier: string | number } | [fileIdentifier: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: clearCache.url(args, options),
    method: 'post',
})

clearCache.definition = {
    methods: ["post"],
    url: '/log-viewer/api/files/{fileIdentifier}/clear-cache',
} satisfies RouteDefinition<["post"]>

/**
* @see \Opcodes\LogViewer\Http\Controllers\FilesController::clearCache
 * @see vendor/opcodesio/log-viewer/src/Http/Controllers/FilesController.php:59
 * @route '/log-viewer/api/files/{fileIdentifier}/clear-cache'
 */
clearCache.url = (args: { fileIdentifier: string | number } | [fileIdentifier: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { fileIdentifier: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    fileIdentifier: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        fileIdentifier: args.fileIdentifier,
                }

    return clearCache.definition.url
            .replace('{fileIdentifier}', parsedArgs.fileIdentifier.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \Opcodes\LogViewer\Http\Controllers\FilesController::clearCache
 * @see vendor/opcodesio/log-viewer/src/Http/Controllers/FilesController.php:59
 * @route '/log-viewer/api/files/{fileIdentifier}/clear-cache'
 */
clearCache.post = (args: { fileIdentifier: string | number } | [fileIdentifier: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: clearCache.url(args, options),
    method: 'post',
})

    /**
* @see \Opcodes\LogViewer\Http\Controllers\FilesController::clearCache
 * @see vendor/opcodesio/log-viewer/src/Http/Controllers/FilesController.php:59
 * @route '/log-viewer/api/files/{fileIdentifier}/clear-cache'
 */
    const clearCacheForm = (args: { fileIdentifier: string | number } | [fileIdentifier: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: clearCache.url(args, options),
        method: 'post',
    })

            /**
* @see \Opcodes\LogViewer\Http\Controllers\FilesController::clearCache
 * @see vendor/opcodesio/log-viewer/src/Http/Controllers/FilesController.php:59
 * @route '/log-viewer/api/files/{fileIdentifier}/clear-cache'
 */
        clearCacheForm.post = (args: { fileIdentifier: string | number } | [fileIdentifier: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: clearCache.url(args, options),
            method: 'post',
        })
    
    clearCache.form = clearCacheForm
/**
* @see \Opcodes\LogViewer\Http\Controllers\FilesController::deleteMethod
 * @see vendor/opcodesio/log-viewer/src/Http/Controllers/FilesController.php:81
 * @route '/log-viewer/api/files/{fileIdentifier}'
 */
export const deleteMethod = (args: { fileIdentifier: string | number } | [fileIdentifier: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: deleteMethod.url(args, options),
    method: 'delete',
})

deleteMethod.definition = {
    methods: ["delete"],
    url: '/log-viewer/api/files/{fileIdentifier}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \Opcodes\LogViewer\Http\Controllers\FilesController::deleteMethod
 * @see vendor/opcodesio/log-viewer/src/Http/Controllers/FilesController.php:81
 * @route '/log-viewer/api/files/{fileIdentifier}'
 */
deleteMethod.url = (args: { fileIdentifier: string | number } | [fileIdentifier: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { fileIdentifier: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    fileIdentifier: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        fileIdentifier: args.fileIdentifier,
                }

    return deleteMethod.definition.url
            .replace('{fileIdentifier}', parsedArgs.fileIdentifier.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \Opcodes\LogViewer\Http\Controllers\FilesController::deleteMethod
 * @see vendor/opcodesio/log-viewer/src/Http/Controllers/FilesController.php:81
 * @route '/log-viewer/api/files/{fileIdentifier}'
 */
deleteMethod.delete = (args: { fileIdentifier: string | number } | [fileIdentifier: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: deleteMethod.url(args, options),
    method: 'delete',
})

    /**
* @see \Opcodes\LogViewer\Http\Controllers\FilesController::deleteMethod
 * @see vendor/opcodesio/log-viewer/src/Http/Controllers/FilesController.php:81
 * @route '/log-viewer/api/files/{fileIdentifier}'
 */
    const deleteMethodForm = (args: { fileIdentifier: string | number } | [fileIdentifier: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: deleteMethod.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \Opcodes\LogViewer\Http\Controllers\FilesController::deleteMethod
 * @see vendor/opcodesio/log-viewer/src/Http/Controllers/FilesController.php:81
 * @route '/log-viewer/api/files/{fileIdentifier}'
 */
        deleteMethodForm.delete = (args: { fileIdentifier: string | number } | [fileIdentifier: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: deleteMethod.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    deleteMethod.form = deleteMethodForm
/**
* @see \Opcodes\LogViewer\Http\Controllers\FilesController::clearCacheAll
 * @see vendor/opcodesio/log-viewer/src/Http/Controllers/FilesController.php:72
 * @route '/log-viewer/api/clear-cache-all'
 */
export const clearCacheAll = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: clearCacheAll.url(options),
    method: 'post',
})

clearCacheAll.definition = {
    methods: ["post"],
    url: '/log-viewer/api/clear-cache-all',
} satisfies RouteDefinition<["post"]>

/**
* @see \Opcodes\LogViewer\Http\Controllers\FilesController::clearCacheAll
 * @see vendor/opcodesio/log-viewer/src/Http/Controllers/FilesController.php:72
 * @route '/log-viewer/api/clear-cache-all'
 */
clearCacheAll.url = (options?: RouteQueryOptions) => {
    return clearCacheAll.definition.url + queryParams(options)
}

/**
* @see \Opcodes\LogViewer\Http\Controllers\FilesController::clearCacheAll
 * @see vendor/opcodesio/log-viewer/src/Http/Controllers/FilesController.php:72
 * @route '/log-viewer/api/clear-cache-all'
 */
clearCacheAll.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: clearCacheAll.url(options),
    method: 'post',
})

    /**
* @see \Opcodes\LogViewer\Http\Controllers\FilesController::clearCacheAll
 * @see vendor/opcodesio/log-viewer/src/Http/Controllers/FilesController.php:72
 * @route '/log-viewer/api/clear-cache-all'
 */
    const clearCacheAllForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: clearCacheAll.url(options),
        method: 'post',
    })

            /**
* @see \Opcodes\LogViewer\Http\Controllers\FilesController::clearCacheAll
 * @see vendor/opcodesio/log-viewer/src/Http/Controllers/FilesController.php:72
 * @route '/log-viewer/api/clear-cache-all'
 */
        clearCacheAllForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: clearCacheAll.url(options),
            method: 'post',
        })
    
    clearCacheAll.form = clearCacheAllForm
/**
* @see \Opcodes\LogViewer\Http\Controllers\FilesController::deleteMultipleFiles
 * @see vendor/opcodesio/log-viewer/src/Http/Controllers/FilesController.php:98
 * @route '/log-viewer/api/delete-multiple-files'
 */
export const deleteMultipleFiles = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: deleteMultipleFiles.url(options),
    method: 'post',
})

deleteMultipleFiles.definition = {
    methods: ["post"],
    url: '/log-viewer/api/delete-multiple-files',
} satisfies RouteDefinition<["post"]>

/**
* @see \Opcodes\LogViewer\Http\Controllers\FilesController::deleteMultipleFiles
 * @see vendor/opcodesio/log-viewer/src/Http/Controllers/FilesController.php:98
 * @route '/log-viewer/api/delete-multiple-files'
 */
deleteMultipleFiles.url = (options?: RouteQueryOptions) => {
    return deleteMultipleFiles.definition.url + queryParams(options)
}

/**
* @see \Opcodes\LogViewer\Http\Controllers\FilesController::deleteMultipleFiles
 * @see vendor/opcodesio/log-viewer/src/Http/Controllers/FilesController.php:98
 * @route '/log-viewer/api/delete-multiple-files'
 */
deleteMultipleFiles.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: deleteMultipleFiles.url(options),
    method: 'post',
})

    /**
* @see \Opcodes\LogViewer\Http\Controllers\FilesController::deleteMultipleFiles
 * @see vendor/opcodesio/log-viewer/src/Http/Controllers/FilesController.php:98
 * @route '/log-viewer/api/delete-multiple-files'
 */
    const deleteMultipleFilesForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: deleteMultipleFiles.url(options),
        method: 'post',
    })

            /**
* @see \Opcodes\LogViewer\Http\Controllers\FilesController::deleteMultipleFiles
 * @see vendor/opcodesio/log-viewer/src/Http/Controllers/FilesController.php:98
 * @route '/log-viewer/api/delete-multiple-files'
 */
        deleteMultipleFilesForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: deleteMultipleFiles.url(options),
            method: 'post',
        })
    
    deleteMultipleFiles.form = deleteMultipleFilesForm
/**
* @see \Opcodes\LogViewer\Http\Controllers\FilesController::download
 * @see vendor/opcodesio/log-viewer/src/Http/Controllers/FilesController.php:52
 * @route '/log-viewer/api/files/{fileIdentifier}/download'
 */
export const download = (args: { fileIdentifier: string | number } | [fileIdentifier: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: download.url(args, options),
    method: 'get',
})

download.definition = {
    methods: ["get","head"],
    url: '/log-viewer/api/files/{fileIdentifier}/download',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \Opcodes\LogViewer\Http\Controllers\FilesController::download
 * @see vendor/opcodesio/log-viewer/src/Http/Controllers/FilesController.php:52
 * @route '/log-viewer/api/files/{fileIdentifier}/download'
 */
download.url = (args: { fileIdentifier: string | number } | [fileIdentifier: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { fileIdentifier: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    fileIdentifier: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        fileIdentifier: args.fileIdentifier,
                }

    return download.definition.url
            .replace('{fileIdentifier}', parsedArgs.fileIdentifier.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \Opcodes\LogViewer\Http\Controllers\FilesController::download
 * @see vendor/opcodesio/log-viewer/src/Http/Controllers/FilesController.php:52
 * @route '/log-viewer/api/files/{fileIdentifier}/download'
 */
download.get = (args: { fileIdentifier: string | number } | [fileIdentifier: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: download.url(args, options),
    method: 'get',
})
/**
* @see \Opcodes\LogViewer\Http\Controllers\FilesController::download
 * @see vendor/opcodesio/log-viewer/src/Http/Controllers/FilesController.php:52
 * @route '/log-viewer/api/files/{fileIdentifier}/download'
 */
download.head = (args: { fileIdentifier: string | number } | [fileIdentifier: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: download.url(args, options),
    method: 'head',
})

    /**
* @see \Opcodes\LogViewer\Http\Controllers\FilesController::download
 * @see vendor/opcodesio/log-viewer/src/Http/Controllers/FilesController.php:52
 * @route '/log-viewer/api/files/{fileIdentifier}/download'
 */
    const downloadForm = (args: { fileIdentifier: string | number } | [fileIdentifier: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: download.url(args, options),
        method: 'get',
    })

            /**
* @see \Opcodes\LogViewer\Http\Controllers\FilesController::download
 * @see vendor/opcodesio/log-viewer/src/Http/Controllers/FilesController.php:52
 * @route '/log-viewer/api/files/{fileIdentifier}/download'
 */
        downloadForm.get = (args: { fileIdentifier: string | number } | [fileIdentifier: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: download.url(args, options),
            method: 'get',
        })
            /**
* @see \Opcodes\LogViewer\Http\Controllers\FilesController::download
 * @see vendor/opcodesio/log-viewer/src/Http/Controllers/FilesController.php:52
 * @route '/log-viewer/api/files/{fileIdentifier}/download'
 */
        downloadForm.head = (args: { fileIdentifier: string | number } | [fileIdentifier: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: download.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    download.form = downloadForm
const FilesController = { index, requestDownload, clearCache, deleteMethod, clearCacheAll, deleteMultipleFiles, download, delete: deleteMethod }

export default FilesController