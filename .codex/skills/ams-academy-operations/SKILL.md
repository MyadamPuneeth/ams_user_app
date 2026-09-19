---
name: ams-academy-operations
description: Implement AMS admissions, athlete and guardian records, coaching, attendance, calendars and equipment stock workflows. Use for day-to-day academy operations excluding financial ledgers and match rules.
---

# AMS academy operations

Read [product scope](../../context/product-scope.md), [domain model](../../context/domain-model.md) and [permissions](../../context/permissions.md).

## Workflow

- Identify the complete requested user journey and its existing records before adding a screen or endpoint.
- Convert enquiries to athlete records idempotently and preserve the source link. Keep trials, enrolments and attendance as distinct facts.
- Create guardian access through explicit authorized links. A child need not have a login; matching surnames or contact details is not proof of access.
- Treat recurring schedules as templates and attendance as records on actual session occurrences. Preserve completed history when schedules change.
- Enforce coach, athlete and table conflicts server-side, including concurrent requests. Use the academy timezone for schedule generation.
- Restrict coach views and assessment writes to assignments; separate staff-only notes from progress shared with athletes/guardians.
- Represent equipment balances through receipts, issues, returns and recorded adjustments. Reject impossible quantities and keep author/reason for corrections.
- Imports need preview, row errors and deliberate duplicate handling. Do not merge identities across academies or silently overwrite existing records.

## Verification

Cover enquiry conversion retries, guardian isolation, recurring-session edits, attendance correction, concurrent booking conflicts and stock issue/return balances as relevant. Validate one complete operational journey through UI/API/persistence instead of treating a CRUD page as the whole workflow.
