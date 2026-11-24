import type { Concept } from '../schemas'

/** The things a learner can get right or wrong in Chapter 14. Each question blames exactly one. */
export const concepts: Concept[] = [
  {
    id: 'vocabulary.location-directions',
    kind: 'vocabulary',
    label: '위치와 방향 어휘',
    labelEn: 'Location and direction words',
    chapterId: 'ch14',
    textbookRef: { volume: 1, page: 181 },
    prerequisiteIds: [],
  },
  {
    id: 'grammar.euro-direction',
    kind: 'grammar',
    label: '(으)로 (방향)',
    labelEn: 'Toward, to (direction)',
    chapterId: 'ch14',
    textbookRef: { volume: 1, page: 182 },
    prerequisiteIds: ['vocabulary.location-directions'],
  },
  {
    id: 'vocabulary.movement-verbs',
    kind: 'vocabulary',
    label: '이동 동사',
    labelEn: 'Going up, down, in, and out',
    chapterId: 'ch14',
    textbookRef: { volume: 1, page: 184 },
    prerequisiteIds: [],
  },
  {
    id: 'vocabulary.streets',
    kind: 'vocabulary',
    label: '길과 건물 어휘',
    labelEn: 'Streets and buildings',
    chapterId: 'ch14',
    textbookRef: { volume: 1, page: 184 },
    prerequisiteIds: [],
  },
  {
    id: 'grammar.eu-seyo-imperative',
    kind: 'grammar',
    label: '-(으)세요 (명령)',
    labelEn: 'Please do… (instructions)',
    chapterId: 'ch14',
    textbookRef: { volume: 1, page: 185 },
    prerequisiteIds: [],
  },
  {
    id: 'culture.road-name-address',
    kind: 'culture',
    label: '도로명 주소',
    labelEn: 'Korean street addresses',
    chapterId: 'ch14',
    textbookRef: { volume: 1, page: 187 },
    prerequisiteIds: [],
  },
]
