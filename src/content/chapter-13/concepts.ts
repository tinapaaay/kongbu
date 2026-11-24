import type { Concept } from '../schemas'

/** The things a learner can get right or wrong in Chapter 13. Each question blames exactly one. */
export const concepts: Concept[] = [
  {
    id: 'vocabulary.weekend-activities',
    kind: 'vocabulary',
    label: '주말 활동 어휘',
    labelEn: 'Weekend activities',
    chapterId: 'ch13',
    textbookRef: { volume: 1, page: 171 },
    prerequisiteIds: [],
  },
  {
    id: 'vocabulary.weekend-places',
    kind: 'vocabulary',
    label: '주말에 가는 곳',
    labelEn: 'Places to spend the weekend',
    chapterId: 'ch13',
    textbookRef: { volume: 1, page: 171 },
    prerequisiteIds: [],
  },
  {
    id: 'grammar.eul-geoyeyo-plan',
    kind: 'grammar',
    label: '-(으)ㄹ 거예요 (계획)',
    labelEn: 'Going to (plans)',
    chapterId: 'ch13',
    textbookRef: { volume: 1, page: 172 },
    prerequisiteIds: [],
  },
  {
    id: 'vocabulary.feelings-moods',
    kind: 'vocabulary',
    label: '상태와 기분 어휘',
    labelEn: 'Feelings and moods',
    chapterId: 'ch13',
    textbookRef: { volume: 1, page: 174 },
    prerequisiteIds: [],
  },
  {
    id: 'grammar.mot-cannot',
    kind: 'grammar',
    label: '못 (불가능)',
    labelEn: 'Can’t',
    chapterId: 'ch13',
    textbookRef: { volume: 1, page: 175 },
    prerequisiteIds: [],
  },
  {
    id: 'culture.religion-in-korea',
    kind: 'culture',
    label: '한국인의 종교',
    labelEn: 'Religion in Korea',
    chapterId: 'ch13',
    textbookRef: { volume: 1, page: 177 },
    prerequisiteIds: ['vocabulary.weekend-places'],
  },
]
