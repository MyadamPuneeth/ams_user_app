---
name: ams-frontend
description: Build or refine AMS responsive screens, navigation, dashboards, forms and athlete or guardian portals. Use for UI work; scoring behavior also requires the scoring guidance.
---

# AMS frontend

Read [UX](../../context/ux.md), [product scope](../../context/product-scope.md) and relevant [permissions](../../context/permissions.md).

## Workflow

- Inspect the existing component system and the FastAPI-generated API contract. Use React/TypeScript with the separate backend; do not replace the planned architecture with a Next.js application.
- Shape screens around the user's role, selected academy and branch. Make the active workspace and child selection visible where mistakes would affect records.
- Keep office workflows usable on desktop and attendance, scoring, schedules and payments usable on phones.
- Use accessible forms, visible focus, keyboard navigation and clear status wording. Include loading, empty, error and stale states with recovery.
- UI visibility is not authorization. Call protected APIs and handle denied or revoked access gracefully.
- Consume generated contracts. Temporary fixtures must be clearly identified; a mock screen is not a working feature.
- Preserve entered data on recoverable errors. For financial or competition finalization, show the concrete outcome before submission.
- Use the existing design system if one exists; do not introduce unrelated visual redesign during a functional fix.

## Verification

Check the changed journey at phone and desktop widths, with keyboard navigation and realistic long names/data. Exercise failure and empty states. For shared components or critical workflows, run relevant component or browser tests; do not add wording-only tests for reversible cosmetic edits.
