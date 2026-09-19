# Roles, tenancy and privacy

Status: intended authorization model. Enforce at API, database and integration boundaries.

## Role matrix

| Role | Allowed scope | Limits |
| --- | --- | --- |
| Platform owner | Invite, configure and suspend academy workspaces; platform operational metadata | No routine private athlete, document or financial access; no implicit impersonation |
| Academy administrator | Academy operations, role assignments, branches and business settings | Restricted to their academy |
| Coach | Assigned branches/batches/athletes, sessions, attendance, plans and assessments | No finance, payroll, secret configuration or unrelated athletes |
| Finance staff | Authorized branch/academy invoices, payments, expenses, payroll and reports | Only necessary athlete billing identity; no coaching notes or role administration |
| Scorer | Explicitly assigned matches and minimal participant display data | No other academy records; ownership still checked for scoring writes |
| Athlete | Linked personal schedule, attendance, shared assessments, fees and event entries | No access to peers' private records |
| Guardian | Same self-service functions for explicitly linked children, including payments | No access based solely on surname, email similarity or unverified claims |
| Public/guest | Published event details, approved display information and own entry workflow | No private academy membership or internal participant details |

Multiple roles combine explicit permissions within the same academy; branch assignments still constrain access. Revoking membership, roles, guardian links or scorer assignments must affect subsequent access and private realtime delivery.

## Enforcement

- Resolve identity from a verified token and active membership from the server. A client-supplied academy ID is a selection, not proof of access.
- Apply checks to reads, writes, lists, searches, reports, exports, file links, queue jobs and realtime subscriptions.
- Use row-level policies on tenant tables plus tenant-consistent foreign keys/constraints. Test policies with the restricted runtime role, not only an owner that bypasses them.
- Set actor/academy context within the same database transaction as queries, and ensure pooled connections cannot reuse it outside that transaction.
- Treat platform administration as a separate limited capability. Do not solve platform onboarding by granting broad browser database access.
- Private files require ownership checks before signing. Use short expirations; already-issued links may remain valid until expiry, so do not promise instantaneous revocation of those URLs.
- Guests use an authenticated or verified entry-specific access flow for their own registration; unpublished event data is not globally readable.

## Publication and audit

Public event payloads are explicit projections: display name/approved affiliation, category, draw, schedule and scores. Exclude birth dates, contact information, guardians, financial records and private documents. Public publication, including minor participant display information, requires an explicit visibility/consent workflow.

Audit sensitive role changes, guardian linking, payments, payroll finalization, score corrections and exports. Record actor, academy, action, target, time and relevant change metadata without copying credentials or entire private documents into logs.

## Required negative tests

Use two academies, several branches, a multi-membership user, unlinked guardians and assigned/unassigned coaches/scorers. Attempt ID substitution, cross-tenant relationship creation, unauthorized exports, file requests and websocket subscriptions. Test membership removal and queued work after revocation. Confirm public projections contain only allowed fields.
