import type { Metadata } from "next";
import { Inter, Space_Grotesk, JetBrains_Mono, Geist } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "COSMORA",
  description: "Explore the universe. Understand what you find. Experience it in the real world.",
};

import { Header } from "@/components/layout/header";
import { MobileNav } from "@/components/layout/mobile-nav";
import { AuthProvider } from "@/components/auth/auth-provider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn("dark", inter.variable, spaceGrotesk.variable, jetbrainsMono.variable, "font-sans", geist.variable)}
      suppressHydrationWarning
    >
      <body className="h-[100dvh] max-h-[100dvh] flex flex-col relative pb-20 sm:pb-24 lg:pb-0 selection:bg-accent/30 overflow-hidden">
        <AuthProvider>
          <Header />
          <main className="flex-1 flex flex-col w-full relative min-h-0 overflow-hidden">{children}</main>
          <MobileNav />
        </AuthProvider>
      </body>
    </html>
  );
}
