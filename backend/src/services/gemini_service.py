from google import genai
from google.genai import types
from pydantic import ValidationError

from src.core.config import Settings, get_settings
from src.core.prompts import (
    PROMPT_TRANSFORMATION_SYSTEM_INSTRUCTION,
    build_transformation_request,
)
from src.schemas import PromptTransformation

import logging
import time


logger = logging.getLogger(
    "promptforge.gemini"
)


class GeminiServiceError(RuntimeError):
    """Base exception raised by the Gemini service."""


class EmptyGeminiResponseError(GeminiServiceError):
    """Raised when Gemini returns no usable response text."""


class InvalidGeminiResponseError(GeminiServiceError):
    """Raised when Gemini returns data that does not match our schema."""


class GeminiService:
    """Handle all communication with the Gemini API."""

    def __init__(
        self,
        settings: Settings | None = None,
    ) -> None:
        self.settings = settings or get_settings()

        self.client = genai.Client(
            api_key=self.settings.gemini_api_key_value,
        )

    def transform_prompt(
        self,
        weak_prompt: str,
    ) -> PromptTransformation:
        """
        Transform a weak prompt into a structured professional prompt.

        Raises:
            ValueError:
                When the supplied prompt is empty.

            EmptyGeminiResponseError:
                When Gemini returns no response text.

            InvalidGeminiResponseError:
                When Gemini returns invalid structured data.

            GeminiServiceError:
                When the Gemini request otherwise fails.
        """

        cleaned_prompt = weak_prompt.strip()

        if not cleaned_prompt:
            raise ValueError("The prompt cannot be empty.")

        request_content = build_transformation_request(
            cleaned_prompt,
        )

        try:
            started_at = time.perf_counter()
            response = self.client.models.generate_content(
                model=self.settings.gemini_model,
                contents=request_content,
                config=types.GenerateContentConfig(
                    system_instruction=(
                        PROMPT_TRANSFORMATION_SYSTEM_INSTRUCTION
                    ),
                    temperature=self.settings.gemini_temperature,
                    response_mime_type="application/json",
                    response_schema=PromptTransformation,
                ),
            )
            duration_ms = (
                time.perf_counter() - started_at
            ) * 1000

            logger.info(
                "gemini_generation_completed | duration_ms=%.2f",                    duration_ms,
            )
        except Exception as error:
            raise GeminiServiceError(
                "Gemini could not transform the prompt."
            ) from error

        if not response.text:
            raise EmptyGeminiResponseError(
                "Gemini returned an empty response."
            )

        try:
            transformation = (
                PromptTransformation.model_validate_json(
                    response.text
                )
            )
        except ValidationError as error:
            raise InvalidGeminiResponseError(
                "Gemini returned an invalid structured response."
            ) from error

        # Ensure the original text is preserved exactly.
        transformation.weak_prompt = cleaned_prompt

        return transformation