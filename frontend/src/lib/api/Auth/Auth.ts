import config from "@/lib/utils/config";
import type { UserProfile } from "@/lib/types/models";

export type AuthUserPayload = {
    name?: string;
    email: string;
    password: string;
    password_confirmation?: string;
};

export type AuthSuccess = {
    ok: true;
    message: string;
    token?: string;
    user?: UserProfile;
};

export type AuthFailure = {
    ok: false;
    message: string;
    fieldErrors?: string[];
};

export type AuthResult = AuthSuccess | AuthFailure;

async function parseErrorMessage(response: Response): Promise<string> {
    try {
        const data = await response.json();
        if (Array.isArray(data.message)) {
            return data.message.join(". ");
        }
        if (typeof data.message === "string") {
            return data.message;
        }
        return "Произошла ошибка. Попробуйте ещё раз.";
    } catch {
        return "Произошла ошибка. Попробуйте ещё раз.";
    }
}

export async function loginRequest(
    email: string,
    password: string
): Promise<AuthResult> {
    const response = await fetch(`${config.api}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ user: { email, password } }),
    });

    if (!response.ok) {
        return {
            ok: false,
            message:
                response.status === 401
                    ? "Неверный email или пароль"
                    : await parseErrorMessage(response),
        };
    }

    const data = await response.json();
    return {
        ok: true,
        message: data.message || "Вход выполнен успешно",
        token: data.token,
    };
}

export async function registrationRequest(
    user: Required<Pick<AuthUserPayload, "name" | "email" | "password" | "password_confirmation">>
): Promise<AuthResult> {
    const response = await fetch(`${config.api}/registration`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ user }),
    });

    if (!response.ok) {
        const message = await parseErrorMessage(response);
        return {
            ok: false,
            message,
            fieldErrors: message.split(". ").filter(Boolean),
        };
    }

    const data = await response.json();
    return {
        ok: true,
        message: data.message || "Регистрация выполнена успешно",
        user: data.user
            ? {
                  id: data.user.id,
                  name: data.user.name,
                  email: data.user.email,
                  created_at: data.user.created_at,
                  updated_at: data.user.updated_at,
              }
            : undefined,
    };
}
