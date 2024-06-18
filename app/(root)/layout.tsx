/**
 * The root layout component for the application.
 * It renders the sidebar and mobile navigation, and provides the main content area for the children components.
 * The logged-in user information is passed down to the sidebar and mobile navigation components.
 */
import MobileNav from "@/components/MobileNav";
import SideBar from "@/components/SideBar";
import Image from "next/image";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const loggedIn = {
    firstName: "Jose",
    lastName: "Marte",
    $id: "",
    email: "",
    userId: "",
    dwollaCustomerUrl: "",
    avatarUrl: "",
    username: "",
    isEmailVerified: false,
    isGithubConnected: false,
    isGoogleConnected: false,
    roles: [],
  };
  return (
    <main className="flex h-screen w-full font-inter">
      <SideBar user={loggedIn} />

      {/** Mobile navBar  */}
      <div className="flex size-full flex-col">
        <div className="root-layout">
          <Image src="/icons/logo.svg" alt="logo" width={30} height={30} />
          <MobileNav user={loggedIn} />
        </div>
        {children}
      </div>
      {/** Mobile navBar  */}
    </main>
  );
}
