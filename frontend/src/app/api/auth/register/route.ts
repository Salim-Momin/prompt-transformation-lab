import { NextResponse } from "next/server";

import type {
  AuthApiError,
  AuthUser,
  RegisterRequest,
} from "@/types/auth";

const BACKEND_API_URL =
  process.env.BACKEND_API_URL ??
  "http://127.0.0.1:8000";

export async function POST(
  request: Request,
) {
  let body: RegisterRequest;

  try {
    body =
      (await request.json()) as RegisterRequest;
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

  let backendResponse: Response;

  try {
    backendResponse = await fetch(
      `${BACKEND_API_URL}/api/v1/auth/register`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
        cache: "no-store",
      },
    );
  } catch {
    return NextResponse.json(
      {
        detail:
          "Registration service is unavailable.",
      },
      {
        status: 503,
      },
    );
  }

  if (!backendResponse.ok) {
    let error: AuthApiError = {
      detail:
        "Your account could not be created.",
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

  const user =
    (await backendResponse.json()) as AuthUser;

  return NextResponse.json(
    user,
    {
      status: 201,
    },
  );
}