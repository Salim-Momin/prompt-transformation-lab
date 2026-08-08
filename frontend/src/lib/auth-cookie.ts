export const AUTH_COOKIE_NAME =
  "promptforge_session";

export const AUTH_COOKIE_MAX_AGE =
  30 * 60;

export function getAuthCookieOptions() {
  return {
    httpOnly: true,
    secure:
      process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: AUTH_COOKIE_MAX_AGE,
  };
}