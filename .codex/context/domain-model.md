# Domain model

Status: conceptual model for implementation, not a deployed schema. Add physical fields and constraints with the relevant feature and migration.

## Entity groups

| Group | Entities and relationships |
| --- | --- |
| Workspace | Academy has branches; branch has tables/resources. Identity has academy memberships with roles and branch scope |
| People | Academy athlete optionally links to an identity. Guardian links connect authorized identities to one or more athletes |
| Admissions | Enquiry has follow-ups and trials; conversion links to the resulting athlete without duplicating it |
| Training | Batch has enrolments and coach assignments; recurring schedule generates sessions; session has attendance |
| Development | Athlete has goals, training plans and dated assessments with authorship |
| Finance | Fee plan/assignment generates invoice and lines; payments allocate to invoices; refunds and credits reference original transactions |
| Staff | Staff profile and attendance feed a payroll period; salary components produce a finalized payslip and payment records |
| Inventory | Equipment/item belongs to an academy and branch; stock movements and issue/return records explain its balance |
| Competition | Tournament contains events/categories; event has entries, stages, draws, fixtures and final standings |
| Teams | Team entry has nominated squad; tie has lineup slots and ordered individual matches |
| Scoring | Match has participants/sides, rules configuration, scoring session, ordered events, derived state and confirmed result |
| Support | Documents, announcements, notifications, audit records, outbox entries and export jobs retain owner/scope |

## Relationship rules

- Academy-owned entities carry academy identity. Add branch scope where meaningful; an academy-wide invoice or tournament need not belong to a single branch.
- Enforce matching tenant ownership in database relationships, not only in request handlers.
- Keep a platform identity separate from academy athlete records. Do not merge athletes from different academies by email, phone or name.
- A child may exist without a login. A guardian may link to multiple children, and a child may have multiple explicitly authorized guardians.
- Open-event participants are event-specific records with optional links to athletes in the organizing academy. Preserve entry snapshots without sharing another academy's private record.
- Use competition entry/side references so singles, doubles and teams are represented without requiring every entrant to be one athlete.
- Distinguish a game, individual match, team tie, tournament and tournament event. An event is one category/format within a tournament.
- Payment allocation is distinct from payment capture. One provider payment is never counted twice because multiple notifications arrived.

## Lifecycle expectations

- An enquiry converts once; retain the conversion link and follow-up history.
- A recurring schedule is a template; session attendance belongs to concrete occurrences. Schedule edits must not rewrite completed attendance.
- Published competition structure becomes constrained; played results and downstream fixtures cannot be silently regenerated.
- Match states distinguish scheduled, active, awaiting confirmation, confirmed and exceptional termination. Offline completion is awaiting synchronization/confirmation.
- Finalized invoices, payroll and results retain history. Use credits, adjustments or explicit reopening workflows rather than deleting evidence.
- Athlete/staff archival should preserve attendance, invoices and competition history. Do not cascade-delete those records for routine deactivation.

Prefer UTC timestamps for instants, explicit local dates for attendance/payroll periods, and the academy timezone for schedule generation. Money uses integer minor units with currency. Bulk imports need preview, row-level errors and an explicit duplicate strategy; do not guess identity matches.
