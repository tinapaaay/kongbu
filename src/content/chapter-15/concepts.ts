import type { Concept } from '../schemas'

/** The things a learner can get right or wrong in Chapter 15. Each question blames exactly one. */
export const concepts: Concept[] = [
  {
    id: 'vocabulary.clothing',
    kind: 'vocabulary',
    label: '옷과 액세서리',
    labelEn: 'Clothes and accessories',
    chapterId: 'ch15',
    textbookRef: { volume: 1, page: 191 },
    prerequisiteIds: [],
  },
  {
    id: 'vocabulary.wearing-verbs',
    kind: 'vocabulary',
    label: '입다, 신다, 쓰다',
    labelEn: 'Verbs for wearing',
    chapterId: 'ch15',
    textbookRef: { volume: 1, page: 191 },
    prerequisiteIds: ['vocabulary.clothing'],
  },
  {
    id: 'grammar.go-itda-state',
    kind: 'grammar',
    label: '-고 있다 (상태)',
    labelEn: 'Is wearing, is holding (a state)',
    chapterId: 'ch15',
    textbookRef: { volume: 1, page: 192 },
    prerequisiteIds: ['vocabulary.wearing-verbs'],
  },
  {
    id: 'vocabulary.colors',
    kind: 'vocabulary',
    label: '색깔',
    labelEn: 'Colors',
    chapterId: 'ch15',
    textbookRef: { volume: 1, page: 194 },
    prerequisiteIds: [],
  },
  {
    id: 'grammar.eun-adjective',
    kind: 'grammar',
    label: '-(으)ㄴ (형용사 + 명사)',
    labelEn: 'Describing a noun (a big bag)',
    chapterId: 'ch15',
    textbookRef: { volume: 1, page: 195 },
    prerequisiteIds: [],
  },
  {
    id: 'culture.hanbok',
    kind: 'culture',
    label: '한국의 전통 의상',
    labelEn: 'Hanbok, Korea’s traditional clothing',
    chapterId: 'ch15',
    textbookRef: { volume: 1, page: 197 },
    prerequisiteIds: ['vocabulary.clothing'],
  },
]
