import type { Concept } from '../schemas'

/** The things a learner can get right or wrong in Chapter 17. Each question blames exactly one. */
export const concepts: Concept[] = [
  {
    id: 'vocabulary.travel-planning',
    kind: 'vocabulary',
    label: '여행 준비 어휘',
    labelEn: 'Planning a trip',
    chapterId: 'ch17',
    textbookRef: { volume: 1, page: 211 },
    prerequisiteIds: [],
  },
  {
    id: 'vocabulary.lodging',
    kind: 'vocabulary',
    label: '숙소',
    labelEn: 'Places to stay',
    chapterId: 'ch17',
    textbookRef: { volume: 1, page: 211 },
    prerequisiteIds: [],
  },
  {
    id: 'grammar.eul-ttae',
    kind: 'grammar',
    label: '-(으)ㄹ 때',
    labelEn: 'When…',
    chapterId: 'ch17',
    textbookRef: { volume: 1, page: 212 },
    prerequisiteIds: [],
  },
  {
    id: 'vocabulary.travel-destinations',
    kind: 'vocabulary',
    label: '여행지 어휘',
    labelEn: 'Places to visit',
    chapterId: 'ch17',
    textbookRef: { volume: 1, page: 214 },
    prerequisiteIds: [],
  },
  {
    id: 'grammar.euryeogo-hada',
    kind: 'grammar',
    label: '-(으)려고 하다',
    labelEn: 'Intend to, plan to',
    chapterId: 'ch17',
    textbookRef: { volume: 1, page: 215 },
    prerequisiteIds: [],
  },
  {
    id: 'culture.cultural-heritage',
    kind: 'culture',
    label: '한국의 문화유산',
    labelEn: 'Korea’s historic places',
    chapterId: 'ch17',
    textbookRef: { volume: 1, page: 217 },
    prerequisiteIds: ['vocabulary.travel-destinations'],
  },
]
