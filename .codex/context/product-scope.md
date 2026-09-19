# Product scope

Status: planned product, documentation initialized. Decision provenance is in [decisions.md](decisions.md).

## Objective and audience

Give sports academies one connected system for athlete administration, coaching, finances, competitions and business operations. Start with table tennis and multiple independent academies in India. Each academy may have several branches. Launch through an invite-only pilot with a responsive web application.

Users: platform owner, academy administrator, coach, finance staff, scorer, athlete and parent/guardian. One person can hold multiple roles or belong to multiple academies; access remains scoped to the selected workspace.

## First-release capabilities

| Area | Intended capability |
| --- | --- |
| Academy setup | Branding, branches, tables, invitations, staff and branch assignments |
| Admissions | Enquiries, follow-ups, trial bookings, enrolment and conversion history |
| Athletes | Profiles, guardians, emergency contacts, documents and CSV import/export |
| Coaching | Batches, recurring sessions, coach assignments, attendance, training plans, goals, assessments and progress |
| Scheduling | Shared calendar for sessions, table reservations and matches with conflict prevention |
| Fees | Fee plans, recurring invoices, instalments, discounts, dues, reminders, receipts and refunds |
| Competitions | Internal and open registration, entry fees, categories, seeds, draws, schedules, singles, doubles, mixed doubles and teams |
| Scoring | Point-by-point scoring, public live results, offline continuation and safe recovery |
| Business | Equipment stock and issue/return, expense evidence, staff attendance, salaries and payslips |
| Communication | Academy and batch announcements, in-app notifications and transactional email |
| Reporting | Enrolment, attendance, fee collection, outstanding dues, expenses, payroll and sports performance |
| Self-service | Athlete and guardian access to their schedules, attendance, assessments, fees and event entries |

All areas belong to the intended first release. Milestones sequence delivery; they do not silently reduce scope to an MVP.

## Core journeys

- Enquiry -> trial -> enrolment -> batch assignment -> attendance -> assessment.
- Fee assignment -> invoice -> payment -> allocation -> receipt -> financial reporting.
- Open event -> guest or member registration -> entry payment -> accepted entrant -> draw -> scored match -> confirmed result -> standings.
- Team entry -> squad -> tie lineup -> individual matches -> team winner.
- Equipment receipt -> stock -> issue -> return or recorded loss.
- Salary setup -> period inputs -> payroll review -> final payslip -> recorded payment.
- Guardian invitation -> verified child link -> view and pay for linked children.

## Boundaries

Deferred: other sports, native mobile apps, WhatsApp/SMS, automated platform subscription billing, shared cross-academy rankings, federation integration, arbitrary custom team formats and statutory payroll filing/calculation. Payroll records payments; it does not transfer salaries.

Open competitions belong to an organizing academy. Guest registration does not create academy membership or grant access to internal records. Public visibility is explicitly controlled.

Defaults: AMS working name, English, INR and Asia/Kolkata. These are adjustable documented defaults, not a permanent prohibition on future expansion.
