"use client";

import { motion } from "framer-motion";
import Image from "next/image";

import { experience } from "@/lib/content";

export function ExperienceSection() {
  return (
    <section id="experience" className="scroll-mt-24">
      <div className="space-y-4">
        <h2 className="text-3xl font-semibold lg:text-4xl">Experience</h2>
        <p className="max-w-2xl text-muted-foreground">
          A timeline of the teams, products, and outcomes I&apos;ve helped shape
          across platform, data, and developer experience.
        </p>
      </div>
      <div className="relative mt-12">
        <div className="absolute left-4 top-0 hidden h-full w-px bg-border/70 md:block" />
        <div className="space-y-10">
          {experience.map((role, index) => (
            <motion.article
              key={role.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{
                duration: 0.6,
                delay: index * 0.1,
                ease: "easeOut",
              }}
              className="relative md:pl-16"
            >
              <span className="absolute -left-[3.4px] top-3 hidden h-3 w-3 rounded-full border-2 border-background bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.6)] md:block" />
              <div className="flex flex-col gap-6 rounded-3xl border border-border/60 bg-background/75 p-8 shadow-lg backdrop-blur md:flex-row md:items-start">
                <div className="flex w-full shrink-0 items-center gap-4 md:w-48 md:flex-col md:items-start">
                  <div className="relative h-16 w-16 overflow-hidden rounded-2xl border border-border/60 bg-background/80">
                    <Image
                      src={role.logo}
                      alt={role.company}
                      width={96}
                      height={96}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="text-sm text-muted-foreground md:text-base">
                    <p className="font-semibold text-foreground">
                      {role.company}
                    </p>
                    <p>{role.location}</p>
                  </div>
                </div>
                <div className="flex-1 space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <h3 className="text-xl font-semibold text-foreground">
                        {role.role}
                      </h3>
                      <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground/80">
                        {role.startDate} – {role.endDate ?? "Present"}
                      </p>
                    </div>
                  </div>
                  <ul className="space-y-3 text-sm text-muted-foreground">
                    {role.description.map((item) => (
                      <li key={item} className="flex items-start gap-3">
                        <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400" />
                        {item}
                      </li>
                    ))}
                  </ul>
                  <div className="flex flex-wrap gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground/60">
                    {role.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="rounded-full border border-border/60 bg-background/70 px-3 py-1"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
