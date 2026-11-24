# Chapter 1 question review

- Reviewed: 24 November 2026
- Reviewer: Claude (AI-assisted review), not a human Korean teacher.
- Reference: NEW EPS-TOPIK Standard Korean Textbook, Book 1, printed pages 50–59. The PDF stays private and outside Git.
- Outcome: all 24 questions marked `ai-reviewed`.

## Review method and limits

Read the whole chapter: vocabulary (pp.51, 54), grammar (pp.52, 55), conversations (pp.53, 56), culture (p.57), and the reading and listening checks with their scripts (pp.58–59). Checked every prompt, context, choice, key, and explanation for correct Korean, a single defensible answer, and Korean a Chapter 1 learner can read.

**Level limit.** Chapter 1 teaches only 입니다/입니까? and 은/는, so contexts and choices use only those patterns and the chapter's words. Instructions are standard test wording, and the two culture questions (q023, q024) need a little more Korean, so they are rated harder. Vocabulary questions q001, q015 and q016 give an English word in the prompt, because there are no pictures and the learner knows no Korean to describe a job with yet.

**Originality.** Compared each question with the book's exercises and test items, then avoided their compositions:
- No “which word goes with 나라” item and no form-field (직업 :, 국적 :) items, which are the p.58 reading items.
- No alien registration card passage (p.58) and no greeting-etiquette passage whose answer is the handshake rule (p.58).
- No “what are they talking about” items (p.59 listening).
- The book's character names are not used.

The basic yes/no exchange (“…입니까? / 네, …입니다. / 아니요, 저는 …입니다.”) is the chapter's target pattern, so q009, q010, q019 and q022 necessarily share its shape. Each uses different people, jobs and countries from the book. q021 uses the fixed phrases 처음 뵙겠습니다 and 잘 부탁드립니다, which the book teaches as a set expression. This review does not certify originality against every published textbook or exam.

`ai-reviewed` shows in the quiz as “Reviewed by AI · not teacher-checked.” `approved` stays reserved for a human teacher's review.

## Points worth a teacher's check

- q007: 어느 나라 사람입니다? said with a rising tone is sometimes heard in speech. In writing, and in this formal style, the question form is 입니까?, so one answer stands.
- q023: 안녕하세요? to a close friend is not wrong, so it was left out of the choices. 안녕? is the natural answer.

## Validation

`npm test` checks four different choices, valid concept IDs and keys, at least two questions per concept, and explanations that never mention option numbers. These checks protect the data. They cannot prove the Korean is correct.
