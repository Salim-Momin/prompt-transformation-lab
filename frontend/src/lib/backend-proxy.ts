import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { AUTH_COOKIE_NAME } from "@/lib/auth-cookie";

export const BACKEND_API_URL =
  process.env.BACKEND_API_URL ??
  "http://127.0.0.1:8000";

export async function getSessionToken():
Promise<string | null> {
  const cookieStore = await cookies();

  return (
    cookieStore.get(AUTH_COOKIE_NAME)?.value ??
    null
  );
}

export function unauthorizedResponse() {
  return NextResponse.json(
    {
      detail: "Not authenticated.",
    },
    {
      status: 401,
    },
  );
}

export async function forwardBackendResponse(
  backendResponse: Response,
): Promise<NextResponse> {
  const contentType =
    backendResponse.headers.get(
      "content-type",
    ) ?? "";

  if (
    contentType.includes(
      "application/json",
    )
  ) {
    let data: unknown;

    try {
      data = await backendResponse.json();
    } catch {
      data = {
        detail:
          "The backend returned invalid JSON.",
      };
    }

    const response = NextResponse.json(
      data,
      {
        status: backendResponse.status,
      },
    );

    if (backendResponse.status === 401) {
      response.cookies.delete(
        AUTH_COOKIE_NAME,
      );
    }

    return response;
  }

  const text =
    await backendResponse.text();

  const response = new NextResponse(text, {
    status: backendResponse.status,
    headers: {
      "Content-Type":
        contentType || "text/plain",
    },
  });

  if (backendResponse.status === 401) {
    response.cookies.delete(
      AUTH_COOKIE_NAME,
    );
  }

  return response;
}

export function backendUnavailableResponse() {
  return NextResponse.json(
    {
      detail:
        "The backend service is unavailable.",
    },
    {
      status: 503,
    },
  );
}