#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
STAMP="$(date -u +%Y%m%dT%H%M%SZ)"
EVIDENCE="$ROOT/docs/evidence/31.1/$STAMP"
mkdir -p "$EVIDENCE"
export PATH="$ROOT/scripts:$PATH"
exec > >(tee "$EVIDENCE/phase-gate.log") 2>&1

cd "$ROOT"
printf '\n== CareerPilot Phase 31.1 gate ==\n'
printf 'UTC: %s\n' "$STAMP"

printf '\n== Tool versions ==\n'
node --version
corepack pnpm --version
python --version

printf '\n== Web checks ==\n'
corepack pnpm lint
corepack pnpm typecheck
corepack pnpm test
corepack pnpm build
if [[ "${SKIP_E2E:-0}" != "1" ]]; then
  printf '\n== Playwright checks ==\n'
  corepack pnpm --filter @careerpilot/e2e exec playwright install chromium
  corepack pnpm --filter @careerpilot/e2e test:e2e
else
  printf '\n== Playwright checks skipped (SKIP_E2E=1) ==\n'
fi

printf '\n== API checks ==\n'
if [[ -x "$ROOT/.venv/bin/python" ]]; then
  "$ROOT/.venv/bin/python" -m pytest -q "$ROOT/services/api/tests"
else
  python -m pytest -q "$ROOT/services/api/tests"
fi

printf '\nPASS: Phase 31.1 automated gate completed.\n'
printf 'Evidence: %s\n' "$EVIDENCE"
