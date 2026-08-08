from datetime import (
    UTC,
    datetime,
    timedelta,
)

import jwt
from jwt import InvalidTokenError
from pwdlib import PasswordHash

from src.core.config import get_settings
from src.schemas import TokenPayload


settings = get_settings()

password_hash = PasswordHash.recommended()


class TokenValidationError(ValueError):
    """Raised when an access token is invalid."""


def hash_password(password: str) -> str:
    """Create a secure one-way password hash."""

    return password_hash.hash(password)


def verify_password(
    plain_password: str,
    stored_password_hash: str,
) -> bool:
    """Check a password against its stored hash."""

    return password_hash.verify(
        plain_password,
        stored_password_hash,
    )


def create_access_token(
    user_id: int,
) -> tuple[str, int]:
    """Create a signed access token for one user."""

    expires_delta = timedelta(
        minutes=settings.access_token_expire_minutes,
    )

    expires_at = datetime.now(UTC) + expires_delta

    payload = {
        "sub": str(user_id),
        "exp": expires_at,
        "iat": datetime.now(UTC),
        "type": "access",
    }

    encoded_token = jwt.encode(
        payload,
        settings.jwt_secret_key_value,
        algorithm=settings.jwt_algorithm,
    )

    expires_in_seconds = int(
        expires_delta.total_seconds()
    )

    return encoded_token, expires_in_seconds


def decode_access_token(
    token: str,
) -> TokenPayload:
    """Decode and validate a JWT access token."""

    try:
        payload = jwt.decode(
            token,
            settings.jwt_secret_key_value,
            algorithms=[settings.jwt_algorithm],
        )

        if payload.get("type") != "access":
            raise TokenValidationError(
                "Invalid token type."
            )

        subject = payload.get("sub")

        if not subject:
            raise TokenValidationError(
                "Token subject is missing."
            )

        return TokenPayload(
            sub=str(subject),
            exp=payload.get("exp"),
        )

    except InvalidTokenError as error:
        raise TokenValidationError(
            "The access token is invalid or expired."
        ) from error