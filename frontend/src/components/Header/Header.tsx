import Link from "next/link";
import { cookies } from "next/headers";
import Logo from "../UI/Logo/Logo";
import {
    LOGIN_ROUTE,
    PROFILE_ROUTE,
    REGISTRATION_ROUTE,
    TOKEN_COOKIE_KEY,
} from "@/lib/utils/consts";
import "@/styles/Header.css";

function ProfileIcon() {
    return (
        <svg
            className="site-header__profile-icon"
            width="36"
            height="36"
            viewBox="0 0 40 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
        >
            <circle
                cx="20"
                cy="20"
                r="18.5"
                stroke="currentColor"
                strokeWidth="1.5"
            />
            <circle cx="20" cy="15" r="6" fill="currentColor" />
            <path
                d="M8.5 32.5C10.8 27.8 15 25 20 25C25 25 29.2 27.8 31.5 32.5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
            />
        </svg>
    );
}

export default async function Header() {
    const cookieStore = await cookies();
    const token = cookieStore.get(TOKEN_COOKIE_KEY)?.value;
    const authorized = Boolean(token && token.trim());

    return (
        <header className="site-header">
            <div className="container site-header__inner">
                <Logo />

                <div className="site-header__viewbar" aria-hidden="true" />

                <nav className="site-header__nav" aria-label="Аккаунт">
                    {authorized ? (
                        <Link
                            href={PROFILE_ROUTE}
                            className="site-header__profile"
                            aria-label="Профиль пользователя"
                            title="Профиль"
                        >
                            <ProfileIcon />
                        </Link>
                    ) : (
                        <>
                            <Link href={LOGIN_ROUTE} className="site-header__link">
                                Войти
                            </Link>
                            <Link
                                href={REGISTRATION_ROUTE}
                                className="site-header__link site-header__link--accent"
                            >
                                Регистрация
                            </Link>
                        </>
                    )}
                </nav>
            </div>
        </header>
    );
}
