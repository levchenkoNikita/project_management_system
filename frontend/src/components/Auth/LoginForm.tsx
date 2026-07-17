"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { loginRequest } from "@/lib/api/Auth/Auth";
import { getCurrentUser } from "@/lib/api/User/User";
import { setAuthToken } from "@/lib/utils/auth";
import { PROJECTS_ROUTE, REGISTRATION_ROUTE } from "@/lib/utils/consts";
import Alert from "@/components/UI/Alert/Alert";
import Loader from "@/components/UI/Loader/Loader";
import "@/styles/AuthForm.css";

type FormState = "idle" | "loading" | "success" | "error";

export default function LoginForm() {
    const router = useRouter();
    const [state, setState] = useState<FormState>("idle");
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [hasFieldError, setHasFieldError] = useState(false);

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setErrorMessage("");
        setHasFieldError(false);
        setState("loading");

        const formData = new FormData(event.currentTarget);
        const email = String(formData.get("email") || "").trim();
        const password = String(formData.get("password") || "");

        try {
            const result = await loginRequest(email, password);

            if (!result.ok || !result.token) {
                setHasFieldError(true);
                setErrorMessage(
                    result.ok
                        ? "Сервер не вернул токен авторизации"
                        : result.message
                );
                setState("error");
                return;
            }

            setAuthToken(result.token);
            await getCurrentUser().catch(() => undefined);
            router.refresh();
            setSuccessMessage("Вход выполнен успешно");
            setState("success");
        } catch {
            setHasFieldError(true);
            setErrorMessage("Не удалось связаться с сервером. Попробуйте позже.");
            setState("error");
        }
    }

    return (
        <section className="auth-page">
            {errorMessage ? (
                <Alert
                    message={errorMessage}
                    variant="error"
                    onClose={() => setErrorMessage("")}
                />
            ) : null}
            {state === "success" && successMessage ? (
                <Alert message={successMessage} variant="success" />
            ) : null}

            {state === "loading" ? (
                <div className="auth-form auth-form--status">
                    <Loader label="Выполняется вход..." />
                </div>
            ) : null}

            {state === "success" ? (
                <div className="auth-form auth-form--status">
                    <div className="auth-form__header">
                        <h1 className="auth-form__title">Вы вошли</h1>
                        <p className="auth-form__subtitle">
                            Авторизация прошла успешно. Можно перейти к проектам.
                        </p>
                    </div>
                    <Link href={PROJECTS_ROUTE} className="auth-form__submit auth-form__submit--link">
                        Перейти к проектам
                    </Link>
                </div>
            ) : null}

            {state === "idle" || state === "error" ? (
                <form className="auth-form" noValidate onSubmit={handleSubmit}>
                    <div className="auth-form__header">
                        <h1 className="auth-form__title">Вход</h1>
                        <p className="auth-form__subtitle">
                            С возвращением. Введите данные, чтобы продолжить.
                        </p>
                    </div>

                    <div className="auth-form__fields">
                        <label className="auth-field">
                            <span className="auth-field__label">Email</span>
                            <input
                                className={`auth-field__input${hasFieldError ? " auth-field__input--error" : ""}`}
                                type="email"
                                name="email"
                                autoComplete="email"
                                placeholder="you@example.com"
                                required
                            />
                        </label>

                        <label className="auth-field">
                            <span className="auth-field__label">Пароль</span>
                            <input
                                className={`auth-field__input${hasFieldError ? " auth-field__input--error" : ""}`}
                                type="password"
                                name="password"
                                autoComplete="current-password"
                                placeholder="••••••••"
                                required
                            />
                        </label>
                    </div>

                    <button type="submit" className="auth-form__submit">
                        Войти
                    </button>

                    <p className="auth-form__switch">
                        Нет аккаунта?{" "}
                        <Link href={REGISTRATION_ROUTE} className="auth-form__link">
                            Зарегистрироваться
                        </Link>
                    </p>
                </form>
            ) : null}
        </section>
    );
}
