---
name: ams-context
description: Maintain AMS project context, decisions, status, AGENTS.md and project skill instructions. Use for documentation setup, durable project changes and handoffs; avoid copying transient conversation into memory.
---

# AMS context maintenance

Read the [context index](../../context/README.md), [decisions](../../context/decisions.md), [status](../../context/status.md) and [root instructions](../../../AGENTS.md).

## Workflow

- Identify whether the change is a user-confirmed decision, implementation default, planned behavior or verified implementation fact. Preserve that distinction explicitly.
- Update the owning context document. Record material decision changes with date, provenance and superseded choices.
- Keep skills as reusable workflows and context as the source of shared project facts. Link rather than copying detailed domain rules into every skill.
- Maintain the user's locations: .codex/skills for all skill files, .codex/context for all context files, and root AGENTS.md for instruction routing.
- Keep skill names lowercase/hyphenated with required YAML name and description; make triggers specific enough to avoid loading irrelevant skills.
- Route each skill from AGENTS.md because the requested location is not the documented native repository discovery path.
- Update status only with artifacts and checks that exist. Record FastAPI/uv, SQLAlchemy and raw SQL migration changes in architecture and decisions when they change the implementation boundary; do not claim a feature, migration, deployment or live integration is complete based on a plan.
- Preserve project scope boundaries and current authorization. Do not add blanket approval requirements, deployment permission or delegation requirements to reusable instructions.
- Avoid credentials, personal athlete records, raw transcripts and generic coding advice in project memory.

## Verification

Check frontmatter and folder/name alignment, resolve local Markdown links, confirm every skill is reachable from AGENTS.md and review cross-file decisions for contradictions. Use the installed skill-creator validator if available. Report whether validation was structural or behavioral; structural success does not prove a skill's downstream decisions.
