from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    status,
)
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from src.api.dependencies import (
    CurrentUser,
    DatabaseSession,
)
from src.core.security import (
    create_access_token,
    hash_password,
    verify_password,
)
from src.database.crud import (
    PromptHistoryRepositoryError,
    create_user,
    get_user_by_email,
)
from src.schemas import (
    ErrorResponse,
    TokenResponse,
    UserRead,
    UserRegisterRequest,
)


router = APIRouter(
    prefix="/auth",
    tags=["Authentication"],
)


@router.post(
    "/register",
    response_model=UserRead,
    status_code=status.HTTP_201_CREATED,
    responses={
        status.HTTP_409_CONFLICT: {
            "model": ErrorResponse,
        },
    },
    summary="Register a user",
)
def register_user(
    request: UserRegisterRequest,
    db: DatabaseSession,
) -> UserRead:
    """Create a PromptForge account."""

    existing_user = get_user_by_email(
        db,
        str(request.email),
    )

    if existing_user is not None:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=(
                "An account with this email already exists."
            ),
        )

    try:
        user = create_user(
            db,
            name=request.name,
            email=str(request.email),
            password_hash=hash_password(
                request.password
            ),
        )

    except PromptHistoryRepositoryError as error:
        raise HTTPException(
            status_code=(
                status.HTTP_500_INTERNAL_SERVER_ERROR
            ),
            detail="The account could not be created.",
        ) from error

    return UserRead.model_validate(user)


@router.post(
    "/login",
    response_model=TokenResponse,
    responses={
        status.HTTP_401_UNAUTHORIZED: {
            "model": ErrorResponse,
        },
    },
    summary="Log in",
)


def login_user(
    db: DatabaseSession,
    form_data: OAuth2PasswordRequestForm = Depends(),
) -> TokenResponse:
    """
    Authenticate with email and password.

    OAuth2 names the identity field `username`, but PromptForge
    expects the user's email address in that field.
    """

    user = get_user_by_email(
        db,
        form_data.username,
    )

    valid_password = (
        user is not None
        and verify_password(
            form_data.password,
            user.password_hash,
        )
    )

    if not valid_password or user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password.",
            headers={
                "WWW-Authenticate": "Bearer",
            },
        )

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="This account is inactive.",
        )

    access_token, expires_in = (
        create_access_token(user.id)
    )

    return TokenResponse(
        access_token=access_token,
        token_type="bearer",
        expires_in=expires_in,
        user=UserRead.model_validate(user),
    )


@router.get(
    "/me",
    response_model=UserRead,
    summary="Get current user",
)
def read_current_user(
    current_user: CurrentUser,
) -> UserRead:
    """Return the authenticated user's public profile."""

    return UserRead.model_validate(
        current_user
    )