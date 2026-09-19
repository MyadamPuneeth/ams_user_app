# AMS

AMS is a multi-academy table tennis management platform. The first completed foundation provides secure academy workspaces, branches and tables, staff invitations, access management, audit records and platform onboarding.

## Run locally

Requirements: Node.js 22.12 or later and Python 3.12 or later. No local Docker or PostgreSQL installation is required for the default preview.

```powershell
npm install
python -m pip install uv
npm run dev
```

Open [http://localhost:5173](http://localhost:5173). The preview starts an isolated local PostgreSQL server on `127.0.0.1:55432`, seeds two sample academies, and enables clearly marked development-only accounts. Preview data is stored under `.local/postgres` and is ignored by Git.

The API documentation is available at [http://127.0.0.1:3001/api/docs](http://127.0.0.1:3001/api/docs).

## Verification

```powershell
npm test
npm run test:e2e
npm run check
```

`npm test` runs the FastAPI pytest suite against an isolated PostgreSQL database and verifies tenant policies, invitation races, revoked membership and suspension. `npm run test:e2e` verifies the real browser paths and responsive layouts.

## Production configuration

Copy `.env.example` and configure Supabase Auth before setting `DEV_AUTH=false`. The API rejects development authentication in production. Use `MIGRATION_DATABASE_URL` only for database migrations; runtime `DATABASE_URL` must use the restricted `ams_app` PostgreSQL role.

See [.codex/context/status.md](.codex/context/status.md) for the current implementation boundary and the next milestone.
