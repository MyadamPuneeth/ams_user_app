# Architecture

Status: foundation implementation exists. See [status.md](status.md) for verified commands and current limits.

## Components

| Component | Planned choice and responsibility |
| --- | --- |
| Web | React, TypeScript, Vite, React Router and Tailwind; responsive administration and portals |
| API | FastAPI modular REST API with Pydantic OpenAPI and generated frontend contracts |
| Database | PostgreSQL with SQLAlchemy async mappings; explicit SQL migrations for policies and constraints |
| Identity | Supabase Auth for credentials, invitations, password reset and token identity |
| Documents | Private Supabase Storage with authorized short-lived links |
| Jobs | Redis-backed queue for invoices, reminders, exports and reconciliation |
| Realtime | Backend WebSocket channels with authorization and sanitized public score messages |
| Rules | Shared deterministic TypeScript table-tennis rules used by browser and server |
| Local setup | Embedded loopback PostgreSQL by default, Docker Compose alternative, reproducible two-academy seed data |

Keep one modular backend. Domains: identity/access, academies, admissions/athletes, coaching/scheduling, finance/payroll, inventory, tournaments, scoring, notifications and reports. A worker may run separately from the API using the same domain services.

## Planned layout

- apps/web: browser application.
- apps/api: FastAPI backend, SQLAlchemy mappings, pytest suite and uv lockfile.
- packages/api-client: generated OpenAPI client/types.
- packages/table-tennis: deterministic scoring and competition rules.
- Database schema and migrations colocated with the API; root development configuration shared.

The web/API paths, shared API client and database migrations now exist. FastAPI dependencies are locked in `apps/api/uv.lock`; the current raw migration history remains under `apps/api/prisma/migrations` solely to preserve its applied checksum names. The table-tennis rules package remains pending until the competition milestone. Root `package.json` contains the current commands and pinned dependencies.

## Boundaries and data flow

The browser authenticates with Supabase and calls the API with a verified identity. The API resolves academy membership, branch scope and action permissions before issuing business queries. Identity is not authorization.

Private business data flows through the API, not direct unrestricted browser database access. Use tenant-scoped transactions on a restricted PostgreSQL runtime role. Set actor and academy context transaction-locally; never leak context through pooled connections. Database owners and migration roles are not runtime credentials.

Use committed state as the source for job work and realtime publication. When delivery matters, persist an outbox entry in the business transaction, then retry delivery idempotently. A worker carries academy and actor/service context and rechecks current access before releasing private outputs.

REST mutations validate inputs and domain state; OpenAPI describes the actual API. Use operation IDs for retries where duplicate execution would change money or competition outcomes. Scoring additionally uses an ordered event synchronization contract in [table-tennis.md](table-tennis.md).

## Integration and operations defaults

Use each academy's own Razorpay credentials; no pooled merchant account. Transactional email uses a configurable SMTP provider. Do not log tokens, provider secrets or private documents.

Local development uses `scripts/dev.mjs`, which starts an embedded PostgreSQL server on loopback, seeds sample academies and starts Uvicorn. Docker Compose is available as an alternative for PostgreSQL and Redis. `scripts/migrate.mjs` requires a migration-owner connection; runtime API connections are rejected unless they use the restricted `ams_app` role. The API exposes process liveness at `/api/health` and OpenAPI documentation outside production.

Supabase Auth is the production identity integration. Its project URL/key are intentionally unset. A local preview auth provider is enabled only with `DEV_AUTH=true` and is rejected when `NODE_ENV=production`. Hosting provider, paid service tiers, sending domain and live credentials are not selected or provisioned.

Application logs should carry request/job identifiers and academy identifiers where appropriate. Monitor worker failures, payment webhook/reconciliation failures and scoring conflicts. Preserve audit records for sensitive changes. Establish backups and verify restoration before a live pilot.

References: [FastAPI](https://fastapi.tiangolo.com/), [SQLAlchemy asyncio](https://docs.sqlalchemy.org/en/20/orm/extensions/asyncio.html), [Vite](https://vite.dev/guide/), [Supabase row security](https://supabase.com/docs/guides/database/postgres/row-level-security).
