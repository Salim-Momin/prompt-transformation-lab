import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  BrainCircuit,
  CheckCircle2,
  FileText,
  Search,
  Sparkles,
  WandSparkles,
} from "lucide-react";

const steps = [
  {
    number: "01",
    title: "Enter a weak prompt",
    description:
      "Start with a simple or incomplete request such as “Explain machine learning.”",
    icon: FileText,
  },
  {
    number: "02",
    title: "PromptForge analyzes intent",
    description:
      "The system identifies your goal, audience, missing context, constraints, and expected output.",
    icon: Search,
  },
  {
    number: "03",
    title: "Gemini structures the request",
    description:
      "Gemini converts the original idea into a structured prompt-engineering specification.",
    icon: BrainCircuit,
  },
  {
    number: "04",
    title: "Your prompt is transformed",
    description:
      "PromptForge generates role, goal, audience, requirements, constraints, context questions, and output format.",
    icon: WandSparkles,
  },
  {
    number: "05",
    title: "Review the final prompt",
    description:
      "Compare the original request with the improved prompt and inspect its quality score.",
    icon: CheckCircle2,
  },
  {
    number: "06",
    title: "Save and reuse",
    description:
      "Authenticated users can revisit transformations through searchable private prompt history.",
    icon: Sparkles,
  },
];

export default function HowItWorksPage() {
  return (
    <main className="min-h-screen bg-[#08080c] text-white">
      <div className="mx-auto w-full max-w-6xl px-5 py-10 sm:px-8 lg:px-10">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-zinc-500 transition hover:text-white"
        >
          <ArrowLeft className="size-4" />
          Back to PromptForge
        </Link>

        <section className="pb-16 pt-20 text-center">
          <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-violet-400/20 bg-violet-500/[0.08] px-4 py-2 text-xs font-medium uppercase tracking-[0.18em] text-violet-300">
            <Sparkles className="size-3.5" />
            How it works
          </div>

          <h1 className="mx-auto mt-6 max-w-4xl text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
            From vague idea to
            <span className="text-violet-300">
              {" "}
              professional prompt.
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-zinc-500">
            PromptForge analyzes what your request is missing,
            structures the context, and transforms it into a
            reusable prompt designed for better AI responses.
          </p>
        </section>

        <section className="grid gap-4 md:grid-cols-2">
          {steps.map((step) => {
            const Icon = step.icon;

            return (
              <article
                key={step.number}
                className="group relative overflow-hidden rounded-3xl border border-white/[0.07] bg-white/[0.025] p-6 transition hover:border-violet-400/20 hover:bg-white/[0.04]"
              >
                <div className="absolute right-5 top-4 text-5xl font-semibold text-white/[0.025]">
                  {step.number}
                </div>

                <div className="flex size-11 items-center justify-center rounded-2xl border border-violet-400/15 bg-violet-500/[0.08] text-violet-300">
                  <Icon className="size-5" />
                </div>

                <p className="mt-6 text-xs font-semibold tracking-[0.18em] text-violet-400">
                  STEP {step.number}
                </p>

                <h2 className="mt-2 text-xl font-medium">
                  {step.title}
                </h2>

                <p className="mt-3 max-w-lg text-sm leading-7 text-zinc-500">
                  {step.description}
                </p>
              </article>
            );
          })}
        </section>

        <section className="mt-20 overflow-hidden rounded-[2rem] border border-white/[0.08] bg-gradient-to-br from-violet-500/[0.08] to-transparent p-8 sm:p-10">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-violet-300">
            Example
          </p>

          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            <div className="rounded-2xl border border-white/[0.07] bg-black/20 p-5">
              <p className="text-xs uppercase tracking-wider text-zinc-600">
                Weak prompt
              </p>

              <p className="mt-4 text-lg text-zinc-300">
                Explain machine learning.
              </p>
            </div>

            <div className="rounded-2xl border border-violet-400/15 bg-violet-500/[0.05] p-5">
              <p className="text-xs uppercase tracking-wider text-violet-400">
                PromptForge result
              </p>

              <p className="mt-4 text-sm leading-7 text-zinc-300">
                Act as an experienced machine-learning educator.
                Explain machine learning to a beginner computer
                science student using intuitive definitions,
                practical examples, core learning types, and a
                concise comparison between supervised,
                unsupervised, and reinforcement learning.
              </p>
            </div>
          </div>
        </section>

        <div className="mt-12 flex justify-center">
          <Link
            href="/"
            className="inline-flex h-12 items-center gap-2 rounded-xl bg-violet-500 px-6 text-sm font-medium text-white transition hover:bg-violet-400"
          >
            Try PromptForge
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </div>
    </main>
  );
}