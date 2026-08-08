"use client";

import { useEffect, useState } from "react";
import {
  BrainCircuit,
  Check,
  FileSearch,
  Layers3,
  Sparkles,
  WandSparkles,
} from "lucide-react";
import {
  AnimatePresence,
  motion,
} from "motion/react";

import { GlassCard } from "@/components/ui/glass-card";
import { cn } from "@/lib/utils";

interface ThinkingTimelineProps {
  visible: boolean;
}

const steps = [
  {
    label: "Analyzing intent",
    description:
      "Understanding the goal behind your request.",
    icon: BrainCircuit,
  },
  {
    label: "Finding missing context",
    description:
      "Detecting audience, examples, and background details.",
    icon: FileSearch,
  },
  {
    label: "Building requirements",
    description:
      "Creating clear instructions and constraints.",
    icon: Layers3,
  },
  {
    label: "Engineering final prompt",
    description:
      "Producing the complete professional prompt.",
    icon: WandSparkles,
  },
];

export function ThinkingTimeline({
  visible,
}: ThinkingTimelineProps) {
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    if (!visible) {
      return;
    }

    const interval = window.setInterval(() => {
      setActiveStep((currentStep) => {
        if (currentStep >= steps.length - 1) {
          return currentStep;
        }

        return currentStep + 1;
      });
    }, 1100);

    return () => {
      window.clearInterval(interval);
    };
  }, [visible]);

  const displayedStep = visible ? activeStep : 0;

  const progress =
    ((displayedStep + 1) / steps.length) * 100;

  return (
    <AnimatePresence>
      {visible ? (
        <motion.div
          initial={{
            opacity: 0,
            y: 20,
            height: 0,
          }}
          animate={{
            opacity: 1,
            y: 0,
            height: "auto",
          }}
          exit={{
            opacity: 0,
            y: -12,
            height: 0,
          }}
          transition={{
            duration: 0.35,
          }}
          className="mt-6 overflow-hidden"
        >
          <GlassCard className="p-6 sm:p-7">
            <div className="flex items-start gap-4">
              <div className="relative flex size-11 shrink-0 items-center justify-center rounded-2xl border border-violet-400/20 bg-violet-500/10">
                <motion.div
                  animate={{
                    rotate: 360,
                  }}
                  transition={{
                    duration: 4,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "linear",
                  }}
                >
                  <Sparkles className="size-5 text-violet-200" />
                </motion.div>

                <span className="absolute inset-0 animate-ping rounded-2xl border border-violet-400/15" />
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-violet-300">
                  PromptForge is thinking
                </p>

                <h2 className="mt-2 text-lg font-medium text-white">
                  Engineering your professional prompt
                </h2>

                <p className="mt-1 text-sm leading-6 text-zinc-500">
                  Gemini is analyzing your request and creating
                  a structured transformation.
                </p>
              </div>

              <span className="hidden rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-zinc-400 sm:block">
                {Math.round(progress)}%
              </span>
            </div>

            <div className="mt-6 h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-violet-500 via-purple-400 to-cyan-400"
                animate={{
                  width: `${progress}%`,
                }}
                transition={{
                  duration: 0.5,
                  ease: "easeOut",
                }}
              />
            </div>

            <div className="mt-7 space-y-3">
              {steps.map((step, index) => {
                const Icon = step.icon;

                const completed =
                  index < displayedStep;

                const active =
                  index === displayedStep;

                return (
                  <motion.div
                    key={step.label}
                    animate={{
                      opacity:
                        index <= displayedStep
                          ? 1
                          : 0.4,
                    }}
                    className={cn(
                      "flex items-start gap-4 rounded-2xl border p-4 transition",
                      active
                        ? "border-violet-400/25 bg-violet-500/[0.07]"
                        : "border-transparent",
                    )}
                  >
                    <div
                      className={cn(
                        "flex size-9 shrink-0 items-center justify-center rounded-xl border transition",
                        completed
                          ? "border-emerald-400/20 bg-emerald-500/10 text-emerald-300"
                          : active
                            ? "border-violet-400/25 bg-violet-500/10 text-violet-200"
                            : "border-white/[0.07] bg-white/[0.03] text-zinc-600",
                      )}
                    >
                      {completed ? (
                        <Check className="size-4" />
                      ) : (
                        <Icon
                          className={cn(
                            "size-4",
                            active &&
                              "animate-pulse",
                          )}
                        />
                      )}
                    </div>

                    <div>
                      <p
                        className={cn(
                          "text-sm font-medium",
                          index <= displayedStep
                            ? "text-zinc-200"
                            : "text-zinc-600",
                        )}
                      >
                        {step.label}
                      </p>

                      <p className="mt-1 text-xs leading-5 text-zinc-600">
                        {step.description}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </GlassCard>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}