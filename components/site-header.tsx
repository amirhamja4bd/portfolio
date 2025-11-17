"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  const pathname = usePathname();
  const [activeSection, setActiveSection] = useState<string>("");

  useEffect(() => {
    // Only run on homepage
    if (pathname !== "/") {
      setActiveSection("");
      return;
    }

    // Small delay to ensure DOM is ready after navigation
    const timeoutId = setTimeout(() => {
      const observers = siteConfig.sections.map((section) => {
        const element = document.getElementById(section.id);
        if (!element) return null;

        const observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                setActiveSection(section.id);
              }
            });
          },
          {
            rootMargin: "-20% 0px -80% 0px",
            threshold: 0,
          }
        );

        observer.observe(element);
        return observer;
      });

      return () => {
        observers.forEach((observer) => observer?.disconnect());
      };
    }, 100);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [pathname]);

  return (
    <motion.header
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="sticky top-0 z-50 border-b border-border/60 backdrop-blur-xl"
    >
      <div className="container mx-auto flex h-16 items-center justify-between px-4 lg:px-8">
        <Link
          href="/"
          className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.3em]"
        >
          <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.6)]" />
          {siteConfig.name}
        </Link>
        <nav className="hidden items-center gap-8 md:flex">
          {siteConfig.sections.map((item) => (
            <a
              key={item.id}
              href={`/#${item.id}`}
              className={cn(
                "text-sm font-medium transition hover:text-foreground relative",
                activeSection === item.id
                  ? "text-emerald-400"
                  : "text-muted-foreground",
                pathname === "/" ? "" : "opacity-70"
              )}
            >
              {item.label}
              {activeSection === item.id && (
                <motion.span
                  layoutId="activeSection"
                  className="absolute -bottom-[17px] left-0 right-0 h-0.5 bg-emerald-400"
                  initial={false}
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button asChild variant="outline">
            <a href={siteConfig.mail}>Contact</a>
          </Button>
        </div>
      </div>
    </motion.header>
  );
}
