"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  const pathname = usePathname();
  const [activeSection, setActiveSection] = useState<string>("");
  const [resumeUrl, setResumeUrl] = useState<string>("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Fetch primary resume URL
  useEffect(() => {
    const fetchResumeUrl = async () => {
      try {
        const response = await fetch("/api/settings");
        if (response.ok) {
          const result = await response.json();
          const primaryResume = result.data?.resumes?.find(
            (r: any) => r.isPrimary
          );
          if (primaryResume) {
            setResumeUrl(primaryResume.resumeUrl);
          }
        }
      } catch (error) {
        console.error("Failed to fetch resume:", error);
      }
    };
    fetchResumeUrl();
  }, []);

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

  // Prevent scrolling when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen]);

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
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <span className="h-2 w-2 rounded-full bg-brand shadow-[0_0_12px_rgba(52,211,153,0.6)]" />
          {siteConfig.name}
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-8 md:flex">
          {siteConfig.sections.map((item) => (
            <a
              key={item.id}
              href={`/#${item.id}`}
              className={cn(
                "text-sm font-medium transition hover:text-foreground relative",
                activeSection === item.id
                  ? "text-brand"
                  : "text-muted-foreground",
                pathname === "/" ? "" : "opacity-70"
              )}
            >
              {item.label}
              {activeSection === item.id && (
                <motion.span
                  layoutId="activeSection"
                  className="absolute -bottom-[17px] left-0 right-0 h-0.5 bg-brand"
                  initial={false}
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <div className="hidden md:flex items-center gap-2">
            {/* <ThemeToggle type="circle-blur" /> */}
            {resumeUrl ? (
              <Button asChild variant="outline">
                <a href={resumeUrl} target="_blank" rel="noopener noreferrer">
                  Resume
                </a>
              </Button>
            ) : (
              <Button variant="outline" disabled>
                Resume
              </Button>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "100vh" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="fixed inset-0 top-16 z-40 bg-background/95 backdrop-blur-xl md:hidden"
          >
            <div className="container mx-auto flex flex-col gap-6 p-8">
              <nav className="flex flex-col gap-6">
                {siteConfig.sections.map((item, index) => (
                  <motion.a
                    key={item.id}
                    href={`/#${item.id}`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={cn(
                      "text-lg font-medium transition-colors hover:text-brand",
                      activeSection === item.id
                        ? "text-brand"
                        : "text-muted-foreground"
                    )}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.label}
                  </motion.a>
                ))}
              </nav>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex flex-col gap-4 pt-6 border-t"
              >
                {/* <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Theme</span>
                  <ThemeToggle type="circle-blur" />
                </div> */}
                {resumeUrl ? (
                  <Button asChild className="w-full">
                    <a
                      href={resumeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Resume
                    </a>
                  </Button>
                ) : (
                  <Button className="w-full" disabled>
                    Resume
                  </Button>
                )}
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
