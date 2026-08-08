import type { HTMLAttributes } from "react";

import { cn } from "@/lib/utils";

interface GlassCardProps
  extends HTMLAttributes<HTMLDivElement> {
  glow?: boolean;
}

export function GlassCard({
  children,
  className,
  glow = false,
  ...props
}: GlassCardProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-[1.75rem]",
        "border border-white/[0.085]",
        "bg-white/[0.035] backdrop-blur-2xl",
        "shadow-[0_20px_80px_rgba(0,0,0,0.3)]",
        glow &&
          "shadow-[0_20px_100px_rgba(124,58,237,0.16)]",
        className,
      )}
      {...props}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-12 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"
      />

      {children}
    </div>
  );
}