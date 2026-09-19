# Delivery plan and verification

Status: foundation is implemented and verified; milestones 2–5 remain pending. See [status.md](status.md).

## Milestones

| Milestone | Deliverables | Acceptance evidence |
| --- | --- | --- |
| 1. Foundation | Web/API scaffold, local services, identity, academy invitations, branches, roles, audit basics and seeded tenants | Two-academy access tests, login/invitation journey, documented runnable commands |
| 2. Academy operations | Admissions, athletes/guardians, batches, sessions, attendance, coaching and calendar | Enquiry-to-enrolment journey, guardian access tests, scheduling conflict tests |
| 3. Finance and business | Fees, test-mode Razorpay, receipts/refunds, expenses, inventory, staff attendance and salary management | Ledger reconciliation, webhook retry tests, issue/return balances, finalized payslip checks |
| 4. Competitions | Guest/member entries, draws, team events, scheduling, scoring, offline recovery and public results | Singles/doubles/team end-to-end paths, group ranking, recovery and conflict tests |
| 5. Pilot readiness | Completed portals, notifications, exports, reports, accessibility, monitoring and operations documentation | Role journey suite, backup restoration, staging rehearsal and recorded outstanding limitations |

These milestones sequence the full platform. Do not mark a module delivered when only a static screen or mock endpoint exists.

## Test strategy

- Unit tests for scoring, standings, financial arithmetic and lifecycle transitions.
- Database/API integration tests for tenant policies, constraints, authorization, transactional updates and provider callbacks.
- Playwright journeys for enrolment, attendance, guardian payments, event registration, team ties and offline scoring.
- Use deterministic provider doubles for automated failures/retries and provider test mode for integration rehearsal. Tests must not charge real users.
- Include two academies and multiple branches in authorization fixtures. Run policy tests with the actual restricted runtime role.
- Verify mobile layouts and keyboard/focus behavior on critical screens.
- For documentation-only work, validate skill metadata, relative links, routing coverage and consistency instead of running nonexistent application tests.

## Completion standard

A feature has working UI/API/persistence where applicable, meaningful success and failure checks, enforced permissions, accurate user feedback and updated contract/context documents. Report commands actually run and failures or unavailable prerequisites.

Before a live pilot: verify backup restoration, secret configuration, schema migration procedure, outbox/worker retry handling, payment reconciliation, private-file access and score synchronization monitoring. Configure a staging environment with test payments before live credentials.

## Dependencies and unresolved environment setup

Hosting vendor, live Supabase resources, SMTP sender/domain and academy Razorpay accounts are not provisioned. They are environment requirements for deployment, not a reason to block local scaffolding or deterministic tests. Exact dependency versions, package-manager scripts and CI provider will be recorded when scaffolding establishes them.

No automated build/test/deployment commands exist yet. Do not fabricate successful checks or copy speculative commands into the current-status record.
