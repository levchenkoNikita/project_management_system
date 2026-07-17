import config from "@/lib/utils/config";
import { getAuthToken } from "@/lib/utils/auth";
import type { UserProfile } from "@/lib/types/models";
import { clearUserProfile, setUserProfile } from "@/lib/utils/userProfile";

function authHeaders(): HeadersInit {
    const token = getAuthToken();
    return {
        "Content-Type": "application/json",
        Accept: "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
}

export async function getCurrentUser(): Promise<UserProfile> {
    const response = await fetch(`${config.api}/user`, {
        method: "GET",
        headers: authHeaders(),
    });

    if (!response.ok) {
        if (response.status === 401) {
            clearUserProfile();
        }
        throw new Error("Не удалось загрузить данные пользователя");
    }

    const data = await response.json();
    if (!data.user) {
        throw new Error("Сервер не вернул данные пользователя");
    }

    const user = data.user as UserProfile;
    setUserProfile(user);
    return user;
}
