"use client";

import DynamicIcon from "@/components/dynamic-icon/DynamicIcon";
import { motion } from "framer-motion";
import { Github, Linkedin, Mail } from "lucide-react";
import React, { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { HeroData } from "@/types/hero";
import HeroSkeleton from "../skeleton/HeroSkeleton";

// Icon mapping for social links
const iconMap = {
  Github,
  Linkedin,
  Mail,
};

export function HeroSection() {
  const [heroData, setHeroData] = useState<HeroData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [settings, setSettings] = useState<any>(null);

  useEffect(() => {
    // fetch hero and settings in parallel
    const fetchAll = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const [heroResp, settingsResp] = await Promise.all([
          fetch("/api/hero"),
          fetch("/api/settings"),
        ]);

        if (heroResp.ok) {
          const heroJson = await heroResp.json();
          if (heroJson.success && heroJson.data) setHeroData(heroJson.data);
        }

        if (settingsResp.ok) {
          const settingsJson = await settingsResp.json();
          if (settingsJson.success && settingsJson.data)
            setSettings(settingsJson.data);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : String(err));
      } finally {
        setIsLoading(false);
      }
    };

    fetchAll();
  }, []);

  // Loading state
  if (isLoading) {
    return <HeroSkeleton />;
  }

  // Error state
  if (error || !heroData) {
    return "Hero data not found";
    // return <HeroError error={error || "Hero data not found"} />;
  }

  return (
    <section id="hero" className="relative py-8">
      <div className="container">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left Column - Main Content */}
          <div className="flex flex-col justify-center gap-8">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-500/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-muted-foreground backdrop-blur w-fit"
            >
              {/* Small glowing dot to the left of the badge text */}
              <span
                aria-hidden
                className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.35)] animate-pulse"
              />
              {heroData.badge.text}
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              <h1 className="text-4xl font-bold  tracking-tight text-emerald-300 sm:text-5xl lg:text-6xl">
                {heroData.heading.name}
              </h1>
              <p className="text-2xl font-medium text-muted-foreground sm:text-3xl">
                {heroData.heading.title}
              </p>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="max-w-xl text-lg leading-relaxed text-muted-foreground"
            >
              {heroData.bio}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex flex-wrap gap-4"
            >
              <Button size="lg" asChild>
                <a href={heroData.cta.primary.href}>
                  {heroData.cta.primary.text}
                </a>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <a href={heroData.cta.secondary.href}>
                  {heroData.cta.secondary.text}
                </a>
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex gap-4 pt-4"
            >
              {(settings?.socialAccounts && settings.socialAccounts.length
                ? settings.socialAccounts
                    .slice()
                    .sort((a: any, b: any) => a.order - b.order)
                : heroData.socialLinks
              ).map((social: any) => {
                const href = social.url || social.link;
                const label = social.title || social.name || href;
                // Use dynamic icon when provided; fall back to inline iconMap
                const iconName = social.icon;
                return (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-background transition-colors hover:border-foreground hover:bg-muted"
                    aria-label={label}
                  >
                    {iconName ? (
                      <DynamicIcon name={iconName} className="h-5 w-5" />
                    ) : (
                      <Mail className="h-5 w-5" />
                    )}
                  </a>
                );
              })}
            </motion.div>
          </div>

          {/* Right Column - Code Terminal */}
          <div className="flex flex-col justify-center">
            <CodeTerminal heroData={heroData} />
          </div>
        </div>
        <TechMarquee techStack={heroData.techStack} />
      </div>
    </section>
  );
}

function CodeTerminal({ heroData }: { heroData: HeroData }) {
  const [currentLine, setCurrentLine] = React.useState(0);
  const [showCursor, setShowCursor] = React.useState(true);
  const [isStreamingComplete, setIsStreamingComplete] = React.useState(false);

  React.useEffect(() => {
    const lineTimer = setInterval(() => {
      setCurrentLine((prev) => {
        const nextLine = prev < 16 ? prev + 1 : prev;
        if (nextLine === 16 && !isStreamingComplete) {
          setIsStreamingComplete(true);
        }
        return nextLine;
      });
    }, 350);

    const cursorTimer = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 530);

    return () => {
      clearInterval(lineTimer);
      clearInterval(cursorTimer);
    };
  }, [isStreamingComplete]);

  const codeLines = [
    {
      indent: 0,
      content: (
        <>
          <span className="text-cyan-400">const</span>&nbsp;
          <span className="text-white">engineer</span>&nbsp;
          <span className="text-cyan-400">=</span>&nbsp;
          <span className="text-yellow-400">new</span>&nbsp;
          <span className="text-brand-accent">SoftwareEngineer</span>
          <span className="text-white">();</span>
        </>
      ),
    },
    {
      indent: 0,
      content: (
        <>
          <span className="text-white"></span>
        </>
      ),
    },
    {
      indent: 0,
      content: (
        <>
          <span className="text-purple-400">function</span>&nbsp;
          <span className="text-blue-400">getEngineerProfile</span>
          <span className="text-white">() {"{"}</span>
        </>
      ),
    },
    {
      indent: 1,
      content: (
        <>
          <span className="text-cyan-400">return</span>&nbsp;
          <span className="text-white">{"{"}</span>
        </>
      ),
    },
    {
      indent: 3,
      content: (
        <>
          <span className="text-pink-400">name: </span>
          <span className="text-brand-accent">"Amir Hamza"</span>
          <span className="text-white">,</span>
        </>
      ),
    },
    {
      indent: 3,
      content: (
        <>
          <span className="text-pink-400">title: </span>
          <span className="text-brand-accent">"Software Engineer (L1)"</span>
          <span className="text-white">,</span>
        </>
      ),
    },
    {
      indent: 3,
      content: (
        <>
          <span className="text-pink-400">skills: </span>
          <span className="text-orange-400">[</span>
        </>
      ),
    },
    {
      indent: 4,
      content: (
        <div className="">
          <span className="text-brand-accent">"React"</span>
          <span className="text-white">, </span>
          <span className="text-brand-accent">"Next.js"</span>
          <span className="text-white">, </span>
          <span className="text-brand-accent">"TypeScript"</span>
          <span className="text-white">,</span>
          <span className="text-brand-accent">"Node.js"</span>
          <span className="text-white">, </span>
          <span className="text-brand-accent">"Express.js"</span>
          <span className="text-white">, </span>
          <span className="text-brand-accent">"MongoDB"</span>
        </div>
      ),
    },
    {
      indent: 4,
      content: <></>,
    },
    {
      indent: 3,
      content: (
        <>
          <span className="text-orange-400">]</span>
          <span className="text-white">,</span>
        </>
      ),
    },
    {
      indent: 3,
      content: (
        <>
          <span className="text-pink-400">passion: </span>
        </>
      ),
    },
    {
      indent: 4,
      content: (
        <>
          <span className="text-brand-accent">
            "Engineering robust, scalable platforms with exceptional user
            experience."
            <span className="text-white">,</span>
          </span>
        </>
      ),
    },
    {
      indent: 3,
      content: (
        <div className="flex ">
          <span className="text-pink-400">focus: </span>
          <span className="text-brand-accent">
            "Platform Engineering & Modern Frontend Architecture"
            <span className="text-white">,</span>
          </span>
        </div>
      ),
    },
    {
      indent: 3,
      content: (
        <div className="flex ">
          <span className="text-pink-400">currentlyBuilding: </span>
          <span className="text-brand-accent">
            "Next-generation full-stack web applications"
            <span className="text-white">,</span>
          </span>
        </div>
      ),
    },
    {
      indent: 3,
      content: (
        <>
          <span className="text-pink-400">openToWork: </span>
          <span className="text-orange-400">true</span>
          <span className="text-white">,</span>
        </>
      ),
    },
    {
      indent: 2,
      content: (
        <>
          <span className="text-white">{"};"}</span>
        </>
      ),
    },
    {
      indent: 0,
      content: (
        <>
          <span className="text-white">{"}"}</span>
        </>
      ),
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="relative overflow-hidden rounded-xl border border-border bg-[#0a0e1a] shadow-2xl"
    >
      {/* Terminal Header */}
      <div className="flex items-center gap-2 border-b border-border/50 bg-[#151922] px-4 py-3">
        <div className="flex gap-1.5">
          <div className="h-3 w-3 rounded-full bg-[#ff5f57]" />
          <div className="h-3 w-3 rounded-full bg-[#febc2e]" />
          <div className="h-3 w-3 rounded-full bg-[#28c840]" />
        </div>
        <div className="flex-1 text-center text-xs text-muted-foreground">
          amirhamza.ts
        </div>
      </div>

      {/* Terminal Content */}
      <div className="p-6 font-mono text-sm leading-relaxed">
        <div className="space-y-1">
          {codeLines.map((line, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0 }}
              animate={{ opacity: currentLine >= index ? 1 : 0 }}
              transition={{ duration: 0.1 }}
              className="flex items-center"
              style={{ paddingLeft: `${line.indent * 0.5}rem` }}
            >
              {line.content}
              {/* Show cursor on current line during streaming */}
              {currentLine === index && !isStreamingComplete && showCursor && (
                <span className="ml-0.5 inline-block h-4 w-2 bg-brand-accent animate-pulse" />
              )}
              {/* Show permanent blinking cursor at end of last line after streaming */}
              {index === codeLines.length - 1 &&
                isStreamingComplete &&
                showCursor && (
                  <span className="ml-0.5 inline-block h-4 w-2 bg-brand-accent" />
                )}
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

function TechMarquee({ techStack }: { techStack: string[] }) {
  return (
    <div className="relative mx-auto mt-16 w-[min(100%,64rem)] overflow-hidden rounded-2xl border border-border/50 bg-background/70 py-5 shadow-sm backdrop-blur">
      <div className="pointer-events-none absolute inset-0 bg-linear-to-r from-background via-background/60 to-background opacity-80" />
      <motion.div
        initial={{ x: 0 }}
        animate={{ x: "-50%" }}
        transition={{ repeat: Infinity, duration: 18, ease: "linear" }}
        className="flex min-w-full gap-10 whitespace-nowrap text-sm uppercase tracking-[0.4em] text-muted-foreground"
      >
        {[...techStack, ...techStack].map((tech, index) => (
          <span key={`${tech}-${index}`} className="text-muted-foreground/80">
            {tech}
          </span>
        ))}
      </motion.div>
    </div>
  );
}
