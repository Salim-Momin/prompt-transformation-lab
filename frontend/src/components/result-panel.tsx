"use client";

import {
  CheckCircle2,
  ChevronDown,
  Sparkles,
} from "lucide-react";
import { motion } from "motion/react";

import { ExportControls } from "@/components/ai/export-controls";
import { PromptScore } from "@/components/ai/prompt-score";
import { GlassCard } from "@/components/ui/glass-card";

import type { PromptTransformation } from "@/types/prompt";

import { SectionCard } from "./section-card";

interface ResultPanelProps {
  result: PromptTransformation;
}

interface ListSectionProps {
  items: string[];
  emptyMessage: string;
}

function ListSection({
  items,
  emptyMessage,
}: ListSectionProps) {
  if (items.length === 0) {
    return <p className="text-sm text-zinc-500">{emptyMessage}</p>;
  }

  return (
    <ul className="space-y-2">
      {items.map((item, index) => (
        <li
          key={`${item}-${index}`}
          className="flex gap-3 text-sm leading-6 text-zinc-300"
        >
          <span className="mt-2 size-1.5 shrink-0 rounded-full bg-violet-400" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export function ResultPanel({
  result,
}: ResultPanelProps) {

  return (
      <div className="space-y-5">
        <PromptScore result={result} />
      <div className="flex flex-col justify-between gap-4 rounded-2xl border border-emerald-400/20 bg-emerald-400/[0.06] p-5 sm:flex-row sm:items-center">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-300">
            Transformation complete
          </p>

          <h2 className="mt-2 text-xl font-semibold text-white">
            Your professional prompt is ready
          </h2>
        </div>

        <span className="w-fit rounded-full border border-white/10 bg-black/20 px-3 py-1.5 text-xs font-medium capitalize text-zinc-300">
          {result.category}
        </span>
      </div>

      <div className="grid gap-5 md:grid-cols-3">
        <SectionCard title="Role">
          <p className="text-sm leading-6 text-zinc-300">
            {result.role}
          </p>
        </SectionCard>

        <SectionCard title="Goal">
          <p className="text-sm leading-6 text-zinc-300">
            {result.goal}
          </p>
        </SectionCard>

        <SectionCard title="Audience">
          <p className="text-sm leading-6 text-zinc-300">
            {result.audience}
          </p>
        </SectionCard>
      </div>

      <SectionCard title="Intent">
        <p className="text-sm leading-6 text-zinc-300">
          {result.intent}
        </p>
      </SectionCard>

      <div className="grid gap-5 lg:grid-cols-2">
        <SectionCard title="Missing information">
          <ListSection
            items={result.missing_information}
            emptyMessage="No important information appears to be missing."
          />
        </SectionCard>

        <SectionCard title="Context questions">
          <ol className="space-y-3">
            {result.context_questions.map((question, index) => (
              <li
                key={`${question}-${index}`}
                className="flex gap-3 text-sm leading-6 text-zinc-300"
              >
                <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-violet-500/15 text-xs font-semibold text-violet-300">
                  {index + 1}
                </span>

                <span>{question}</span>
              </li>
            ))}
          </ol>
        </SectionCard>

        <SectionCard title="Requirements">
          <ListSection
            items={result.requirements}
            emptyMessage="No additional requirements were generated."
          />
        </SectionCard>

        <SectionCard title="Constraints">
          <ListSection
            items={result.constraints}
            emptyMessage="No additional constraints were generated."
          />
        </SectionCard>

        <SectionCard title="Assumptions">
          <ListSection
            items={result.assumptions}
            emptyMessage="No assumptions were required."
          />
        </SectionCard>

        <SectionCard title="Success criteria">
          <ListSection
            items={result.success_criteria}
            emptyMessage="No success criteria were generated."
          />
        </SectionCard>
      </div>

      <SectionCard
        title="Output format"
        description="The response structure requested by the transformed prompt."
      >
        <p className="whitespace-pre-wrap text-sm leading-7 text-zinc-300">
          {result.output_format}
        </p>
      </SectionCard>

      <GlassCard
        glow
        className="overflow-hidden border-violet-400/20 bg-violet-500/[0.05]"
      >
        <div className="flex flex-col justify-between gap-5 border-b border-white/[0.07] px-5 py-5 sm:flex-row sm:items-center sm:px-7">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-violet-300">
              <Sparkles className="size-4" />
              Improved prompt
            </div>

            <h2 className="mt-3 text-xl font-medium text-white">
             Your professional prompt is ready
            </h2>

            <p className="mt-1 text-sm text-zinc-500">
               Copy it directly or export the complete transformation.
            </p>
          </div>

          <div className="flex w-fit items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-500/[0.07] px-3 py-2 text-xs font-medium text-emerald-300">
            <CheckCircle2 className="size-4" />
            Transformation complete
         </div>
       </div>

       <motion.pre
         initial={{
            opacity: 0,
            y: 12,
        }}
        animate={{
            opacity: 1,
            y: 0,
        }}
        transition={{
            delay: 0.15,
            duration: 0.5,
        }}
        className="max-h-[42rem] overflow-auto whitespace-pre-wrap p-5 font-mono text-sm leading-7 text-zinc-200 sm:p-7"
       >
        {result.improved_prompt}
       </motion.pre>

       <div className="border-t border-white/[0.07] p-5 sm:p-7">
        <ExportControls result={result} />
       </div>
      </GlassCard>
        <details className="group overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.025]">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-sm font-medium text-zinc-300 transition hover:bg-white/[0.03]">
            <span>View raw transformation JSON</span>

            <ChevronDown className="size-4 text-zinc-600 transition group-open:rotate-180" />
          </summary>

          <pre className="max-h-[32rem] overflow-auto border-t border-white/[0.07] bg-black/20 p-5 text-xs leading-6 text-zinc-400">
            {JSON.stringify(result, null, 2)}
          </pre>
        </details>
    </div>
  );
}