# Hangul Lab

A personal Korean study workspace for EPS-TOPIK preparation, organized around the NEW EPS-TOPIK Standard Korean Textbook (Books 1 and 2).

Practice questions are original EPS-TOPIK-style questions, not real exam questions. Textbook PDFs and audio are private study material and are never committed to this repository.

## Status

**Phase 1, Milestone 1 (project setup): complete.**

| Milestone | Status |
|---|---|
| 1. Project setup | Done |
| 2. App shell and tokens | Pending |
| 3. Content foundation | Pending |
| 4. Scoring and quiz rules | Pending |
| 5. Local persistence and backup | Pending |
| 6. Dashboard → Chapter 11 | Pending |
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
  main.tsx        Starts React and loads global styles
  App.tsx         Current screen (replaced by the app shell in Milestone 2)
  styles/         tokens.css (generated) and global.css
  test/           Shared test setup
docs/             Plan, decisions, and design references
```

More folders (`content/`, `domain/`, `data/`, `features/`, `components/`) are added in later milestones, as described in the plan.
