"use client";

import { useState } from "react";
import {
  ArrowRight,
  BrainCircuit,
  Braces,
  Layers3,
  Sparkles,
  WandSparkles,
} from "lucide-react";

import { AuthModal } from "@/components/auth/auth-modal";
import { useAuth } from "@/providers/auth-provider";
import { HistoryDrawer } from "@/components/history/history-drawer";
import type { PromptHistoryRecord } from "@/types/history";
import { ThinkingTimeline } from "@/components/ai/thinking-timeline";
import { motion } from "motion/react";

import { Navbar } from "@/components/layout/navbar";
import { PageBackground } from "@/components/layout/page-background";
import { PromptForm } from "@/components/prompt-form";
import { ResultPanel } from "@/components/result-panel";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { transformPrompt } from "@/lib/api";
import type { PromptTransformation } from "@/types/prompt";

const features = [
  {
    icon: BrainCircuit,
    title: "Intent analysis",
    description:
      "Understand what the user is actually trying to accomplish.",
  },
  {
    icon: Layers3,
    title: "Context engineering",
    description:
      "Detect missing audience, requirements, constraints, and examples.",
  },
  {
    icon: Braces,
    title: "Structured output",
    description:
      "Generate consistent, production-ready prompt structures and JSON.",
  },
];

export default function HomePage() {
  const [result, setResult] =
    useState<PromptTransformation | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [historyOpen, setHistoryOpen] =
    useState(false);

  const [
    activeHistoryId,
    setActiveHistoryId,
  ] = useState<number | null>(null);

  const {
    authenticated,
    user,
    logout,
  } = useAuth();

  const [authOpen, setAuthOpen] =
    useState(false);

  function handleOpenHistoryRecord(
    record: PromptHistoryRecord,
  ) {
    setActiveHistoryId(record.id);

    setResult({
      weak_prompt: record.weak_prompt,
      intent: record.intent,
      category: record.category,
      missing_information:
        record.missing_information,
      context_questions:
        record.context_questions,
      assumptions:
        record.assumptions,
      role: record.role,
      goal: record.goal,
      audience: record.audience,
      requirements:
        record.requirements,
      constraints:
        record.constraints,
      output_format:
        record.output_format,
      success_criteria:
        record.success_criteria,
      improved_prompt:
        record.improved_prompt,
    });

    window.setTimeout(() => {
      document
        .getElementById(
          "transformation-result",
        )
        ?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
    }, 100);
  }

  async function handleTransform(prompt: string) {
    if (!authenticated) {
      setAuthOpen(true);
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const transformation = await transformPrompt({
        prompt,
      });

      setResult(transformation);
      setActiveHistoryId(null);

      window.setTimeout(() => {
        document
          .getElementById("transformation-result")
          ?.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
      }, 150);
    } catch (caughtError) {
      const message =
        caughtError instanceof Error
          ? caughtError.message
          : "An unexpected error occurred.";

      setError(message);
    } finally {
      setLoading(false);
    }
  }

  function scrollToWorkspace() {
    if (!authenticated) {
      setAuthOpen(true);
      return;
    }

    document
      .getElementById("prompt-workspace")
      ?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
  }

  function scrollToFeatures() {
    document
      .getElementById("features")
      ?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
  }

  async function handleLogout() {
    await logout();

    setResult(null);
    setActiveHistoryId(null);
    setHistoryOpen(false);
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#050507] text-white">
      <PageBackground />
     <Navbar
  onOpenAuth={() => {
    setAuthOpen(true);
  }}
  onOpenHistory={() => {
    if (!authenticated) {
      setAuthOpen(true);
      return;
    }

    setHistoryOpen(true);
  }}
  onLogout={handleLogout}
/>
      <div className="relative z-10">
        <section className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-7xl flex-col items-center justify-center px-4 py-20 sm:px-6 lg:px-8">
          <motion.div
            initial={{
              opacity: 0,
              y: 18,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.55,
            }}
          >
            <Badge>
              <Sparkles className="size-3.5" />
              Powered by Gemini
            </Badge>
          </motion.div>

          <motion.h1
            initial={{
              opacity: 0,
              y: 24,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.65,
              delay: 0.08,
            }}
            className="mt-7 max-w-5xl text-center text-4xl font-semibold leading-[1.05] tracking-[-0.045em] sm:text-6xl lg:text-7xl"
          >
            Turn rough ideas into{" "}
            <span className="text-gradient">
              precision-engineered prompts.
            </span>
          </motion.h1>

          <motion.p
            initial={{
              opacity: 0,
              y: 22,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.65,
              delay: 0.16,
            }}
            className="mt-6 max-w-2xl text-center text-base leading-7 text-zinc-400 sm:text-lg"
          >
            PromptForge analyzes intent, uncovers missing
            context, and transforms vague instructions into
            structured prompts ready for modern AI models.
          </motion.p>

          <motion.div
            initial={{
              opacity: 0,
              y: 20,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.65,
              delay: 0.24,
            }}
            className="mt-8 flex flex-col items-center gap-3 sm:flex-row"
          >
            <Button
              size="lg"
              onClick={scrollToWorkspace}
            >
              <WandSparkles className="size-5" />
              Transform a prompt
              <ArrowRight className="size-4" />
            </Button>

            <Button
              variant="secondary"
              size="lg"
              onClick={scrollToFeatures}
            >
              See how it works
            </Button>
          </motion.div>

          <motion.div
            id="prompt-workspace"
            initial={{
              opacity: 0,
              y: 35,
              scale: 0.98,
            }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
            }}
            transition={{
              duration: 0.8,
              delay: 0.32,
            }}
            className="mt-16 w-full max-w-5xl scroll-mt-24"
          >
            <PromptForm
              loading={loading}
              onSubmit={handleTransform}
            />

            {loading ? (
              <ThinkingTimeline
                key="active-transformation"
                visible
              />
            ) : null}

            {error ? (
              <motion.div
                initial={{
                  opacity: 0,
                  y: 12,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                role="alert"
                className="mt-5 rounded-2xl border border-red-400/20 bg-red-500/[0.07] p-4 text-sm leading-6 text-red-200 backdrop-blur-xl"
              >
                <span className="font-semibold">
                  Transformation failed:
                </span>{" "}
                {error}
              </motion.div>
            ) : null}
          </motion.div>
        </section>

        {result ? (
          <motion.section
            id="transformation-result"
            initial={{
              opacity: 0,
              y: 32,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.55,
            }}
            className="mx-auto w-full max-w-7xl scroll-mt-24 px-4 pb-24 sm:px-6 lg:px-8"
          >
            <ResultPanel result={result} />
          </motion.section>
        ) : null}

        <section
          id="features"
          className="mx-auto w-full max-w-7xl scroll-mt-24 px-4 pb-24 sm:px-6 lg:px-8"
        >
          <motion.div
            initial={{
              opacity: 0,
              y: 20,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            viewport={{
              once: true,
              amount: 0.3,
            }}
            transition={{
              duration: 0.5,
            }}
            className="mb-10 text-center"
          >
            <Badge>How PromptForge works</Badge>

            <h2 className="mt-5 text-3xl font-semibold tracking-[-0.035em] text-white sm:text-4xl">
              From vague idea to structured prompt
            </h2>

            <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-zinc-500 sm:text-base">
              PromptForge analyzes the original request, detects
              missing information, and creates a complete prompt
              with clear requirements and constraints.
            </p>
          </motion.div>

          <div className="grid gap-4 md:grid-cols-3">
            {features.map((feature, index) => {
              const Icon = feature.icon;

              return (
                <motion.div
                  key={feature.title}
                  initial={{
                    opacity: 0,
                    y: 24,
                  }}
                  whileInView={{
                    opacity: 1,
                    y: 0,
                  }}
                  viewport={{
                    once: true,
                    amount: 0.25,
                  }}
                  transition={{
                    duration: 0.5,
                    delay: index * 0.08,
                  }}
                >
                  <GlassCard className="h-full p-6 transition duration-200 hover:-translate-y-1 hover:border-white/[0.14] hover:bg-white/[0.05]">
                    <div className="flex size-11 items-center justify-center rounded-2xl border border-violet-400/20 bg-violet-500/10">
                      <Icon className="size-5 text-violet-200" />
                    </div>

                    <h3 className="mt-5 text-lg font-medium text-white">
                      {feature.title}
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-zinc-500">
                      {feature.description}
                    </p>
                  </GlassCard>
                </motion.div>
              );
            })}
          </div>
        </section>

        <footer className="border-t border-white/[0.06]">
          <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-between gap-4 px-4 py-8 text-center sm:flex-row sm:px-6 sm:text-left lg:px-8">
            <div>
              <p className="text-sm font-medium text-zinc-300">
                PromptForge AI
              </p>

              <p className="mt-1 text-xs text-zinc-600">
                Transform vague ideas into production-ready AI
                prompts.
              </p>
            </div>

            <p className="text-xs text-zinc-600">
              Built with Next.js, FastAPI, and Gemini.
            </p>
          </div>
        </footer>
      </div>
        {authenticated && user ? (
  <HistoryDrawer
    key={user.id}
    open={historyOpen}
    activeHistoryId={activeHistoryId}
    onClose={() =>
      setHistoryOpen(false)
    }
    onOpenRecord={
      handleOpenHistoryRecord
    }
  />
) : null}
    <AuthModal
  open={authOpen}
  onClose={() =>
    setAuthOpen(false)
  }
/>
    </main>
  );
}