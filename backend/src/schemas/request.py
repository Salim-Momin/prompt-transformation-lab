from pydantic import BaseModel, ConfigDict, Field


class TransformPromptRequest(BaseModel):
    """Request body accepted by the transformation endpoint."""

    model_config = ConfigDict(
        str_strip_whitespace=True,
        extra="forbid",
        json_schema_extra={
            "examples": [
                {
                    "prompt": "Explain machine learning",
                }
            ]
        },
    )

    prompt: str = Field(
        min_length=2,
        max_length=10_000,
        description=(
            "The weak, vague, or incomplete prompt that should "
            "be transformed."
        ),
    )