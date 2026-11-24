# Chapter 14 question review

- Reviewed: 24 November 2026
- Reviewer: Claude (AI-assisted review), not a human Korean teacher.
- Reference: NEW EPS-TOPIK Standard Korean Textbook, Book 1, printed pages 180–189. The PDF stays private and outside Git.
- Outcome: all 26 questions marked `ai-reviewed`.

## Review method and limits

Read the whole chapter: vocabulary (pp.181, 184), grammar (pp.182, 185), conversations (pp.183, 186), culture (p.187), and the reading and listening checks with their scripts (pp.188–189). Checked every prompt, context, choice, key, and explanation for correct Korean, a single defensible answer, and Korean a learner who has finished Chapters 1–13 can read.

**Level limit.** Contexts use this chapter's words and grammar plus what earlier chapters teach (-아/어야 되다, -아서/어서, -(으)ㄹ게요, 걸리다, 쯤). The address questions (q025, q026) use place names that appear only in the culture note, so they are rated harder.

**Originality.** Compared each question with the book's exercises and test items, then avoided their compositions:
- No "which word goes with 아래" item (p.188), and no correct-sentence item built on particle mistakes before -(으)세요 (p.188). q021 tests the verb ending instead.
- No passage whose answer is the order of a Korean address or the building number coming last (p.188). The address questions ask about road widths, odd and even numbers, and finding the road name.
- No floor-directory, "car between buildings", or "pharmacy next to the hospital" items (p.189 listening).
- No "사무실(으로/로)", "어느 쪽(으로/로)", or "횡단보도를 건너가세요 to a shop across the road" items (pp.182, 185 exercises). q011 uses 휴게실 for the ㄹ rule.
- The phrase "지하철역에 어떻게 가요? / 사거리에서 오른쪽으로 가세요" (p.186) is not reused. q022 gives directions to a post office over a footbridge.
- The book's character names are not used.

The address in q026 (부산광역시 사하구 낙동대로 120) uses a real road name to show the format. The building number was chosen for the example and is not meant to point to a particular place. The road in q025 (한빛로) is made up.

This review does not certify originality against every published textbook or exam.

`ai-reviewed` shows in the quiz as "Reviewed by AI · not teacher-checked." `approved` stays reserved for a human teacher's review.

## Concept choices

- `grammar.euro-direction` is separate from Chapter 12's `grammar.euro-means`. It is the same particle, but learners get the two meanings wrong in different ways. q014 checks the difference.
- `grammar.eu-seyo-imperative` names the instruction use, which leaves room for the honorific present (-(으)세요 as "you do…") if a later chapter teaches it on its own.

## Points worth a teacher's check

- q017: choosing 내려오세요 over 내려가세요 depends on the speaker being on the 1st floor. The context line (1층 안내 데스크에서) states this. In casual speech, some speakers would accept 내려가세요 from the listener's point of view.
- q018: 같이 밖으로 나가요 is read as a suggestion ("let's go out"), which is natural in speech. No other choice fits going from inside to outside.
- q020 and q023: the ㄹ-drop (미세요) and ㄷ→ㄹ (걸으세요) forms are rated harder. The lesson notes cover both.

## Validation

`npm test` checks four different choices, valid concept IDs and keys, at least two questions per concept, and explanations that never mention option numbers. These checks protect the data. They cannot prove the Korean is correct.
