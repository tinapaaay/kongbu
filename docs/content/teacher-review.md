# Teacher review of practice questions

Every question starts as `draft`. An AI-assisted review can raise it to `ai-reviewed`. Only a Korean teacher or a qualified EPS-TOPIK tutor can raise it to `approved` ([issue #11](https://github.com/tinapaaay/kongbu/issues/11)). This page explains how to hand a teacher a chapter and how to record what they decide.

## 1. Export a review sheet

```bash
npm run export:review -- 11
```

```bash
npm run export:review -- --all
```

The first command exports one chapter (use any chapter number that has questions). The second exports every chapter that has questions. Each chapter gets two files in `exports/`:

- `chapter-11-review-sheet.html`: open it in a browser and print it, or save it as a PDF (A4). Each question is one block that never splits across pages. It shows the id, concept (Korean and English), format, difficulty, prompt, context, the four choices with the correct one marked "✓ Correct answer", the explanation, the current `reviewStatus`, and boxes for the teacher to tick.
- `chapter-11-review-sheet.csv`: the same questions, one row each, for Excel, Numbers or Google Sheets. The last columns (`korean_ok`, `one_answer`, `explanation_ok`, `level_ok`, `notes`, `approve`) are empty for the teacher.

`exports/` is in `.gitignore`. The sheets are copies of `src/content/`, so never commit them; export again after any question changes. They contain only Kongbu's own questions, never textbook pages or audio.

Choice letters a–d are data ids, not the ①–④ the learner sees: the app shuffles choices. Tell the teacher this if they refer to an answer by number.

## 2. What the teacher checks

For each question:

1. **Korean natural and correct?** Spelling, spacing and particles are right, and a Korean speaker would really say it.
2. **One answer only?** Exactly one choice is right. The wrong choices are believable for a learner but clearly wrong. Grammar questions use learner mistakes as wrong choices on purpose; those should stay wrong.
3. **Explanation clear?** The English explanation is accurate and easy to follow.
4. **Level fits?** It uses only what EPS-TOPIK Book 1 has taught by that chapter.
5. **Original?** It is not a copy of a textbook or real exam question the teacher recognizes.

Then they choose: approve as written, approve after a fix in their notes, or do not approve.

## 3. Record the result

1. **Fix first.** Apply the teacher's corrections in `src/content/chapter-NN/questions.ts`. Keep the question id and choice ids the same.
2. **Approve only what was signed off.** Set `reviewStatus: 'approved'` only on questions the teacher approved in their final wording. If you changed a question after the teacher saw it, show them the new wording before approving it. Leave everything else `ai-reviewed` (or `draft` if it changed and nobody has checked it yet).
3. **Write it down** in `docs/content/chapter-NN-review.md`, in a new "Teacher review" section:
   - Reviewer: name and qualification (for example "Korean teacher, 5 years of EPS-TOPIK classes").
   - Date of the review.
   - For each question: approved, approved after a fix (say what changed), or not approved with the reason.
4. **Keep the signed sheet** (paper or PDF) outside Git, like the textbook files.
5. Run `npm run verify`, then update the chapter's line under "Known limits" in the README.

A question is done when it is either `approved` or has a written reason in its review file why it isn't.
