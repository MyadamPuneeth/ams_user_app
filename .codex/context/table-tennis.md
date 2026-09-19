# Table tennis competitions and scoring

Status: intended academy competition behavior. Use versioned rules and retain the chosen rules configuration on each match.

## Competition structure

Tournaments contain categories/events for singles, doubles, mixed doubles or teams. Entries may be academy members or external guests. Support knockout, round robin and groups followed by knockout; include seeding, byes, draw preview and explicit publication.

Use the standard ITTF team-match presets in section 3.7.6, not arbitrary user-authored match sequences at launch. Each tie uses nominated squad members, valid lineup slots and ordered individual matches. A tie ends once a side wins the required majority; unneeded individual matches remain unplayed.

Apply the ITTF group ranking procedure in section 3.7.5, including tied-subgroup recalculation. If rules require lots after unresolved equality, record an organizer-supervised draw rather than an invisible random tie-break.

Check event eligibility using its configured category and cutoff. Do not infer age categories, entry deadlines, squad rules or entry prices from an athlete's batch. Preserve the participant data needed for an event without importing another academy's private profile.

## Rules baseline

Use the 2026 ITTF rules as the initial reference:

- Games to 11 with a two-point margin; matches best of three, five or seven games.
- Service changes after two points; at deuce, after each point.
- Track first server/receiver, doubles sequence, between-game changes and deciding-game end changes.
- Include timeouts, retirement, walkover, disqualification and referee corrections as explicit events.
- Officials adjudicate play; software implements scoring and records decisions. Include an explicit referee-controlled path for exceptional rules such as expedite rather than claiming full officiating automation.

Implement the detailed sequences and exceptional rules by consulting sections 2.11-2.15 and relevant competition regulations. Do not claim federation certification.

Source: [ITTF Statutes 2026](https://documents.ittf.sport/sites/default/files/public/2026-02/2026_Statutes_v1_consolidated_clean.pdf). This is a baseline reference; check official amendments when implementing or changing the rules.

## Shared scoring engine

Keep the rules package deterministic, independent of browser/network/database APIs. Given the same initial configuration and event stream, browser and server must produce the same state. Configuration and rule version are pinned for a started match.

Append ordered events rather than overwriting scores without history. Undo/referee adjustments retain original events and author/reason. Server validation is authoritative even if a browser already rendered a local result.

Keep a game result, individual match result and team-tie result distinct. Public updates never advance a draw by themselves. Only synchronized, confirmed results update standings and downstream fixtures.

## Offline protocol

1. Claim the match while online; the server grants one active scorer device/session.
2. Cache the scorer application, claimed match configuration, session details and event queue in IndexedDB.
3. Record points locally with stable event IDs and ordered sequence numbers. Display unsynchronized changes and provisional completion.
4. Reconnect using session identity, expected server version and ordered event batch. Authenticate again if needed without discarding queued events.
5. The server validates ownership and event ordering, applies accepted events transactionally, and acknowledges committed event IDs/version.
6. Retry acknowledged events safely. Preserve the local queue until acknowledgment.
7. On version conflict, revocation or device takeover, stop automatic merging and show a recoverable conflict for administrator reconciliation.

An offline session is not silently reassigned by an expiring heartbeat. Explicit administrative takeover revokes the previous writer; that writer's later events require review. Offline support is for a previously loaded/claimed match, not new tournament setup or arbitrary academy pages.

Public viewers see the last synchronized state and update time. Protect drafts and private channels. Final results advance competition only after confirmation. A correction that affects a downstream match already in progress requires administrator resolution and an audit trail.

## Acceptance scenarios

Deuce, doubles rotation, deciding games, timeout, undo, retirement, bye versus walkover, team majority, group ties, invalid events, duplicate synchronization, network loss mid-game, browser reload, lost acknowledgment, device takeover, revoked access and corrected upstream results.
