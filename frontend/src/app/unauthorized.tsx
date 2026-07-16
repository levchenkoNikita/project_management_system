import Link from "next/link";
import { HOME_ROUTE, LOGIN_ROUTE } from "@/lib/utils/consts";
import "@/styles/ErrorPage.css";

export default function Unauthorized() {
    return (
        <section className="error-page">
            <div className="error-page__content">
                <p className="error-page__code">401</p>
                <h1 className="error-page__title">Вы не авторизованы</h1>
                <p className="error-page__subtitle">
                    Чтобы открыть эту страницу, войдите в аккаунт
                    или зарегистрируйтесь.
                </p>
                <div className="error-page__actions">
                    <Link href={LOGIN_ROUTE} className="error-page__cta">
                        Войти
                    </Link>
                    <Link
                        href={HOME_ROUTE}
                        className="error-page__cta error-page__cta--ghost"
                    >
                        На главную
                    </Link>
                </div>
            </div>
        </section>
    );
}
