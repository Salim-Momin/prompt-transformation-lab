import type {
  AuthApiError,
  AuthUser,
  LoginRequest,
  RegisterRequest,
} from "@/types/auth";

async function getErrorMessage(
  response: Response,
  fallback: string,
): Promise<string> {
  try {
    const error =
      (await response.json()) as AuthApiError;

    if (typeof error.detail === "string") {
      return error.detail;
    }

    if (Array.isArray(error.detail)) {
      return error.detail
        .map((item) => item.msg)
        .filter(Boolean)
        .join(" ");
    }
  } catch {
    // Keep fallback.
  }

  return fallback;
}

export async function registerUser(
  request: RegisterRequest,
): Promise<AuthUser> {
  const response = await fetch(
    "/api/auth/register",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
    },
  );

  if (!response.ok) {
    throw new Error(
      await getErrorMessage(
        response,
        "Your account could not be created.",
      ),
    );
  }

  return (await response.json()) as AuthUser;
}

export async function loginUser(
  request: LoginRequest,
): Promise<{
  user: AuthUser;
  expires_in: number;
}> {
  const response = await fetch(
    "/api/auth/login",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
    },
  );

  if (!response.ok) {
    throw new Error(
      await getErrorMessage(
        response,
        "Incorrect email or password.",
      ),
    );
  }

  return (await response.json()) as {
    user: AuthUser;
    expires_in: number;
  };
}

export async function fetchCurrentUser():
Promise<AuthUser> {
  const response = await fetch(
    "/api/auth/me",
    {
      method: "GET",
      cache: "no-store",
    },
  );

  if (!response.ok) {
    throw new Error(
      await getErrorMessage(
        response,
        "Your session is invalid or expired.",
      ),
    );
  }

  return (await response.json()) as AuthUser;
}

export async function logoutUser():
Promise<void> {
  await fetch(
    "/api/auth/logout",
    {
      method: "POST",
    },
  );
}