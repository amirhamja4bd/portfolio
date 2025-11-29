"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { Frown, Heart, Star, ThumbsUp, Zap } from "lucide-react";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type ComponentType,
  type SVGProps,
} from "react";

type ReactionsMap = { [k: number]: number | undefined };

const DEFAULT_EMOJI: Record<
  number,
  {
    label: string;
    Icon: ComponentType<SVGProps<SVGSVGElement>>;
    color: string;
    textClass: string;
  }
> = {
  1: {
    label: "Like",
    Icon: ThumbsUp,
    color: "#1877f2",
    textClass: "text-blue-500",
  },
  2: {
    label: "Love",
    Icon: Heart,
    color: "#ef4444",
    textClass: "text-red-500",
  },
  3: {
    label: "Wow",
    Icon: Star,
    color: "#f59e0b",
    textClass: "text-yellow-500",
  },
  4: {
    label: "Sad",
    Icon: Frown,
    color: "#6b7280",
    textClass: "text-gray-500",
  },
  5: {
    label: "Mind-blown",
    Icon: Zap,
    color: "#ff8a00",
    textClass: "text-orange-500",
  },
};

interface BlogReactionsProps {
  reactions: ReactionsMap;
  onReact: (reaction: number) => void;
  selectedReaction?: number | null;
}

export function BlogReactions({
  reactions,
  onReact,
  selectedReaction,
}: BlogReactionsProps) {
  const [showPicker, setShowPicker] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const total: number = Object.values(reactions ?? {}).reduce<number>(
    (s, n) => s + (n ?? 0),
    0
  );

  // Close picker on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (!rootRef.current) return;
      if (!rootRef.current.contains(e.target as Node)) {
        setShowPicker(false);
      }
    };
    if (showPicker) {
      document.addEventListener("mousedown", handleClick);
    }
    return () => document.removeEventListener("mousedown", handleClick);
  }, [showPicker]);

  const dominantReaction = useMemo(() => {
    const entries = Object.entries(reactions ?? {}) as [
      string,
      number | undefined
    ][];
    if (entries.length === 0) return 1;
    let maxId = 1;
    let maxCount = 0;
    for (const [k, v] of entries) {
      const num = v ?? 0;
      if (num > maxCount) {
        maxCount = num;
        maxId = Number(k);
      }
    }
    return maxId;
  }, [reactions]);
  // prefer visitor's selected reaction to show in the main button when available
  const displayedReaction = selectedReaction ?? dominantReaction;

  return (
    <div className="flex items-center gap-4" ref={rootRef}>
      {/* Main action: show the dominant reaction icon and toggle the picker */}
      <div
        className="relative flex items-center gap-2 rounded-full"
        onMouseEnter={() => setShowPicker(true)}
        onMouseLeave={() => setShowPicker(false)}
      >
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowPicker((s) => !s)}
          aria-haspopup="true"
          aria-expanded={showPicker}
          className="h-10 w-10 p-0"
          title={DEFAULT_EMOJI[dominantReaction]?.label}
        >
          {(() => {
            const MainIcon = DEFAULT_EMOJI[dominantReaction]?.Icon;
            const color = DEFAULT_EMOJI[displayedReaction]?.color;
            const reacted = Boolean(reactions?.[displayedReaction]);
            const active = selectedReaction === displayedReaction;
            return MainIcon ? (
              <span
                className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-full text-xl leading-none",
                  active ? "scale-105 shadow-lg" : ""
                )}
              >
                <MainIcon
                  width={20}
                  height={20}
                  className={cn(
                    "h-5 w-5",
                    active
                      ? DEFAULT_EMOJI[displayedReaction].textClass
                      : "text-muted-foreground"
                  )}
                />
              </span>
            ) : null;
          })()}
        </Button>

        <AnimatePresence>
          {showPicker && (
            <motion.div
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.6 }}
              transition={{ type: "spring", stiffness: 400, damping: 24 }}
              className="absolute -top-14 right-0 z-50 flex items-center gap-3 rounded-full bg-white/90 p-3 shadow-2xl backdrop-blur-md dark:bg-black/75 lg:left-1/2 lg:-translate-x-1/2 lg:right-auto"
            >
              {/* pointer */}
              <div className="absolute -bottom-1 right-5 rotate-45 bg-white w-3 h-3 dark:bg-black/75 lg:left-1/2 lg:-translate-x-1/2 lg:right-auto" />
              {Object.entries(DEFAULT_EMOJI).map(
                ([key, { Icon, label, color }], index) => (
                  <motion.button
                    key={key}
                    initial={{ y: 10, opacity: 0, scale: 0.8 }}
                    animate={{ y: 0, opacity: 1, scale: 1 }}
                    exit={{ y: 10, opacity: 0, scale: 0.8 }}
                    transition={{ delay: index * 0.04 }}
                    onClick={() => {
                      onReact(Number(key));
                      setShowPicker(false);
                    }}
                    whileHover={{ scale: 1.18 }}
                    className={cn(
                      "flex h-8 w-8 items-center justify-center rounded-full shadow-sm leading-none transition-transform hover:scale-110",
                      selectedReaction === Number(key)
                        ? "ring-2 ring-white dark:ring-black scale-[1.08] shadow-lg"
                        : ""
                    )}
                    style={{ backgroundColor: color }}
                    aria-label={label}
                    title={label}
                    tabIndex={0}
                  >
                    <Icon width={18} height={18} color="#fff" />
                  </motion.button>
                )
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Totals if no total shown above (redundant but keeps layout intact) */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        {total > 0 ? (
          <span>{total}</span>
        ) : (
          <span className="text-xs">0</span>
          //   <span className="text-xs">Be the first to react</span>
        )}
      </div>
    </div>
  );
}

export default BlogReactions;
