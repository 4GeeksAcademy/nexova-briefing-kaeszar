"""Environment-backed settings for the API process."""

import os
from dataclasses import dataclass


@dataclass(frozen=True)
class Settings:
    cors_origins: list[str]


def _load_cors_origins() -> list[str]:
    configured_origins = os.getenv("CORS_ORIGINS")
    if configured_origins is None:
        # Preserve the local frontend origins already allowed by the API.
        return ["http://localhost:3000", "http://localhost:3001"]

    return [origin.strip() for origin in configured_origins.split(",") if origin.strip()]


settings = Settings(cors_origins=_load_cors_origins())