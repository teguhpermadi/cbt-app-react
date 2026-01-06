import { usePage } from '@inertiajs/react';

export function usePermission() {
    const { auth } = usePage().props as any;
    const { permissions, roles } = auth;

    /**
     * Check if user has a specific permission
     */
    const can = (permissionName: string): boolean => {
        return permissions?.includes(permissionName);
    };

    /**
     * Check if user has a specific role
     */
    const hasRole = (roleName: string): boolean => {
        return roles?.includes(roleName);
    };

    /**
     * Check if user has any of the given values (roles or permissions)
     */
    const hasAny = (values: string[], type: 'role' | 'permission' = 'permission'): boolean => {
        const source = type === 'role' ? roles : permissions;
        return values.some((value) => source?.includes(value));
    };

    return { can, hasRole, hasAny, roles, permissions };
}
