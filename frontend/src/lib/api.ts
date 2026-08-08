import type {
  ApiErrorResponse,
  PromptTransformation,
  TransformPromptRequest,
} from "@/types/prompt";

async function getErrorMessage(
  response: Response,
  fallback: string,
): Promise<string> {
  try {
    const errorData =
      (await response.json()) as ApiErrorResponse;

    if (
      typeof errorData.detail ===
      "string"
    ) {
      return errorData.detail;
    }

    if (
      Array.isArray(errorData.detail)
    ) {
      return errorData.detail
        .map((item) => item.msg)
        .filter(Boolean)
        .join(" ");
    }
  } catch {
    // Keep fallback.
  }

  return fallback;
}

export async function transformPrompt(
  request: TransformPromptRequest,
): Promise<PromptTransformation> {
  const controller =
    new AbortController();

  const timeoutId =
    window.setTimeout(() => {
      controller.abort();
    }, 45_000);

  let response: Response;

  try {
    response = await fetch(
      "/api/transform",
      {
        method: "POST",
        headers: {
          "Content-Type":
            "application/json",
        },
        body: JSON.stringify(request),
        signal: controller.signal,
      },
    );
  } catch (error) {
    if (
      error instanceof DOMException &&
      error.name === "AbortError"
    ) {
      throw new Error(
        "The transformation took too long. Please try again.",
      );
    }

    throw new Error(
      "Could not connect to PromptForge.",
    );
  } finally {
    window.clearTimeout(timeoutId);
  }

  if (response.status === 401) {
    throw new Error(
      "Your session has expired. Please log in again.",
    );
  }

  if (!response.ok) {
    throw new Error(
      await getErrorMessage(
        response,
        "The prompt transformation failed.",
      ),
    );
  }

  try {
    return (
      await response.json()
    ) as PromptTransformation;
  } catch {
    throw new Error(
      "PromptForge returned an invalid response.",
    );
  }
}