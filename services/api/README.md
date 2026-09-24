# CareerPilot API

FastAPI foundation for Phase 31.1.

```bash
python -m venv .venv
source .venv/bin/activate
pip install -e .[dev]
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Endpoints:

- `GET /health`
- `GET /api/v1/health`
- `GET /ready` and `GET /api/v1/readiness`
- `GET /api/v1/configuration` (safe status only; never returns secrets)
- `GET /docs` (development only)

This phase deliberately has no authentication, database writes, user data or AI provider calls.
