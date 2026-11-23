# Chapter 12 question review

- Reviewed: 23 November 2026
- Reviewer: Claude (AI-assisted review), not a human Korean teacher.
- Reference: NEW EPS-TOPIK Standard Korean Textbook, Book 1, printed pages 160–169. The PDF stays private and outside Git.
- Outcome: all 26 questions marked `ai-reviewed`; none removed. Ten were rewritten or edited (below). IDs are unchanged; three correct-choice keys changed with their rewrites (q017, q019, q020).

## Review method and limits

Read the whole chapter: vocabulary (pp.161, 164), grammar (pp.162, 165), conversations (pp.163, 166), culture (p.167), and the reading and listening checks with their scripts (pp.168–169). Checked every prompt, context, choice, key, and explanation for correct Korean, a single defensible answer, and vocabulary the chapter teaches.

Then compared each question with the book's exercises and test items. Shared target words and standard test instructions are unavoidable. Where a question copied a book item's *composition* (the same situation leading to the same answer), it was rewritten. This does not certify originality against every published textbook or exam.

`ai-reviewed` shows in the quiz as “Reviewed by AI · not teacher-checked.” `approved` stays reserved for a human teacher's review. Re-review any changed question and set it back to `draft` while that review is pending.

## Changes

| Question | Key | Reason | Change |
| --- | --- | --- | --- |
| ch12-q001 | b: 비행기 | Unnatural Korean | “하늘로 다니는” is not natural Korean. The question now asks what you board at an airport, so it also tests the place words. |
| ch12-q007 | b | Too close to the book | The passage started like the p.163 conversation (“회사 앞 버스 정류장에서”). It now starts at the dorm. |
| ch12-q017 | b: 지나요 (was 걸어가요) | Too close to the book | “Very close, so I walk every day” repeated the p.168 reading item. Now it tests 지나다: a bus passing Seoul Station. |
| ch12-q018 | a: 막혀요 | Grammar not taught yet | Dropped the relative clause “출근하는 사람”. It now says 8 a.m. is the start of the work day. |
| ch12-q019 | a: 쯤 (was 걸려요) | Two right answers | “얼마나 멀어요?” (how far?) and “얼마나 가까워요?” are also correct Korean, so the old blank had more than one answer. The blank now tests 쯤. |
| ch12-q020 | c (was d) | Too close to the book | The “close dorm, short walk, never late” passage matched p.166 and the p.168 reading item. It is now about rush hour and taking the metro. |
| ch12-q021 | c: 바빠서 | Too close to the book | The 피곤하어서 and 좋아서 choices mirrored the p.168 item and the p.169 listening answer. They are now 운동하어서 (wrong) and 바빠서 (correct, ㅡ drops), and 싸어서 replaces 고프어서. |
| ch12-q023 | c: KTX 표가 비싸서 | Too close to the book | “왜 늦었어요?” answered with a traffic jam is the p.169 listening item. Now: why take the express bus instead of the KTX? |
| ch12-q025 | b | Too close to the book | “KTX costs more but is fast” matched the p.168 reading item. The passage is now about rush hour, the metro, and night taxis in Seoul. |
| ch12-q026 | a: 택시는 앱으로도 불러요 | Too close to the book | The correct answer (buy tickets online or by app) matched the p.168 item's answer. The answer is now calling a taxi with an app. |

The other 16 (q002–q006, q008–q016, q022, q024) were checked and passed unchanged.

## Validation

`npm test` checks four different choices, valid concept IDs and keys, and explanations that never mention option numbers. These checks protect the data. They cannot prove the Korean is correct, which is why a teacher check (`approved`) stays open.
