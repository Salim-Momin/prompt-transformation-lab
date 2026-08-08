import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import {
  AUTH_COOKIE_NAME,
  getAuthCookieOptions,
} from "@/lib/auth-cookie";
import type {
  AuthApiError,
  AuthUser,
} from "@/types/auth";

const BACKEND_API_URL =
  process.env.BACKEND_API_URL ??
  "http://127.0.0.1:8000";

export async function GET() {
  const cookieStore = await cookies();

  const token = cookieStore.get(
    AUTH_COOKIE_NAME,
  )?.value;

  if (!token) {
    return NextResponse.json(
      {
        detail: "Not authenticated.",
      },
      {
        status: 401,
      },
    );
  }

  let backendResponse: Response;

  try {
    backendResponse = await fetch(
      `${BACKEND_API_URL}/api/v1/auth/me`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
      },
    );
  } catch {
    return NextResponse.json(
      {
        detail:
          "Authentication service is unavailable.",
      },
      {
        status: 503,
      },
    );
  }

  if (!backendResponse.ok) {
    let error: AuthApiError = {
      detail:
        "Your session is invalid or expired.",
    };

    try {
      error =
        (await backendResponse.json()) as AuthApiError;
    } catch {
      // Keep fallback.
    }

    const response = NextResponse.json(
      error,
      {
        status: backendResponse.status,
      },
    );

    if (backendResponse.status === 401) {
      response.cookies.set(
        AUTH_COOKIE_NAME,
        "",
        {
          ...getAuthCookieOptions(),
          maxAge: 0,
        },
      );
    }

    return response;
  }

  const user =
    (await backendResponse.json()) as AuthUser;

  return NextResponse.json(user);
}