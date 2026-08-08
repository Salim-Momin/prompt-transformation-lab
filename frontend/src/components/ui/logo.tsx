import { Sparkles } from "lucide-react";

interface LogoProps {
  compact?: boolean;
}

export function Logo({
  compact = false,
}: LogoProps) {
  return (
    <div className="flex items-center gap-3">
      <div className="relative flex size-9 items-center justify-center overflow-hidden rounded-xl border border-violet-400/30 bg-violet-500/15">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-500/25 to-cyan-400/10" />

        <Sparkles
          aria-hidden="true"
          className="relative size-[18px] text-violet-200"
        />
      </div>

      {!compact ? (
        <div className="flex items-baseline gap-1">
          <span className="font-semibold tracking-[-0.02em] text-white">
            PromptForge
          </span>

          <span className="text-xs font-medium text-violet-300">
            AI
          </span>
        </div>
      ) : null}
    </div>
  );
}