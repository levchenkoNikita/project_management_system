export type Project = {
    id: number;
    title: string;
    user_id: number;
    created_at?: string;
    updated_at?: string;
};

export type UserProfile = {
    id: number;
    name: string;
    email: string;
    created_at?: string;
    updated_at?: string;
};

export type TaskStatus =
    | "to_do"
    | "in_progress"
    | "in_testing"
    | "rejected"
    | "done";

export type Task = {
    id: number;
    project_id: number;
    title: string;
    description: string | null;
    status: TaskStatus;
    created_at?: string;
    updated_at?: string;
};

export const TASK_STATUS_TO_DO: TaskStatus = "to_do";
export const TASK_STATUS_IN_PROGRESS: TaskStatus = "in_progress";
export const TASK_STATUS_IN_TESTING: TaskStatus = "in_testing";
export const TASK_STATUS_REJECTED: TaskStatus = "rejected";
export const TASK_STATUS_DONE: TaskStatus = "done";

export const TASK_STATUS_ORDER: TaskStatus[] = [
    TASK_STATUS_TO_DO,
    TASK_STATUS_IN_PROGRESS,
    TASK_STATUS_IN_TESTING,
    TASK_STATUS_REJECTED,
    TASK_STATUS_DONE,
];

export const TASK_STATUS_LABELS: Record<TaskStatus, string> = {
    to_do: "К выполнению",
    in_progress: "В работе",
    in_testing: "На тестировании",
    rejected: "Отклонена",
    done: "Готово",
};

const STATUS_ALIASES: Record<string, TaskStatus> = {
    to_do: "to_do",
    in_progress: "in_progress",
    in_testing: "in_testing",
    rejected: "rejected",
    done: "done",
    "0": "to_do",
    "1": "in_progress",
    "2": "in_testing",
    "3": "rejected",
    "4": "done",
};

export function normalizeTaskStatus(status: TaskStatus | string | number): TaskStatus {
    const mapped = STATUS_ALIASES[String(status)];
    return mapped ?? TASK_STATUS_TO_DO;
}

export function getTaskStatusLabel(status: TaskStatus | string | number): string {
    const normalized = normalizeTaskStatus(status);
    return TASK_STATUS_LABELS[normalized] ?? String(status);
}

/** Valid next statuses according to backend Task.check_status */
export function getValidNextStatuses(
    current: TaskStatus | string | number
): TaskStatus[] {
    const code = normalizeTaskStatus(current);

    switch (code) {
        case TASK_STATUS_TO_DO:
            return [TASK_STATUS_IN_PROGRESS];
        case TASK_STATUS_IN_PROGRESS:
            return [TASK_STATUS_TO_DO, TASK_STATUS_IN_TESTING];
        case TASK_STATUS_IN_TESTING:
            return [TASK_STATUS_REJECTED, TASK_STATUS_DONE];
        case TASK_STATUS_REJECTED:
            return [TASK_STATUS_IN_PROGRESS];
        case TASK_STATUS_DONE:
            return [TASK_STATUS_TO_DO];
        default:
            return [...TASK_STATUS_ORDER];
    }
}
