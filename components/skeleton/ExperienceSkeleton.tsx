import { motion } from "framer-motion";
type Props = {};

const ExperienceSkeleton = ({}: Props) => {
  return (
    <section id="experience" className="scroll-mt-24">
      {/* Header */}
      <div className="space-y-4">
        <h2 className="text-3xl font-semibold lg:text-4xl">Experience</h2>
        <p className="max-w-2xl text-muted-foreground">
          A timeline of the teams, products, and outcomes I&apos;ve helped shape
          across platform, data, and developer experience.
        </p>
      </div>

      {/* Timeline Skeleton */}
      <div className="relative mt-12">
        <div className="absolute left-4 top-0 hidden h-full w-px bg-border/70 md:block" />
        <div className="space-y-10">
          {Array.from({ length: 3 }).map((_, index) => (
            <motion.article
              key={index}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.6,
                delay: index * 0.1,
                ease: "easeOut",
              }}
              className="relative md:pl-16"
            >
              <span className="absolute left-2.5 top-0 hidden h-3 w-3 rounded-full border-2 border-background bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.6)] md:block" />
              <div className="flex flex-col gap-6 rounded-3xl border border-border/60 bg-background/75 p-8 shadow-lg backdrop-blur md:flex-row md:items-start">
                {/* Company Info Skeleton */}
                <div className="flex w-full shrink-0 items-center gap-4 md:w-48 md:flex-col md:items-start">
                  <div className="relative h-16 w-16 overflow-hidden rounded-2xl border border-border/60 bg-background/80">
                    <div className="bg-muted-foreground/20 rounded-2xl h-full w-full animate-pulse" />
                  </div>
                  <div className="text-sm text-muted-foreground md:text-base">
                    <div className="bg-muted-foreground/20 rounded h-4 w-24 animate-pulse mb-1" />
                    <div className="bg-muted-foreground/20 rounded h-3 w-16 animate-pulse" />
                  </div>
                </div>

                {/* Experience Details Skeleton */}
                <div className="flex-1 space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <div className="bg-muted-foreground/20 rounded h-6 w-48 animate-pulse mb-2" />
                      <div className="bg-muted-foreground/20 rounded h-3 w-32 animate-pulse" />
                    </div>
                  </div>
                  <div className="bg-muted-foreground/20 rounded h-4 w-full animate-pulse mb-1" />
                  <div className="bg-muted-foreground/20 rounded h-4 w-5/6 animate-pulse" />

                  {/* Responsibilities Skeleton */}
                  <ul className="space-y-3 text-sm text-muted-foreground">
                    {Array.from({ length: 3 }).map((_, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400" />
                        <div className="bg-muted-foreground/20 rounded h-4 w-full animate-pulse" />
                      </li>
                    ))}
                  </ul>

                  {/* Technologies Skeleton */}
                  <div className="flex flex-wrap gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground/60">
                    {Array.from({ length: 5 }).map((_, idx) => (
                      <div
                        key={idx}
                        className="bg-muted-foreground/20 rounded-full border border-border/60 px-3 py-1 h-6 w-16 animate-pulse"
                      />
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
};

export default ExperienceSkeleton;
