import Link from "next/link";
import { PROJECTS_ROUTE } from "@/lib/utils/consts";
import "@/styles/HomePage.css";

export default function Home() {
    return (
        <section className="home-page">
            <div className="home-page__content">
                <p className="home-page__brand">Система управления проектами</p>
                <h1 className="home-page__title">
                    Организуйте работу.
                    <br />
                    Добейтесь большего.
                </h1>
                <p className="home-page__subtitle">
                    Проекты, задачи и прогресс — в одном месте: прозрачно,
                    удобно и всегда под рукой.
                </p>
                <Link href={PROJECTS_ROUTE} className="home-page__cta">
                    Мои проекты
                </Link>
            </div>
        </section>
    );
}
