import config from "@/lib/utils/config";
import { getAuthToken } from "@/lib/utils/auth";
import type { Task } from "@/lib/types/models";

export type TaskPayload = {
    status: string;
    title: string;
    description: string;
};

function authHeaders(): HeadersInit {
    const token = getAuthToken();
    return {
        "Content-Type": "application/json",
        Accept: "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
}

async function readErrorMessage(
    response: Response,
    fallback: string
): Promise<string> {
    try {
        const data = await response.json();
        if (typeof data.message === "string") {
            if (data.message === "Status is not valid") {
                return "Недопустимый переход статуса. Выберите следующий статус по процессу.";
            }
            return data.message;
        }
        if (Array.isArray(data.message)) return data.message.join(". ");
    } catch {
        /* ignore */
    }
    return fallback;
}

export async function getTasks(projectId: string | number): Promise<Task[]> {
    const response = await fetch(`${config.api}/projects/${projectId}/tasks`, {
        method: "GET",
        headers: authHeaders(),
    });

    if (response.status === 400) {
        return [];
    }

    if (!response.ok) {
        throw new Error(
            await readErrorMessage(response, "Не удалось загрузить задачи")
        );
    }

    const data = await response.json();
    return Array.isArray(data.tasks) ? data.tasks : [];
}

export async function getTask(
    projectId: string | number,
    taskId: string | number
): Promise<Task> {
    const response = await fetch(
        `${config.api}/projects/${projectId}/tasks/${taskId}`,
        {
            method: "GET",
            headers: authHeaders(),
        }
    );

    if (!response.ok) {
        throw new Error(
            await readErrorMessage(response, "Не удалось загрузить задачу")
        );
    }

    const data = await response.json();
    if (!data.task) {
        throw new Error("Сервер не вернул задачу");
    }

    return data.task as Task;
}

export async function createTask(
    projectId: string | number,
    payload: TaskPayload
): Promise<Task> {
    const response = await fetch(`${config.api}/projects/${projectId}/tasks`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify({ task: payload }),
    });

    if (!response.ok) {
        throw new Error(
            await readErrorMessage(response, "Не удалось создать задачу")
        );
    }

    const data = await response.json();
    if (!data.task) {
        throw new Error("Сервер не вернул созданную задачу");
    }

    return data.task as Task;
}

export async function updateTask(
    projectId: string | number,
    taskId: string | number,
    payload: TaskPayload
): Promise<void> {
    const response = await fetch(
        `${config.api}/projects/${projectId}/tasks/${taskId}`,
        {
            method: "PATCH",
            headers: authHeaders(),
            body: JSON.stringify({ task: payload }),
        }
    );

    if (!response.ok) {
        throw new Error(
            await readErrorMessage(response, "Не удалось обновить задачу")
        );
    }
}

export async function deleteTask(
    projectId: string | number,
    taskId: string | number
): Promise<void> {
    const response = await fetch(
        `${config.api}/projects/${projectId}/tasks/${taskId}`,
        {
            method: "DELETE",
            headers: authHeaders(),
        }
    );

    if (!response.ok) {
        throw new Error(
            await readErrorMessage(response, "Не удалось удалить задачу")
        );
    }
}
