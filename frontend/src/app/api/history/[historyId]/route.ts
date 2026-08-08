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

function isValidHistoryId(
  historyId: string,
): boolean {
  return /^\d+$/.test(historyId);
}

export async function GET(
  _request: Request,
  context: RouteContext,
) {
  const token = await getSessionToken();

  if (!token) {
    return unauthorizedResponse();
  }

  const { historyId } =
    await context.params;

  if (!isValidHistoryId(historyId)) {
    return Response.json(
      {
        detail: "Invalid history ID.",
      },
      {
        status: 400,
      },
    );
  }

  let backendResponse: Response;

  try {
    backendResponse = await fetch(
      `${BACKEND_API_URL}/api/v1/history/${historyId}`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization:
            `Bearer ${token}`,
        },
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

export async function DELETE(
  _request: Request,
  context: RouteContext,
) {
  const token = await getSessionToken();

  if (!token) {
    return unauthorizedResponse();
  }

  const { historyId } =
    await context.params;

  if (!isValidHistoryId(historyId)) {
    return Response.json(
      {
        detail: "Invalid history ID.",
      },
      {
        status: 400,
      },
    );
  }

  let backendResponse: Response;

  try {
    backendResponse = await fetch(
      `${BACKEND_API_URL}/api/v1/history/${historyId}`,
      {
        method: "DELETE",
        headers: {
          Accept: "application/json",
          Authorization:
            `Bearer ${token}`,
        },
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