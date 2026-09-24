from __future__ import annotations

from datetime import UTC, datetime
from typing import Any

from fastapi import FastAPI, Response, status
from fastapi.middleware.cors import CORSMiddleware

from .config import load_settings

settings = load_settings()
app = FastAPI(
    title="CareerPilot API",
    version=settings.version,
    docs_url="/docs" if settings.environment != "production" else None,
    redoc_url="/redoc" if settings.environment != "production" else None,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=list(settings.web_origins),
    allow_credentials=False,
    allow_methods=["GET", "OPTIONS"],
    allow_headers=["Accept", "Content-Type", "X-Request-ID"],
)


def timestamp() -> str:
    return datetime.now(UTC).isoformat()


def health_payload() -> dict[str, str]:
    return {
        "service": settings.app_name,
        "status": "ok",
        "version": settings.version,
        "environment": settings.environment,
        "timestamp": timestamp(),
    }


def configuration_payload() -> dict[str, Any]:
    """Return safe configuration metadata without returning credentials or URLs."""
    return {
        "service": settings.app_name,
        "status": "ok" if settings.supabase_status != "incomplete" else "invalid",
        "version": settings.version,
        "environment": settings.environment,
        "phase": "31.1",
        "web_origins": len(settings.web_origins),
        "supabase": settings.supabase_status,
        "ai_gateway": settings.ai_gateway_status,
        "timestamp": timestamp(),
    }


def readiness_payload() -> dict[str, Any]:
    config_status = configuration_payload()["status"]
    ready = config_status == "ok"
    return {
        "service": settings.app_name,
        "status": "ready" if ready else "not_ready",
        "version": settings.version,
        "environment": settings.environment,
        "checks": {
            "configuration": "ok" if ready else "error",
            "external_dependencies": "not_required",
        },
        "timestamp": timestamp(),
    }


@app.get("/health", tags=["operations"])
def health() -> dict[str, str]:
    """Liveness check. It intentionally does not test external credentials in Phase 31.1."""
    return health_payload()


@app.get("/api/v1/health", tags=["operations"])
def versioned_health() -> dict[str, str]:
    """Versioned health contract used by future web and mobile clients."""
    return health_payload()


@app.get("/ready", tags=["operations"])
@app.get("/api/v1/readiness", tags=["operations"])
def readiness(response: Response) -> dict[str, Any]:
    """Readiness check for local orchestration without requiring Supabase in Phase 31.1."""
    payload = readiness_payload()
    if payload["status"] != "ready":
        response.status_code = status.HTTP_503_SERVICE_UNAVAILABLE
    return payload


@app.get("/api/v1/configuration", tags=["operations"])
def configuration() -> dict[str, Any]:
    """Safe configuration status; secrets and provider URLs never leave the server."""
    return configuration_payload()


@app.get("/", tags=["operations"])
def root() -> dict[str, str]:
    return {"service": settings.app_name, "message": "CareerPilot API foundation is running"}
