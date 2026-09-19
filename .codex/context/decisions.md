# Decision record

Recorded: 2026-09-19. Confirmed choices came directly from the user; defaults came from the implementation plan and remain revisable.

## Confirmed user choices

| ID | Decision |
| --- | --- |
| U01 | Serve multiple independent academies |
| U02 | Begin with table tennis |
| U03 | Plan a complete platform, delivered in stages |
| U04 | Include platform owner, academy admin, coach, finance, scorer, athlete and guardian roles |
| U05 | Use a responsive web application |
| U06 | Launch in India with online and manual fee collection |
| U07 | Support internal and open tournaments |
| U08 | Include admissions, inventory, expenses and payroll as well as sports operations |
| U09 | Payroll means salary management; statutory processing is external |
| U10 | Support live scoring with offline recovery |
| U11 | Onboard academies through an invite-only pilot |
| U12 | Use a separate backend |
| U13 | Include team competitions |
| U14 | Payments settle directly to each academy, without a platform commission |
| U15 | First create project skills under .codex/skills, context under .codex/context and initialize a project agents file |

## Current implementation defaults

| ID | Default | Reason / consequence |
| --- | --- | --- |
| D01 | React/TypeScript/Vite frontend and FastAPI backend | Implements U12; FastAPI fully replaced the initial NestJS foundation on 2026-09-20 |
| D02 | PostgreSQL with SQLAlchemy async, Supabase Auth and private Storage | Relational business data, managed identity and document storage |
| D03 | Restricted database role with tenant policies and transaction-local context | Isolates academies beyond route checks |
| D04 | Redis-backed jobs and backend WebSockets | Retryable background work and authorized live scores |
| D05 | Razorpay per academy | India online payments with direct academy settlement |
| D06 | OpenAPI-generated client and shared deterministic rules package | Keeps contracts and scoring behavior consistent |
| D07 | English, INR, Asia/Kolkata and AMS working name | Initial pilot defaults |
| D08 | In-app notifications and SMTP email | WhatsApp/SMS deferred |
| D09 | Standard ITTF team presets; best-of-three/five/seven individual matches | Defined competition scope, no custom team-format designer initially |
| D10 | One claimed device per match with explicit conflict resolution | Offline scoring without silently merging conflicting score streams |
| D11 | AGENTS.md capitalization and explicit links to requested skill paths | Standard instruction entrypoint while preserving U15 |
| D12 | No routine platform-owner access to academy private records | Platform operations separated from tenant data |
| D13 | Local/staging development first, test payments | Hosting and live credentials have not been provisioned |
| D14 | Foundation uses an embedded loopback PostgreSQL runner with Docker Compose as an alternative | Docker and PostgreSQL were unavailable in the development environment; integration tests still use real PostgreSQL and the restricted runtime role |
| D15 | Preview authentication uses a clearly labelled local account selector only in development/test | Allows working local onboarding and authorization checks without inventing production credentials; Supabase remains the production path |
| D16 | Use uv for FastAPI dependency locking and Uvicorn local serving | User approved the FastAPI migration plan on 2026-09-20; `apps/api/uv.lock` is the reproducible Python dependency record |

## Superseded and deferred

The initial Next.js single-application recommendation is superseded by U12/D01. Do not reintroduce it as the agreed stack.

Deferred: other sports, native apps, WhatsApp/SMS, platform subscription billing, cross-academy rankings, federation integrations, statutory payroll and arbitrary custom team-match sequences.

## Updating decisions

Record the date, decision, user/default/implementation provenance, reason and any superseded decision. Do not label a proposed default as an explicit user requirement. A change to a high-impact choice should update the affected context documents; preserve enough history to explain the change without storing the conversation.
