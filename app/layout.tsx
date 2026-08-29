import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/sections/Header";
import Footer from "@/components/sections/Footer";
import MobileBottomCTA from "@/components/sections/MobileBottomCTA";
import RegistrationModal from "@/components/forms/RegistrationModal";
import FreeEducationModal from "@/components/forms/FreeEducationModal";
import Lightbox from "@/components/ui/Lightbox";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "IT CENTER TO'RTO'L - Zamonaviy IT va kasb-hunar ta'lim markazi",
  description: "IT CENTER TO'RTO'L: Zamonaviy kasblarni o'rganing. Python, C++, web dasturlash, mobil dasturlash, kiberxavfsizlik, robototexnika, ingliz tili, buxgalteriya.",
  openGraph: {
    title: "IT CENTER TO'RTO'L - Zamonaviy IT va kasb-hunar ta'lim markazi",
    description: "To'rtko'ldagi yetakchi IT o'quv markazi. Kelajak kasblarini bugundan o'rganing.",
    type: "website",
    locale: "uz_UZ",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="uz" className={`${geistSans.variable} ${geistMono.variable} antialiased dark scroll-smooth`}>
      <body className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <MobileBottomCTA />
        <RegistrationModal />
        <FreeEducationModal />
        <Lightbox />
      </body>
    </html>
  );
}
