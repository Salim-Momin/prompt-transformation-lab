"use client";

import {
  Clock3,
  History,
  LoaderCircle,
  Trash2,
  X,
} from "lucide-react";
import {
  AnimatePresence,
  motion,
} from "motion/react";
import {
  useState,
} from "react";
import { toast } from "sonner";

import {
  HistoryItem,
} from "@/components/history/history-item";
import {
  HistoryToolbar,
} from "@/components/history/history-toolbar";
import {
  ConfirmDialog,
} from "@/components/ui/confirm-dialog";
import { Button } from "@/components/ui/button";
import {
  usePromptHistory,
} from "@/hooks/use-prompt-history";
import type {
  PromptHistoryRecord,
  PromptHistorySummary,
} from "@/types/history";

interface HistoryDrawerProps {
  open: boolean;
  activeHistoryId?: number | null;
  onClose: () => void;
  onOpenRecord: (
    record: PromptHistoryRecord,
  ) => void;
}

export function HistoryDrawer({
  open,
  activeHistoryId = null,
  onClose,
  onOpenRecord,
}: HistoryDrawerProps) {
  const {
    items,
    total,
    search,
    category,
    favoritesOnly,
    loading,
    recordLoading,
    error,
    setSearch,
    setCategory,
    setFavoritesOnly,
    loadHistory,
    openRecord,
    toggleFavorite,
    removeRecord,
    clearHistory,
  } = usePromptHistory({
    enabled: open,
  });

  const [
    deleteTarget,
    setDeleteTarget,
  ] =
    useState<PromptHistorySummary | null>(
      null,
    );

  const [
    clearDialogOpen,
    setClearDialogOpen,
  ] = useState(false);

  const [
    deleteLoading,
    setDeleteLoading,
  ] = useState(false);

  async function handleOpen(
    item: PromptHistorySummary,
  ) {
    const record = await openRecord(
      item.id,
    );

    if (!record) {
      toast.error(
        "The saved transformation could not be opened.",
      );
      return;
    }

    onOpenRecord(record);
    onClose();

    toast.success(
      "Saved transformation opened",
    );
  }

  async function handleFavorite(
    item: PromptHistorySummary,
  ) {
    await toggleFavorite(item);

    toast.success(
      item.is_favorite
        ? "Removed from favorites"
        : "Added to favorites",
    );
  }

  async function confirmDelete() {
    if (!deleteTarget) {
      return;
    }

    setDeleteLoading(true);

    try {
      const deleted =
        await removeRecord(
          deleteTarget.id,
        );

      if (deleted) {
        toast.success(
          "Saved transformation deleted",
        );

        setDeleteTarget(null);
      }
    } finally {
      setDeleteLoading(false);
    }
  }

  async function confirmClearHistory() {
    setDeleteLoading(true);

    try {
      const deletedCount =
        await clearHistory();

      toast.success(
        `${deletedCount} history record${
          deletedCount === 1
            ? ""
            : "s"
        } deleted`,
      );

      setClearDialogOpen(false);
    } finally {
      setDeleteLoading(false);
    }
  }

  return (
    <>
      <AnimatePresence>
        {open ? (
          <motion.div
            className="fixed inset-0 z-[80]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <button
              type="button"
              aria-label="Close history"
              className="absolute inset-0 bg-black/65 backdrop-blur-sm"
              onClick={onClose}
            />

            <motion.aside
              role="dialog"
              aria-modal="true"
              aria-label="Prompt history"
              initial={{
                x: "-100%",
              }}
              animate={{
                x: 0,
              }}
              exit={{
                x: "-100%",
              }}
              transition={{
                type: "spring",
                stiffness: 280,
                damping: 30,
              }}
              className="absolute inset-y-0 left-0 flex w-full max-w-md flex-col border-r border-white/[0.08] bg-[#09090d]/95 shadow-2xl backdrop-blur-2xl"
            >
              <header className="flex items-start justify-between border-b border-white/[0.07] p-5">
                <div>
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-violet-300">
                    <History className="size-4" />
                    Prompt history
                  </div>

                  <h2 className="mt-2 text-xl font-medium text-white">
                    Previous transformations
                  </h2>

                  <p className="mt-1 text-sm text-zinc-500">
                    {total} saved prompt
                    {total === 1 ? "" : "s"}
                  </p>
                </div>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onClose}
                  aria-label="Close prompt history"
                >
                  <X className="size-5" />
                </Button>
              </header>

              <div className="border-b border-white/[0.07] p-5">
                <HistoryToolbar
                  search={search}
                  category={category}
                  favoritesOnly={
                    favoritesOnly
                  }
                  loading={loading}
                  onSearchChange={
                    setSearch
                  }
                  onCategoryChange={
                    setCategory
                  }
                  onFavoritesChange={
                    setFavoritesOnly
                  }
                  onRefresh={() => {
                    void loadHistory();
                  }}
                />
              </div>

              <div className="flex-1 overflow-y-auto p-4">
                {error ? (
                  <div className="rounded-2xl border border-red-400/20 bg-red-500/[0.07] p-4 text-sm leading-6 text-red-200">
                    {error}
                  </div>
                ) : null}

                {loading &&
                items.length === 0 ? (
                  <div className="flex min-h-64 flex-col items-center justify-center text-center">
                    <LoaderCircle className="size-6 animate-spin text-violet-300" />

                    <p className="mt-4 text-sm text-zinc-500">
                      Loading prompt history...
                    </p>
                  </div>
                ) : null}

                {!loading &&
                items.length === 0 ? (
                  <div className="flex min-h-72 flex-col items-center justify-center rounded-3xl border border-dashed border-white/[0.08] p-8 text-center">
                    <div className="flex size-12 items-center justify-center rounded-2xl border border-white/[0.08] bg-white/[0.03]">
                      <Clock3 className="size-5 text-zinc-600" />
                    </div>

                    <h3 className="mt-5 text-sm font-medium text-zinc-300">
                      No saved prompts found
                    </h3>

                    <p className="mt-2 max-w-60 text-xs leading-5 text-zinc-600">
                      Transform a prompt or adjust your search and filters.
                    </p>
                  </div>
                ) : null}

                <div className="space-y-3">
                  {items.map((item) => (
                    <HistoryItem
                      key={item.id}
                      item={item}
                      selected={
                        activeHistoryId ===
                        item.id
                      }
                      disabled={
                        recordLoading ||
                        deleteLoading
                      }
                      onOpen={(selectedItem) => {
                        void handleOpen(
                          selectedItem,
                        );
                      }}
                      onFavorite={(selectedItem) => {
                        void handleFavorite(
                          selectedItem,
                        );
                      }}
                      onDelete={
                        setDeleteTarget
                      }
                    />
                  ))}
                </div>
              </div>

              {total > 0 ? (
                <footer className="border-t border-white/[0.07] p-4">
                  <Button
                    variant="danger"
                    className="w-full"
                    onClick={() =>
                      setClearDialogOpen(
                        true,
                      )
                    }
                  >
                    <Trash2 className="size-4" />
                    Clear all history
                  </Button>
                </footer>
              ) : null}
            </motion.aside>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <ConfirmDialog
        open={deleteTarget !== null}
        title="Delete saved transformation?"
        description={
          deleteTarget
            ? `This will permanently delete “${deleteTarget.weak_prompt}”.`
            : ""
        }
        confirmLabel="Delete prompt"
        loading={deleteLoading}
        onClose={() =>
          setDeleteTarget(null)
        }
        onConfirm={confirmDelete}
      />

      <ConfirmDialog
        open={clearDialogOpen}
        title="Clear all prompt history?"
        description="Every saved transformation will be permanently deleted. This action cannot be undone."
        confirmLabel="Clear history"
        loading={deleteLoading}
        onClose={() =>
          setClearDialogOpen(false)
        }
        onConfirm={
          confirmClearHistory
        }
      />
    </>
  );
}