import {
  BACKEND_API_URL,
  backendUnavailableResponse,
  forwardBackendResponse,
  getSessionToken,
  unauthorizedResponse,
} from "@/lib/backend-proxy";

export async function GET(
  request: Request,
) {
  const token = await getSessionToken();

  if (!token) {
    return unauthorizedResponse();
  }

  const requestUrl = new URL(
    request.url,
  );

  const queryString =
    requestUrl.searchParams.toString();

  const backendUrl = queryString
    ? `${BACKEND_API_URL}/api/v1/history?${queryString}`
    : `${BACKEND_API_URL}/api/v1/history`;

  let backendResponse: Response;

  try {
    backendResponse = await fetch(
      backendUrl,
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

export async function DELETE() {
  const token = await getSessionToken();

  if (!token) {
    return unauthorizedResponse();
  }

  let backendResponse: Response;

  try {
    backendResponse = await fetch(
      `${BACKEND_API_URL}/api/v1/history`,
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