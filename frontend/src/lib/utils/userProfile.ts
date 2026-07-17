import type { UserProfile } from "@/lib/types/models";

export const USER_STORAGE_KEY = "auth_user";

export function setUserProfile(user: UserProfile): void {
    if (typeof window === "undefined") return;
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
}

export function getUserProfile(): UserProfile | null {
    if (typeof window === "undefined") return null;

    try {
        const raw = localStorage.getItem(USER_STORAGE_KEY);
        if (!raw) return null;
        return JSON.parse(raw) as UserProfile;
    } catch {
        return null;
    }
}

export function clearUserProfile(): void {
    if (typeof window === "undefined") return;
    localStorage.removeItem(USER_STORAGE_KEY);
}
