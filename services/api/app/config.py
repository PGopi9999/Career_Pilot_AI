from __future__ import annotations

import os
from dataclasses import dataclass
from urllib.parse import urlsplit

_ALLOWED_ENVIRONMENTS = {"development", "test", "staging", "production"}
_DEFAULT_ORIGINS = "http://localhost:3000,http://127.0.0.1:3000"


@dataclass(frozen=True)
class Settings:
    app_name: str = "careerpilot-api"
    version: str = "0.1.0"
    environment: str = "development"
    web_origins: tuple[str, ...] = ("http://localhost:3000", "http://127.0.0.1:3000")
    supabase_url: str = ""
    supabase_anon_key: str = ""
    supabase_service_role_key: str = ""
    ai_gateway_provider: str = ""

    @property
    def supabase_status(self) -> str:
        values = (self.supabase_url, self.supabase_anon_key, self.supabase_service_role_key)
        if not any(values):
            return "not_configured"
        if self.supabase_url and self.supabase_anon_key:
            return "configured"
        return "incomplete"

    @property
    def ai_gateway_status(self) -> str:
        return "configured" if self.ai_gateway_provider else "not_configured"


def _parse_origins(raw_origins: str) -> tuple[str, ...]:
    origins = tuple(
        origin.strip().rstrip("/") for origin in raw_origins.split(",") if origin.strip()
    )
    if not origins:
        raise RuntimeError("WEB_ORIGINS must contain at least one explicit origin")

    for origin in origins:
        if origin == "*":
            raise RuntimeError("WEB_ORIGINS cannot use a wildcard origin")
        parsed = urlsplit(origin)
        if parsed.scheme not in {"http", "https"} or not parsed.netloc:
            raise RuntimeError(f"WEB_ORIGINS contains an invalid origin: {origin}")
        if parsed.username or parsed.password or parsed.path or parsed.query or parsed.fragment:
            raise RuntimeError(f"WEB_ORIGINS must contain origins only: {origin}")
    return origins


def load_settings() -> Settings:
    environment = os.getenv("ENVIRONMENT", os.getenv("NODE_ENV", "development")).strip().lower()
    if environment not in _ALLOWED_ENVIRONMENTS:
        allowed = ", ".join(sorted(_ALLOWED_ENVIRONMENTS))
        raise RuntimeError(f"ENVIRONMENT must be one of: {allowed}")

    return Settings(
        environment=environment,
        web_origins=_parse_origins(os.getenv("WEB_ORIGINS", _DEFAULT_ORIGINS)),
        supabase_url=os.getenv("SUPABASE_URL", "").strip(),
        supabase_anon_key=os.getenv("SUPABASE_ANON_KEY", "").strip(),
        supabase_service_role_key=os.getenv("SUPABASE_SERVICE_ROLE_KEY", "").strip(),
        ai_gateway_provider=os.getenv("AI_GATEWAY_PROVIDER", "").strip(),
    )
