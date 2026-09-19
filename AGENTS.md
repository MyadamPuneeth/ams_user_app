# AMS project instructions

## Start here

AMS is a multi-academy table tennis management platform for an invite-only India pilot. This file applies to the AMS directory and its descendants.

1. Read [.codex/context/README.md](.codex/context/README.md) and [status.md](.codex/context/status.md) at the start of a task.
2. Load the context documents and project skills relevant to the requested work using the tables below. Do not load every document for a small change.
3. Treat current code and executed checks as evidence of implementation. Context describes intended behavior unless explicitly marked implemented.
4. Preserve the user's current instructions. Record material changes to the plan in [decisions.md](.codex/context/decisions.md).

## Project skills

The user requires project skills under .codex/skills. Read the linked SKILL.md directly when the task matches its purpose; do not assume these paths appear in the native skill picker. Do not relocate or duplicate them merely to change discovery.

| Work | Skill |
| --- | --- |
| App scaffolding, backend modules, API contracts, background jobs | [ams-backend](.codex/skills/ams-backend/SKILL.md) |
| Database schema, migrations, tenant isolation, authentication and authorization | [ams-data-access](.codex/skills/ams-data-access/SKILL.md) |
| Responsive screens, portals, accessible interactions | [ams-frontend](.codex/skills/ams-frontend/SKILL.md) |
| Admissions, athletes, coaching, attendance, scheduling, inventory | [ams-academy-operations](.codex/skills/ams-academy-operations/SKILL.md) |
| Fees, payments, refunds, expenses, salaries, financial reports | [ams-finance](.codex/skills/ams-finance/SKILL.md) |
| Tournament registration, draws, team ties, standings and advancement | [ams-tournaments](.codex/skills/ams-tournaments/SKILL.md) |
| Table tennis rules, scorer, offline synchronization, public live scores | [ams-scoring](.codex/skills/ams-scoring/SKILL.md) |
| Tests, regression checks, CI, staging and release readiness | [ams-verification](.codex/skills/ams-verification/SKILL.md) |
| Updating project memory, decisions, handoffs or these instructions | [ams-context](.codex/skills/ams-context/SKILL.md) |

## Implementation direction

- Use the separate React/TypeScript frontend and FastAPI backend described in [architecture.md](.codex/context/architecture.md). Next.js is superseded by the user's separate-backend choice.
- Keep application authorization, database isolation, private file access, exports, jobs and realtime channels consistent with [permissions.md](.codex/context/permissions.md).
- Use server-authoritative finance and competition results. Offline scoring is limited to claimed matches and is provisional until synchronized.
- Keep sport rules in the shared deterministic rules package; keep provider secrets out of browser bundles, source control and logs.
- Treat proposed modules, paths and commands as planned until they exist. Inspect actual manifests before choosing install, build or test commands.

## Working agreements

- Work within AMS. At initialization its Git root is the parent Ongoing_Projects directory, which contains unrelated projects and changes. Scope Git operations to AMS and preserve unrelated work.
- Implement the requested task; the delivery roadmap is not blanket authorization to execute all future milestones.
- Make routine reversible decisions within the established plan. Ask only when missing information materially changes scope, correctness or an external action.
- Do not send messages, provision paid services or publish deployments merely because a skill describes such a workflow.
- Do not spawn subagents unless the user or an applicable instruction explicitly requests delegation.
- Keep dependencies and migrations reproducible. Do not overwrite user changes or commit credentials.
- Verify behavior proportionately. Financial, authorization and scoring changes need meaningful regression coverage; documentation changes need reference and consistency checks.
- Update context when a change affects a decision, interface, invariant, milestone or handoff. Do not turn context into a transcript.
- Report what changed, checks actually run and any remaining limitation. Never report planned work as completed.

## Documentation conventions

Skills contain reusable task guidance; context contains shared project facts and decisions. Link to the authoritative context instead of duplicating detailed rules. Keep all skill files under .codex/skills and all context files under .codex/context. Use AGENTS.md capitalization for the project entrypoint.

Discovery references: [AGENTS.md](https://learn.chatgpt.com/docs/agent-configuration/agents-md), [skills](https://learn.chatgpt.com/docs/build-skills).
