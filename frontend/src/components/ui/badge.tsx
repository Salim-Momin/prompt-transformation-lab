import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

interface BadgeProps {
  children: ReactNode;
  className?: string;
}

export function Badge({
  children,
  className,
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex min-h-7 items-center gap-2 rounded-full",
        "border border-violet-400/20 bg-violet-500/10",
        "px-3 text-xs font-medium text-violet-200",
        className,
      )}
    >
      {children}
    </span>
  );
}