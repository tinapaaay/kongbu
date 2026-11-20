# Hangul Lab

A personal Korean study workspace for EPS-TOPIK preparation, organized around the NEW EPS-TOPIK Standard Korean Textbook (Books 1 and 2).

Practice questions are original EPS-TOPIK-style questions, not real exam questions. Textbook PDFs and audio are private study material and are never committed to this repository.

## Status

**Phase 1 (Functional MVP): complete and verified.** The full core workflow works in Chrome and Safari, on desktop and iPhone: Dashboard → Chapter 11 → Quiz → Results → Mistake Review.

Milestone 11 acted on an outside review: progress is safe with several tabs open, "fixed" and "mastered" need real evidence, mistakes link straight to practice and to the right lesson section, and Settings fits a phone screen.

| Milestone | Status |
|---|---|
| 1. Project setup | Done |
| 2. App shell and tokens | Done |
| 3. Content foundation | Done |
| 4. Scoring and quiz rules | Done |
| 5. Local persistence and backup | Done |
| 6. Dashboard → Chapter 11 | Done |
| 7. Quiz Player | Done |
| 8. Results | Done |
| 9. Mistake Review | Done |
| 10. Final verification | Done |
| 11. Trust and polish (from an outside review) | Done |

The full plan, decisions, and acceptance checks are in [docs/PHASE-0-PLAN.md](docs/PHASE-0-PLAN.md).

## Local setup

Requires Node.js 22 or newer.

```bash
npm install
```

```bash
npm run dev
```

Then open http://localhost:5173.

To run the browser tests, download Playwright's test browsers once:

```bash
npx playwright install chromium webkit
```

## Commands

| Command | What it does |
|---|---|
| `npm run dev` | Starts the development server with live reload |
| `npm test` | Runs all tests once |
| `npm run test:watch` | Reruns tests whenever a file changes |
| `npm run typecheck` | Checks TypeScript types |
| `npm run lint` | Checks code for common mistakes |
| `npm run build` | Builds the production site into `dist/` |
| `npm run tokens` | Regenerates `src/styles/tokens.css` from `DESIGN.md` |
| `npm run design:lint` | Checks `DESIGN.md` against the design.md format |
| `npm run test:e2e` | Runs browser tests against the production build in Chrome, Safari, and iPhone Safari |
| `npm run check:secrets` | Fails if anything that looks like a key or token is in `dist/` |
| `npm run verify` | Runs everything above in order. Use it before every push |

## Testing

There are two kinds of tests.

- **Unit and component tests** (Vitest, 178 tests in `src/**/*.test.ts(x)`): rules, content validation, storage, and every screen, run in a simulated browser. They run in React StrictMode, like the dev server.
- **Browser tests** (Playwright, `tests/e2e/`): the real production build in three setups, Chrome on desktop, Safari on desktop, and Safari on iPhone. WebKit, Safari's engine, stands in for Safari.

| Browser test file | What it proves |
|---|---|
| `definition-of-done.spec.ts` | The PRD's Definition of Done end to end, including a refresh mid-quiz and returning later. Also proves chapter filtering and double-submit safety |
| `offline-and-privacy.spec.ts` | Quizzes work with the network switched off, and the app never contacts another website |
| `backup.spec.ts` | A backup made in one browser profile restores in a completely separate one, and wrong files are rejected |
| `accessibility.spec.ts` | Every screen passes automated WCAG 2.1 AA checks (axe), a quiz can be taken by keyboard alone, and focus is visible |

Keyboard note for Safari: Safari on a Mac moves Tab only between text fields by default. Press Option+Tab to reach links and buttons, or turn on **Settings → Advanced → Press Tab to highlight each item**.

## PRD acceptance criteria

| PRD check | Status | How it is verified |
|---|---|---|
| A fresh user has no false progress or resume state | ✅ Verified | Dashboard and library component tests; Definition of Done browser test |
| Questions show exactly four valid answer options | ✅ Verified | Content validation rejects anything else; quiz browser test counts four radios |
| Correct answers remain hidden until submission | ✅ Verified | The quiz screen receives questions without the key (`PlayableQuestion`); tests check no answer or explanation text appears |
| Submitted answers receive accurate scores | ✅ Verified | Scoring unit tests (all right, all wrong, mixed, skipped); quiz tests score 7/10 exactly |
| Explanations match the stored answer key | ✅ Verified | The correct answer shown comes from the key saved at submission; edited questions are flagged |
| Wrong answers appear in the mistake tracker | ✅ Verified | Mistake Review tests; Definition of Done browser test |
| Progress remains available after refresh | ✅ Verified | Storage tests; browser test refreshes mid-quiz and after submitting |
| Chapter filters prevent unrelated questions from appearing | ✅ Verified | Session-building unit test; browser test checks every question id is Chapter 11 |
| The interface works on mobile and desktop | ✅ Verified | Browser tests on desktop Chrome, desktop Safari, and iPhone Safari |
| Core quizzes function without AI connectivity | ✅ Verified | Offline browser test; the app has no AI code and makes no outside requests |
| Flashcard imports reject malformed records without silently losing data | ⏳ Pending, Phase 3 | Flashcards are not built yet. Backup restore already follows this rule |
| AI secrets never appear in client-side code | ✅ Verified for Phase 1 | No AI code exists; `npm run check:secrets` scans every build. Recheck in Phase 4 |

### Definition of Done

All eight steps pass in the browser tests: open the dashboard, select Chapter 11, start a practice exam, answer ten original EPS-TOPIK-style questions, submit, review the score and explanations, see mistakes saved, and return later to continue.

### Completed and pending

**Completed in Phase 1:** dashboard, 60-chapter library, Chapter 11 lesson, 22 original questions, quiz player, automatic scoring, explanations, mistake tracking, local saving with backup and restore, responsive layout, and accessibility checks.

**Known limits:**

- The 22 Chapter 11 questions are drafts. They were checked against Book 1 (pages 150–159) and fixed where needed, but a person should still review them and mark them `approved`.
- If the same quiz is open in two tabs, the tab that saves last keeps its answers for that quiz. Submitted quizzes are never lost.
- Progress is stored per browser. Use Settings → Backup to move it between Chrome and Safari until Phase 2 adds a database.
- Only Chapter 11 has content. Other chapters show their real titles with "Content coming later."

**Pending by phase:**

- **Phase 2:** Supabase database, multi-device progress, question management, import and export.
- **Phase 3:** flashcards with spaced repetition, Smart Review recommendations, Targeted Review mode, timed exam mode.
- **Phase 4:** secure backend and AI tutor.
- **Phase 5:** listening questions with the textbook audio, richer analytics.

## Design system

All visual rules live in [DESIGN.md](DESIGN.md). Its colors, section system, and layout follow the textbook, adjusted where needed for on-screen readability.

Colors, spacing, and corner radii are design tokens. They are generated into `src/styles/tokens.css` and used through CSS variables such as `var(--color-primary)`. Don't type hex colors in components. Change `DESIGN.md`, then run `npm run tokens`.

Lint `DESIGN.md` after every change, and fix findings until there are 0 errors and 0 warnings:

```bash
npx -y @google/design.md@0.4.0 lint --format json DESIGN.md
```

Visual references:

- [docs/design/design-preview.html](docs/design/design-preview.html): colors, type, and components
- [docs/design/wireframes.html](docs/design/wireframes.html): the seven Phase 1 screens

## Project structure

```text
src/
  main.tsx        Starts React, the router, fonts, and global styles
  app/            Routes, layouts, and navigation
  components/     Shared UI pieces (PageHeader, SectionHeader, StatusBadge, ConfirmDialog, buttons)
  content/        Chapters, lessons, concepts, questions, and their validation
  data/           Saving progress in the browser, backups, and the data provider
  domain/         Pure rules with no UI: learner data, quiz building, scoring, progress
  features/       One folder per screen (dashboard, chapters, quiz, ...)
  styles/         tokens.css (generated) and global.css
  test/           Shared test setup
tests/e2e/        Playwright browser tests
scripts/          Build checks (secrets scan)
docs/             Plan, decisions, and design references
```

## Study content

All study material lives in `src/content/`, and screens read it only through `src/content/index.ts`.

- `chapters.ts`: all 60 chapters from both books' contents pages.
- `chapter-11/`: the lesson (vocabulary, grammar, culture), 8 concepts, and 22 original practice questions. Household words are split into laundry, cleaning, and cooking, so one right answer about brooms can't fix a laundry mistake.
- `schemas.ts`: the rules every chapter, concept, question, and lesson must follow.
- `validate.ts`: cross-checks, such as every question pointing to a real concept and every answer key matching a choice.

`npm test` fails if any content breaks a rule. Questions are original EPS-TOPIK-style practice, stay `draft` until a person reviews them, and must never mention ①–④ in explanations, because choices can be shuffled.

## Study rules

The rules in `src/domain/` are plain TypeScript functions with no screens or storage, so each one is tested on its own.

| Rule | File |
|---|---|
| A practice exam has 10 questions from one chapter. Missed questions come first, then other questions on concepts with open mistakes. Then every concept gets at least one question, then unseen questions, then the ones seen longest ago | `quiz/buildSession.ts` |
| A concept review is a short quiz (up to 5 questions) on one concept, started from Mistakes. It counts as practice and as evidence for fixing mistakes, but not toward mastery | `quiz/buildSession.ts` |
| Each question's four choices get a saved shuffled order | `quiz/buildSession.ts` |
| The quiz screen gets questions without the answer key or explanation | `quiz/playableQuestion.ts` |
| Scoring compares answers with the stored key. Skipped questions count as wrong | `quiz/scoreSession.ts` |
| A mistake is fixed when, in a later quiz, the same question is answered correctly, or two different questions on the same concept are | `progress/mistakes.ts` |
| Mastered means the latest practice exam had at least 10 questions and at least 80% correct, every concept in the chapter has a right answer, and there are no open mistakes | `progress/chapterProgress.ts` |
| Weekly activity counts questions per local day, Monday to Sunday | `progress/activity.ts` |
| The Dashboard's next step: unfinished quiz, then open mistakes, then the current chapter | `progress/nextStep.ts` |

## Saved progress

Progress is saved in the browser's localStorage under one key, `hangul-lab:learner-data`, as a single JSON value. Each change rewrites the whole value in one step, so it is never half-saved.

- **Reload safe:** chapter visits, unfinished quizzes, submitted quizzes, and answers survive refreshes.
- **Several tabs:** every change starts from the latest saved copy, not the tab's own older copy, so a forgotten tab can't erase work from another tab. Tabs also update when another tab saves.
- **Format versions:** saved data has a `schemaVersion` (now 2). Older saved data and backups are upgraded when loaded. Version 1 → 2 moved old household-word answers to the new laundry, cleaning, and cooking concepts.
- **Damaged data:** if saved data can't be read, a copy is kept under `hangul-lab:damaged-copy:<time>` and every page shows a warning. Nothing is silently deleted.
- **Newer data:** data saved by a newer app version is never overwritten.
- **Blocked or full storage:** the app keeps working for the current visit and shows a warning.
- **Backups:** Settings downloads a `hangul-lab-backup-YYYY-MM-DD.json` file and restores one. A restore file is fully checked and summarized, and nothing is replaced until you confirm.

Screens use progress only through `useLearnerData()`. Storage details stay in `src/data/`, so Phase 2 can switch to a database by adding a new `LearnerRepository`.

## Taking a quiz

- Start a practice exam from a chapter page, or a concept review with "Practice this concept" on Mistakes. A quiz in progress is resumed rather than replaced.
- Choose with the mouse, by tapping, or with keys 1–4. Move with Previous and Next, the question numbers, or ← and →.
- Every answer and move is saved immediately, so a refresh returns to the same question.
- Submit at any time. The confirmation lists unanswered questions, which count as incorrect.
- Exit asks first and keeps the quiz to resume later.
- Answers and explanations are never sent to the quiz screen before submission.

## Screens and URLs

| URL | Screen |
|---|---|
| `/` | Dashboard |
| `/learn` | Chapter Library |
| `/learn/11` | One chapter (1–60). `#study-grammar-eul-geyo` and similar open the section that teaches a concept |
| `/practice` | Redirects to `/practice/mistakes` |
| `/practice/mistakes` | Mistake Review. Filters are in the address: `?chapter=ch11&concept=grammar.eul-geyo&range=7` |
| `/quiz/:sessionId` | Quiz (no main navigation) |
| `/quiz/:sessionId/results` | Results |
| `/settings` | Settings |
