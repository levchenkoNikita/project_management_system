import Link from "next/link";
import { HOME_ROUTE } from "@/lib/utils/consts";
import "@/styles/ErrorPage.css";

export default function NotFound() {
    return (
        <section className="error-page">
            <div className="error-page__content">
                <p className="error-page__code">404</p>
                <h1 className="error-page__title">Страница не найдена</h1>
                <p className="error-page__subtitle">
                    Такой страницы не существует или она была перемещена.
                    Проверьте адрес или вернитесь на главную.
                </p>
                <div className="error-page__actions">
                    <Link href={HOME_ROUTE} className="error-page__cta">
                        На главную
                    </Link>
                </div>
            </div>
        </section>
    );
}
