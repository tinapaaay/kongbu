import type { Concept } from '../schemas'

/** The things a learner can get right or wrong in Chapter 11. Each question blames exactly one. */
export const chapter11Concepts: Concept[] = [
  {
    id: 'vocabulary.waste-disposal',
    kind: 'vocabulary',
    label: '쓰레기 분리배출 어휘',
    labelEn: 'Waste separation words',
    chapterId: 'ch11',
    textbookRef: { volume: 1, page: 151 },
    prerequisiteIds: [],
  },
  {
    id: 'grammar.a-eo-ya-doeda',
    kind: 'grammar',
    label: '-아야/어야 되다',
    labelEn: 'Must, have to',
    chapterId: 'ch11',
    textbookRef: { volume: 1, page: 152 },
    prerequisiteIds: [],
  },
  {
    id: 'vocabulary.household-chores',
    kind: 'vocabulary',
    label: '집안일 어휘',
    labelEn: 'Household chore words',
    chapterId: 'ch11',
    textbookRef: { volume: 1, page: 154 },
    prerequisiteIds: [],
  },
  {
    id: 'grammar.eul-geyo',
    kind: 'grammar',
    label: '-(으)ㄹ게요',
    labelEn: "I'll (promise or offer)",
    chapterId: 'ch11',
    textbookRef: { volume: 1, page: 155 },
    prerequisiteIds: [],
  },
  {
    id: 'grammar.s-irregular',
    kind: 'grammar',
    label: "'ㅅ' 불규칙",
    labelEn: 'ㅅ irregular verbs',
    chapterId: 'ch11',
    textbookRef: { volume: 1, page: 155 },
    prerequisiteIds: ['grammar.eul-geyo'],
  },
  {
    id: 'culture.waste-separation',
    kind: 'culture',
    label: '한국의 쓰레기 분리배출',
    labelEn: 'Waste separation in Korea',
    chapterId: 'ch11',
    textbookRef: { volume: 1, page: 157 },
    prerequisiteIds: ['vocabulary.waste-disposal'],
  },
]
