---
name: ams-tournaments
description: Build AMS tournament registration, event categories, draws, scheduling, team ties, standings and advancement. Use for competition organization; point scoring and offline synchronization use ams-scoring.
---

# AMS tournaments

Read [table tennis](../../context/table-tennis.md), [domain model](../../context/domain-model.md) and public access rules in [permissions](../../context/permissions.md).

## Workflow

- Distinguish tournament, event/category, entry, stage, fixture, individual match and team tie.
- Keep guest entrants separate from academy membership. Registration grants access to the entrant's own workflow, not the academy's athlete directory.
- Support singles, doubles, mixed doubles and standard team presets across knockout, round robin and groups-to-knockout formats.
- Validate entry eligibility, pair/team membership and payment readiness before draw inclusion. A paid registration and an accepted entrant remain distinct states.
- Provide draw preview, seeds and byes before publication. Constrain changes after play starts; never regenerate a played bracket invisibly.
- Use the documented ITTF team presets and ranking procedure, including subgroup tie resolution. Record any required drawing of lots.
- Enforce table and participant scheduling conflicts. In doubles and team events, check underlying athletes, not just entry IDs.
- Advance only synchronized, confirmed results. Corrections affecting started downstream matches require explicit administrator resolution and retained history.
- Public projections expose only approved event/participant information.

## Verification

Test odd entry counts, byes, withdrawals, guest isolation, doubles eligibility, team lineup validation, group ties, team majority, concurrent scheduling and upstream corrections. Include one full groups-to-knockout path and one team tie when building the competition subsystem.
