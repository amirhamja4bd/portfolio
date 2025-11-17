import Link from "next/link";

import { siteConfig } from "@/config/site";

const footerLinks = [
  { label: "GitHub", href: siteConfig.github },
  { label: "LinkedIn", href: siteConfig.linkedin },
  { label: "Resume", href: siteConfig.resume },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-border/60 bg-background/60 backdrop-blur">
      <div className="container mx-auto flex flex-col gap-6 px-4 py-8 text-sm text-muted-foreground lg:px-8 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="font-medium text-foreground">{siteConfig.name}</p>
          <p className="max-w-xl text-muted-foreground/80">
            Building resilient systems, teams, and stories that help developers
            ship faster.
          </p>
        </div>
        <div className="flex flex-col gap-3 text-muted-foreground/80 md:flex-row md:items-center md:gap-6">
          {footerLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="transition hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </div>
        <p className="text-xs text-muted-foreground/70">
          © {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
