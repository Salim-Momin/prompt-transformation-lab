import logging
from collections.abc import AsyncIterator
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware
from starlette.middleware.trustedhost import (
    TrustedHostMiddleware,
)

from src.api.exception_handlers import (
    register_exception_handlers,
)
from src.api.middleware import (
    RequestContextMiddleware,
    RequestSizeLimitMiddleware,
)
from src.api.routes import router
from src.core.config import get_settings
from src.core.logging_config import (
    configure_logging,
)


configure_logging()

settings = get_settings()

logger = logging.getLogger("promptforge.app")


@asynccontextmanager
async def lifespan(
    app: FastAPI,
) -> AsyncIterator[None]:
    """Handle application startup and shutdown."""

    logger.info(
        "%s API v%s started",
        settings.app_name,
        settings.app_version,
    )

    yield

    logger.info(
        "%s API stopped",
        settings.app_name,
    )


app = FastAPI(
    title=f"{settings.app_name} API",
    description=(
        "An AI-powered API that transforms vague prompts "
        "into professional structured prompts."
    ),
    version=settings.app_version,
    debug=(
        settings.debug
        and settings.environment == "development"
    ),
    lifespan=lifespan,
    docs_url=(
        "/docs"
        if settings.environment != "production"
        else None
    ),
    redoc_url=(
        "/redoc"
        if settings.environment != "production"
        else None
    ),
)

register_exception_handlers(app)

app.add_middleware(
    TrustedHostMiddleware,
    allowed_hosts=settings.allowed_hosts_list,
)

app.add_middleware(
    RequestSizeLimitMiddleware,
    max_request_size_bytes=(
        settings.max_request_size_bytes
    ),
)

app.add_middleware(
    RequestContextMiddleware,
)

if settings.enable_gzip:
    app.add_middleware(
        GZipMiddleware,
        minimum_size=1000,
        compresslevel=5,
    )

allowed_origins = {
    settings.frontend_url.rstrip("/"),
    "http://localhost:3000",
    "http://127.0.0.1:3000",
}

app.add_middleware(
    CORSMiddleware,
    allow_origins=sorted(allowed_origins),
    allow_credentials=True,
    allow_methods=[
        "GET",
        "POST",
        "PATCH",
        "DELETE",
        "OPTIONS",
    ],
    allow_headers=[
        "Authorization",
        "Content-Type",
        "Accept",
        "X-Request-ID",
    ],
    expose_headers=[
        "X-Request-ID",
    ],
)

app.include_router(
    router,
    prefix="/api/v1",
)


@app.get(
    "/",
    tags=["System"],
    summary="API information",
)
def root() -> dict[str, str]:
    """Return public API information."""

    return {
        "name": f"{settings.app_name} API",
        "version": settings.app_version,
        "health": "/api/v1/health",
        "readiness": "/api/v1/ready",
    }