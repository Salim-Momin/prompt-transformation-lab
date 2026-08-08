from typing import Literal

from pydantic import BaseModel, ConfigDict, Field


class HealthResponse(BaseModel):
    """Response returned by the health-check endpoint."""

    status: Literal["healthy"]
    service: str
    version: str


class ErrorResponse(BaseModel):
    """Standard response structure for API errors."""

    detail: str

class ReadinessResponse(BaseModel):
    """Response returned by the readiness endpoint."""

    status: Literal["ready", "not_ready"]
    database: Literal["connected", "unavailable"]
    service: str
    version: str

class PromptTransformation(BaseModel):
    """Structured prompt transformation returned by Gemini."""

    weak_prompt: str = Field(
        description=(
            "The user's original weak or incomplete prompt."
        ),
    )

    intent: str = Field(
        description=(
            "The primary objective the user is trying to achieve."
        ),
    )

    category: str = Field(
        description=(
            "The most appropriate prompt category, such as "
            "education, coding, business, content, research, "
            "productivity, or general."
        ),
    )

    missing_information: list[str] = Field(
        default_factory=list,
        description=(
            "Important details missing from the original prompt."
        ),
    )

    context_questions: list[str] = Field(
        default_factory=list,
        description=(
            "Questions that would help clarify the user's request."
        ),
    )

    assumptions: list[str] = Field(
        default_factory=list,
        description=(
            "Reasonable assumptions made because details were missing."
        ),
    )

    role: str = Field(
        description=(
            "The expert role assigned to the AI."
        ),
    )

    goal: str = Field(
        description=(
            "A precise description of the desired result."
        ),
    )

    audience: str = Field(
        description=(
            "The intended audience for the final response."
        ),
    )

    requirements: list[str] = Field(
        default_factory=list,
        description=(
            "Important elements the response must include."
        ),
    )

    constraints: list[str] = Field(
        default_factory=list,
        description=(
            "Limits and rules the response must follow."
        ),
    )

    output_format: str = Field(
        description=(
            "The exact structure expected from the final response."
        ),
    )

    success_criteria: list[str] = Field(
        default_factory=list,
        description=(
            "Conditions that define a successful response."
        ),
    )

    improved_prompt: str = Field(
        description=(
            "The complete, professional prompt generated from "
            "the original request."
        ),
    )