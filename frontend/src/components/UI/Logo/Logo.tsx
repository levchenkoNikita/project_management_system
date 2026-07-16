import { HOME_ROUTE } from "@/lib/utils/consts"
import Link from "next/link"
import LogoIcon from "@/assets/icons/logo.svg";
import Image from "next/image";

export default function Logo() {

    return(
        <Link href={HOME_ROUTE} className="hover:opacity-80 duration-200">
            <Image src={LogoIcon} alt="Логотип" width={40} height={40}/>
        </Link>
    )
}