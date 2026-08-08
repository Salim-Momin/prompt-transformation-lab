"use client";

import type { FormEvent, KeyboardEvent } from "react";
import { useState } from "react";
import { Sparkles, WandSparkles } from "lucide-react";
import { motion } from "motion/react";

import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";

interface PromptFormProps {
  loading: boolean;
  onSubmit: (prompt: string) => Promise<void>;
}

const examplePrompts = [
  "Explain machine learning",
  "Build a responsive login page",
  "Create a marketing strategy",
  "Write a LinkedIn post",
];

export function PromptForm({
  loading,
  onSubmit,
}: PromptFormProps) {
  const [prompt, setPrompt] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const cleanedPrompt = prompt.trim();

    if (cleanedPrompt.length < 2 || loading) {
      return;
    }

    await onSubmit(cleanedPrompt);
  }

  function handleKeyboardShortcut(
    event: KeyboardEvent<HTMLTextAreaElement>,
  ) {
    if ((event.ctrlKey || event.metaKey) && event.key === "Enter") {
      event.preventDefault();
      event.currentTarget.form?.requestSubmit();
    }
  }

  return (
    <GlassCard glow className="p-2">
      <form
        onSubmit={handleSubmit}
        className="rounded-[1.4rem] border border-white/[0.06] bg-black/25 p-5 sm:p-8"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-violet-300">
              Prompt workspace
            </p>

            <h2 className="mt-2 text-xl font-medium tracking-tight text-white sm:text-2xl">
              What would you like to improve?
            </h2>

            <p className="mt-2 text-sm leading-6 text-zinc-500">
              Enter a rough instruction and PromptForge will transform it into
              a structured professional prompt.
            </p>
          </div>

          <div className="hidden rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs text-zinc-500 sm:block">
            {prompt.length.toLocaleString()} / 10,000
          </div>
        </div>

        <div className="relative mt-7">
          <textarea
            id="weak-prompt"
            value={prompt}
            onChange={(event) => setPrompt(event.target.value)}
            onKeyDown={handleKeyboardShortcut}
            placeholder="Example: Explain machine learning..."
            maxLength={10_000}
            disabled={loading}
            aria-label="Weak prompt"
            className="min-h-48 w-full resize-y rounded-2xl border border-white/[0.08] bg-black/30 p-5 pr-14 text-base leading-7 text-white outline-none transition duration-200 placeholder:text-zinc-600 hover:border-white/[0.13] focus:border-violet-400/50 focus:bg-black/40 focus:ring-4 focus:ring-violet-500/10 disabled:cursor-not-allowed disabled:opacity-60"
          />

          <motion.div
            animate={
              prompt.length > 0
                ? { opacity: 1, scale: 1 }
                : { opacity: 0, scale: 0.8 }
            }
            className="pointer-events-none absolute right-4 top-4 flex size-8 items-center justify-center rounded-xl border border-violet-400/20 bg-violet-500/10"
          >
            <Sparkles className="size-4 text-violet-300" />
          </motion.div>
        </div>

        <div className="mt-5">
          <p className="mb-2 text-xs font-medium uppercase tracking-[0.16em] text-zinc-600">
            Try an example
          </p>

          <div className="flex flex-wrap gap-2">
            {examplePrompts.map((example) => (
              <button
                key={example}
                type="button"
                onClick={() => setPrompt(example)}
                disabled={loading}
                className="rounded-full border border-white/[0.08] bg-white/[0.035] px-3 py-1.5 text-xs text-zinc-400 transition hover:border-violet-400/30 hover:bg-violet-500/10 hover:text-violet-100 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {example}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <p className="text-sm text-zinc-500">
            Press Ctrl + Enter to transform.
          </p>

          <Button
            type="submit"
            loading={loading}
            disabled={prompt.trim().length < 2}
            className="w-full sm:w-auto"
          >
            <WandSparkles className="size-4" />
            {loading ? "Transforming..." : "Transform prompt"}
          </Button>
        </div>
      </form>
    </GlassCard>
  );
}