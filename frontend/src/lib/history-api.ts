import type {
  ApiErrorResponse,
  ClearHistoryResponse,
  DeleteHistoryResponse,
  FavoriteUpdateRequest,
  HistoryQuery,
  PromptHistoryListResponse,
  PromptHistoryRecord,
} from "@/types/history";

async function parseApiError(
  response: Response,
  fallback: string,
): Promise<string> {
  try {
    const errorData =
      (await response.json()) as ApiErrorResponse;

    return errorData.detail || fallback;
  } catch {
    return fallback;
  }
}

function handleUnauthorized(
  response: Response,
): void {
  if (response.status !== 401) {
    return;
  }

  throw new Error(
    "Your session has expired. Please log in again.",
  );
}

export async function fetchPromptHistory(
  query: HistoryQuery = {},
): Promise<PromptHistoryListResponse> {
  const parameters =
    new URLSearchParams();

  parameters.set(
    "limit",
    String(query.limit ?? 50),
  );

  parameters.set(
    "offset",
    String(query.offset ?? 0),
  );

  if (query.search?.trim()) {
    parameters.set(
      "search",
      query.search.trim(),
    );
  }

  if (
    query.category &&
    query.category !== "all"
  ) {
    parameters.set(
      "category",
      query.category,
    );
  }

  if (query.favoritesOnly) {
    parameters.set(
      "favorites_only",
      "true",
    );
  }

  let response: Response;

  try {
    response = await fetch(
      `/api/history?${parameters.toString()}`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
        cache: "no-store",
      },
    );
  } catch {
    throw new Error(
      "Could not connect to the history service.",
    );
  }

  handleUnauthorized(response);

  if (!response.ok) {
    throw new Error(
      await parseApiError(
        response,
        "Prompt history could not be loaded.",
      ),
    );
  }

  return (
    await response.json()
  ) as PromptHistoryListResponse;
}

export async function fetchHistoryRecord(
  historyId: number,
): Promise<PromptHistoryRecord> {
  let response: Response;

  try {
    response = await fetch(
      `/api/history/${historyId}`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
        cache: "no-store",
      },
    );
  } catch {
    throw new Error(
      "Could not connect to the history service.",
    );
  }

  handleUnauthorized(response);

  if (!response.ok) {
    throw new Error(
      await parseApiError(
        response,
        "The saved transformation could not be loaded.",
      ),
    );
  }

  return (
    await response.json()
  ) as PromptHistoryRecord;
}

export async function updateHistoryFavorite(
  historyId: number,
  request: FavoriteUpdateRequest,
): Promise<PromptHistoryRecord> {
  let response: Response;

  try {
    response = await fetch(
      `/api/history/${historyId}/favorite`,
      {
        method: "PATCH",
        headers: {
          "Content-Type":
            "application/json",
        },
        body: JSON.stringify(request),
      },
    );
  } catch {
    throw new Error(
      "Could not connect to the history service.",
    );
  }

  handleUnauthorized(response);

  if (!response.ok) {
    throw new Error(
      await parseApiError(
        response,
        "The favorite state could not be updated.",
      ),
    );
  }

  return (
    await response.json()
  ) as PromptHistoryRecord;
}

export async function deleteHistoryRecord(
  historyId: number,
): Promise<DeleteHistoryResponse> {
  let response: Response;

  try {
    response = await fetch(
      `/api/history/${historyId}`,
      {
        method: "DELETE",
      },
    );
  } catch {
    throw new Error(
      "Could not connect to the history service.",
    );
  }

  handleUnauthorized(response);

  if (!response.ok) {
    throw new Error(
      await parseApiError(
        response,
        "The saved transformation could not be deleted.",
      ),
    );
  }

  return (
    await response.json()
  ) as DeleteHistoryResponse;
}

export async function clearPromptHistory():
Promise<ClearHistoryResponse> {
  let response: Response;

  try {
    response = await fetch(
      "/api/history",
      {
        method: "DELETE",
      },
    );
  } catch {
    throw new Error(
      "Could not connect to the history service.",
    );
  }

  handleUnauthorized(response);

  if (!response.ok) {
    throw new Error(
      await parseApiError(
        response,
        "Prompt history could not be cleared.",
      ),
    );
  }

  return (
    await response.json()
  ) as ClearHistoryResponse;
}