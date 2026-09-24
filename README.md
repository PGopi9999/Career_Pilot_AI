# CareerPilot AI

Phase 31.1 practical foundation for the locked CareerPilot AI roadmap.

## Current status

**Phase 31.1 — Repository and monorepo foundation: completed.**

This first slice intentionally does **not** include authentication, payments, production AI keys, real user data, job scraping or deployment. Those belong to later numbered phases and will not be silently started by an AI agent.

## Architecture

- `apps/web` — Next.js App Router, TypeScript and design-token based UI shell.
- `services/api` — FastAPI service with `/health` and `/api/v1/health`.
- `packages/shared-types` — shared API-safe TypeScript contracts.
- `packages/ui` — small accessible UI primitives to grow into the component system.
- `docs` — requirements, acceptance and completion evidence.
- `.github/workflows` — repeatable CI checks.

## Requirements

- Node.js 20.9+ (current workspace: Node 20.20.2)
- Corepack-enabled pnpm 12.5.1
- Python 3.11+ (current workspace: Python 3.13)
- Docker is optional for this phase; no local Docker daemon is required yet.

## Run locally

From this directory. If your operating system does not expose the Corepack pnpm shim as `pnpm`, use `PATH="$PWD/scripts:$PATH"` before the commands; the included wrapper keeps Turborepo able to find pnpm.


```bash
corepack pnpm install
python -m venv .venv
source .venv/bin/activate
pip install -e 'services/api[dev]'

# Terminal 1: API
uvicorn app.main:app --app-dir services/api --reload --host 0.0.0.0 --port 8000

# Terminal 2: web
corepack pnpm --filter @careerpilot/web dev
```

Open <http://localhost:3000>. The browser uses the relative `/api/backend/health` path; Next.js rewrites it to the API service so browser code never calls `localhost` directly.

## Phase gate

```bash
corepack pnpm lint
corepack pnpm typecheck
corepack pnpm test
corepack pnpm build
source .venv/bin/activate
pytest -q services/api/tests
corepack pnpm --filter @careerpilot/e2e exec playwright install chromium
corepack pnpm --filter @careerpilot/e2e test:e2e
bash scripts/phase-31-1-gate.sh
```

The gate produces a timestamped evidence folder under `docs/evidence/31.1/`. Generated dependencies and caches are intentionally ignored by Git and are not deliverables.

## Security rules already active

- No secrets in source control or client bundles.
- No production credentials in local development.
- CORS is configured from an explicit allowlist.
- Health, readiness and configuration endpoints return operational/status metadata only; no secrets or personal data.
- CI includes Gitleaks secret scanning and GitHub dependency review.
- The API and UI are versioned for later auth and billing work.

## Next permitted phase

After the Phase 31.1 gate is green and human-approved, begin **Phase 31.2 — Authentication and User Account**. Do not implement Phase 31.2 in this branch until the gate is accepted.
