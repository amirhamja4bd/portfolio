import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import { AnimatedBackground } from "@/components/animated-background";
import { QueryProvider } from "@/components/providers/query-provider";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Amir Hamza • Software Engineer & Technical Writer",
  description:
    "High-performance portfolio, blog, and admin dashboard powered by Next.js, MongoDB, and Editor.js.",
  icons: {
    icon: "/favicon.ico",
  },
  metadataBase: new URL("https://example.com"),
  openGraph: {
    title: "Amir Hamza • Software Engineer & Technical Writer",
    description:
      "Explore projects, technical writing, skills, and insights from a senior software engineer.",
    url: "https://example.com",
    siteName: "Amir Hamza Portfolio",
    images: [
      {
        url: "/api/og",
        width: 1200,
        height: 630,
        alt: "Amir Hamza Portfolio",
      },
    ],
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({
  children,
  modal,
}: Readonly<{
  children: React.ReactNode;
  modal?: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} relative min-h-screen overflow-x-hidden bg-background font-sans text-foreground antialiased`}
      >
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <QueryProvider>
            {/* <StartupLoader minimumDuration={1500} /> */}
            <div className="fixed inset-0 -z-10">
              <AnimatedBackground />
              <div className="absolute inset-0 bg-linear-to-b from-background via-background/60 to-background" />
            </div>
            <div className="relative flex min-h-screen flex-col">
              <SiteHeader />
              <main className="flex-1">
                <div className="container mx-auto px-4 pb-16 pt-10 lg:px-8">
                  {children}
                </div>
              </main>
              <SiteFooter />
            </div>
            {modal}
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
