import type { PromptTransformation } from "@/types/prompt";

export interface PromptHistorySummary {
  id: number;
  weak_prompt: string;
  category: string;
  role: string;
  is_favorite: boolean;
  created_at: string;
}

export interface PromptHistoryRecord
  extends PromptTransformation {
  id: number;
  is_favorite: boolean;
  created_at: string;
  updated_at: string;
}

export interface PromptHistoryListResponse {
  items: PromptHistorySummary[];
  total: number;
  limit: number;
  offset: number;
}

export interface FavoriteUpdateRequest {
  is_favorite: boolean;
}

export interface DeleteHistoryResponse {
  deleted: boolean;
  history_id: number;
}

export interface ClearHistoryResponse {
  deleted_count: number;
}

export interface HistoryQuery {
  search?: string;
  category?: string;
  favoritesOnly?: boolean;
  limit?: number;
  offset?: number;
}

export interface ApiErrorResponse {
  detail?: string;
}