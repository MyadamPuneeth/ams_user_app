---
name: ams-backend
description: Build or change AMS FastAPI modules, REST contracts, background jobs and realtime delivery. Use for backend or integration work; use the domain skills for financial and competition rules.
---

# AMS backend

Read [architecture](../../context/architecture.md) and [status](../../context/status.md). For data access, also read [permissions](../../context/permissions.md).

## Workflow

- Inspect `apps/api/pyproject.toml`, `apps/api/uv.lock`, current routes and generated contracts before scaffolding or adding dependencies.
- Keep the React frontend separate from the FastAPI backend. Organize one modular backend by business capability; do not introduce microservices for routine modules.
- Implement domain operations through Pydantic validation, dependency-based authorization, service logic and persistence, then expose their actual contract through FastAPI OpenAPI. Regenerate browser types with `npm run contracts`.
- Keep application startup/shutdown resources in the FastAPI lifespan and return the established API error envelope with a request ID for expected failures.
- Resolve identity and membership on the server. Keep sensitive provider calls and credential handling server-side.
- Make retries safe where jobs or requests affect invoices, payments, enrolment conversion or competition outcomes. Transactionally persist business changes and durable outbound work before publishing effects.
- Workers carry explicit tenant context and call the same domain logic as interactive requests. Public realtime events use an explicit sanitized projection.
- Provide useful failure responses and request/job identifiers without logging private payloads or secrets.
- Use `python -m uv` for FastAPI dependencies and Uvicorn commands. Document setup commands, configuration names and seed loading only after verifying them.

## Verification

Exercise authorization and input failure paths alongside the happy path. For job/integration changes, verify retries and duplicate delivery do not duplicate business actions. Update architecture/contracts if boundaries change; report unavailable service prerequisites without claiming integration success.
