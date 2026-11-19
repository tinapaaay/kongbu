# Hangul Lab: Phase 0 Plan

**Status:** Decisions, design system, and wireframes are done. Final approval to start Phase 1 is pending.
**Date:** 2026-11-19
**Source of truth:** Hangul Lab PRD v1.0
**Scope of this document:** architecture, folder structure, data models, user flows, and checklist. No application code has been written.

---

## 1. The big picture

Phase 1 is a **single-page application (SPA)**: one website that runs entirely in your browser. There is no server, database, login, or AI yet.

```text
┌──────────────────────────────────────────────────────────┐
│ YOUR BROWSER                                             │
│                                                          │
│  UI layer            screens and components (React)      │
│     │  shows data, sends user actions                    │
│     ▼                                                    │
│  Domain layer        pure rules in TypeScript            │
│     │                scoring, mistakes, chapter status   │
│     ├───────────────────────┐                            │
│     ▼                       ▼                            │
│  Content             Learner data                        │
│  read-only           changes as you study                │
│  chapters,           attempts, sessions, visits          │
│  questions                  │                            │
│  (bundled in app)           ▼                            │
│                      Repository ──► localStorage         │
│                                     (Supabase in Phase 2)│
└──────────────────────────────────────────────────────────┘
```

**Concept: separation of concerns.** Each layer has one job. Scoring code knows nothing about buttons, and buttons know nothing about how data is saved. You can then change or test one part without breaking the others.

### Technology choices

| Tool | What it does | Why it fits |
|---|---|---|
| **React** | Builds the interface from reusable components | Required by the PRD. A quiz has lots of changing state, which React handles well. |
| **TypeScript** | Adds types to JavaScript | Catches mistakes before the app runs, such as a question missing its answer. |
| **Vite** | Runs the dev server and builds the site | Fast, with little setup. |
| **React Router** | Gives each screen its own URL | Refresh, the back button, and bookmarks all work. |
| **CSS Modules + CSS variables** | Styles scoped to one component, using shared design tokens | Plain CSS, which is good for learning. Matches the PRD's "CSS with reusable design tokens". |
| **Zod** | Checks data while the app runs | TypeScript disappears when the app runs, so it cannot check saved data. Zod can, and will later check flashcard imports and AI-generated questions too. |
| **Vitest + Testing Library** | Tests logic and components | Fits naturally with Vite. |
| **Playwright** | Drives a real browser through the app | Proves the full study workflow on desktop and mobile sizes. |

**Deliberately not used in Phase 1:** Redux, Tailwind, a component library, Supabase, authentication, and OpenAI. Each would add something to learn or maintain without helping the first workflow.

---

## 2. Key decision record

# ADR-001: Store learner history as a local attempt log, behind a repository

**Status:** Proposed
**Deciders:** Product owner

### Context

Phase 1 must remember progress without a database, while Phase 2 will add one. Mistakes, weak concepts, chapter status, and analytics all depend on the same study history. If those values drift apart, the app could show false progress, which the PRD explicitly forbids.

### Decision

Save each submitted answer as a permanent **attempt** record. Calculate mistakes, scores, and chapter status from those records whenever they are needed. All saving and loading goes through one **repository**, a small module with a fixed list of operations.

### Options considered

#### Option A: Attempt log plus derived values (recommended)

| Dimension | Assessment |
|---|---|
| Complexity | Medium at first, then simpler as features are added |
| Cost | Free |
| Scalability | Comfortable for one learner, and moves cleanly to a database table |
| Learning value | High: teaches derived state and a single source of truth |

**Pros:** one source of truth, no counters to fall out of sync, and better rules can be applied to old history later.
**Cons:** calculations run on read, though this is trivial at this size.

#### Option B: Save mistakes, scores, and progress separately

| Dimension | Assessment |
|---|---|
| Complexity | Low at first, then grows with every feature |
| Cost | Free |
| Scalability | Poor: every new rule must update several saved values |
| Learning value | Medium |

**Pros:** easy to read saved values directly.
**Cons:** values can disagree after a bug or interrupted save, and old data cannot easily be reinterpreted.

#### Option C: Start with Supabase now

| Dimension | Assessment |
|---|---|
| Complexity | High |
| Cost | Free tier likely, plus account and setup work |
| Scalability | Best long term |
| Learning value | High, but too much at once |

**Pros:** sync across devices from day one.
**Cons:** directly conflicts with the PRD's instruction to verify the local MVP first.

### Trade-off analysis

Option A costs a little more thought now and avoids the bugs most damaging to a learning app: wrong progress and lost mistake history. Option C solves a real problem, device sync, but at the wrong time.

### Consequences

- **Easier:** mistake review, Smart Review, analytics, and the move to Supabase.
- **Harder:** you must learn to think of screens as views calculated from history.
- **Limitation:** Phase 1 data stays in one browser on one device. See section 8.
- **Revisit:** in Phase 2, when the repository gets a Supabase version.

### Action items

1. [ ] Define the data types and Zod schemas.
2. [ ] Build the localStorage repository with a schema version.
3. [ ] Write tests for submission, reload, and corrupted data.

### Other decisions, in brief

| Decision | Why | Concept to look up |
|---|---|---|
| Keep content separate from learner data | Questions are the same for everyone. Your answers are personal and change. | Static vs dynamic data |
| Store the correct answer by **choice ID**, not position | Choices can be shuffled without breaking scoring. | Stable identifiers |
| Never write "③ is correct" in an explanation | Shuffling would make that number wrong. Explanations refer to the Korean text. | Data integrity |
| Copy the correct answer into each attempt | Your history stays accurate if a question is edited later. | Snapshot |
| Give each question one main concept | When you miss it, the app knows what to blame. Extra tags remain available for filtering. | Data modeling |
| Use `useReducer` for the quiz | A quiz moves through clear states and actions, so its rules stay in one testable place. | State machine, reducer |
| Make the repository asynchronous now | localStorage is instant but Supabase is not. Screens will not need rewriting in Phase 2. | Promise, async/await |
| Load learner data once at app start | Only one loading state is needed, and screens read from shared React context. | React context |
| Keep future API keys on a server, never in `VITE_` variables | Vite deliberately places `VITE_` values into browser code, where anyone can read them. | Environment variables |

---

## 3. Folder structure

```text
hangul-lab/
├── DESIGN.md                 Visual rules and design tokens
├── README.md                 Setup, testing, requirement status
├── docs/
│   └── decisions/            Architecture decision records
├── reference/                Your textbook PDF, never committed to Git
├── public/                   Static files such as the favicon
├── tests/
│   └── e2e/                  Full browser workflow tests
└── src/
    ├── main.tsx              Starts React
    ├── app/                  App shell, routes, navigation
    │
    ├── content/              READ-ONLY study material
    │   ├── chapters.ts       All 30 chapter entries
    │   ├── chapter-11/
    │   │   ├── lesson.ts     Objectives, vocabulary, grammar, examples
    │   │   ├── concepts.ts
    │   │   └── questions.ts
    │   ├── schemas.ts        Rules every content item must pass
    │   └── index.ts          The only entry point for reading content
    │
    ├── domain/               PURE RULES, no React and no storage
    │   ├── types.ts
    │   ├── quiz/             Build session, reducer, scoring
    │   └── progress/         Chapter status, mistakes, weak concepts
    │
    ├── data/                 SAVING AND LOADING
    │   ├── LearnerRepository.ts       The operations the app may use
    │   ├── localStorageRepository.ts  The Phase 1 implementation
    │   ├── schemas.ts                 Checks saved data
    │   ├── migrations.ts              Upgrades older saved formats
    │   └── LearnerDataProvider.tsx    Shares data with screens
    │
    ├── features/             SCREENS, grouped by what the user does
    │   ├── dashboard/
    │   ├── chapters/
    │   ├── quiz/
    │   ├── results/
    │   └── mistakes/
    │
    ├── components/           Shared UI: Button, Card, StatusBadge, KoreanText
    └── styles/
        ├── tokens.css        CSS variables copied from DESIGN.md
        └── global.css
```

**The dependency rule:** `features` may use `domain`, `data`, `content`, and `components`. `domain` never imports React or storage. This keeps the most important logic easy to test.

---

## 4. Screens and components

### Routes

| URL | Screen |
|---|---|
| `/` | Dashboard |
| `/learn` | Chapter Library |
| `/learn/11` | Chapter 11 |
| `/quiz/:sessionId` | Quiz Player |
| `/quiz/:sessionId/results` | Results |
| `/practice/mistakes` | Mistake Review |
| `/settings` | Backup and restore |

### Component hierarchy

```text
App
└── LearnerDataProvider
    └── AppLayout (navigation + page area)
        ├── DashboardPage
        │   ├── NextStepCard
        │   ├── ChapterProgressSummary
        │   ├── WeakConceptsList
        │   ├── RecentlyStudiedList
        │   └── WeeklyActivity
        ├── ChapterLibraryPage
        │   └── ChapterList → ChapterRow + StatusBadge
        ├── ChapterPage
        │   ├── ObjectivesSection
        │   ├── VocabularySection
        │   ├── GrammarSection
        │   └── StartPracticeCard
        ├── QuizPage
        │   ├── QuizHeader + QuizProgress
        │   ├── QuestionCard
        │   │   ├── QuestionContext (passage or dialogue)
        │   │   └── ChoiceList → ChoiceButton ①②③④
        │   ├── QuizNavigation
        │   └── SubmitDialog
        ├── ResultsPage
        │   ├── ScoreSummary
        │   ├── ConceptBreakdown
        │   └── AnswerReviewList → AnswerReviewItem
        ├── MistakesPage
        │   ├── MistakeFilters (chapter, concept, date)
        │   └── MistakeList → MistakeItem
        └── SettingsPage
            └── BackupPanel (download, restore)
```

**Phase 1 navigation:** Dashboard, Learn, Practice, and Settings. Mock Exams, Flashcards, AI Tutor, and Progress appear only when they work, because the PRD says features must not be merely decorative.

---

## 5. Data models

These are proposed shapes, shown so you can review them. They use the PRD entities and leave out later-phase tables until they are needed.

### Content (read-only)

```ts
type ChapterId = `ch${number}`;            // "ch11"
type ChoiceId = "a" | "b" | "c" | "d";     // identity, not display order

interface Chapter {
  id: ChapterId;
  number: number;
  titleKo: string;
  titleEn: string;
  objectives: string[];
  contentStatus: "planned" | "available";
  textbookRef: { volume: 1 | 2; chapter: number; startPage: number };
  verification: "unverified" | "verified";
}

interface Concept {
  id: string;                              // "grammar.place-eseo"
  kind: "grammar" | "vocabulary";
  label: string;                           // "에서 (place of action)"
  chapterId: ChapterId;
  explanation: string;
  prerequisiteIds: string[];
}

interface Question {
  id: string;                              // "ch11-q001"
  chapterId: ChapterId;
  conceptId: string;
  tags: string[];
  format:
    | "vocabulary"
    | "sentence-completion"
    | "grammar"
    | "dialogue-completion"
    | "reading";
  difficulty: 1 | 2 | 3;
  prompt: string;
  context?: { kind: "passage" | "dialogue"; text: string };
  choices: [Choice, Choice, Choice, Choice]; // exactly four
  correctChoiceId: ChoiceId;
  explanation: string;
  source: "original";
  reviewStatus: "draft" | "approved";
}

interface Choice { id: ChoiceId; text: string }
```

Picture and listening formats wait until there are licensed or self-created images and real audio.

### Learner data (saved)

```ts
interface LearnerData {
  schemaVersion: 1;
  chapterVisits: Partial<Record<ChapterId, { firstAt: string; lastAt: string }>>;
  activeSession: ActiveSession | null;
  sessions: CompletedSession[];
  attempts: Attempt[];
}

interface ActiveSession {
  id: string;
  type: "chapter-practice";
  chapterId: ChapterId;
  startedAt: string;
  questionIds: string[];
  choiceOrder: Record<string, ChoiceId[]>;
  answers: Record<string, ChoiceId>;
  durationsMs: Record<string, number>;
  currentIndex: number;
}

interface CompletedSession {
  id: string;
  type: "chapter-practice";
  chapterId: ChapterId;
  startedAt: string;
  submittedAt: string;
  questionIds: string[];
  choiceOrder: Record<string, ChoiceId[]>;
  correctCount: number;
  totalCount: number;
}

interface Attempt {
  id: string;
  sessionId: string;
  questionId: string;
  selectedChoiceId: ChoiceId | null;       // null means unanswered
  correctChoiceId: ChoiceId;
  isCorrect: boolean;
  chapterId: ChapterId;
  conceptId: string;
  answeredAt: string;
  durationMs?: number;
}
```

### Repository operations

```ts
interface LearnerRepository {
  load(): Promise<LearnerData>;
  recordChapterVisit(chapterId: ChapterId): Promise<void>;
  saveActiveSession(session: ActiveSession): Promise<void>;
  submitSession(session: CompletedSession, attempts: Attempt[]): Promise<void>;
  exportBackup(): Promise<string>;
  restoreBackup(json: string): Promise<void>; // validates first, replaces only if valid
}
```

`submitSession` saves everything in one write and ignores a session ID it has already saved. A double-click or refresh therefore cannot record the quiz twice. This property is called **idempotency**.

### Calculated values (never saved)

| Value | Rule |
|---|---|
| **Not started** | No visit and no submitted session |
| **Visited** | The chapter page has been opened |
| **Practiced** | At least one quiz has been submitted for the chapter |
| **Mastered** | Latest chapter quiz has at least 10 questions, scores at least 80%, and every missed concept has since been answered correctly |
| **Open mistake** | A concept's most recent attempt was wrong |
| **Weak concept** | Has open mistakes, ranked by wrong count, then recency. Always shown with a sample size, such as "1 of 4 correct" |

---

## 6. User flows

### Flow A: First visit

```text
Open app → no saved data → Dashboard shows 0 progress
→ "Start Chapter 11" → Chapter 11 page → page visit is recorded
```

Chapter 11 is your starting point, but a new user must not see "Continue" or any invented progress.

### Flow B: The core workflow

```text
Dashboard
  → Chapter 11
  → Start practice exam
  → Session is created from Chapter 11 questions only
  → Answer 10 questions (progress autosaves, answers stay hidden)
  → Submit → confirm, with a warning for unanswered questions
  → Attempts are scored and saved
  → Results: score, concept breakdown, explanations
  → Review mistakes
  → Mistake Review, filterable by chapter, concept, or date
```

### Flow C: Interrupted quiz

```text
Refresh or leave mid-quiz → saved session remains
→ Return → same questions, same choice order, same answers, same position
```

Unfinished quizzes do not count toward scores or mistakes.

### Flow D: Coming back later

```text
Open Dashboard
├── Unfinished quiz exists → "Resume quiz"
├── Open mistakes exist    → "Review weak concepts"
└── Otherwise              → next useful Chapter 11 action
```

### Flow E: Retaking a quiz

Question selection puts questions with open mistakes first, then the least recently seen. This meets the PRD requirement that missed concepts reappear, without building all of Smart Review early.

### States every screen must handle

| Situation | Behavior |
|---|---|
| No history | Honest empty state with one next action |
| Chapter has no content yet | Shows "Content coming later" with no quiz button |
| Fewer than 10 available questions | Blocks the quiz and states why |
| Question has not had human review | Shows a visible "Draft question" label |
| Backup file is invalid | Rejects it and leaves current progress untouched |
| Invalid session URL | Friendly message and a link to the dashboard |
| Saved data is corrupted | Keeps a raw backup, explains the problem, and never silently erases it |
| Browser storage is full or blocked | Shows a clear warning that progress may not be saved |

---

## 7. Development checklist

### Phase 0: Design and planning

- [x] Review the PRD
- [x] Propose architecture, folders, data models, flows, and checklist
- [x] Record your decisions (section 9)
- [x] Confirm chapter lists and Chapter 11 source pages from the textbooks
- [x] Agree on the visual direction (Field Guide, light theme) and write `DESIGN.md`
- [x] Lint `DESIGN.md`: 0 errors, 0 warnings
- [x] Create wireframes for the seven Phase 1 screens (`wireframes.html`)
- [ ] Final approval to begin Phase 1

### Phase 1: Functional MVP

Each milestone ends with something you can run and understand.

| # | Milestone | Done when | You learn |
|---|---|---|---|
| 1 | Project setup | App runs, tests run, first commit is on a private GitHub repo | npm, Vite, Git, GitHub |
| 2 | App shell and tokens | Navigation and routes work on phone and desktop | Components, routing, CSS variables |
| 3 | Content foundation | 60 chapter entries and Chapter 11 pass validation | Types, schemas |
| 4 | Scoring and quiz rules | Unit tests pass with no UI | Pure functions, unit tests |
| 5 | Local persistence and backup | Data survives reload, bad data is handled, backup can be downloaded and restored in Chrome and Safari | localStorage, async code, files in the browser |
| 6 | Dashboard → Chapter 11 | Honest fresh state, chapter visit recorded | Props, context, derived state |
| 7 | Quiz Player | Ten questions, keyboard use, resume after refresh | Reducers, forms, accessibility |
| 8 | Results | Accurate score and matching explanations | Rendering lists, data joins |
| 9 | Mistake Review | Mistakes appear and filter correctly | Filtering, URL state |
| 10 | Final verification | All checks below pass, README is complete | End-to-end testing |

### Phase 1 acceptance checks

| PRD check | How it will be verified |
|---|---|
| Fresh user has no false progress | Component + browser test with empty storage |
| Exactly four valid options | Content validation test on every question |
| Answers hidden until submission | Component test, with answer data kept out of the quiz view |
| Accurate scores | Unit tests for all-right, all-wrong, mixed, unanswered |
| Explanations match answer key | Validation plus manual review of each question |
| Wrong answers reach the tracker | Browser test of the full flow |
| Progress survives refresh | Browser test, mid-quiz and after submission |
| Chapter filters work | Unit test on session creation |
| Mobile and desktop work | Playwright at both sizes, plus a manual check |
| Works without AI | Browser test with network access blocked after loading |
| Flashcard import safety | **Pending, Phase 3** |
| No AI secrets in client code | No AI code exists yet. Build scan added now, full check in Phase 4 |

### Later phases

- [ ] **Phase 2:** Supabase, import/export, question management, multi-device history
- [ ] **Phase 3:** flashcards, spaced repetition, Smart Review, Targeted Review
- [ ] **Phase 4:** secure backend and AI tutor
- [ ] **Phase 5:** listening, audio, richer analytics

### Planned local commands

Your Mac already has Node 22, npm 10, and Git 2.54, so no extra setup is needed for these. They will work once Milestone 1 exists.

```bash
npm install
```

```bash
npm run dev
```

```bash
npm test
```

```bash
npm run test:e2e
```

---

## 8. Risks and limits

| Risk | Impact | Plan |
|---|---|---|
| **localStorage belongs to one browser on one device** | Study at home will not appear on your phone or school computer until Phase 2 | Accept for Phase 1, or use one main device |
| **Chrome and Safari keep separate data, and Safari may remove site data after about 7 days without a visit** | Progress can be split or lost | Phase 1 includes backup download and restore. Restoring replaces that browser's data, so it moves progress but does not merge it |
| **Answer keys are in the browser code** | A determined person could find answers in developer tools | Acceptable for personal study. Answers stay hidden in the interface. Real exam security would need a server |
| **Korean content may contain errors** | You could memorize something wrong | Human review is postponed, so Phase 1 questions are checked against the textbook by me and display a "Draft question" label until reviewed |
| **Ten questions become memorized** | Retake scores stop meaning much | Write about 20 for Chapter 11, and each quiz uses 10 |
| **Textbook copyright** | Public repository or site could expose protected material | Keep the PDF out of Git, write original content, and store only source references |

---

## 9. Decisions and textbook findings

| Topic | Decision |
|---|---|
| When answers appear | After submitting the whole quiz. Immediate feedback comes later |
| Textbooks | Book 1 and Book 2 are the curriculum references. They stay outside the project and out of Git |
| Chapter library | 60 entries: Book 1 chapters 1–30 and Book 2 chapters 31–60. Only Chapter 11 has content at first |
| Question review | Postponed. Questions show a "Draft question" label until reviewed |
| Code hosting | Private GitHub repository, created in Milestone 1 |
| Browsers | Chrome and Safari, so backup and restore are in Phase 1 |

### Chapter 11 source map (Book 1, pages 150–159)

| Item | Source page | Use in Phase 1 |
|---|---|---|
| Objectives: asking and answering about waste disposal, talking about chores | 150 | Summarized as chapter objectives |
| Vocabulary: waste separation and disposal | 151 | Concept group |
| Grammar: -아야/어야 되다 | 152 | Concept, with original examples |
| Vocabulary: household chores | 154 | Concept group |
| Grammar: -(으)ㄹ게요 | 155 | Concept, with original examples |
| Note: ㅅ irregular verbs such as 짓다 | 155 | Concept |
| Culture: waste separation in Korea | 157 | Original short summary, used for reading questions |
| Book's reading and listening questions | 158–159 | **Not copied.** Used only to understand question formats |

The book's question formats confirm the plan: vocabulary, sentence accuracy, fill-in-the-blank, and reading can be built now. Picture questions need our own images, and listening waits for Phase 5.

The audio folder beside the PDFs has 332 files. It stays private and out of Git, and will be reviewed when listening work begins.

---

## 10. What happens next

1. Review `wireframes.html` and request changes.
2. Wait for your go-ahead, then start **Milestone 1** only. Its README will link to `DESIGN.md` and include the lint command.
