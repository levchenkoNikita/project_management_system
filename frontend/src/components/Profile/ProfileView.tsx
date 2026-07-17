"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getCurrentUser } from "@/lib/api/User/User";
import type { UserProfile } from "@/lib/types/models";
import { getUserProfile } from "@/lib/utils/userProfile";
import { HOME_ROUTE, PROJECTS_ROUTE } from "@/lib/utils/consts";
import Loader from "@/components/UI/Loader/Loader";
import "@/styles/ProfilePage.css";

function formatDate(value?: string): string {
    if (!value) return "—";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return date.toLocaleString("ru-RU", {
        day: "2-digit",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
}

export default function ProfileView() {
    const [user, setUser] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const cached = getUserProfile();
        if (cached) {
            setUser(cached);
        }

        let cancelled = false;

        async function load() {
            setLoading(true);
            setError("");
            try {
                const data = await getCurrentUser();
                if (!cancelled) {
                    setUser(data);
                }
            } catch (err) {
                if (!cancelled) {
                    if (!cached) {
                        setError(
                            err instanceof Error
                                ? err.message
                                : "Не удалось загрузить профиль"
                        );
                    }
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        }

        void load();
        return () => {
            cancelled = true;
        };
    }, []);

    return (
        <section className="profile-page">
            <div className="container profile-page__inner">
                {loading && !user ? (
                    <div className="profile-page__loader">
                        <Loader label="Загружаем профиль..." />
                    </div>
                ) : null}

                {error && !user ? (
                    <div className="profile-page__empty">
                        <h1 className="profile-page__title">Профиль</h1>
                        <p className="profile-page__error">{error}</p>
                        <Link href={HOME_ROUTE} className="profile-page__cta">
                            На главную
                        </Link>
                    </div>
                ) : null}

                {user ? (
                    <>
                        <p className="profile-page__eyebrow">Аккаунт</p>
                        <h1 className="profile-page__title">Профиль</h1>
                        <p className="profile-page__subtitle">
                            Информация о вашем аккаунте (только просмотр).
                        </p>

                        <div className="profile-card">
                            <div className="profile-card__row">
                                <span className="profile-card__label">ID</span>
                                <span className="profile-card__value">
                                    {user.id}
                                </span>
                            </div>
                            <div className="profile-card__row">
                                <span className="profile-card__label">Имя</span>
                                <span className="profile-card__value">
                                    {user.name}
                                </span>
                            </div>
                            <div className="profile-card__row">
                                <span className="profile-card__label">Email</span>
                                <span className="profile-card__value">
                                    {user.email}
                                </span>
                            </div>
                            <div className="profile-card__row">
                                <span className="profile-card__label">
                                    Создан
                                </span>
                                <span className="profile-card__value">
                                    {formatDate(user.created_at)}
                                </span>
                            </div>
                            <div className="profile-card__row">
                                <span className="profile-card__label">
                                    Обновлён
                                </span>
                                <span className="profile-card__value">
                                    {formatDate(user.updated_at)}
                                </span>
                            </div>
                        </div>

                        <div className="profile-page__actions">
                            <Link
                                href={PROJECTS_ROUTE}
                                className="profile-page__cta"
                            >
                                К проектам
                            </Link>
                        </div>
                    </>
                ) : null}
            </div>
        </section>
    );
}
