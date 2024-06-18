/**
 * The root layout component for the Horizon Bank application.
 * This component sets up the HTML structure and applies the necessary font styles.
 *
 * @param {Readonly<{ children: React.ReactNode }>} props - The props passed to the component.
 * @returns {JSX.Element} The rendered HTML structure for the root layout.
 */
import type { Metadata } from "next";
import { Inter, IBM_Plex_Serif } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const ibmPlexSerif = IBM_Plex_Serif({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-ibm-plex-serif",
});

export const metadata: Metadata = {
  title: "Horizon Bank",
  description: "Modern banking for a modern World",
  icons: { icon: "/icons/logo.svg" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${ibmPlexSerif.variable}`}>
        {children}
      </body>
    </html>
  );
}
