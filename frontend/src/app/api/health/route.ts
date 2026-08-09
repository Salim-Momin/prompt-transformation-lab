import { NextResponse } from "next/server";

const BACKEND_API_URL =
  process.env.BACKEND_API_URL ??
  "http://127.0.0.1:8000";

export async function GET() {
  try {
    const response = await fetch(
      `${BACKEND_API_URL}/api/v1/health`,
      {
        method: "GET",
        cache: "no-store",
      },
    );

    if (!response.ok) {
      return NextResponse.json(
        { status: "unavailable" },
        { status: response.status },
      );
    }

    return NextResponse.json({
      status: "healthy",
    });
  } catch {
    return NextResponse.json(
      { status: "unavailable" },
      { status: 503 },
    );
  }
}