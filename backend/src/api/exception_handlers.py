import logging

from fastapi import FastAPI, Request
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from sqlalchemy.exc import SQLAlchemyError
from starlette.exceptions import HTTPException as StarletteHTTPException

from src.core.config import get_settings


logger = logging.getLogger("promptforge.errors")


def get_request_id(
    request: Request,
) -> str | None:
    """Return the middleware-generated request ID."""

    return getattr(
        request.state,
        "request_id",
        None,
    )


def register_exception_handlers(
    app: FastAPI,
) -> None:
    """Register safe application-wide error handlers."""

    settings = get_settings()

    @app.exception_handler(
        StarletteHTTPException
    )
    async def http_exception_handler(
        request: Request,
        exception: StarletteHTTPException,
    ) -> JSONResponse:
        return JSONResponse(
            status_code=exception.status_code,
            content={
                "detail": exception.detail,
                "request_id": get_request_id(request),
            },
            headers=exception.headers,
        )

    @app.exception_handler(
        RequestValidationError
    )
    async def validation_exception_handler(
        request: Request,
        exception: RequestValidationError,
    ) -> JSONResponse:
        errors = [
            {
                "location": list(error["loc"]),
                "message": error["msg"],
                "type": error["type"],
            }
            for error in exception.errors()
        ]

        return JSONResponse(
            status_code=422,
            content={
                "detail": "Request validation failed.",
                "errors": errors,
                "request_id": get_request_id(request),
            },
        )

    @app.exception_handler(SQLAlchemyError)
    async def database_exception_handler(
        request: Request,
        exception: SQLAlchemyError,
    ) -> JSONResponse:
        logger.exception(
            "Unhandled database error | request_id=%s",
            get_request_id(request),
        )

        return JSONResponse(
            status_code=503,
            content={
                "detail": (
                    "The database service is temporarily "
                    "unavailable."
                ),
                "request_id": get_request_id(request),
            },
        )

    @app.exception_handler(Exception)
    async def unexpected_exception_handler(
        request: Request,
        exception: Exception,
    ) -> JSONResponse:
        logger.exception(
            "Unexpected application error | request_id=%s",
            get_request_id(request),
        )

        content: dict[str, object] = {
            "detail": (
                "An unexpected server error occurred."
            ),
            "request_id": get_request_id(request),
        }

        if (
            settings.debug
            and settings.environment == "development"
        ):
            content["debug_error"] = str(exception)

        return JSONResponse(
            status_code=500,
            content=content,
        )