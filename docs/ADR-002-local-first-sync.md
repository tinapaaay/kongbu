# ADR-002: Phase 2 saves progress locally first and syncs to Supabase

**Status:** Proposed
**Date:** 2026-11-20
**Deciders:** Product owner
**Builds on:** [ADR-001](PHASE-0-PLAN.md#2-key-decision-record) (store learner history as a local attempt log, behind a repository)

## Context

Phase 2 adds Supabase so progress follows the learner between Chrome, Safari, and their phone. The PRD also requires that core quizzes work with no internet connection (checked by `tests/e2e/offline-and-privacy.spec.ts`).

Today the app reads and writes one saved copy in the browser. Its history is a list of answers (attempts) that are never edited and each have their own ID. Saving already goes through named actions on an asynchronous `LearnerRepository` (`submitSession`, `recordChapterVisit`, and so on), not through "save everything."

An architecture review after Phase 1 found three things that break once a second device appears:

1. **One unfinished-quiz slot.** `LearnerData.activeSession` holds a single quiz in progress. Starting a quiz on the phone would replace the one in progress on the laptop.
2. **"Later" is judged by the device's clock.** A mistake is fixed by a correct answer in a *later* quiz (`domain/progress/mistakes.ts`). Two devices whose clocks differ by minutes could get that order wrong.
3. **Restore replaces everything.** That's safe in one browser. Once data syncs, a replace would spread to every device.

## Decision

Keep the browser copy as what the screens read and write, so the app stays instant and works offline. Add a **sync step** that sends new attempts, quizzes, and chapter visits to Supabase, and brings in the ones made on other devices. Records are combined by their ID and are never overwritten.

## Options considered

### Option A: online only (the repository talks straight to Supabase)

| Dimension | Assessment |
|---|---|
| Complexity | Low |
| Cost | Supabase free tier is enough |
| Scalability | Good |
| Team familiarity | Easiest to learn |

**Pros:** simplest, and there is one copy of the truth.
**Cons:** breaks the offline requirement. Every answer waits for the network, and a dropped connection mid-quiz can lose an answer.

### Option B: local first, with our own small sync (recommended)

| Dimension | Assessment |
|---|---|
| Complexity | Medium: a queue of changes not yet sent, sending and fetching, and combining by ID |
| Cost | Supabase free tier is enough |
| Scalability | Good. Records are only ever added, so combining is simple |
| Team familiarity | Builds on the existing repository and tests |

**Pros:** works offline and stays instant. The existing repository, unit tests, and browser tests keep working. Combining is safe because an answer is never edited.
**Cons:** more code to own, and sync status has to be designed and shown ("3 answers waiting to sync").

### Option C: a third-party local-first sync library

| Dimension | Assessment |
|---|---|
| Complexity | Low code, but a high learning curve |
| Cost | Often a paid tier at scale |
| Scalability | Strong |
| Team familiarity | New concepts and a dependency on one provider |

**Pros:** sync edge cases are handled for you.
**Cons:** a large dependency for a problem that is small here, because records are only ever added. Harder to learn from.

## Trade-off analysis

Option B costs a little more than Option A but keeps a hard PRD requirement (offline quizzes) and every test already written. Option C solves a harder problem than this app has: records that are never edited are the easy case for syncing, so B gets most of C's benefit for much less weight.

## Consequences

- **Easier:** progress across devices. Backups become a safety net instead of the only way to move between browsers. Offline quizzes keep working.
- **Harder:**
  - Sign-in is needed. The PRD deferred it until the MVP was verified, which is now done.
  - Every table needs row-level security, so each learner can read and write only their own rows. Only the public anon key is ever used in the browser; the service role key never is (`npm run check:secrets` already fails a build that contains it).
  - Sync status needs a visible place on screen.
- **Changes the data model** (saved data version 3, with a migration):
  - One unfinished quiz per device instead of one in total.
  - "Later" is decided by the time the server received each record, not the device's clock.
  - Restore and import add the records that are missing instead of replacing everything.
- **Revisit:** Option C, if sync bugs pile up or records ever need to be edited instead of only added.

## Action items

**Before Phase 2 (small, can be done now):**

1. [ ] Pass the concept list into `chapterProgress` instead of importing content inside a rule (`domain/progress/chapterProgress.ts`).
2. [ ] Move shared quiz pieces (`useStartPractice`, `PracticeConceptButton`, `quizKindLabel`) out of the quiz screen's folder into a shared place.
3. [ ] Load each chapter's content only when it is opened, before adding the second chapter. Chapter 11 adds about 6.5 KB compressed to the main JavaScript file, so 60 chapters would add about 390 KB.

**Phase 2:**

1. [ ] Sign-in with Supabase, and row-level security on every table.
2. [ ] Tables for attempts, quizzes, and chapter visits, keyed by the IDs the app already creates.
3. [ ] A sync queue in the repository, and a sync indicator on screen.
4. [ ] One unfinished quiz per device (saved data version 3, with a migration).
5. [ ] Restore and import add missing records instead of replacing.
6. [ ] Browser tests: two devices, offline then reconnect, and the same record sent twice.

## Terms

- **Local-first:** the copy on your device is the one you use; the cloud copy is kept in step with it.
- **Append-only log:** records that are only ever added, never edited. This is what makes syncing simple here.
- **Clock skew:** two devices disagreeing about the current time.
- **Row-level security:** database rules that decide, row by row, who may read or change data.
