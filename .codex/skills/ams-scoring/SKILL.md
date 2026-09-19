---
name: ams-scoring
description: Implement or change AMS table tennis scoring rules, scorer controls, match ownership, offline event synchronization and public live scores. Use whenever points or match confirmation behavior changes.
---

# AMS scoring

Read [table tennis](../../context/table-tennis.md), scorer guidance in [UX](../../context/ux.md) and [permissions](../../context/permissions.md). Consult the cited official rules for exact sequences.

## Workflow

- Express rules as deterministic state transitions in the shared package; the browser and server consume the same pinned rules/configuration.
- Retain an ordered event history for points, undo and referee adjustments. Do not use unaudited score overwrites.
- Let the server validate authorized session ownership, event identity/order and expected match version before committing.
- Persist local events and claim details before acknowledging an offline point in the UI. Preserve the queue through reload and authentication renewal.
- Delete pending local work only after server acknowledgment; deduplicate replay after lost acknowledgments.
- Treat device takeover/revocation and version conflicts as reconciliation cases. Do not silently merge two scorers or discard their local work.
- Separate locally completed, synchronized and confirmed results. Public scores show the last committed version and timestamp; draw advancement consumes confirmation.
- Protect public/private channel boundaries and publish committed state only.
- Make sync status and recovery actions visible in scorer controls without exposing implementation details to ordinary spectators.

## Verification

Cover 11-point wins, deuce, service changes, doubles sequence, deciding-game end changes, undo and exceptional outcomes. Test network loss/reload, duplicate batches, lost acknowledgment, invalid event order, stale versions, session takeover and revoked access. Compare browser/server replay outcomes from identical event histories.
