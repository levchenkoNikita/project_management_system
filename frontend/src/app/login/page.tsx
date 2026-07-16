import Link from "next/link";
import { REGISTRATION_ROUTE } from "@/lib/utils/consts";
import "@/styles/AuthForm.css";

export default function LoginPage() {
    return (
        <section className="auth-page">
            <form className="auth-form" noValidate>
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
                            className="auth-field__input"
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
                            className="auth-field__input"
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
        </section>
    );
}
