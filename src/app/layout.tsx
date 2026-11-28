import type { Metadata } from "next";
import localFont from "next/font/local";
import { aboutData } from "@/data/about";
import "./globals.css";
import "./site-motion.css";
import { SiteMotion } from "@/components/animation/SiteMotion";
import { Header } from "@/components/header/Header";
import { Footer } from "@/components/footer/Footer";
import { CookieConsent } from "@/components/common/CookieConsent";

const involve = localFont({
  src: "../fonts/Involve-SemiBold.woff2",
  weight: "600",
  style: "normal",
  variable: "--font-involve",
  display: "swap",
});

const switzer = localFont({
  src: [
    {
      path: "../fonts/Switzer-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../fonts/Switzer-Semibold.woff2",
      weight: "600",
      style: "normal",
    },
  ],
  variable: "--font-switzer",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://vastuviharnepal.netlify.app"),
  title: `${aboutData.brandName} | ${aboutData.heading}`,
  description: aboutData.description,
  icons: {
    icon: aboutData.icons.favicon,
    apple: aboutData.icons.appIcon,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${involve.variable} ${switzer.variable}`}>
      <body>
        <Header />
        {children}
        <Footer />
        <CookieConsent />
        <SiteMotion />
      </body>
    </html>
  );
}