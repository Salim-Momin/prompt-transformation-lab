from datetime import datetime

from pydantic import (
    BaseModel,
    ConfigDict,
    EmailStr,
    Field,
    field_validator,
)


class UserRegisterRequest(BaseModel):
    """Request used to create a PromptForge account."""

    model_config = ConfigDict(
        str_strip_whitespace=True,
        extra="forbid",
    )

    name: str = Field(
        min_length=2,
        max_length=100,
    )

    email: EmailStr

    password: str = Field(
        min_length=8,
        max_length=128,
    )

    @field_validator("password")
    @classmethod
    def validate_password(cls, password: str) -> str:
        """Require a basic mix of password characters."""

        if not any(character.isalpha() for character in password):
            raise ValueError(
                "Password must contain at least one letter."
            )

        if not any(character.isdigit() for character in password):
            raise ValueError(
                "Password must contain at least one number."
            )

        return password


class UserRead(BaseModel):
    """Public user information returned by the API."""

    model_config = ConfigDict(
        from_attributes=True,
    )

    id: int
    name: str
    email: EmailStr
    is_active: bool
    created_at: datetime


class TokenResponse(BaseModel):
    """JWT response returned after successful login."""

    access_token: str
    token_type: str = "bearer"
    expires_in: int
    user: UserRead


class TokenPayload(BaseModel):
    """Validated claims extracted from a JWT."""

    sub: str
    exp: int | None = None