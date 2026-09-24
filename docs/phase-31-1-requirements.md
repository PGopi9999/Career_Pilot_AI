# Phase 31.1 — Requirements and acceptance

## Purpose

Create a reproducible, secure foundation for the CareerPilot AI product. This phase is complete only when a clean checkout can install, validate, test and build the web and API foundations.

## In scope

- pnpm workspace + Turborepo monorepo
- Next.js App Router web shell
- FastAPI API shell
- Shared API-safe TypeScript types
- Environment example and fail-safe configuration
- Responsive design-token system
- Health, readiness and safe-configuration endpoints
- Unit/API and Playwright E2E test setup
- CI workflow
- Secret/dependency scanning configuration
- Human-readable runbook and evidence path

## Explicitly not in scope

Authentication, MFA, real Supabase credentials, resume uploads, AI inference, payments, job-source scraping, production deployment, user tracking, analytics cookies and real personal data.

## Definition of done

1. The web app opens on desktop and mobile-sized viewports.
2. The API responds on `/health`, `/api/v1/health`, `/ready`, `/api/v1/readiness` and `/api/v1/configuration`.
3. The browser calls the API through a relative same-origin rewrite.
4. No secret is present in source, logs or the browser bundle; configuration responses expose status only.
5. Lint, typecheck, unit tests, API tests, Playwright smoke tests and production build pass.
6. CI is defined for the same checks.
7. The owner reviews the UI, commands and evidence before Phase 31.2 starts.
