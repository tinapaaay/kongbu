# Adding a chapter

Chapters are found by folder. To add Chapter 7, create `src/content/chapter-07/` with these four files, copying the shape of an existing chapter. Nothing else in the app needs to change: the chapter becomes "available," gets its own on-demand download, and joins the tests and the offline cache automatically.

| File | What it holds |
| --- | --- |
| `concepts.ts` | `export const concepts: Concept[]`: what the chapter teaches, each with a stable ID |
| `lesson.ts` | vocabulary, grammar, and culture, written in our own words (Korean word lists may follow the book, cited by page) |
| `questions.ts` | original questions built with `questionMaker('ch7')` and `PROMPTS` from `../questionBuilder` |
| `index.ts` | `export const chapterContent = { lesson, questions }` |

Use two digits in the folder name (`chapter-07`) so folders sort in chapter order. Then:

1. Write `docs/content/chapter-07-review.md` after the review, and add a line to the README.
2. Run `npm run verify`. It fails if a concept has fewer than two questions, a chapter has fewer than 20, or the chapter ended up in the main app file.

## Concept IDs are permanent

Every saved answer records its concept ID, so an ID that has shipped can never be renamed or removed: learners' mistakes and mastery would lose their link. Concept IDs are shared across all 60 chapters, and the tests reject duplicates.

- **Name an ID after this chapter's own topic,** not a general word another chapter will want. Chapter 19 (요리, Cooking) can't use `vocabulary.cooking`, because Chapter 11 took it for kitchen chores, so it uses something like `vocabulary.recipes` or `vocabulary.cooking-methods`.
- **Name grammar after its form and meaning** when a form has more than one use: `grammar.a-eoseo-reason` (because), leaving room for a later `grammar.a-eoseo-sequence` (and then).
- **Use lowercase romanization with hyphens**, starting with the kind: `grammar.`, `vocabulary.`, or `culture.`.
- **Once shipped, never change it.** Change the `label` or `labelEn` (what learners see) instead.
