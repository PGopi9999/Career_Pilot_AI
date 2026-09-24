import asyncio
from typing import Any

import pytest
from httpx import ASGITransport, AsyncClient, Response

from app.config import _parse_origins, load_settings
from app.main import app


def request(method: str, path: str, **kwargs: Any) -> Response:
    async def send() -> Response:
        transport = ASGITransport(app=app)
        async with AsyncClient(transport=transport, base_url="http://testserver") as client:
            return await client.request(method, path, **kwargs)

    return asyncio.run(send())


def test_health_contract() -> None:
    response = request("GET", "/health")
    assert response.status_code == 200
    payload = response.json()
    assert payload["service"] == "careerpilot-api"
    assert payload["status"] == "ok"
    assert payload["environment"] in {"development", "test", "staging", "production"}
    assert payload["timestamp"].endswith("+00:00")


def test_versioned_health_contract() -> None:
    response = request("GET", "/api/v1/health")
    assert response.status_code == 200
    assert response.json()["service"] == "careerpilot-api"


def test_cors_is_explicit() -> None:
    response = request(
        "OPTIONS",
        "/health",
        headers={
            "Origin": "http://localhost:3000",
            "Access-Control-Request-Method": "GET",
        },
    )
    assert response.status_code == 200
    assert response.headers["access-control-allow-origin"] == "http://localhost:3000"


def test_readiness_and_safe_configuration_contracts() -> None:
    readiness = request("GET", "/api/v1/readiness")
    configuration = request("GET", "/api/v1/configuration")

    assert readiness.status_code == 200
    assert readiness.json()["status"] == "ready"
    assert readiness.json()["checks"]["external_dependencies"] == "not_required"
    assert configuration.status_code == 200
    assert configuration.json()["supabase"] == "not_configured"
    assert "SUPABASE" not in configuration.text
    assert "localhost" not in configuration.text


def test_configuration_rejects_wildcard_and_malformed_origins() -> None:
    with pytest.raises(RuntimeError, match="wildcard"):
        _parse_origins("*")
    with pytest.raises(RuntimeError, match="invalid origin"):
        _parse_origins("not-an-origin")


def test_environment_validation(monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.setenv("ENVIRONMENT", "unknown")
    with pytest.raises(RuntimeError, match="ENVIRONMENT"):
        load_settings()
