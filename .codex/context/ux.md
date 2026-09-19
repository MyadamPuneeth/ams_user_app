# User experience

Status: design defaults for a responsive application; no visual assets or screens exist yet.

## Navigation and presentation

Desktop uses a persistent sidebar, visible academy/branch context and role-specific dashboard. Group navigation around People, Training, Competitions, Finance, Business and Reports rather than exposing backend module names.

Phone layouts prioritize attendance, scoring, schedules, payments and guardian tasks. Use clear page titles, touch-friendly controls and compact summaries; wide reports may use deliberate horizontal scrolling rather than squeezing every column onto a phone.

Use reusable accessible components, visible focus states, labelled forms, keyboard support, readable contrast and more than color alone for status. Default appearance is a clean light interface with restrained table-tennis/sports accents; branding assets and final palette are not user-supplied.

## Role landing pages

- Platform owner: academy onboarding, workspace status and operational issues.
- Academy administrator: today's sessions/matches, attendance, dues and tasks needing attention.
- Coach: assigned sessions, attendance entry and athlete development.
- Finance staff: collections, overdue invoices, reconciliation and payroll tasks.
- Scorer: assigned matches, current match and synchronization status.
- Athlete/guardian: schedules, progress, fees, receipts and relevant announcements; guardians can switch children.
- Public visitor: published event information, registration and live results.

## Interaction rules

Always distinguish loading, empty, error, stale and successful states. Preserve entered form data after a recoverable failure. Show actionable validation near the field and summarize failures for keyboard/screen-reader access.

Bulk imports show a preview, duplicate handling and row errors before confirmation. Show reasons for disabled actions when a workflow is locked by a published draw or finalized record. Authorization must be enforced server-side, not by hidden navigation alone.

Dates use the academy timezone and unambiguous formatting. Money shows INR with consistent Indian grouping. Separate an outstanding invoice, captured payment, pending refund and recorded manual payment visually and in wording.

Public publication and irreversible domain actions such as finalizing payroll or confirming a match need a clear review step showing what will change. Routine navigation and reversible edits should not accumulate confirmation dialogs.

## Scorer

Make participant names, game score, match score, current server and point controls readable at arm's length. Provide deliberate undo, visible offline status, queued-event count and last synchronization. Protect against accidental double submission while preserving intentional rapid scoring.

Show provisional versus confirmed results explicitly. Never label a local-only finish as officially published. A conflict screen preserves local work and explains why automatic syncing paused.

## Notifications and reports

Use in-app and email announcements/reminders with appropriate audience scope. Failed delivery does not roll back a payment or score. Reporting filters show academy, branch, date range and timezone; exported output applies the same permissions.

Fixture/demo data should include two distinct academies, multiple branches, a guardian with two children, guest entrants, fee arrears and a team competition. Keep demonstrations clearly separate from live records.
