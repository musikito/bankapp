'use client';
import Link from 'next/link';
import Image from "next/image";
import { sidebarLinks } from '@/constants';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';

/**
 * The SideBar component renders a sidebar navigation section with a logo link.
 *
 * @param {SiderbarProps} props - The props object containing the user data.
 * @param {User} props.user - The user data object.
 * @returns {JSX.Element} - The rendered sidebar section.
 */
const SideBar = ({ user }: SiderbarProps) => {
    const pathname = usePathname();
    return (
        <section className="sidebar">
            <nav className="flex flex-col gap-4">
                <Link href="/" className="mb-12 cursor-pointer flex items-center gap-2">
                    <Image
                        src="/icons/logo.svg"
                        width={34}
                        height={34}
                        alt="logo"
                        className="size-[24px] max-xl:size-14"
                    />
                    <h1 className="sidebar-logo">Horizon</h1>
                </Link>
                {sidebarLinks.map((link) => {
                    const isActive =
                        pathname === link.route || pathname.startsWith(`${link.route}/`);
                    return (
                        <Link
                            href={link.route}
                            key={link.label}
                            className={cn("sidebar-link", { "bg-bank-gradient": isActive })}
                        >
                            <div className="relative size-6">
                                <Image
                                    src={link.imgURL}
                                    alt={link.label}
                                    fill
                                    className={cn({ "brightness-[3]": isActive })}
                                />
                            </div>
                            <p className={cn("sidebar-label", { "!text-white": isActive })}>
                                {link.label}
                            </p>
                        </Link>
                    );
                })}
                {/** TODO IMPLEMENT USER */}
                USER
            </nav>
            {/** TODO IMPLEMENT FOOTER */}
            FOOTER
        </section>
    );
};

export default SideBar