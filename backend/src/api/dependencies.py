from functools import lru_cache

from src.services.gemini_service import GeminiService

from typing import Annotated

from fastapi import (
    Depends,
    HTTPException,
    status,
)
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session

from src.core.security import (
    TokenValidationError,
    decode_access_token,
)
from src.database.crud import get_user_by_id
from src.database.models import User
from src.database.session import get_db_session

@lru_cache
def get_gemini_service() -> GeminiService:
    """
    Create and cache one GeminiService instance.

    FastAPI injects this service into routes using Depends.
    """

    return GeminiService()


oauth2_scheme = OAuth2PasswordBearer(
    tokenUrl="/api/v1/auth/login",
)


DatabaseSession = Annotated[
    Session,
    Depends(get_db_session),
]


def get_current_user(
    token: Annotated[
        str,
        Depends(oauth2_scheme),
    ],
    db: DatabaseSession,
) -> User:
    """Return the authenticated active user."""

    credentials_error = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail=(
            "Authentication credentials are invalid "
            "or expired."
        ),
        headers={
            "WWW-Authenticate": "Bearer",
        },
    )

    try:
        token_payload = decode_access_token(token)
        user_id = int(token_payload.sub)

    except (
        TokenValidationError,
        TypeError,
        ValueError,
    ) as error:
        raise credentials_error from error

    user = get_user_by_id(
        db,
        user_id,
    )

    if user is None or not user.is_active:
        raise credentials_error

    return user


CurrentUser = Annotated[
    User,
    Depends(get_current_user),
]