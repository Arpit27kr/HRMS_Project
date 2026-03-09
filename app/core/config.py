"""Application configuration settings."""

from functools import lru_cache
import os


def _parse_cors_origins(origins_value: str) -> list[str]:
    """Parse comma-separated CORS origins into a clean list."""
    return [origin.strip() for origin in origins_value.split(",") if origin.strip()]


def _default_database_url() -> str:
    """Return a deployment-aware default SQLite URL."""
    if os.getenv("VERCEL") == "1":
        return "sqlite:////tmp/hrms_lite.db"
    return "sqlite:///./hrms_lite.db"


class Settings:
    """Container for environment-driven application settings."""

    def __init__(self) -> None:
        """Initialize settings with sane defaults for local development."""
        self.app_name: str = os.getenv("APP_NAME", "HRMS Lite API")
        self.api_v1_prefix: str = os.getenv("API_V1_PREFIX", "/api/v1")
        self.database_url: str = os.getenv("DATABASE_URL", _default_database_url())
        self.debug: bool = os.getenv("DEBUG", "false").lower() == "true"
        cors_origins_default = (
            "http://localhost:3000,"
            "http://127.0.0.1:3000,"
            "http://localhost:5173,"
            "http://127.0.0.1:5173"
        )
        self.cors_origins: list[str] = _parse_cors_origins(
            os.getenv("CORS_ORIGINS", cors_origins_default)
        )


@lru_cache
def get_settings() -> Settings:
    """Return a cached settings instance for the application lifecycle."""
    return Settings()
