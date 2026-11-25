# Chapter 16 question review

- Reviewed: 25 November 2026
- Reviewer: Claude (AI-assisted review), not a human Korean teacher.
- Reference: NEW EPS-TOPIK Standard Korean Textbook, Book 1, printed pages 200–209. The PDF stays private and outside Git.
- Outcome: all 26 questions marked `ai-reviewed`.

## Review method and limits

Read the whole chapter: vocabulary (pp.201, 204), grammar (pp.202, 205), conversations (pp.203, 206), culture (p.207), and the reading and listening checks with their scripts (pp.208–209). Checked every prompt, context, choice, key, and explanation for correct Korean, a single defensible answer, and Korean a learner who has finished Chapters 1–15 can read.

**Level limit.** Contexts use this chapter's words and grammar plus earlier chapters' (-아서/어서, -(으)ㄹ 거예요, 못, -(으)ㄴ, -(으)세요). 졸업하다 was removed from q011 during review. -아/어 주다 appears once (q005, 소개해 줘요), as in the book's own conversation on p.203.

**Originality.** Compared each question with the book's exercises and test items, then avoided their compositions:
- No opposite-word items for 조용하다 or 넓다 (p.208). q015 asks for the opposite of 편리하다.
- No "the lease ends, so I must look for a home" blank, and no "near the metro with many facilities, so it's convenient" blank (p.208).
- No passage whose answer is that many Koreans live in apartments, and no 1-person-household items (p.208). q025 is a short dialogue, and q026 is about one person's officetel.
- No parking-construction, "is the dorm close?", "when will you move?", "rent is 500,000 won", or "come with me to the agent" items (p.209 listening).
- The book's -지만 sentences (rent expensive but good view, convenience store close but market far, Sunday but must work, room small but cheap, busy yesterday but free today) are not reused. q020 reverses the idea on purpose (small but expensive), and q022 uses rain.
- The book's character names are not used.

This review does not certify originality against every published textbook or exam.

`ai-reviewed` shows in the quiz as "Reviewed by AI · not teacher-checked." `approved` stays reserved for a human teacher's review.

## Related fix

Chapter 15's q024 used -고 싶어요 before Chapter 16 teaches it. It now uses -(으)ㄹ 거예요, and the Chapter 15 review notes the change.

## Points worth a teacher's check

- q013: 저는 … 먹고 싶어 해요 is marked wrong by the book's rule (-고 싶어 하다 is for third persons). Native speakers sometimes use it about themselves when reporting from outside, but not in a plain statement like this.
- q023: the key depends on whether both halves really contrast. A first draft had 월세가 싸지만 좋아요 as a distractor, which can be read as a real contrast in speech, so it was replaced during review with 방이 깨끗하지만 넓어요 (two good points, no contrast).

## Validation

`npm test` checks four different choices, valid concept IDs and keys, at least two questions per concept, and explanations that never mention option numbers. These checks protect the data. They cannot prove the Korean is correct.
