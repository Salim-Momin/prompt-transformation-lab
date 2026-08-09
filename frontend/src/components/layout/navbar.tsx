"use client";

import Link from "next/link";
import { useState } from "react";
import { motion } from "motion/react";

import {
  BookOpen,
  History,
  LogOut,
  Menu,
  Sparkles,
  UserRound,
  Workflow,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Logo } from "@/components/ui/logo";
import { useAuth } from "@/providers/auth-provider";

function GitHubIcon({
  className = "size-[18px]",
}: {
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M12 2C6.48 2 2 6.58 2 12.23c0 4.52 2.87 8.35 6.84 9.71.5.1.68-.22.68-.49 0-.24-.01-1.05-.01-1.9-2.78.62-3.37-1.2-3.37-1.2-.45-1.18-1.11-1.49-1.11-1.49-.91-.64.07-.63.07-.63 1 .08 1.53 1.06 1.53 1.06.9 1.57 2.35 1.12 2.93.86.09-.66.35-1.12.64-1.38-2.22-.26-4.56-1.14-4.56-5.07 0-1.12.39-2.04 1.03-2.76-.1-.26-.45-1.31.1-2.73 0 0 .84-.28 2.75 1.05A9.3 9.3 0 0 1 12 6.92a9.3 9.3 0 0 1 2.5.35c1.91-1.33 2.75-1.05 2.75-1.05.55 1.42.2 2.47.1 2.73.64.72 1.03 1.64 1.03 2.76 0 3.94-2.35 4.8-4.58 5.06.36.32.68.94.68 1.89 0 1.36-.01 2.46-.01 2.79 0 .27.18.59.69.49A10.27 10.27 0 0 0 22 12.23C22 6.58 17.52 2 12 2Z" />
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
  const [mobileMenuOpen, setMobileMenuOpen] =
    useState(false);

  const {
    user,
    authenticated,
    loading,
  } = useAuth();

  function closeMobileMenu() {
    setMobileMenuOpen(false);
  }

  return (
    <motion.header
      initial={{
        opacity: 0,
        y: -16,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.5,
      }}
      className="sticky top-0 z-50 border-b border-white/[0.06] bg-[#050507]/80 backdrop-blur-2xl"
    >
      {/* Main navbar */}
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6">
        {/* Logo */}
        <Link
          href="/"
          onClick={closeMobileMenu}
          aria-label="PromptForge home"
          className="shrink-0"
        >
          <Logo />
        </Link>

        {/* Desktop navigation */}
        <nav className="hidden items-center gap-1 md:flex">
          <Link
            href="/#features"
            className="rounded-xl px-3 py-2 text-sm text-zinc-400 transition hover:bg-white/[0.05] hover:text-white"
          >
            Features
          </Link>

          <Link
            href="/how-it-works"
            className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-zinc-400 transition hover:bg-white/[0.05] hover:text-white"
          >
            How It Works
          </Link>

          <Link
            href="/docs"
            className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-zinc-400 transition hover:bg-white/[0.05] hover:text-white"
          >
            API Docs
          </Link>
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-2">
          {/* Desktop authentication controls */}
          <div className="hidden items-center gap-2 md:flex">
            {authenticated ? (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onOpenHistory}
                >
                  <History className="size-4" />
                  History
                </Button>

                <div className="flex items-center gap-2 rounded-xl border border-white/[0.07] bg-white/[0.03] px-3 py-2">
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

            <a
              href="https://github.com/Salim-Momin/prompt-transformation-lab"
              target="_blank"
              rel="noreferrer"
              aria-label="Open GitHub repository"
              className="flex size-9 items-center justify-center rounded-xl text-zinc-400 transition hover:bg-white/[0.05] hover:text-white"
            >
              <GitHubIcon/>
            </a>

            <Link
              href="/#workspace"
              className="inline-flex h-9 items-center gap-2 rounded-xl bg-violet-500 px-4 text-sm font-medium text-white transition hover:bg-violet-400"
            >
              <Sparkles className="size-4" />
              Start creating
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            type="button"
            onClick={() => {
              setMobileMenuOpen(
                (current) => !current,
              );
            }}
            className="flex size-10 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.03] text-zinc-400 transition hover:bg-white/[0.06] hover:text-white md:hidden"
            aria-label={
              mobileMenuOpen
                ? "Close navigation menu"
                : "Open navigation menu"
            }
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? (
              <X className="size-5" />
            ) : (
              <Menu className="size-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="border-t border-white/[0.06] px-4 pb-4 pt-3 md:hidden">
          <div className="mx-auto w-full max-w-7xl rounded-2xl border border-white/[0.07] bg-[#0d0d12]/95 p-2 shadow-2xl backdrop-blur-xl">
            <Link
              href="/#features"
              onClick={closeMobileMenu}
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-zinc-400 transition hover:bg-white/[0.05] hover:text-white"
            >
              <Sparkles className="size-4 text-violet-400" />
              Features
            </Link>

            <Link
              href="/how-it-works"
              onClick={closeMobileMenu}
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-zinc-400 transition hover:bg-white/[0.05] hover:text-white"
            >
              <Workflow className="size-4 text-violet-400" />
              How It Works
            </Link>

            <Link
              href="/docs"
              onClick={closeMobileMenu}
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-zinc-400 transition hover:bg-white/[0.05] hover:text-white"
            >
              <BookOpen className="size-4 text-violet-400" />
              API Docs
            </Link>

            <a
              href="https://github.com/Salim-Momin/prompt-transformation-lab"
              target="_blank"
              rel="noreferrer"
              onClick={closeMobileMenu}
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-zinc-400 transition hover:bg-white/[0.05] hover:text-white"
            >
              <GitHubIcon className="size-4 text-violet-400" />
              GitHub
            </a>

            <Link
              href="/#workspace"
              onClick={closeMobileMenu}
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-zinc-400 transition hover:bg-white/[0.05] hover:text-white"
            >
              <Sparkles className="size-4 text-violet-400" />
              Start Creating
            </Link>

            <div className="my-2 h-px bg-white/[0.06]" />

            {authenticated && user ? (
              <>
                <button
                  type="button"
                  onClick={() => {
                    closeMobileMenu();
                    onOpenHistory?.();
                  }}
                  className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm text-zinc-400 transition hover:bg-white/[0.05] hover:text-white"
                >
                  <History className="size-4 text-violet-400" />
                  History
                </button>

                <div className="mt-2 flex items-center gap-3 rounded-xl bg-white/[0.025] px-4 py-3">
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-violet-500/10 text-violet-300">
                    <UserRound className="size-4" />
                  </div>

                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-zinc-200">
                      {user.name}
                    </p>

                    <p className="truncate text-xs text-zinc-600">
                      {user.email}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    closeMobileMenu();
                    void onLogout?.();
                  }}
                  className="mt-2 flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm text-red-400 transition hover:bg-red-500/[0.08]"
                >
                  <LogOut className="size-4" />
                  Log out
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => {
                  closeMobileMenu();
                  onOpenAuth?.();
                }}
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-violet-500 px-4 py-3 text-sm font-medium text-white transition hover:bg-violet-400 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <UserRound className="size-4" />
                Log in
              </button>
            )}
          </div>
        </div>
      )}
    </motion.header>
  );
}
