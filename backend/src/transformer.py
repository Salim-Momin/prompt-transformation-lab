from src.schemas import PromptTransformation
from src.services.gemini_service import GeminiService


class PromptTransformer:
    """
    Compatibility interface for the existing CLI and API routes.

    New Gemini-specific logic lives in GeminiService.
    """

    def __init__(
        self,
        gemini_service: GeminiService | None = None,
    ) -> None:
        self.gemini_service = (
            gemini_service or GeminiService()
        )

    def transform(
        self,
        weak_prompt: str,
    ) -> PromptTransformation:
        """Transform a weak prompt using Gemini."""

        return self.gemini_service.transform_prompt(
            weak_prompt
        )