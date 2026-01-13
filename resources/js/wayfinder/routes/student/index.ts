import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../wayfinder'
import exams from './exams'
/**
* @see \App\Http\Controllers\Student\DashboardController::dashboard
 * @see app/Http/Controllers/Student/DashboardController.php:11
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
 * @see app/Http/Controllers/Student/DashboardController.php:11
 * @route '/student/dashboard'
 */
dashboard.url = (options?: RouteQueryOptions) => {
    return dashboard.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Student\DashboardController::dashboard
 * @see app/Http/Controllers/Student/DashboardController.php:11
 * @route '/student/dashboard'
 */
dashboard.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: dashboard.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Student\DashboardController::dashboard
 * @see app/Http/Controllers/Student/DashboardController.php:11
 * @route '/student/dashboard'
 */
dashboard.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: dashboard.url(options),
    method: 'head',
})
const student = {
    dashboard: Object.assign(dashboard, dashboard),
exams: Object.assign(exams, exams),
}

export default student