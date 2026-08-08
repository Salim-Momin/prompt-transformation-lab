import logging
import time
from collections.abc import Awaitable, Callable
from uuid import uuid4

from fastapi import Request
from fastapi.responses import JSONResponse, Response
from starlette.middleware.base import BaseHTTPMiddleware


logger = logging.getLogger("promptforge.requests")


class RequestContextMiddleware(BaseHTTPMiddleware):
    """
    Add a request ID and log request duration.

    The request ID is returned in the X-Request-ID header,
    making frontend and backend errors easier to trace.
    """

    async def dispatch(
        self,
        request: Request,
        call_next: Callable[
            [Request],
            Awaitable[Response],
        ],
    ) -> Response:
        request_id = (
            request.headers.get("X-Request-ID")
            or str(uuid4())
        )

        request.state.request_id = request_id

        started_at = time.perf_counter()

        try:
            response = await call_next(request)
        except Exception:
            duration_ms = (
                time.perf_counter() - started_at
            ) * 1000

            logger.exception(
                (
                    "Unhandled request error | "
                    "request_id=%s | method=%s | "
                    "path=%s | duration_ms=%.2f"
                ),
                request_id,
                request.method,
                request.url.path,
                duration_ms,
            )

            raise

        duration_ms = (
            time.perf_counter() - started_at
        ) * 1000

        response.headers["X-Request-ID"] = request_id

        logger.info(
            (
                "request_completed | request_id=%s | "
                "method=%s | path=%s | status=%s | "
                "duration_ms=%.2f"
            ),
            request_id,
            request.method,
            request.url.path,
            response.status_code,
            duration_ms,
        )

        return response


class RequestSizeLimitMiddleware(BaseHTTPMiddleware):
    """Reject request bodies larger than the configured limit."""

    def __init__(
        self,
        app,
        max_request_size_bytes: int,
    ) -> None:
        super().__init__(app)

        self.max_request_size_bytes = (
            max_request_size_bytes
        )

    async def dispatch(
        self,
        request: Request,
        call_next: Callable[
            [Request],
            Awaitable[Response],
        ],
    ) -> Response:
        content_length = request.headers.get(
            "content-length"
        )

        if content_length is not None:
            try:
                request_size = int(content_length)
            except ValueError:
                return JSONResponse(
                    status_code=400,
                    content={
                        "detail": (
                            "Invalid Content-Length header."
                        )
                    },
                )

            if (
                request_size
                > self.max_request_size_bytes
            ):
                return JSONResponse(
                    status_code=413,
                    content={
                        "detail": (
                            "The request body is too large."
                        )
                    },
                )

        return await call_next(request)