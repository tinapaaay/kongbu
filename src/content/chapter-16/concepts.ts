import type { Concept } from '../schemas'

/** The things a learner can get right or wrong in Chapter 16. Each question blames exactly one. */
export const concepts: Concept[] = [
  {
    id: 'vocabulary.housing-types',
    kind: 'vocabulary',
    label: '주거 형태',
    labelEn: 'Kinds of homes',
    chapterId: 'ch16',
    textbookRef: { volume: 1, page: 201 },
    prerequisiteIds: [],
  },
  {
    id: 'vocabulary.house-hunting',
    kind: 'vocabulary',
    label: '집 구하기 어휘',
    labelEn: 'Renting a home',
    chapterId: 'ch16',
    textbookRef: { volume: 1, page: 201 },
    prerequisiteIds: [],
  },
  {
    id: 'grammar.go-sipda',
    kind: 'grammar',
    label: '-고 싶다',
    labelEn: 'Want to',
    chapterId: 'ch16',
    textbookRef: { volume: 1, page: 202 },
    prerequisiteIds: [],
  },
  {
    id: 'vocabulary.living-environment',
    kind: 'vocabulary',
    label: '주거 환경 어휘',
    labelEn: 'Describing a home and neighborhood',
    chapterId: 'ch16',
    textbookRef: { volume: 1, page: 204 },
    prerequisiteIds: [],
  },
  {
    id: 'grammar.jiman-contrast',
    kind: 'grammar',
    label: '-지만',
    labelEn: 'But (contrast)',
    chapterId: 'ch16',
    textbookRef: { volume: 1, page: 205 },
    prerequisiteIds: [],
  },
  {
    id: 'culture.housing-in-korea',
    kind: 'culture',
    label: '한국의 주거 형태',
    labelEn: 'How people live in Korea',
    chapterId: 'ch16',
    textbookRef: { volume: 1, page: 207 },
    prerequisiteIds: ['vocabulary.housing-types'],
  },
]
