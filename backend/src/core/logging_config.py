import logging
from logging.config import dictConfig

from src.core.config import get_settings


def configure_logging() -> None:
    """Configure application and dependency logging."""

    settings = get_settings()

    log_level = settings.log_level.upper()

    logging_configuration = {
        "version": 1,
        "disable_existing_loggers": False,
        "formatters": {
            "default": {
                "format": (
                    "%(asctime)s | %(levelname)s | "
                    "%(name)s | %(message)s"
                ),
                "datefmt": "%Y-%m-%d %H:%M:%S",
            },
            "access": {
                "format": (
                    "%(asctime)s | %(levelname)s | "
                    "%(message)s"
                ),
                "datefmt": "%Y-%m-%d %H:%M:%S",
            },
        },
        "handlers": {
            "console": {
                "class": "logging.StreamHandler",
                "formatter": "default",
                "level": log_level,
            },
            "access_console": {
                "class": "logging.StreamHandler",
                "formatter": "access",
                "level": log_level,
            },
        },
        "root": {
            "handlers": ["console"],
            "level": log_level,
        },
        "loggers": {
            "promptforge": {
                "handlers": ["console"],
                "level": log_level,
                "propagate": False,
            },
            "uvicorn": {
                "handlers": ["console"],
                "level": log_level,
                "propagate": False,
            },
            "uvicorn.error": {
                "handlers": ["console"],
                "level": log_level,
                "propagate": False,
            },
            "uvicorn.access": {
                "handlers": ["access_console"],
                "level": log_level,
                "propagate": False,
            },
            "sqlalchemy.engine": {
                "handlers": ["console"],
                "level": (
                    "INFO"
                    if settings.database_echo
                    else "WARNING"
                ),
                "propagate": False,
            },
        },
    }

    dictConfig(logging_configuration)