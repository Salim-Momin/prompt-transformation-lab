import type { ReactNode } from "react";

interface SectionCardProps {
  title: string;
  description?: string;
  children: ReactNode;
}

export function SectionCard({
  title,
  description,
  children,
}: SectionCardProps) {
  return (
    <section className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-sm">
      <div className="mb-4">
        <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-violet-300">
          {title}
        </h2>

        {description ? (
          <p className="mt-1 text-sm leading-6 text-zinc-400">
            {description}
          </p>
        ) : null}
      </div>

      {children}
    </section>
  );
}