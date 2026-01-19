import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import { QueryProvider } from "@/components/providers/query-provider";
import { ThemeProvider } from "@/components/providers/theme-provider";
import ScrollProgress from "@/components/seroll/scroll";
import { SettingsDrawer } from "@/components/settings-drawer";
import { Toaster } from "@/components/ui/sonner";
import { SettingsProvider } from "@/contexts/settings-context";
import type { Metadata } from "next";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Amir Hamza • Software Engineer",
    template: "%s | Amir Hamza",
  },
  description:
    "High-performance portfolio, blog, and admin dashboard powered by Next.js, MongoDB, and Editor.js.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;500;600;700;800&family=Inter:wght@300;400;500;600;700;800&family=Poppins:wght@300;400;500;600;700;800&family=Roboto:wght@300;400;500;700;900&family=Montserrat:wght@300;400;500;600;700;800&family=Playfair+Display:wght@400;500;600;700;800&family=Lora:wght@400;500;600;700&family=Raleway:wght@300;400;500;600;700;800&family=Source+Sans+3:wght@300;400;500;600;700;800&family=Work+Sans:wght@300;400;500;600;700;800&family=DM+Sans:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} relative min-h-screen overflow-x-hidden bg-background font-sans text-foreground antialiased`}
      >
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <SettingsProvider>
            <QueryProvider>
              {children}
              <Toaster />

              <div className="hidden">
                <SettingsDrawer />
              </div>
              <ScrollProgress />
            </QueryProvider>
          </SettingsProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
