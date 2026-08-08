import { NextResponse } from "next/server";

import {
  AUTH_COOKIE_NAME,
  getAuthCookieOptions,
} from "@/lib/auth-cookie";
import type {
  AuthApiError,
  TokenResponse,
} from "@/types/auth";

const BACKEND_API_URL =
  process.env.BACKEND_API_URL ??
  "http://127.0.0.1:8000";

interface LoginBody {
  email?: string;
  password?: string;
}

export async function POST(
  request: Request,
) {
  let body: LoginBody;

  try {
    body = (await request.json()) as LoginBody;
  } catch {
    return NextResponse.json(
      {
        detail: "Invalid request body.",
      },
      {
        status: 400,
      },
    );
  }

  const email = body.email?.trim().toLowerCase();
  const password = body.password ?? "";

  if (!email || !password) {
    return NextResponse.json(
      {
        detail:
          "Email and password are required.",
      },
      {
        status: 400,
      },
    );
  }

  const formData = new URLSearchParams();

  formData.set("username", email);
  formData.set("password", password);

  let backendResponse: Response;

  try {
    backendResponse = await fetch(
      `${BACKEND_API_URL}/api/v1/auth/login`,
      {
        method: "POST",
        headers: {
          "Content-Type":
            "application/x-www-form-urlencoded",
        },
        body: formData.toString(),
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
      detail: "Incorrect email or password.",
    };

    try {
      error =
        (await backendResponse.json()) as AuthApiError;
    } catch {
      // Keep fallback error.
    }

    return NextResponse.json(
      error,
      {
        status: backendResponse.status,
      },
    );
  }

  const result =
    (await backendResponse.json()) as TokenResponse;

  const response = NextResponse.json({
    expires_in: result.expires_in,
    user: result.user,
  });

  response.cookies.set(
    AUTH_COOKIE_NAME,
    result.access_token,
    getAuthCookieOptions(),
  );

  return response;
}