import Link from "next/link";
import Logo from "../UI/Logo/Logo";
import { LOGIN_ROUTE, REGISTRATION_ROUTE } from "@/lib/utils/consts";

export default function Header() {

    return(
        <header className="shrink-0 border-b border-accent py-10">
            <div className="container flex items-center justify-between">
                {/* Логотип */}
                <Logo />

                {/* ViewBar для красоты */}
                <div className="h-30 w-352 rounded-2xl border border-accent">

                </div>

                {/* Регистрация и аутентификация */}
                <div className="flex items-center gap-x-10">
                    <Link href={LOGIN_ROUTE} className="hover:text-accent2 duration-200">
                        Войти
                    </Link>
                    <Link href={REGISTRATION_ROUTE} className="hover:text-accent2 duration-200">
                        Регистрация
                    </Link>
                </div>
            </div>
        </header>
    )
}