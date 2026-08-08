import type {
  ButtonHTMLAttributes,
  ReactNode,
} from "react";

import { LoaderCircle } from "lucide-react";

import { cn } from "@/lib/utils";

type ButtonVariant =
  | "primary"
  | "secondary"
  | "ghost"
  | "danger";

type ButtonSize = "sm" | "md" | "lg" | "icon";

interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "border border-violet-400/30 bg-violet-500 text-white shadow-[0_12px_40px_rgba(124,58,237,0.25)] hover:border-violet-300/50 hover:bg-violet-400",
  secondary:
    "border border-white/10 bg-white/[0.055] text-zinc-100 hover:border-white/15 hover:bg-white/[0.085]",
  ghost:
    "border border-transparent bg-transparent text-zinc-400 hover:bg-white/[0.05] hover:text-white",
  danger:
    "border border-red-400/20 bg-red-500/10 text-red-300 hover:bg-red-500/15",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "min-h-9 rounded-xl px-3.5 text-sm",
  md: "min-h-11 rounded-xl px-4 text-sm",
  lg: "min-h-13 rounded-2xl px-6 text-base",
  icon: "size-10 rounded-xl",
};

export function Button({
  children,
  className,
  variant = "primary",
  size = "md",
  loading = false,
  disabled,
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={cn(
        "inline-flex items-center justify-center gap-2 font-medium outline-none transition duration-200",
        "focus-visible:ring-2 focus-visible:ring-violet-400/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#050507]",
        "active:scale-[0.98]",
        "disabled:cursor-not-allowed disabled:opacity-50 disabled:active:scale-100",
        variantClasses[variant],
        sizeClasses[size],
        className,
      )}
      {...props}
    >
      {loading ? (
        <LoaderCircle
          aria-hidden="true"
          className="size-4 animate-spin"
        />
      ) : null}

      {children}
    </button>
  );
}