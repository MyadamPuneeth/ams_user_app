---
name: ams-data-access
description: Design or change AMS schemas, migrations, authentication, membership permissions, tenant policies and private file access. Use when a change crosses an academy, role, branch or identity boundary.
---

# AMS data access

Read [domain model](../../context/domain-model.md), [permissions](../../context/permissions.md) and the database boundary in [architecture](../../context/architecture.md).

## Workflow

- Identify the owning academy, optional branch and authorized actors for every entity and operation. Keep platform identities separate from academy athlete records.
- Add tenant-consistent relationships and uniqueness rules in migrations. A valid row identifier from another tenant must not make a relationship valid.
- Use SQLAlchemy async sessions with the restricted runtime database role and transaction-local actor/email/academy context. Keep migration/owner credentials out of application requests.
- Preserve the checksum-verified SQL migration history. Never edit an applied migration; add a new SQL migration and update the migration runner only when its behavior requires it.
- Apply checks to search, list, export, private files, jobs and WebSocket subscriptions as well as ordinary CRUD routes.
- Derive membership from current server data, not a user-controlled tenant selector or a stale client role.
- Signed document access requires ownership checks and short expiration. Describe expiry limits honestly when implementing revocation.
- Preserve attendance, finance and competition history when archiving people. Plan data migration and compatibility for existing records instead of defaulting to destructive resets.
- For a new physical schema, keep names and types consistent with existing conventions; the conceptual model is not an instruction to create every table at once.

## Verification

Test allowed and denied operations with two academies, multiple branches and the restricted runtime role. Include cross-tenant foreign keys, revoked membership, unlinked guardians, unauthenticated access and public projections. Verify migration behavior on a clean database and on relevant existing data.
