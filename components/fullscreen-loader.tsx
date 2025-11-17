"use client";

import Lottie from "lottie-react";

import loaderAnimation from "@/lib/animations/fullscreen-loader.json";
import { cn } from "@/lib/utils";

interface FullScreenLoaderProps {
  label?: string;
  showLabel?: boolean;
  backdropClassName?: string;
  contentClassName?: string;
  animationSize?: number;
}

export function FullScreenLoader({
  label = "Loading",
  showLabel = true,
  backdropClassName,
  contentClassName,
  animationSize = 240,
}: FullScreenLoaderProps) {
  return (
    <div
      className={cn(
        "fixed inset-0 z-50 flex h-screen w-screen items-center justify-center bg-background/95 backdrop-blur",
        backdropClassName
      )}
      role="status"
      aria-live="polite"
      aria-label={label}
    >
      <div className={cn("flex flex-col items-center gap-6", contentClassName)}>
        <Lottie
          animationData={loaderAnimation}
          loop
          autoplay
          style={{ width: animationSize, height: animationSize }}
        />
        {showLabel ? (
          <p className="text-sm font-medium uppercase tracking-[0.35em] text-muted-foreground">
            {label}
          </p>
        ) : null}
      </div>
    </div>
  );
}
