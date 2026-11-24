# Kongbu (공부) · EPS-TOPIK Review

An unofficial EPS-TOPIK review app based on the Standard Korean Language Textbook (Books 1 and 2). It is not made by or affiliated with HRD Korea. Formerly called Hangul Lab. "Kongbu" is 공부 ("study"), spelled the way it sounds.

A personal Korean study workspace for EPS-TOPIK preparation, organized around the NEW EPS-TOPIK Standard Korean Textbook (Books 1 and 2).

Practice questions are original EPS-TOPIK-style questions, not real exam questions. Textbook PDFs and audio are private study material and are never committed to this repository.

**Live app:** https://tinapaaay.github.io/kongbu/ (deployed by GitHub Actions on every push to `main`, only after every check passes; progress is saved only in your browser)

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
| 12. Design critique fixes | Done |
| Polish: smaller critique items | Done |

The full plan, decisions, and acceptance checks are in [docs/PHASE-0-PLAN.md](docs/PHASE-0-PLAN.md). The proposed approach for Phase 2 (save locally first, then sync to Supabase) is in [docs/ADR-002-local-first-sync.md](docs/ADR-002-local-first-sync.md).

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
| `npm run design:check-type` | Fails if any stylesheet uses a font size that isn't a typography level in `DESIGN.md` |
| `npm run test:e2e` | Runs browser tests against the production build in Chrome, Safari, and iPhone Safari |
| `npm run check:content-split` | Fails if a chapter's questions are in the main app file instead of their own file |
| `npm run check:secrets` | Fails if anything that looks like a key or token is in `dist/` |
| `npm run verify` | Runs everything above in order. Use it before every push |

## Testing

There are two kinds of tests.

- **Unit and component tests** (Vitest, `src/**/*.test.ts(x)`): rules, content validation, storage, and every screen, run in a simulated browser. They run in React StrictMode, like the dev server.
- **Browser tests** (Playwright, `tests/e2e/`): the real production build in three setups, Chrome on desktop, Safari on desktop, and Safari on iPhone. WebKit, Safari's engine, stands in for Safari.

| Browser test file | What it proves |
|---|---|
| `definition-of-done.spec.ts` | The PRD's Definition of Done end to end, including a refresh mid-quiz and returning later. Also proves chapter filtering and double-submit safety |
| `offline-and-privacy.spec.ts` | Quizzes work with the network switched off, and the app never contacts another website |
| `installable-offline.spec.ts` | The manifest and icons make the app installable; after one visit, every page and chapter opens with no internet, even after a reload (Chrome only: Playwright's service worker support is reliable only there) |
| `backup.spec.ts` | A backup made in one browser profile restores in a completely separate one, and wrong files are rejected |
| `accessibility.spec.ts` | Every screen passes automated WCAG 2.1 AA checks (axe), a quiz can be taken by keyboard alone, and focus is visible |

**On GitHub:** pull requests run `npm run verify` (the Checks workflow), and the deploy to GitHub Pages runs it again before publishing. A failing check stops the deploy.

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

- The 22 Chapter 11 questions are marked `ai-reviewed` after an AI-assisted review against Book 1, pages 150–159, authorized by the product owner. The quiz shows “Reviewed by AI · not teacher-checked”; `approved` is reserved for a subsequent human review. See the [per-question review](docs/content/chapter-11-review.md) for changes, answer rationales, and limits.
- If the same quiz is open in two tabs, the tab that saves last keeps its answers for that quiz. Submitted quizzes are never lost.
- Progress is stored per browser. Use Settings → Backup to move it between Chrome and Safari until Phase 2 adds a database.
- The 26 Chapter 12 questions (Public Transportation) are marked `ai-reviewed` after an AI-assisted review against Book 1, pages 160–169. Ten were rewritten or edited, mostly so they no longer mirror the book's own test items. See the [Chapter 12 review](docs/content/chapter-12-review.md).
- The 24 Chapter 1 questions (Self Introduction) are marked `ai-reviewed` after an AI-assisted review against Book 1, pages 50–59. They use only the grammar Chapter 1 teaches (입니다/입니까?, 은/는). See the [Chapter 1 review](docs/content/chapter-01-review.md).
- The 26 Chapter 13 questions (Weekend Activities) are marked `ai-reviewed` after an AI-assisted review against Book 1, pages 170–179. See the [Chapter 13 review](docs/content/chapter-13-review.md).
- The 26 Chapter 14 questions (Getting Directions) are marked `ai-reviewed` after an AI-assisted review against Book 1, pages 180–189. See the [Chapter 14 review](docs/content/chapter-14-review.md).
- Chapters 1 and 11–14 have content. Other chapters show their real titles with "Content coming later." Chapters are being added in order from Chapter 15; Chapters 2–10 come later.

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
  components/     Shared UI pieces (PageHeader, SectionHeader, StatusBadge, ConfirmDialog, buttons,
                  NotFoundPage, ContentBoundary for loading and retry)
  content/        Chapters, lessons, concepts, questions, and their validation.
                  Each chapter's lesson and questions download on demand as their own file
  data/           Saving progress in the browser, backups, and the data provider
  domain/         Pure rules with no UI: learner data, quiz building, scoring, progress
  features/       One folder per screen (dashboard, chapters, quiz, ...). Screens never import each other
  practice/       Starting practice exams and concept reviews, shared by several screens
  styles/         tokens.css (generated) and global.css
  test/           Shared test setup
tests/e2e/        Playwright browser tests
scripts/          Build checks (secrets, type scale, content split)
docs/             Plan, decision records (ADR-002), and design references
```


`src/architecture.test.ts` keeps these boundaries in place. It fails if a rule in `domain/` loads study content, if a screen imports another screen's folder, or if anything but `content/index.ts` imports a chapter's files directly.

## Study content

All study material lives in `src/content/`, and screens read it only through `src/content/index.ts`.

- `chapters.ts`: all 60 chapters from both books' contents pages.
- `chapter-01/`: the lesson, 6 concepts, and 24 original practice questions that use only Chapter 1 grammar.
- `chapter-11/`: the lesson (vocabulary, grammar, culture), 8 concepts, and 22 original practice questions. Household words are split into laundry, cleaning, and cooking, so one right answer about brooms can't fix a laundry mistake.
- `chapter-12/`: the lesson, 8 concepts, and 26 original practice questions, at least two per concept, so a mistake can be fixed by a different question. `(으)로` and `~에서 ~까지` are separate concepts, even though the book teaches them on one page.
- `schemas.ts`: the rules every chapter, concept, question, and lesson must follow.
- **What loads when:** chapter titles and concept names load with the app. Each chapter's lesson and questions (`chapter-11/index.ts`) are a separate file, downloaded the first time a screen needs them through `loadChapterContent()` or `useChapterContent()`. The app also downloads your current chapter in the background, so it keeps working if the connection drops after the app opens. `index.ts` finds chapters by their `chapter-NN/` folders, so adding a folder is all it takes: see [Adding a chapter](docs/content/adding-a-chapter.md), which also has the concept ID naming rule.
- `questionBuilder.ts`: the shared `questionMaker()` and standard instructions that every chapter's `questions.ts` uses.
- `allContent.ts`: every chapter at once, for tests and validation only.
- `validate.ts`: cross-checks, such as every question pointing to a real concept and every answer key matching a choice.

`npm test` fails if any content breaks a rule. Questions are original EPS-TOPIK-style practice, default to `draft`; AI review sets `ai-reviewed`, while human approval sets `approved`, and must never mention ①–④ in explanations, because choices can be shuffled.

**Teacher review:** `npm run export:review -- 11` (or `-- --all`) writes a printable HTML sheet and a CSV of a chapter's questions to `exports/` (gitignored) for a Korean teacher to check. See [Teacher review](docs/content/teacher-review.md) for what they check and how to record approvals.

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

Progress is saved in the browser's localStorage under one key, `hangul-lab:learner-data`, as a single JSON value. The key keeps the app's old name on purpose: renaming it would make existing progress look empty. Each change rewrites the whole value in one step, so it is never half-saved.

- **Reload safe:** chapter visits, unfinished quizzes, submitted quizzes, and answers survive refreshes.
- **Several tabs:** every change starts from the latest saved copy, not the tab's own older copy, so a forgotten tab can't erase work from another tab. Tabs also update when another tab saves.
- **Format versions:** saved data has a `schemaVersion` (now 2). Older saved data and backups are upgraded when loaded. Version 1 → 2 moved old household-word answers to the new laundry, cleaning, and cooking concepts.
- **Damaged data:** if saved data can't be read, a copy is kept under `hangul-lab:damaged-copy:<time>` and every page shows a warning. Nothing is silently deleted.
- **Newer data:** data saved by a newer app version is never overwritten.
- **Blocked or full storage:** the app keeps working for the current visit and shows a warning.
- **Backups:** Settings downloads a `kongbu-backup-YYYY-MM-DD.json` file and restores one (backups made under the app's earlier names, `hangul-lab-backup-…` and `gongbu-backup-…`, still restore). A restore file is fully checked and summarized, and nothing is replaced until you confirm.

## Installable and offline

Kongbu is a **Progressive Web App**: on Android and desktop Chrome, use **Install app**; on iPhone, Safari's **Share → Add to Home Screen**. It then opens full screen with its own icon.

A **service worker** (`vite-plugin-pwa`) saves every built file the first time the app opens, including each chapter, so after one visit every page opens offline. The update notice appears when a new version has been downloaded. The new version loads only when you tap Reload, so a deploy never interrupts a quiz. Browser tests turn the service worker off (`serviceWorkers: 'block'` in `playwright.config.ts`) except in `installable-offline.spec.ts`, because it would answer requests that tests block on purpose.

The icons in `public/` are drawn by `swift scripts/make-icons.swift` (macOS, with the system Korean font). Run it again only if the icon design changes.

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
