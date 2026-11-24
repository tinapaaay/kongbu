import type { Concept } from '../schemas'

/** The things a learner can get right or wrong in Chapter 1. Each question blames exactly one. */
export const concepts: Concept[] = [
  {
    id: 'vocabulary.countries',
    kind: 'vocabulary',
    label: '나라 이름',
    labelEn: 'Countries',
    chapterId: 'ch1',
    textbookRef: { volume: 1, page: 51 },
    prerequisiteIds: [],
  },
  {
    id: 'vocabulary.introductions',
    kind: 'vocabulary',
    label: '자기소개 말',
    labelEn: 'Words for introductions',
    chapterId: 'ch1',
    textbookRef: { volume: 1, page: 51 },
    prerequisiteIds: [],
  },
  {
    id: 'grammar.imnida',
    kind: 'grammar',
    label: '입니다, 입니까?',
    labelEn: 'I am…, Are you…?',
    chapterId: 'ch1',
    textbookRef: { volume: 1, page: 52 },
    prerequisiteIds: [],
  },
  {
    id: 'vocabulary.occupations',
    kind: 'vocabulary',
    label: '직업 이름',
    labelEn: 'Jobs',
    chapterId: 'ch1',
    textbookRef: { volume: 1, page: 54 },
    prerequisiteIds: [],
  },
  {
    id: 'grammar.eun-neun',
    kind: 'grammar',
    label: '은/는',
    labelEn: 'Topic marker',
    chapterId: 'ch1',
    textbookRef: { volume: 1, page: 55 },
    prerequisiteIds: [],
  },
  {
    id: 'culture.greetings',
    kind: 'culture',
    label: '한국의 인사 예절',
    labelEn: 'Greeting etiquette in Korea',
    chapterId: 'ch1',
    textbookRef: { volume: 1, page: 57 },
    prerequisiteIds: ['vocabulary.introductions'],
  },
]
