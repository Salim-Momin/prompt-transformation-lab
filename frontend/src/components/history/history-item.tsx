"use client";

import {
  Clock3,
  ExternalLink,
  Star,
  Trash2,
} from "lucide-react";

import { cn } from "@/lib/utils";
import type {
  PromptHistorySummary,
} from "@/types/history";

interface HistoryItemProps {
  item: PromptHistorySummary;
  selected?: boolean;
  disabled?: boolean;
  onOpen: (
    item: PromptHistorySummary,
  ) => void;
  onFavorite: (
    item: PromptHistorySummary,
  ) => void;
  onDelete: (
    item: PromptHistorySummary,
  ) => void;
}

function formatHistoryDate(
  value: string,
): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Unknown date";
  }

  const now = new Date();
  const difference =
    now.getTime() - date.getTime();

  const minutes = Math.floor(
    difference / 60_000,
  );

  if (minutes < 1) {
    return "Just now";
  }

  if (minutes < 60) {
    return `${minutes}m ago`;
  }

  const hours = Math.floor(
    minutes / 60,
  );

  if (hours < 24) {
    return `${hours}h ago`;
  }

  const days = Math.floor(
    hours / 24,
  );

  if (days < 7) {
    return `${days}d ago`;
  }

  return new Intl.DateTimeFormat(
    undefined,
    {
      month: "short",
      day: "numeric",
      year:
        date.getFullYear() !==
        now.getFullYear()
          ? "numeric"
          : undefined,
    },
  ).format(date);
}

export function HistoryItem({
  item,
  selected = false,
  disabled = false,
  onOpen,
  onFavorite,
  onDelete,
}: HistoryItemProps) {
  return (
    <article
      className={cn(
        "group rounded-2xl border p-4 transition",
        selected
          ? "border-violet-400/30 bg-violet-500/[0.08]"
          : "border-white/[0.065] bg-white/[0.025] hover:border-white/[0.12] hover:bg-white/[0.045]",
      )}
    >
      <button
        type="button"
        disabled={disabled}
        onClick={() => onOpen(item)}
        className="w-full text-left"
      >
        <div className="flex items-start justify-between gap-3">
          <span className="rounded-full border border-violet-400/15 bg-violet-500/[0.08] px-2.5 py-1 text-[11px] font-medium capitalize text-violet-300">
            {item.category}
          </span>

          <ExternalLink className="size-4 text-zinc-700 transition group-hover:text-zinc-400" />
        </div>

        <h3 className="mt-3 line-clamp-2 text-sm font-medium leading-6 text-zinc-200">
          {item.weak_prompt}
        </h3>

        <p className="mt-2 line-clamp-1 text-xs text-zinc-600">
          {item.role}
        </p>
      </button>

      <div className="mt-4 flex items-center justify-between border-t border-white/[0.05] pt-3">
        <span className="flex items-center gap-1.5 text-xs text-zinc-600">
          <Clock3 className="size-3.5" />
          {formatHistoryDate(
            item.created_at,
          )}
        </span>

        <div className="flex items-center gap-1">
          <button
            type="button"
            disabled={disabled}
            onClick={() =>
              onFavorite(item)
            }
            aria-label={
              item.is_favorite
                ? "Remove from favorites"
                : "Add to favorites"
            }
            className={cn(
              "flex size-8 items-center justify-center rounded-lg transition",
              item.is_favorite
                ? "bg-amber-500/10 text-amber-300"
                : "text-zinc-700 hover:bg-white/[0.05] hover:text-zinc-300",
            )}
          >
            <Star
              className={cn(
                "size-4",
                item.is_favorite &&
                  "fill-current",
              )}
            />
          </button>

          <button
            type="button"
            disabled={disabled}
            onClick={() =>
              onDelete(item)
            }
            aria-label="Delete saved prompt"
            className="flex size-8 items-center justify-center rounded-lg text-zinc-700 transition hover:bg-red-500/10 hover:text-red-300"
          >
            <Trash2 className="size-4" />
          </button>
        </div>
      </div>
    </article>
  );
}