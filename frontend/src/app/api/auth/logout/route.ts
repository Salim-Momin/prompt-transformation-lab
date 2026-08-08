import { NextResponse } from "next/server";

import {
  AUTH_COOKIE_NAME,
  getAuthCookieOptions,
} from "@/lib/auth-cookie";

export async function POST() {
  const response = NextResponse.json({
    logged_out: true,
  });

  response.cookies.set(
    AUTH_COOKIE_NAME,
    "",
    {
      ...getAuthCookieOptions(),
      maxAge: 0,
    },
  );

  return response;
}