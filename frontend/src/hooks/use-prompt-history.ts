"use client";

import {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  clearPromptHistory,
  deleteHistoryRecord,
  fetchHistoryRecord,
  fetchPromptHistory,
  updateHistoryFavorite,
} from "@/lib/history-api";

import type {
  PromptHistoryRecord,
  PromptHistorySummary,
} from "@/types/history";

import { useAuth } from "@/providers/auth-provider";

interface UsePromptHistoryOptions {
  enabled?: boolean;
}

export function usePromptHistory({
  enabled = true,
}: UsePromptHistoryOptions = {}) {
  const [items, setItems] = useState<
    PromptHistorySummary[]
  >([]);

  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [favoritesOnly, setFavoritesOnly] =
    useState(false);

  const [loading, setLoading] = useState(false);
  const [recordLoading, setRecordLoading] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  const { user } = useAuth();

  useEffect(() => {
  setItems([]);
  setTotal(0);
  setSearch("");
  setCategory("all");
  setFavoritesOnly(false);
  setError(null);
}, [user?.id]);

  const loadHistory = useCallback(async () => {
    if (!enabled) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetchPromptHistory({
        search,
        category,
        favoritesOnly,
        limit: 50,
        offset: 0,
      });

      setItems(response.items);
      setTotal(response.total);
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Prompt history could not be loaded.",
      );
    } finally {
      setLoading(false);
    }
  }, [
    category,
    enabled,
    favoritesOnly,
    search,
  ]);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      void loadHistory();
    }, 300);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [enabled, loadHistory]);

  const openRecord = useCallback(
    async (
      historyId: number,
    ): Promise<PromptHistoryRecord | null> => {
      setRecordLoading(true);
      setError(null);

      try {
        return await fetchHistoryRecord(historyId);
      } catch (caughtError) {
        setError(
          caughtError instanceof Error
            ? caughtError.message
            : "The saved prompt could not be opened.",
        );

        return null;
      } finally {
        setRecordLoading(false);
      }
    },
    [],
  );

  const toggleFavorite = useCallback(
    async (
      item: PromptHistorySummary,
    ): Promise<void> => {
      const previousItems = items;

      setItems((currentItems) =>
        currentItems.map((currentItem) =>
          currentItem.id === item.id
            ? {
                ...currentItem,
                is_favorite:
                  !currentItem.is_favorite,
              }
            : currentItem,
        ),
      );

      try {
        await updateHistoryFavorite(
          item.id,
          {
            is_favorite:
              !item.is_favorite,
          },
        );

        if (
          favoritesOnly &&
          item.is_favorite
        ) {
          await loadHistory();
        }
      } catch (caughtError) {
        setItems(previousItems);

        setError(
          caughtError instanceof Error
            ? caughtError.message
            : "Favorite state could not be updated.",
        );
      }
    },
    [
      favoritesOnly,
      items,
      loadHistory,
    ],
  );

  const removeRecord = useCallback(
    async (
      historyId: number,
    ): Promise<boolean> => {
      const previousItems = items;

      setItems((currentItems) =>
        currentItems.filter(
          (item) => item.id !== historyId,
        ),
      );

      setTotal((currentTotal) =>
        Math.max(0, currentTotal - 1),
      );

      try {
        await deleteHistoryRecord(historyId);
        return true;
      } catch (caughtError) {
        setItems(previousItems);
        setTotal(previousItems.length);

        setError(
          caughtError instanceof Error
            ? caughtError.message
            : "The history record could not be deleted.",
        );

        return false;
      }
    },
    [items],
  );

  const clearHistory =
    useCallback(async (): Promise<number> => {
      setLoading(true);
      setError(null);

      try {
        const response =
          await clearPromptHistory();

        setItems([]);
        setTotal(0);

        return response.deleted_count;
      } catch (caughtError) {
        setError(
          caughtError instanceof Error
            ? caughtError.message
            : "Prompt history could not be cleared.",
        );

        return 0;
      } finally {
        setLoading(false);
      }
    }, []);

  return {
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
  };
}