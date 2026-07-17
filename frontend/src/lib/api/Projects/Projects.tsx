import config from "@/lib/utils/config";
import { getAuthToken } from "@/lib/utils/auth";
import type { Project } from "@/lib/types/models";

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
        if (typeof data.message === "string") return data.message;
        if (Array.isArray(data.message)) return data.message.join(". ");
    } catch {
        /* ignore */
    }
    return fallback;
}

export async function getProjects(): Promise<Project[]> {
    const response = await fetch(`${config.api}/projects`, {
        method: "GET",
        headers: authHeaders(),
    });

    if (!response.ok) {
        throw new Error(
            await readErrorMessage(response, "Не удалось загрузить проекты")
        );
    }

    const data = await response.json();
    return Array.isArray(data.projects) ? data.projects : [];
}

export async function createProject(title: string): Promise<Project> {
    const response = await fetch(`${config.api}/projects`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify({ title }),
    });

    if (!response.ok) {
        throw new Error(
            await readErrorMessage(response, "Не удалось создать проект")
        );
    }

    const data = await response.json();
    if (!data.project) {
        throw new Error("Сервер не вернул созданный проект");
    }

    return data.project as Project;
}

export async function updateProject(
    projectId: string | number,
    newTitle: string
): Promise<void> {
    const response = await fetch(`${config.api}/projects/${projectId}`, {
        method: "PATCH",
        headers: authHeaders(),
        body: JSON.stringify({ new_title: newTitle }),
    });

    if (!response.ok) {
        throw new Error(
            await readErrorMessage(response, "Не удалось обновить проект")
        );
    }
}

export async function deleteProject(projectId: string | number): Promise<void> {
    const response = await fetch(`${config.api}/projects/${projectId}`, {
        method: "DELETE",
        headers: authHeaders(),
    });

    if (!response.ok) {
        throw new Error(
            await readErrorMessage(response, "Не удалось удалить проект")
        );
    }
}
