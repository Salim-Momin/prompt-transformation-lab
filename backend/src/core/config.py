from functools import lru_cache
from pathlib import Path

from pydantic import Field, SecretStr
from pydantic_settings import BaseSettings, SettingsConfigDict


# backend/
BACKEND_DIRECTORY = Path(__file__).resolve().parents[2]

# backend/.env
ENV_FILE = BACKEND_DIRECTORY / ".env"


class Settings(BaseSettings):
    """
    Typed application settings loaded from environment variables.

    Environment variable examples:
    GEMINI_API_KEY=your_key
    GEMINI_MODEL=gemini-3.6-flash
    """

    model_config = SettingsConfigDict(
        env_file=ENV_FILE,
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )

    app_name: str = "PromptForge AI"
    app_version: str = "1.0.0"
    environment: str = "development"
    debug: bool = True

    gemini_api_key: SecretStr = Field(
        description="Private Gemini API key.",
    )

    gemini_model: str = Field(
        default="gemini-3.6-flash",
        description="Gemini model used for prompt transformation.",
    )

    gemini_temperature: float = Field(
        default=0.2,
        ge=0.0,
        le=2.0,
        description="Creativity level used for prompt transformation.",
    )

    gemini_request_timeout_seconds: int = Field(
        default=45,
        ge=5,
        le=180,
        description="Maximum expected AI request duration.",
    )

    frontend_url: str = "http://localhost:3000"

    database_url: SecretStr = Field(
        description="SQLAlchemy PostgreSQL connection URL.",
    )
    
    database_echo: bool = Field(
        default=False,
        description="Log generated SQL statements during development.",        
    )

    jwt_secret_key: SecretStr = Field(
        description="Secret key used to sign JWT access tokens.",
    )

    jwt_algorithm: str = Field(
        default="HS256",
        description="Algorithm used to sign JWT tokens.",
    )

    access_token_expire_minutes: int = Field(
        default=30,
        ge=5,
        le=1440,
        description="Access-token lifetime in minutes.",
    )
    
    log_level: str = Field(
        default="INFO",
        description="Minimum application logging level.",
    )

    allowed_hosts: str = Field(
        default="localhost,127.0.0.1",
        description="Comma-separated hosts accepted by the API.",
    )

    max_request_size_bytes: int = Field(
        default=1_100_000,
        ge=10_000,
        le=10_000_000,
        description="Maximum accepted HTTP request-body size.",
    )

    enable_gzip: bool = Field(
        default=True,
        description="Compress sufficiently large API responses.",
    )

    @property
    def allowed_hosts_list(self) -> list[str]:
        """Return configured hosts as a cleaned list."""

        hosts = [
            host.strip()
            for host in self.allowed_hosts.split(",")
            if host.strip()
        ]

        return hosts or [
            "localhost",
            "127.0.0.1",
        ]
    
    @property
    def gemini_api_key_value(self) -> str:
        """Return the API key only when an SDK requires its raw value."""

        return self.gemini_api_key.get_secret_value()

    @property
    def database_url_value(self) -> str:
        """Return the raw database URL for SQLAlchemy."""

        return self.database_url.get_secret_value()

    @property
    def jwt_secret_key_value(self) -> str:
        """Return the raw JWT signing secret."""

        return self.jwt_secret_key.get_secret_value()


@lru_cache
def get_settings() -> Settings:
    """
    Create and cache one settings object.

    Caching prevents the .env file from being read again for every request.
    """

    return Settings()