import {
  BACKEND_API_URL,
  backendUnavailableResponse,
  forwardBackendResponse,
  getSessionToken,
  unauthorizedResponse,
} from "@/lib/backend-proxy";

interface TransformRequestBody {
  prompt?: string;
}

export async function POST(
  request: Request,
) {
  const token = await getSessionToken();

  if (!token) {
    return unauthorizedResponse();
  }

  let body: TransformRequestBody;

  try {
    body =
      (await request.json()) as TransformRequestBody;
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

  let backendResponse: Response;

  try {
    backendResponse = await fetch(
      `${BACKEND_API_URL}/api/v1/transform`,
      {
        method: "POST",
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