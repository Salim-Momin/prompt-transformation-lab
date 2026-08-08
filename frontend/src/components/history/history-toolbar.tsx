"use client";

import {
  RefreshCw,
  Search,
  Star,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface HistoryToolbarProps {
  search: string;
  category: string;
  favoritesOnly: boolean;
  loading: boolean;
  onSearchChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onFavoritesChange: (value: boolean) => void;
  onRefresh: () => void;
}

const categories = [
  "all",
  "education",
  "coding",
  "business",
  "content",
  "research",
  "productivity",
  "general",
];

export function HistoryToolbar({
  search,
  category,
  favoritesOnly,
  loading,
  onSearchChange,
  onCategoryChange,
  onFavoritesChange,
  onRefresh,
}: HistoryToolbarProps) {
  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-zinc-600" />

        <input
          type="search"
          value={search}
          onChange={(event) =>
            onSearchChange(event.target.value)
          }
          placeholder="Search prompt history..."
          className="h-11 w-full rounded-2xl border border-white/[0.08] bg-black/25 pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-violet-400/40 focus:ring-4 focus:ring-violet-500/10"
        />
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {categories.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() =>
              onCategoryChange(item)
            }
            className={cn(
              "shrink-0 rounded-full border px-3 py-1.5 text-xs capitalize transition",
              category === item
                ? "border-violet-400/30 bg-violet-500/15 text-violet-200"
                : "border-white/[0.07] bg-white/[0.025] text-zinc-500 hover:bg-white/[0.05] hover:text-zinc-300",
            )}
          >
            {item}
          </button>
        ))}
      </div>

      <div className="flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={() =>
            onFavoritesChange(
              !favoritesOnly,
            )
          }
          className={cn(
            "flex min-h-10 items-center gap-2 rounded-xl border px-3 text-sm transition",
            favoritesOnly
              ? "border-amber-400/25 bg-amber-500/10 text-amber-200"
              : "border-white/[0.07] bg-white/[0.025] text-zinc-500 hover:text-white",
          )}
        >
          <Star
            className={cn(
              "size-4",
              favoritesOnly &&
                "fill-current",
            )}
          />

          Favorites
        </button>

        <Button
          variant="ghost"
          size="icon"
          onClick={onRefresh}
          disabled={loading}
          aria-label="Refresh prompt history"
        >
          <RefreshCw
            className={cn(
              "size-4",
              loading && "animate-spin",
            )}
          />
        </Button>
      </div>
    </div>
  );
}