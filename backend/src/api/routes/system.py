from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    status,
)
from sqlalchemy import text
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session

from src.core.config import get_settings
from src.database.session import get_db_session
from src.schemas import (
    HealthResponse,
    ReadinessResponse,
)


router = APIRouter(
    tags=["System"],
)


@router.get(
    "/health",
    response_model=HealthResponse,
    summary="Check process health",
)
def health_check() -> HealthResponse:
    """
    Confirm that the API process is running.

    This endpoint does not require the database.
    """

    settings = get_settings()

    return HealthResponse(
        status="healthy",
        service=settings.app_name,
        version=settings.app_version,
    )


@router.get(
    "/ready",
    response_model=ReadinessResponse,
    summary="Check service readiness",
)
def readiness_check(
    db: Session = Depends(get_db_session),
) -> ReadinessResponse:
    """Confirm that the API can reach PostgreSQL."""

    settings = get_settings()

    try:
        db.execute(text("SELECT 1"))

    except SQLAlchemyError as error:
        raise HTTPException(
            status_code=(
                status.HTTP_503_SERVICE_UNAVAILABLE
            ),
            detail=(
                "The database is currently unavailable."
            ),
        ) from error

    return ReadinessResponse(
        status="ready",
        database="connected",
        service=settings.app_name,
        version=settings.app_version,
    )