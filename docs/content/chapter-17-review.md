# Chapter 17 question review

- Reviewed: 27 November 2026
- Reviewer: Claude (AI-assisted review), not a human Korean teacher.
- Reference: NEW EPS-TOPIK Standard Korean Textbook, Book 1, printed pages 210–219. The PDF stays private and outside Git.
- Outcome: all 26 questions marked `ai-reviewed`.

## Review method and limits

Read the whole chapter: vocabulary (pp.211, 214), grammar (pp.212, 215), conversations (pp.213, 216), culture (p.217), and the reading and listening checks with their scripts (pp.218–219). Checked every prompt, context, choice, key, and explanation for correct Korean, a single defensible answer, and Korean a learner who has finished Chapters 1–16 can read.

**Level limit.** Contexts use this chapter's words and grammar plus earlier chapters' (-아서/어서, -(으)ㄹ 거예요, 못, -고 싶다, -지만, -(으)세요). Place names from the culture note (경복궁, 불국사, 석굴암, 하회마을) appear only in the three culture questions, which are rated harder.

**Originality.** Compared each question with the book's exercises and test items, then avoided their compositions:
- No "packing" picture item, and no "which word goes with 호텔" item (p.218). q006 is an odd-one-out with 유적지.
- No correct-sentence item mixing 아름답을 / 넣아야 / 만들려고 / 열으야 (p.218). q022 tests whether -(으)려고 하다 fits at all (adjective, past time, spelling).
- No "cheap, good hotel, so I booked it today" blank (p.218, also the p.213 conversation).
- No passage comparing Seoul, Andong, and Gyeongju whose answer is palaces among modern buildings (p.218). q026 is one traveler's visit to Hahoe Village.
- No summer-holiday dates, Gyeongju museum, "how was Jeju?", "what will you ride?", or "what will you do this vacation?" items (p.219 listening).
- The book's example sentences (휴가 때 부산에, 시간이 있을 때 여행을, 제주도에 갈 때 비행기를, 음식을 만들 때 기분이, 책을 많이 읽으려고, 내년에 이사하려고, 불고기를 만들려고, 경주에 가려고) are not reused.
- The book's character names are not used.

This review does not certify originality against every published textbook or exam.

`ai-reviewed` shows in the quiz as "Reviewed by AI · not teacher-checked." `approved` stays reserved for a human teacher's review.

## Concept choices

- Places to stay (`vocabulary.lodging`) are separate from trip-planning verbs, because a 민박 versus 유스 호스텔 mix-up is a different gap from 출발하다 versus 도착하다.
- `grammar.euryeogo-hada` is named for the "intend to" construction. The bare connective -(으)려고 (in order to) may get its own concept when a later chapter teaches it.

## Points worth a teacher's check

- q011: 추석 때 is natural, and 추석에 is also correct. The distractors (주말 때, 오후 때, 월요일 때) follow the book's rule that these nouns don't take 때.
- q013: 올 때 can mean "when coming" (on the way). Because the answer is about life after arriving, the key is 왔을 때.
- q019 and q021: 볼려고 and 묵을려고 are marked wrong as spellings. They are common in casual speech and messages, and the lesson note says so.

## Validation

`npm test` checks four different choices, valid concept IDs and keys, at least two questions per concept, and explanations that never mention option numbers. These checks protect the data. They cannot prove the Korean is correct.
