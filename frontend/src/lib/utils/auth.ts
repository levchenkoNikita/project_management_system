import {
    TOKEN_COOKIE_KEY,
    TOKEN_MAX_AGE_SECONDS,
    TOKEN_STORAGE_KEY,
} from "@/lib/utils/consts";
import { clearUserProfile } from "@/lib/utils/userProfile";

export function setAuthToken(token: string): void {
    if (typeof window === "undefined") return;

    localStorage.setItem(TOKEN_STORAGE_KEY, token);
    document.cookie = [
        `${TOKEN_COOKIE_KEY}=${encodeURIComponent(token)}`,
        "path=/",
        `max-age=${TOKEN_MAX_AGE_SECONDS}`,
        "SameSite=Lax",
    ].join("; ");
    window.dispatchEvent(new Event("auth-change"));
}

export function getAuthToken(): string | null {
    if (typeof window === "undefined") return null;

    const fromStorage = localStorage.getItem(TOKEN_STORAGE_KEY);
    if (fromStorage) return fromStorage;

    const match = document.cookie
        .split("; ")
        .find((row) => row.startsWith(`${TOKEN_COOKIE_KEY}=`));

    if (!match) return null;

    return decodeURIComponent(match.split("=").slice(1).join("="));
}

export function clearAuthToken(): void {
    if (typeof window === "undefined") return;

    localStorage.removeItem(TOKEN_STORAGE_KEY);
    document.cookie = `${TOKEN_COOKIE_KEY}=; path=/; max-age=0; SameSite=Lax`;
    clearUserProfile();
    window.dispatchEvent(new Event("auth-change"));
}

export function hasAuthToken(): boolean {
    return Boolean(getAuthToken());
}
