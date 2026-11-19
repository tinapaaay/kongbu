# Hangul Lab

A personal Korean study workspace for EPS-TOPIK preparation, organized around the NEW EPS-TOPIK Standard Korean Textbook (Books 1 and 2).

Practice questions are original EPS-TOPIK-style questions, not real exam questions. Textbook PDFs and audio are private study material and are never committed to this repository.

## Status

**Phase 1, Milestone 6 (Dashboard and Chapter 11): complete.**

| Milestone | Status |
|---|---|
| 1. Project setup | Done |
| 2. App shell and tokens | Done |
| 3. Content foundation | Done |
| 4. Scoring and quiz rules | Done |
| 5. Local persistence and backup | Done |
| 6. Dashboard → Chapter 11 | Done |
| 7. Quiz Player | Pending |
| 8. Results | Pending |
| 9. Mistake Review | Pending |
| 10. Final verification | Pending |

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
  components/     Shared UI pieces (PageHeader, SectionHeader, StatusBadge, buttons)
  content/        Chapters, lessons, concepts, questions, and their validation
  data/           Saving progress in the browser, backups, and the data provider
  domain/         Pure rules with no UI: learner data, quiz building, scoring, progress
  features/       One folder per screen (dashboard, chapters, quiz, ...)
  styles/         tokens.css (generated) and global.css
  test/           Shared test setup
docs/             Plan, decisions, and design references
```

## Study content

All study material lives in `src/content/`, and screens read it only through `src/content/index.ts`.

- `chapters.ts`: all 60 chapters from both books' contents pages.
- `chapter-11/`: the lesson (vocabulary, grammar, culture), 6 concepts, and 22 original practice questions.
- `schemas.ts`: the rules every chapter, concept, question, and lesson must follow.
- `validate.ts`: cross-checks, such as every question pointing to a real concept and every answer key matching a choice.

`npm test` fails if any content breaks a rule. Questions are original EPS-TOPIK-style practice, stay `draft` until a person reviews them, and must never mention ①–④ in explanations, because choices can be shuffled.

## Study rules

The rules in `src/domain/` are plain TypeScript functions with no screens or storage, so each one is tested on its own.

| Rule | File |
|---|---|
| A quiz has 10 questions from one chapter. Missed questions come first, then other questions on concepts with open mistakes, then unseen questions, then the ones seen longest ago | `quiz/buildSession.ts` |
| Each question's four choices get a saved shuffled order | `quiz/buildSession.ts` |
| The quiz screen gets questions without the answer key or explanation | `quiz/playableQuestion.ts` |
| Scoring compares answers with the stored key. Skipped questions count as wrong | `quiz/scoreSession.ts` |
| A mistake is fixed only when the same concept is answered correctly in a later quiz | `progress/mistakes.ts` |
| Mastered means the latest quiz had at least 10 questions, at least 80% correct, and no open mistakes | `progress/chapterProgress.ts` |
| Weekly activity counts questions per local day, Monday to Sunday | `progress/activity.ts` |
| The Dashboard's next step: unfinished quiz, then open mistakes, then the current chapter | `progress/nextStep.ts` |

## Saved progress

Progress is saved in the browser's localStorage under one key, `hangul-lab:learner-data`, as a single JSON value. Each change rewrites the whole value in one step, so it is never half-saved.

- **Reload safe:** chapter visits, unfinished quizzes, submitted quizzes, and answers survive refreshes.
- **Damaged data:** if saved data can't be read, a copy is kept under `hangul-lab:damaged-copy:<time>` and every page shows a warning. Nothing is silently deleted.
- **Newer data:** data saved by a newer app version is never overwritten.
- **Blocked or full storage:** the app keeps working for the current visit and shows a warning.
- **Backups:** Settings downloads a `hangul-lab-backup-YYYY-MM-DD.json` file and restores one. A restore file is fully checked and summarized, and nothing is replaced until you confirm.

Screens use progress only through `useLearnerData()`. Storage details stay in `src/data/`, so Phase 2 can switch to a database by adding a new `LearnerRepository`.

## Screens and URLs

| URL | Screen |
|---|---|
| `/` | Dashboard |
| `/learn` | Chapter Library |
| `/learn/11` | One chapter (1–60) |
| `/practice` | Redirects to `/practice/mistakes` |
| `/practice/mistakes` | Mistake Review |
| `/quiz/:sessionId` | Quiz (no main navigation) |
| `/quiz/:sessionId/results` | Results |
| `/settings` | Settings |

The Quiz, Results, and Mistakes screens still show short notes saying which milestone builds them.
