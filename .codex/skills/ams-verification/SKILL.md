---
name: ams-verification
description: Validate AMS changes with domain tests, database and API checks, browser journeys, CI or pilot readiness review. Use for verification and release work; do not interpret readiness review as deployment authorization.
---

# AMS verification

Read [delivery plan](../../context/delivery-plan.md) and [status](../../context/status.md), then load the domain context for the change.

## Workflow

- Inspect actual manifests and available tools before selecting commands. The foundation suite uses `npm test` to run pytest against embedded PostgreSQL, `npm run contracts` to generate FastAPI OpenAPI types, and `npm run test:e2e` for browser journeys.
- For FastAPI changes, verify Pydantic validation, the established error envelope, restricted-role SQLAlchemy transactions and regenerated OpenAPI contracts alongside domain behavior.
- Map changes to observable failure risks: tenant leakage, wrong financial totals, invalid scoring, lost offline work or broken user journeys.
- Run the narrow meaningful checks first. Broaden only when shared behavior, failures or unresolved concerns justify it.
- Use unit tests for domain calculations, real database/API tests for transactions and policies, and browser tests for cross-component workflows.
- Exercise authorization with two academies and a restricted runtime database role. Owner credentials can hide missing policies.
- Use deterministic fake provider responses and test-mode integration checks. Distinguish simulated success from a real provider test result.
- For offline scoring, simulate disconnects and reloads; a reducer test alone does not validate browser persistence or reconciliation.
- For documentation changes, check metadata, link targets, skill routing and contradictions instead of creating application tests.
- Review migrations, backups/restoration, queues, payment reconciliation and synchronization observability before live pilot readiness. Report missing credentials/provider setup as prerequisites, not successful validation.

## Completion report

State what ran, the result, the behavior covered and material gaps. Do not mark a milestone complete based on a mock screen, skipped tests or planned checks. Update status with evidence after implementation. Execute deployment or external actions only when already authorized by the user.
