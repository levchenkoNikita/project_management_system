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
    | "done"
    | number;

export type Task = {
    id: number;
    project_id: number;
    title: string;
    description: string | null;
    status: TaskStatus;
    created_at?: string;
    updated_at?: string;
};

export const TASK_STATUS_LABELS: Record<string, string> = {
    to_do: "К выполнению",
    in_progress: "В работе",
    in_testing: "На тестировании",
    rejected: "Отклонена",
    done: "Готово",
    "0": "К выполнению",
    "1": "В работе",
    "2": "На тестировании",
    "3": "Отклонена",
    "4": "Готово",
};

const STATUS_NAME_TO_CODE: Record<string, number> = {
    to_do: 0,
    in_progress: 1,
    in_testing: 2,
    rejected: 3,
    done: 4,
};

export const TASK_STATUS_ORDER = [0, 1, 2, 3, 4] as const;

export function getTaskStatusLabel(status: TaskStatus): string {
    return TASK_STATUS_LABELS[String(status)] ?? String(status);
}

export function normalizeTaskStatus(status: TaskStatus): number {
    if (typeof status === "number" && !Number.isNaN(status)) {
        return status;
    }

    const asName = STATUS_NAME_TO_CODE[String(status)];
    if (asName !== undefined) return asName;

    const asNumber = Number(status);
    return Number.isNaN(asNumber) ? 0 : asNumber;
}

/** Valid next statuses according to backend Task.check_status */
export function getValidNextStatuses(current: TaskStatus): number[] {
    const code = normalizeTaskStatus(current);

    switch (code) {
        case 0:
            return [1];
        case 1:
            return [0, 2];
        case 2:
            return [3, 4];
        case 3:
            return [1];
        case 4:
            // Backend treats 0 as blank and allows the transition from done
            return [0];
        default:
            return [0, 1, 2, 3, 4];
    }
}
