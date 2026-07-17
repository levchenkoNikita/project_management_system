export const HOME_ROUTE: string = '/';
export const PROJECTS_ROUTE: string = '/projects';
export const REGISTRATION_ROUTE: string = '/registration';
export const LOGIN_ROUTE: string = '/login';
export const UNAUTHORIZED_ROUTE: string = '/unauthorized';
export const PROFILE_ROUTE: string = '/profile';
export const TOKEN_COOKIE_KEY: string = 'auth_token';
export const TOKEN_STORAGE_KEY: string = 'auth_token';
export const TOKEN_MAX_AGE_SECONDS: number = 60 * 60;

export function tasksRoute(projectId: string | number): string {
    return `${PROJECTS_ROUTE}/${projectId}/tasks`;
}

export function taskRoute(projectId: string | number, taskId: string | number): string {
    return `${PROJECTS_ROUTE}/${projectId}/tasks/${taskId}`;
}
