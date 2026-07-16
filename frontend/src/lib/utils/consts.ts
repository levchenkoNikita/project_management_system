export const HOME_ROUTE: string = '/';
export const PROJECTS_ROUTE: string = '/projects';
export const TASKS_ROUTE: string = `${PROJECTS_ROUTE}/:id/tasks`;
export const TASK_ROUTE: string = `${PROJECTS_ROUTE}/:project_id/tasks/:id`;
export const REGISTRATION_ROUTE: string = '/registration';
export const LOGIN_ROUTE: string = '/login';