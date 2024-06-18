'use client'
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { sidebarLinks } from "@/constants"
import { cn } from "@/lib/utils"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"


const MobileNav = ({ user }: MobileNavProps) => {
    const pathname = usePathname();
    return (
        <section className="w-fulll max-w-[264px]">
            <Sheet>
                <SheetTrigger>
                    <Image
                        src="/icons/hamburger.svg"
                        width={30}
                        height={30}
                        alt="menu"
                        className="cursor-pointer"
                    />
                </SheetTrigger>
                <SheetContent side="left" className="border-none bg-white">
                    <Link href="/" className="mb-12 cursor-pointer flex items-center gap-2">
                        <Image
                            src="/icons/logo.svg"
                            width={34}
                            height={34}
                            alt="logo"
                        />
                        <h1 className="text-26 font-ibm-plex-serif font-bold text-black-1">Horizon</h1>
                    </Link>
                    {/* Side bar links*/}
                    <div className="mobilenav-sheets">
                        <SheetClose asChild>
                            <nav className="flex h-full flex-col gap-6 pt-16 text-white">
                                {sidebarLinks.map((link) => {
                                    const isActive =
                                        pathname === link.route || pathname.startsWith(`${link.route}/`);
                                    return (
                                        <SheetClose asChild key={link.label}>
                                            <Link
                                                href={link.route}
                                                key={link.label}
                                                className={cn("mobilenav-sheet_close w-full", { "bg-bank-gradient": isActive })}
                                            >

                                                <Image
                                                    src={link.imgURL}
                                                    alt={link.label}
                                                    width={20}
                                                    height={20}
                                                    className={cn({ "brightness-[3] invert-0": isActive })}
                                                />

                                                <p className={cn("test-16 font-semibold text-black-2", { "text-white": isActive })}>
                                                    {link.label}
                                                </p>
                                            </Link>
                                        </SheetClose>

                                    );
                                })}
                {/** TODO IMPLEMENT USER */}
                USER
                            </nav>
                        </SheetClose>
            {/** TODO IMPLEMENT FOOTER */}
            FOOTER
                    </div>
                </SheetContent>
            </Sheet>

        </section>
    )
}

export default MobileNav