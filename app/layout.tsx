import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";

import { ThemeProvider } from "@/components/theme-provider";
import { BottomNav } from "@/components/bottom-nav";
import { Header } from "@/components/header";
import { OneSignalInit } from "@/components/onesignal-init";

export const metadata: Metadata = {
  title: "Masjid Al-Ikhlas",
  description: "Portal jamaah dan admin Masjid Al-Ikhlas",
  manifest: "/manifest.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body>
        <ThemeProvider>
          <Script
            src="https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.page.js"
            strategy="afterInteractive"
          />
          <OneSignalInit />
          <Header />
          <main className="mx-auto min-h-screen max-w-6xl px-4 pb-28 pt-6">
            {children}
          </main>
          <BottomNav />
        </ThemeProvider>
      </body>
    </html>
  );
}