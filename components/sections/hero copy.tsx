// "use client";

// import { motion } from "framer-motion";

// import { Button } from "@/components/ui/button";
// import { siteConfig } from "@/config/site";

// const heroData = {
//   badge: {
//     text: "Crafting delightful developer journeys",
//   },

//   heading: {
//     name: "Amir Hamza",
//     title: "Principal Platform Engineer & DX Strategist",
//   },

//   bio: `I build developer experiences and resilient systems that help teams deliver faster with confidence. Over the past decade, I've shipped features to millions, led platform migrations, and mentored engineers across the globe.`,

//   cta: {
//     primary: {
//       text: "View Projects",
//       href: "#projects",
//     },
//     secondary: {
//       text: "Download Resume",
//       href: siteConfig.resume,
//       external: true,
//     },
//   },

//   stats: [
//     { label: "Years experience", value: "6+" },
//     { label: "Projects shipped", value: "24" },
//     { label: "Happy collaborators", value: "15" },
//   ],

//   techStack: [
//     "Next.js",
//     "React",
//     "TypeScript",
//     "Node.js",
//     "GraphQL",
//     "MongoDB",
//     "AWS",
//     "Framer Motion",
//     "Editor.js",
//   ],
// };

// export function HeroSection() {
//   return (
//     <section id="hero" className="relative overflow-hidden py-20">
//       <div className="relative mx-auto max-w-6xl px-6">
//         {/* Terminal Window */}
//         <motion.div
//           initial={{ opacity: 0, y: 40 }}
//           whileInView={{ opacity: 1, y: 0 }}
//           viewport={{ once: true }}
//           transition={{ duration: 0.8, ease: "easeOut" }}
//           className="relative overflow-hidden rounded-xl border border-border/60 bg-linear-to-b from-zinc-900/95 to-zinc-950/95 shadow-2xl backdrop-blur dark:from-zinc-900/95 dark:to-black/95"
//         >
//           {/* Terminal Header */}
//           <div className="flex items-center justify-between border-b border-zinc-800/80 bg-zinc-900/80 px-4 py-3">
//             <div className="flex items-center gap-2">
//               <div className="h-3 w-3 rounded-full bg-red-500" />
//               <div className="h-3 w-3 rounded-full bg-yellow-500" />
//               <div className="h-3 w-3 rounded-full bg-green-500" />
//             </div>
//             <div className="absolute left-1/2 -translate-x-1/2 text-xs text-zinc-400">
//               amir@portfolio:~
//             </div>
//             <div className="text-xs text-zinc-500">bash</div>
//           </div>

//           {/* Terminal Content */}
//           <div className="p-8 font-mono text-sm">
//             {/* Command Prompt */}
//             <motion.div
//               initial={{ opacity: 0 }}
//               whileInView={{ opacity: 1 }}
//               viewport={{ once: true }}
//               transition={{ duration: 0.5, delay: 0.2 }}
//               className="mb-6"
//             >
//               <span className="text-brand">amir@portfolio</span>
//               <span className="text-zinc-400">:</span>
//               <span className="text-blue-400">~</span>
//               <span className="text-zinc-400">$</span>
//               <span className="ml-2 text-zinc-300">cat profile.json</span>
//             </motion.div>

//             {/* JSON Output */}
//             <motion.div
//               initial={{ opacity: 0 }}
//               whileInView={{ opacity: 1 }}
//               viewport={{ once: true }}
//               transition={{ duration: 0.6, delay: 0.4 }}
//               className="space-y-2 text-zinc-300"
//             >
//               <div>
//                 <span className="text-zinc-500">{"{"}</span>
//               </div>
//               <div className="ml-4">
//                 <span className="text-purple-400">"name"</span>
//                 <span className="text-zinc-500">: </span>
//                 <span className="text-brand">
//                   "{heroData.heading.name}"
//                 </span>
//                 <span className="text-zinc-500">,</span>
//               </div>
//               <div className="ml-4">
//                 <span className="text-purple-400">"role"</span>
//                 <span className="text-zinc-500">: </span>
//                 <span className="text-brand">
//                   "{heroData.heading.title}"
//                 </span>
//                 <span className="text-zinc-500">,</span>
//               </div>
//               <div className="ml-4">
//                 <span className="text-purple-400">"bio"</span>
//                 <span className="text-zinc-500">: </span>
//                 <span className="text-brand">"{heroData.bio}"</span>
//                 <span className="text-zinc-500">,</span>
//               </div>
//               <div className="ml-4">
//                 <span className="text-purple-400">"stats"</span>
//                 <span className="text-zinc-500">: {"{"}</span>
//               </div>
//               {heroData.stats.map((stat, index) => (
//                 <div key={stat.label} className="ml-8">
//                   <span className="text-cyan-400">
//                     "{stat.label.toLowerCase().replace(/\s+/g, "_")}"
//                   </span>
//                   <span className="text-zinc-500">: </span>
//                   <span className="text-orange-400">"{stat.value}"</span>
//                   <span className="text-zinc-500">
//                     {index < heroData.stats.length - 1 ? "," : ""}
//                   </span>
//                 </div>
//               ))}
//               <div className="ml-4">
//                 <span className="text-zinc-500">{"},"}</span>
//               </div>
//               <div className="ml-4">
//                 <span className="text-purple-400">"achievements"</span>
//                 <span className="text-zinc-500">: [</span>
//               </div>
//               <div className="ml-4">
//                 <span className="text-zinc-500">]</span>
//               </div>
//               <div>
//                 <span className="text-zinc-500">{"}"}</span>
//               </div>
//             </motion.div>

//             {/* Action Buttons */}
//             <motion.div
//               initial={{ opacity: 0 }}
//               whileInView={{ opacity: 1 }}
//               viewport={{ once: true }}
//               transition={{ duration: 0.6, delay: 0.6 }}
//               className="mt-8 flex items-center gap-2"
//             >
//               <span className="text-brand">amir@portfolio</span>
//               <span className="text-zinc-400">:</span>
//               <span className="text-blue-400">~</span>
//               <span className="text-zinc-400">$</span>
//               <motion.span
//                 animate={{ opacity: [1, 0, 1] }}
//                 transition={{ duration: 1, repeat: Infinity }}
//                 className="ml-2 inline-block h-5 w-2 bg-brand"
//               />
//             </motion.div>

//             <motion.div
//               initial={{ opacity: 0, y: 10 }}
//               whileInView={{ opacity: 1, y: 0 }}
//               viewport={{ once: true }}
//               transition={{ duration: 0.6, delay: 0.8 }}
//               className="mt-6 flex flex-col gap-3 sm:flex-row"
//             >
//               <Button
//                 size="lg"
//                 asChild
//                 className="min-w-[180px] bg-brand hover:bg-brand/70"
//               >
//                 <a href={heroData.cta.primary.href}>
//                   {heroData.cta.primary.text}
//                 </a>
//               </Button>
//               <Button
//                 size="lg"
//                 variant="outline"
//                 asChild
//                 className="min-w-[180px] border-zinc-700 hover:bg-zinc-800"
//               >
//                 <a
//                   href={heroData.cta.secondary.href}
//                   target={
//                     heroData.cta.secondary.external ? "_blank" : undefined
//                   }
//                   rel={
//                     heroData.cta.secondary.external ? "noreferrer" : undefined
//                   }
//                 >
//                   {heroData.cta.secondary.text}
//                 </a>
//               </Button>
//             </motion.div>
//           </div>
//         </motion.div>
//       </div>

//       <TechMarquee />
//     </section>
//   );
// }

// function TechMarquee() {
//   return (
//     <div className="relative mx-auto mt-16 max-w-5xl overflow-hidden rounded-2xl border border-border/50 bg-background/70 py-5 shadow-sm backdrop-blur">
//       <div className="pointer-events-none absolute inset-0 bg-linear-to-r from-background via-background/60 to-background opacity-80" />
//       <motion.div
//         initial={{ x: 0 }}
//         animate={{ x: "-50%" }}
//         transition={{ repeat: Infinity, duration: 18, ease: "linear" }}
//         className="flex min-w-full gap-10 whitespace-nowrap text-sm uppercase tracking-[0.4em] text-muted-foreground"
//       >
//         {[...heroData.techStack, ...heroData.techStack].map((tech, index) => (
//           <span key={`${tech}-${index}`} className="text-muted-foreground/80">
//             {tech}
//           </span>
//         ))}
//       </motion.div>
//     </div>
//   );
// }

"use client";

import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";

const heroData = {
  badge: {
    text: "Crafting delightful developer journeys",
  },

  heading: {
    name: "Amir Hamza",
    title: "Principal Platform Engineer & DX Strategist",
  },

  bio: `I build developer experiences and resilient systems that help teams deliver faster with confidence. Over the past decade, I've shipped features to millions, led platform migrations, and mentored engineers across the globe.`,

  cta: {
    primary: {
      text: "View Projects",
      href: "#projects",
    },
    secondary: {
      text: "Download Resume",
      href: siteConfig.resume,
      external: true,
    },
  },

  stats: [
    { label: "Years experience", value: "6+" },
    { label: "Projects shipped", value: "24" },
    { label: "Happy collaborators", value: "15" },
  ],

  highlights: [
    "Led a team of engineers to successfully migrate a monolithic application to a microservices architecture.",
    "Implemented a CI/CD pipeline that reduced deployment times by 50%.",
  ],

  techStack: [
    "Next.js",
    "React",
    "TypeScript",
    "Node.js",
    "GraphQL",
    "MongoDB",
    "AWS",
    "Framer Motion",
    "Editor.js",
  ],
};

export function HeroSection() {
  return (
    <section id="hero" className="relative overflow-hidden py-20">
      <div className="relative mx-auto flex max-w-5xl flex-col items-center gap-10 px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-500/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-emerald-300/90 backdrop-blur"
        >
          {heroData.badge.text}
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.05 }}
          className="text-balance text-4xl font-semibold leading-tight sm:text-5xl lg:text-6xl"
        >
          {heroData.heading.name} — {heroData.heading.title}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.1 }}
          className="max-w-3xl text-lg text-muted-foreground"
        >
          {heroData.bio}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.15 }}
          className="flex flex-col items-center gap-3 sm:flex-row"
        >
          <Button size="lg" asChild className="min-w-[180px]">
            <a href={heroData.cta.primary.href}>{heroData.cta.primary.text}</a>
          </Button>
          <Button size="lg" variant="outline" asChild className="min-w-[180px]">
            <a
              href={heroData.cta.secondary.href}
              target={heroData.cta.secondary.external ? "_blank" : undefined}
              rel={heroData.cta.secondary.external ? "noreferrer" : undefined}
            >
              {heroData.cta.secondary.text}
            </a>
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.2 }}
          className="grid w-full gap-4 rounded-2xl border border-border/60 bg-background/70 p-6 shadow-lg backdrop-blur sm:grid-cols-3"
        >
          {heroData.stats.map((stat) => (
            <div key={stat.label} className="space-y-1">
              <p className="text-sm uppercase tracking-[0.25em] text-muted-foreground/80">
                {stat.label}
              </p>
              <p className="text-3xl font-semibold text-foreground">
                {stat.value}
              </p>
            </div>
          ))}
        </motion.div>

        <motion.ul
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.25 }}
          className="grid w-full gap-4 text-left text-sm text-muted-foreground/90 sm:grid-cols-2"
        >
          {heroData.highlights.map((highlight) => (
            <li
              key={highlight}
              className="flex items-start gap-3 rounded-xl border border-border/50 bg-linear-to-r from-background/80 via-background/60 to-background/80 p-5 shadow-sm backdrop-blur"
            >
              <span className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-emerald-300 shadow-[0_0_20px_rgba(45,212,191,0.45)]" />
              {highlight}
            </li>
          ))}
        </motion.ul>
      </div>

      <TechMarquee />
    </section>
  );
}

function TechMarquee() {
  return (
    <div className="relative mx-auto mt-16 w-[min(100%,64rem)] overflow-hidden rounded-2xl border border-border/50 bg-background/70 py-5 shadow-sm backdrop-blur">
      <div className="pointer-events-none absolute inset-0 bg-linear-to-r from-background via-background/60 to-background opacity-80" />
      <motion.div
        initial={{ x: 0 }}
        animate={{ x: "-50%" }}
        transition={{ repeat: Infinity, duration: 18, ease: "linear" }}
        className="flex min-w-full gap-10 whitespace-nowrap text-sm uppercase tracking-[0.4em] text-muted-foreground"
      >
        {[...heroData.techStack, ...heroData.techStack].map((tech, index) => (
          <span key={`${tech}-${index}`} className="text-muted-foreground/80">
            {tech}
          </span>
        ))}
      </motion.div>
    </div>
  );
}
