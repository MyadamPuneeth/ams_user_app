# Current status

Updated: 2026-09-20.

## Implemented artifacts

- Root AGENTS.md with startup guidance, skill routing and project boundaries.
- Nine project SKILL.md files under .codex/skills, with backend, data-access, frontend and verification guidance aligned to FastAPI, uv and SQLAlchemy.
- React/Vite web application in `apps/web` with responsive academy, branch/table, team access, activity and platform onboarding screens.
- FastAPI API in `apps/api` with Pydantic OpenAPI, health endpoint, preview authentication, Supabase authentication configuration, academy onboarding, branches/tables, memberships, invitations, suspension and audit records.
- PostgreSQL SQLAlchemy async mappings and two SQL migrations: foundation entities plus restricted `ams_app` role policies and tenant/branch RLS.
- Generated OpenAPI document and TypeScript client under `packages/api-client`.
- Local PostgreSQL development runner, Docker Compose alternative, sample seed data and browser/integration test suites.

## Application state

Foundation milestone implementation exists. The local preview starts a bundled PostgreSQL instance and uses explicit sample accounts only when `DEV_AUTH=true`; it is rejected in production. Supabase, SMTP, Redis, payment accounts, private file storage, worker jobs, live realtime channels, CI and deployment are not configured.

The AMS directory is currently inside a wider Git repository rooted at its parent Ongoing_Projects directory. Other projects contain unrelated changes. Limit version-control operations to AMS; do not initialize or restructure repositories without a relevant request.

## Verification

Verified on 2026-09-20:

- `npm test`: 12 integration checks passed against an isolated PostgreSQL instance. Coverage includes forged/absent preview authentication, two-academy RLS separation, branch scope, composite tenant foreign keys, append-only audit data, invitation validation/revocation/single-use concurrency, platform privacy, membership revocation, final-admin protection and academy suspension.
- `npm run contracts`: FastAPI OpenAPI schema and TypeScript client generation passed.
- `npm run typecheck` and `npm run build`: web TypeScript checks and production build passed.
- `npm run test:e2e`: 4 Chromium paths passed, covering branch/table persistence, invitation acceptance, scoped coach access on mobile, platform onboarding/suspension and desktop overview.
- `npm audit --json`: zero known dependency vulnerabilities at the time of verification.

No live Supabase, payment, email or deployment integration has been verified.

## Next implementation milestone

Foundation milestone work is implemented. The next implementation request should begin milestone 2 in [delivery-plan.md](delivery-plan.md): admissions, athlete/guardian records, batches, sessions, attendance, coaching and calendar scheduling.

Use `npm run dev` for the local preview after installing `uv` with `python -m pip install uv`. Inspect actual manifests and migrations before adding commands or dependencies. Use [architecture.md](architecture.md) and [decisions.md](decisions.md) for current defaults.

## Handoff maintenance

After substantive work, update this file with actual artifacts, evidence of checks, remaining work and material blockers. Keep future intentions separate from verified outcomes. Do not preserve this initial snapshot as current once the application exists.
