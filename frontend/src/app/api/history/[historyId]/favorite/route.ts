import {
  BACKEND_API_URL,
  backendUnavailableResponse,
  forwardBackendResponse,
  getSessionToken,
  unauthorizedResponse,
} from "@/lib/backend-proxy";

interface RouteContext {
  params: Promise<{
    historyId: string;
  }>;
}

interface FavoriteRequestBody {
  is_favorite?: boolean;
}

export async function PATCH(
  request: Request,
  context: RouteContext,
) {
  const token = await getSessionToken();

  if (!token) {
    return unauthorizedResponse();
  }

  const { historyId } =
    await context.params;

  if (!/^\d+$/.test(historyId)) {
    return Response.json(
      {
        detail: "Invalid history ID.",
      },
      {
        status: 400,
      },
    );
  }

  let body: FavoriteRequestBody;

  try {
    body =
      (await request.json()) as FavoriteRequestBody;
  } catch {
    return Response.json(
      {
        detail: "Invalid request body.",
      },
      {
        status: 400,
      },
    );
  }

  if (
    typeof body.is_favorite !==
    "boolean"
  ) {
    return Response.json(
      {
        detail:
          "is_favorite must be a boolean.",
      },
      {
        status: 400,
      },
    );
  }

  let backendResponse: Response;

  try {
    backendResponse = await fetch(
      `${BACKEND_API_URL}/api/v1/history/${historyId}/favorite`,
      {
        method: "PATCH",
        headers: {
          "Content-Type":
            "application/json",
          Accept: "application/json",
          Authorization:
            `Bearer ${token}`,
        },
        body: JSON.stringify(body),
        cache: "no-store",
      },
    );
  } catch {
    return backendUnavailableResponse();
  }

  return forwardBackendResponse(
    backendResponse,
  );
}