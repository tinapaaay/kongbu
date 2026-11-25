# Chapter 15 question review

- Reviewed: 24 November 2026
- Reviewer: Claude (AI-assisted review), not a human Korean teacher.
- Reference: NEW EPS-TOPIK Standard Korean Textbook, Book 1, printed pages 190–199. The PDF stays private and outside Git.
- Outcome: all 27 questions marked `ai-reviewed`.

## Review method and limits

Read the whole chapter: vocabulary (pp.191, 194), grammar (pp.192, 195), conversations (pp.193, 196), culture (p.197), and the reading and listening checks with their scripts (pp.198–199). Checked every prompt, context, choice, key, and explanation for correct Korean, a single defensible answer, and Korean a learner who has finished Chapters 1–14 can read.

**Level limit.** Contexts use this chapter's words and grammar plus what earlier chapters teach (-아서/어서, -아/어야 되다, -(으)세요, -(으)ㄹ게요, -(으)ㄹ 거예요). During review, four contexts were simplified: an unknown word (얼룩), 동료, -아/어도 되다, and 말고 were taken out. On 25 November, q024 was changed from -고 싶어요 to -(으)ㄹ 거예요, because -고 싶다 is taught in Chapter 16. 저고리 and 명절 appear only in the culture note, so the hanbok questions are rated harder.

**Originality.** Compared each question with the book's exercises and test items, then avoided their compositions:
- No correct-sentence item mixing 맛있은 / 예쁜 / 덥은 / 짧는 (p.198). The -(으)ㄴ questions are single blanks with other words (따뜻한, 어두운, 재미있는, 긴, 큰).
- No "hot weather, so I wore short trousers" or "younger sibling is short and wearing a cap" blanks (p.198).
- No hanbok passage whose answer is that everyday hanbok is comfortable (p.198).
- No "green sneakers", "is the cap red?", "are the shoes small?", or "do you like yellow?" items (p.199 listening).
- The practice pair "까만색 잠바 / 어둡다" (p.196) is not reused. q018 uses gray trousers. The lesson example "할머니께서 안경을 쓰고 계세요" (p.192) is not reused. q012 uses a grandfather and a cap.
- The book's character names are not used.

This review does not certify originality against every published textbook or exam.

`ai-reviewed` shows in the quiz as "Reviewed by AI · not teacher-checked." `approved` stays reserved for a human teacher's review.

## Concept choices

- Wearing verbs (`vocabulary.wearing-verbs`) are separate from the clothing nouns. Choosing 입다, 신다, or 쓰다 is a different mistake from not knowing what 장화 is.
- `grammar.go-itda-state` names the "is wearing" use, which leaves room for `grammar.go-itda-progressive` (in the middle of doing) when a later chapter teaches it.
- `grammar.eun-adjective` covers adjectives only, which leaves room for the verb forms (-는, -(으)ㄴ past) taught later.

## Points worth a teacher's check

- q012: 쓰고 있어요 with 할아버지께서 is not ungrammatical in casual speech, but it doesn't match the honorific subject. The key follows the chapter's -고 계시다 rule.
- q013: 입어 있어요 is a common learner error and is wrong here. Native speakers use -어 있다 with verbs like 앉다 and 서다, not with clothing verbs.
- q019: the green walking signal reflects Korean traffic lights (초록불). Some people call it 파란불, but 파란색 is not among the choices.

## Validation

`npm test` checks four different choices, valid concept IDs and keys, at least two questions per concept, and explanations that never mention option numbers. These checks protect the data. They cannot prove the Korean is correct.
