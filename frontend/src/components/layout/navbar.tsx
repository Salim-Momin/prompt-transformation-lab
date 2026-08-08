"use client";

import {
  History,
  LogOut,
  Menu,
  Sparkles,
  UserRound,
} from "lucide-react";

import { useAuth } from "@/providers/auth-provider";

import Link from "next/link";
import { motion } from "motion/react";

import { Button } from "@/components/ui/button";
import { Logo } from "@/components/ui/logo";

function GitHubIcon({ className = "size-[18px]" }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className={className}
      fill="currentColor"
    >
      <path d="M12 2C6.48 2 2 6.58 2 12.23c0 4.52 2.87 8.35 6.84 9.71.5.1.68-.22.68-.49 0-.24-.01-1.04-.01-1.89-2.78.62-3.37-1.21-3.37-1.21-.46-1.18-1.11-1.49-1.11-1.49-.91-.64.07-.62.07-.62 1 .07 1.53 1.06 1.53 1.06.89 1.56 2.34 1.11 2.91.85.09-.66.35-1.11.63-1.37-2.22-.26-4.56-1.14-4.56-5.07 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.3.1-2.71 0 0 .84-.28 2.75 1.05A9.3 9.3 0 0 1 12 6.96a9.3 9.3 0 0 1 2.5.35c1.91-1.33 2.75-1.05 2.75-1.05.55 1.41.2 2.45.1 2.71.64.72 1.03 1.63 1.03 2.75 0 3.94-2.34 4.8-4.57 5.06.36.32.68.94.68 1.9 0 1.37-.01 2.47-.01 2.81 0 .27.18.59.69.49A10.25 10.25 0 0 0 22 12.23C22 6.58 17.52 2 12 2Z" />
    </svg>
  );
}

interface NavbarProps {
  onOpenHistory?: () => void;
  onOpenAuth?: () => void;
  onLogout?: () => void | Promise<void>;
}

export function Navbar({
  onOpenHistory,
  onOpenAuth,
  onLogout,
}: NavbarProps) {
  const {
    user,
    authenticated,
    loading,
  } = useAuth();
  return (
    <motion.header
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="sticky top-0 z-50 border-b border-white/[0.06] bg-[#050507]/70 backdrop-blur-2xl"
    >
      <nav className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link
            href="/"
            aria-label="PromptForge AI home"
        >
            <Logo />
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          <a
            href="#features"
            className="rounded-lg px-3 py-2 text-sm text-zinc-400 transition hover:bg-white/[0.04] hover:text-white"
          >
            Features
          </a>

          <a
            href="#how-it-works"
            className="rounded-lg px-3 py-2 text-sm text-zinc-400 transition hover:bg-white/[0.04] hover:text-white"
          >
            How it works
          </a>

          <a
            href="http://127.0.0.1:8000/docs"
            target="_blank"
            rel="noreferrer"
            className="rounded-lg px-3 py-2 text-sm text-zinc-400 transition hover:bg-white/[0.04] hover:text-white"
          >
            API Docs
          </a>
        </div>

        <div className="flex items-center gap-2">
  {authenticated ? (
    <>
      <Button
        variant="ghost"
        size="sm"
        onClick={onOpenHistory}
        className="hidden sm:inline-flex"
      >
        <History className="size-4" />
        History
      </Button>

      <div className="hidden items-center gap-2 rounded-xl border border-white/[0.07] bg-white/[0.03] px-3 py-2 md:flex">
        <div className="flex size-7 items-center justify-center rounded-lg bg-violet-500/10 text-violet-300">
          <UserRound className="size-4" />
        </div>

        <div className="max-w-32">
          <p className="truncate text-xs font-medium text-zinc-200">
            {user?.name}
          </p>

          <p className="truncate text-[10px] text-zinc-600">
            {user?.email}
          </p>
        </div>
      </div>

      <Button
        variant="ghost"
        size="icon"
        onClick={() => {
          void onLogout?.();
        }}
        aria-label="Log out"
      >
        <LogOut className="size-4" />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        className="sm:hidden"
        onClick={onOpenHistory}
        aria-label="Open prompt history"
      >
        <History className="size-5" />
      </Button>
    </>
  ) : (
    <Button
      size="sm"
      onClick={onOpenAuth}
      disabled={loading}
    >
      <UserRound className="size-4" />
      Log in
    </Button>
  )}

  <Button
    variant="ghost"
    size="icon"
    className="hidden"
    aria-label="Menu"
  >
    <Menu className="size-5" />
  </Button>
</div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="hidden sm:inline-flex"
            aria-label="Open GitHub repository"
          >
            <GitHubIcon />
          </Button>

          <Button
            size="sm"
            className="hidden sm:inline-flex"
          >
            <Sparkles className="size-4" />
            Start creating
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="sm:hidden"
            onClick={onOpenHistory}
            aria-label="Open prompt history"
          >
            <History className="size-5" />
          </Button>
        </div>
      </nav>
    </motion.header>
  );
}