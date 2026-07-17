"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { loginRequest, registrationRequest } from "@/lib/api/Auth/Auth";
import { getCurrentUser } from "@/lib/api/User/User";
import { setAuthToken } from "@/lib/utils/auth";
import { setUserProfile } from "@/lib/utils/userProfile";
import { LOGIN_ROUTE, PROJECTS_ROUTE } from "@/lib/utils/consts";
import Alert from "@/components/UI/Alert/Alert";
import Loader from "@/components/UI/Loader/Loader";
import "@/styles/AuthForm.css";

type FormState = "idle" | "loading" | "success" | "error";

export default function RegistrationForm() {
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
        const name = String(formData.get("name") || "").trim();
        const email = String(formData.get("email") || "").trim();
        const password = String(formData.get("password") || "");
        const passwordConfirmation = String(
            formData.get("password_confirmation") || ""
        );

        if (password !== passwordConfirmation) {
            setHasFieldError(true);
            setErrorMessage("Пароли не совпадают");
            setState("error");
            return;
        }

        try {
            const registration = await registrationRequest({
                name,
                email,
                password,
                password_confirmation: passwordConfirmation,
            });

            if (!registration.ok) {
                setHasFieldError(true);
                setErrorMessage(registration.message);
                setState("error");
                return;
            }

            if (registration.user) {
                setUserProfile(registration.user);
            }

            const login = await loginRequest(email, password);
            if (login.ok && login.token) {
                setAuthToken(login.token);
                await getCurrentUser().catch(() => undefined);
                router.refresh();
            }

            setSuccessMessage("Регистрация выполнена успешно");
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
                <div className="auth-form auth-form--register auth-form--status">
                    <Loader label="Создаём аккаунт..." />
                </div>
            ) : null}

            {state === "success" ? (
                <div className="auth-form auth-form--register auth-form--status">
                    <div className="auth-form__header">
                        <h1 className="auth-form__title">Аккаунт создан</h1>
                        <p className="auth-form__subtitle">
                            Регистрация прошла успешно. Можно перейти к проектам.
                        </p>
                    </div>
                    <Link href={PROJECTS_ROUTE} className="auth-form__submit auth-form__submit--link">
                        Перейти к проектам
                    </Link>
                    <p className="auth-form__switch">
                        Или{" "}
                        <Link href={LOGIN_ROUTE} className="auth-form__link">
                            войти снова
                        </Link>
                    </p>
                </div>
            ) : null}

            {state === "idle" || state === "error" ? (
                <form
                    className="auth-form auth-form--register"
                    noValidate
                    onSubmit={handleSubmit}
                >
                    <div className="auth-form__header">
                        <h1 className="auth-form__title">Регистрация</h1>
                        <p className="auth-form__subtitle">
                            Создайте аккаунт, чтобы начать управлять проектами.
                        </p>
                    </div>

                    <div className="auth-form__fields">
                        <label className="auth-field">
                            <span className="auth-field__label">Имя</span>
                            <input
                                className={`auth-field__input${hasFieldError ? " auth-field__input--error" : ""}`}
                                type="text"
                                name="name"
                                autoComplete="name"
                                placeholder="Ваше имя"
                                required
                                minLength={6}
                                maxLength={20}
                            />
                        </label>

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
                                autoComplete="new-password"
                                placeholder="••••••••"
                                required
                            />
                        </label>

                        <label className="auth-field">
                            <span className="auth-field__label">Подтвердите пароль</span>
                            <input
                                className={`auth-field__input${hasFieldError ? " auth-field__input--error" : ""}`}
                                type="password"
                                name="password_confirmation"
                                autoComplete="new-password"
                                placeholder="••••••••"
                                required
                            />
                        </label>
                    </div>

                    <button type="submit" className="auth-form__submit">
                        Создать аккаунт
                    </button>

                    <p className="auth-form__switch">
                        Уже есть аккаунт?{" "}
                        <Link href={LOGIN_ROUTE} className="auth-form__link">
                            Войти
                        </Link>
                    </p>
                </form>
            ) : null}
        </section>
    );
}
