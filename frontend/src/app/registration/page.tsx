import Link from "next/link";
import { LOGIN_ROUTE } from "@/lib/utils/consts";
import "@/styles/AuthForm.css";

export default function RegistrationPage() {
    return (
        <section className="auth-page">
            <form className="auth-form auth-form--register" noValidate>
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
                            className="auth-field__input"
                            type="text"
                            name="name"
                            autoComplete="name"
                            placeholder="Ваше имя"
                            required
                        />
                    </label>

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
                            autoComplete="new-password"
                            placeholder="••••••••"
                            required
                        />
                    </label>

                    <label className="auth-field">
                        <span className="auth-field__label">Подтвердите пароль</span>
                        <input
                            className="auth-field__input"
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
        </section>
    );
}
