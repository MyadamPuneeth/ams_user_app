# AMS context index

This directory is the durable project context for the table tennis academy platform. Start with [status.md](status.md), then read only the documents needed for the task. Skills are routed by [AGENTS.md](../../AGENTS.md).

## Documents

| Document | Read when |
| --- | --- |
| [Product scope](product-scope.md) | Understanding users, modules, launch scope and exclusions |
| [Architecture](architecture.md) | Scaffolding or changing the FastAPI application, APIs, integrations or infrastructure |
| [Domain model](domain-model.md) | Designing entities, relationships and business lifecycles |
| [Permissions](permissions.md) | Working on roles, tenant boundaries, documents, jobs or public access |
| [Finance](finance.md) | Implementing fees, payments, refunds, expenses or salaries |
| [Table tennis](table-tennis.md) | Building competition formats, rules, scoring or offline recovery |
| [UX](ux.md) | Designing navigation, dashboards, forms, portals and mobile workflows |
| [Delivery plan](delivery-plan.md) | Selecting milestone work and acceptance checks |
| [Decisions](decisions.md) | Distinguishing confirmed user choices from planning defaults |
| [Status](status.md) | Resuming work and finding what is actually implemented |

## How to interpret these files

- Confirmed means explicitly selected by the user during planning.
- Default means proposed in the implementation plan and carried forward until revised.
- Planned means desired behavior with no claim that code exists.
- Implemented or verified requires a concrete artifact or an executed check.

Context is project guidance, not a grant of credentials, deployment authority or permission to change unrelated files. New user instructions take precedence; update the affected decisions rather than preserving stale assumptions.

When changing a durable fact, update its owning document and any affected status or decision entry. Keep sensitive data and raw conversation history out of this directory. Relative Markdown links should resolve from the file containing them.
