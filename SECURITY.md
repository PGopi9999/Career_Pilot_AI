# Security boundaries for Phase 31.1

## In scope

- Keep all secrets in environment variables or a secret manager.
- Do not put Supabase service-role keys, payment keys or AI provider keys in browser code.
- Use explicit CORS origins; no wildcard authenticated CORS.
- Keep health responses free of credentials, connection strings and user data.
- Use dev-only placeholder configuration until the relevant numbered phase.

## Out of scope until the numbered phase

- Authentication and MFA: Phase 31.2.
- File uploads and resume parsing: Phase 31.4.
- AI provider calls: Phase 31.4/31.6/31.8 onward through the server-side AI Gateway.
- Payments and webhooks: Phase 31.15.
- Production hardening and deployment: Phase 31.17–31.20.

Report suspected issues without adding live secrets to an issue or chat transcript.
