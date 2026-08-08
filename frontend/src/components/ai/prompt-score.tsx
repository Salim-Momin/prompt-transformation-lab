"use client";

import {
  AlertCircle,
  CheckCircle2,
  Gauge,
  TrendingUp,
} from "lucide-react";
import { motion } from "motion/react";

import { GlassCard } from "@/components/ui/glass-card";
import type { PromptTransformation } from "@/types/prompt";

interface PromptScoreProps {
  result: PromptTransformation;
}

interface ScoreRingProps {
  score: number;
  label: string;
  description: string;
  improved?: boolean;
}

function getWeakPromptScore(
  result: PromptTransformation,
) {
  const missingCount =
    result.missing_information.length;

  const questionCount =
    result.context_questions.length;

  const promptWordCount =
    result.weak_prompt.trim().split(/\s+/).length;

  let score = 78;

  score -= Math.min(missingCount * 8, 40);
  score -= Math.min(questionCount * 2, 10);

  if (promptWordCount <= 3) {
    score -= 15;
  } else if (promptWordCount <= 7) {
    score -= 8;
  }

  return Math.max(10, Math.min(score, 75));
}

function getImprovedPromptScore(
  result: PromptTransformation,
) {
  let score = 75;

  if (result.role) score += 3;
  if (result.goal) score += 3;
  if (result.audience) score += 3;
  if (result.requirements.length >= 3) score += 4;
  if (result.constraints.length >= 2) score += 4;
  if (result.success_criteria.length >= 2) score += 4;
  if (result.output_format) score += 4;

  return Math.min(score, 100);
}

function getScoreLabel(score: number) {
  if (score >= 90) return "Excellent";
  if (score >= 75) return "Strong";
  if (score >= 55) return "Average";
  if (score >= 35) return "Weak";

  return "Very weak";
}

function ScoreRing({
  score,
  label,
  description,
  improved = false,
}: ScoreRingProps) {
  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const dashOffset =
    circumference - (score / 100) * circumference;

  return (
    <div className="flex flex-col items-center text-center">
      <div className="relative size-36">
        <svg
          viewBox="0 0 120 120"
          className="-rotate-90"
          aria-label={`${label}: ${score} out of 100`}
        >
          <circle
            cx="60"
            cy="60"
            r={radius}
            fill="none"
            stroke="rgba(255,255,255,0.06)"
            strokeWidth="8"
          />

          <motion.circle
            cx="60"
            cy="60"
            r={radius}
            fill="none"
            stroke={
              improved
                ? "url(#improved-score-gradient)"
                : "url(#weak-score-gradient)"
            }
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{
              strokeDashoffset: circumference,
            }}
            animate={{
              strokeDashoffset: dashOffset,
            }}
            transition={{
              duration: 1.1,
              delay: 0.2,
              ease: "easeOut",
            }}
          />

          <defs>
            <linearGradient
              id="weak-score-gradient"
              x1="0"
              y1="0"
              x2="1"
              y2="1"
            >
              <stop
                offset="0%"
                stopColor="#f59e0b"
              />
              <stop
                offset="100%"
                stopColor="#ef4444"
              />
            </linearGradient>

            <linearGradient
              id="improved-score-gradient"
              x1="0"
              y1="0"
              x2="1"
              y2="1"
            >
              <stop
                offset="0%"
                stopColor="#8b5cf6"
              />
              <stop
                offset="100%"
                stopColor="#22d3ee"
              />
            </linearGradient>
          </defs>
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            initial={{
              opacity: 0,
              scale: 0.8,
            }}
            animate={{
              opacity: 1,
              scale: 1,
            }}
            transition={{
              delay: 0.35,
            }}
            className="text-3xl font-semibold tracking-tight text-white"
          >
            {score}
          </motion.span>

          <span className="text-xs text-zinc-600">
            out of 100
          </span>
        </div>
      </div>

      <h3 className="mt-3 text-sm font-medium text-white">
        {label}
      </h3>

      <p className="mt-1 text-xs text-zinc-500">
        {getScoreLabel(score)}
      </p>

      <p className="mt-3 max-w-56 text-xs leading-5 text-zinc-600">
        {description}
      </p>
    </div>
  );
}

export function PromptScore({
  result,
}: PromptScoreProps) {
  const weakScore = getWeakPromptScore(result);
  const improvedScore =
    getImprovedPromptScore(result);

  const improvement =
    improvedScore - weakScore;

  return (
    <GlassCard className="p-6 sm:p-8">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-violet-300">
            <Gauge className="size-4" />
            Prompt quality analysis
          </div>

          <h2 className="mt-3 text-xl font-medium tracking-tight text-white">
            See what changed
          </h2>

          <p className="mt-2 max-w-xl text-sm leading-6 text-zinc-500">
            The scores estimate how clearly each prompt defines its context,
            requirements, audience, constraints, and expected output.
          </p>
        </div>

        <div className="flex w-fit items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-500/[0.08] px-3 py-2 text-xs font-medium text-emerald-300">
          <TrendingUp className="size-4" />
          +{improvement} point improvement
        </div>
      </div>

      <div className="mt-9 grid gap-10 sm:grid-cols-2">
        <ScoreRing
          score={weakScore}
          label="Original prompt"
          description="Limited context and insufficient instructions reduce consistency."
        />

        <ScoreRing
          score={improvedScore}
          label="Improved prompt"
          description="Clear structure, requirements, and success criteria improve reliability."
          improved
        />
      </div>

      <div className="mt-9 grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-amber-400/15 bg-amber-500/[0.05] p-5">
          <div className="flex items-center gap-2 text-sm font-medium text-amber-200">
            <AlertCircle className="size-4" />
            Issues detected
          </div>

          {result.missing_information.length > 0 ? (
            <ul className="mt-4 space-y-2">
              {result.missing_information
                .slice(0, 5)
                .map((item) => (
                  <li
                    key={item}
                    className="flex gap-3 text-sm leading-6 text-zinc-400"
                  >
                    <span className="mt-2 size-1.5 shrink-0 rounded-full bg-amber-400" />
                    {item}
                  </li>
                ))}
            </ul>
          ) : (
            <p className="mt-4 text-sm text-zinc-500">
              No major issues were detected.
            </p>
          )}
        </div>

        <div className="rounded-2xl border border-emerald-400/15 bg-emerald-500/[0.05] p-5">
          <div className="flex items-center gap-2 text-sm font-medium text-emerald-200">
            <CheckCircle2 className="size-4" />
            Improvements added
          </div>

          <ul className="mt-4 space-y-2">
            {[
              "Expert role and clear goal",
              "Defined target audience",
              "Specific requirements",
              "Practical constraints",
              "Output format and success criteria",
            ].map((item) => (
              <li
                key={item}
                className="flex gap-3 text-sm leading-6 text-zinc-400"
              >
                <span className="mt-2 size-1.5 shrink-0 rounded-full bg-emerald-400" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </GlassCard>
  );
}