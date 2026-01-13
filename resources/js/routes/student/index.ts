import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../wayfinder'
import exams from './exams'
import results from './results'
/**
* @see \App\Http\Controllers\Student\DashboardController::dashboard
 * @see app/Http/Controllers/Student/DashboardController.php:12
 * @route '/student/dashboard'
 */
export const dashboard = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: dashboard.url(options),
    method: 'get',
})

dashboard.definition = {
    methods: ["get","head"],
    url: '/student/dashboard',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Student\DashboardController::dashboard
 * @see app/Http/Controllers/Student/DashboardController.php:12
 * @route '/student/dashboard'
 */
dashboard.url = (options?: RouteQueryOptions) => {
    return dashboard.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Student\DashboardController::dashboard
 * @see app/Http/Controllers/Student/DashboardController.php:12
 * @route '/student/dashboard'
 */
dashboard.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: dashboard.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Student\DashboardController::dashboard
 * @see app/Http/Controllers/Student/DashboardController.php:12
 * @route '/student/dashboard'
 */
dashboard.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: dashboard.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Student\DashboardController::dashboard
 * @see app/Http/Controllers/Student/DashboardController.php:12
 * @route '/student/dashboard'
 */
    const dashboardForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: dashboard.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Student\DashboardController::dashboard
 * @see app/Http/Controllers/Student/DashboardController.php:12
 * @route '/student/dashboard'
 */
        dashboardForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: dashboard.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Student\DashboardController::dashboard
 * @see app/Http/Controllers/Student/DashboardController.php:12
 * @route '/student/dashboard'
 */
        dashboardForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: dashboard.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    dashboard.form = dashboardForm
const student = {
    dashboard: Object.assign(dashboard, dashboard),
exams: Object.assign(exams, exams),
results: Object.assign(results, results),
}

export default student