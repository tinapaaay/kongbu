import type { Lesson } from '../schemas'

/**
 * Chapter 16 · 집 구하기 (Finding a House) · Book 1, pages 200–209.
 * The Korean word lists follow the textbook so the app matches what you study (cited by page).
 * Objectives, English glosses, explanations, and example sentences are original, not copied from the book.
 */
export const chapter16Lesson: Lesson = {
  chapterId: 'ch16',
  objectives: [
    { ko: '살고 싶은 집에 대해 말할 수 있다.', en: 'Say what kind of home you want to live in.' },
    { ko: '집과 동네의 좋은 점과 나쁜 점을 말할 수 있다.', en: 'Talk about the good and bad points of a home and its area.' },
  ],

  vocabulary: [
    {
      titleKo: '주거 형태',
      titleEn: 'Kinds of homes',
      conceptId: 'vocabulary.housing-types',
      textbookRef: { volume: 1, page: 201 },
      items: [
        { ko: '아파트', en: 'a flat in a tall apartment block' },
        { ko: '빌라', en: 'a flat in a low building of a few floors (not a luxury villa)' },
        { ko: '주택', en: 'a house with its own land' },
        { ko: '오피스텔', en: 'a studio flat in an office-style building' },
        { ko: '원룸', en: 'a one-room studio with a small kitchen and bathroom' },
        { ko: '기숙사', en: 'a dormitory run by a company or school' },
        { ko: '고시원', en: 'a very small, cheap rented room, often with a shared kitchen' },
      ],
    },
    {
      titleKo: '집 구하기',
      titleEn: 'Renting a home',
      conceptId: 'vocabulary.house-hunting',
      textbookRef: { volume: 1, page: 201 },
      items: [
        { ko: '구하다', en: 'to look for and find (집을 구하다: to find a place to live)' },
        { ko: '부동산', en: 'an estate agent’s office (부동산에 가다)' },
        { ko: '집을 알아보다', en: 'to look into homes, ask around' },
        { ko: '집을 보다', en: 'to go and see a home in person' },
        { ko: '계약하다 / 계약이 끝나다', en: 'to sign a lease / a lease ends' },
        { ko: '계약금을 내다', en: 'to pay money to hold the home before the full deposit' },
        { ko: '보증금', en: 'the deposit you get back when you move out' },
        { ko: '월세', en: 'rent paid every month' },
        { ko: '이사하다', en: 'to move to a new home' },
        { ko: '부탁', en: 'a favor (부탁이 있어요: I have a favor to ask)' },
      ],
    },
    {
      titleKo: '주거 환경',
      titleEn: 'Describing a home and neighborhood',
      conceptId: 'vocabulary.living-environment',
      textbookRef: { volume: 1, page: 204 },
      items: [
        { ko: '넓다 ↔ 좁다', en: 'roomy ↔ cramped' },
        { ko: '깨끗하다 ↔ 더럽다', en: 'clean ↔ dirty (더러워요)' },
        { ko: '조용하다 ↔ 시끄럽다', en: 'quiet ↔ noisy (시끄러워요)' },
        { ko: '편리하다 ↔ 불편하다', en: 'convenient ↔ inconvenient' },
        { ko: '좋다 ↔ 나쁘다', en: 'good ↔ bad' },
        { ko: '많다 ↔ 부족하다', en: 'plenty ↔ not enough' },
        { ko: '교통', en: 'getting around: buses and trains nearby (교통이 편리해요)' },
        { ko: '전망', en: 'the view from the window (전망이 좋아요)' },
        { ko: '편의 시설', en: 'shops, banks, hospitals and other places you need nearby' },
        { ko: '편하다', en: 'to be comfortable, easy' },
      ],
    },
  ],

  grammar: [
    {
      conceptId: 'grammar.go-sipda',
      pattern: '-고 싶다',
      meaningEn: 'want to (do)',
      explanationEn:
        'Attach to a verb to say what you want to do. Use it about yourself in statements, and about the listener in questions.',
      rules: [
        { when: 'I want to…', form: '-고 싶어요', example: '이사하다 → 이사하고 싶어요' },
        { when: 'Do you want to…?', form: '-고 싶어요?', example: '살다 → 어디에서 살고 싶어요?' },
        { when: 'Someone else wants to…', form: '-고 싶어 해요', example: '쉬다 → 친구는 쉬고 싶어 해요' },
      ],
      examples: [
        { ko: '회사 근처로 이사하고 싶어요.', en: 'I want to move near my company.', highlight: '이사하고 싶어요' },
        { ko: '어떤 집을 구하고 싶어요?', en: 'What kind of home are you looking for?', highlight: '구하고 싶어요' },
        { ko: '남편은 넓은 집에서 살고 싶어 해요.', en: 'My husband wants to live somewhere roomy.', highlight: '살고 싶어 해요' },
      ],
      notes: [
        'It goes after verbs only. For adjectives, change the idea: 예뻐지고 싶어요 (want to become pretty), not 예쁘고 싶어요.',
        'The thing you want can take 을/를 or 이/가: 물을 마시고 싶어요 or 물이 마시고 싶어요.',
        'With 하고 (같이), you say who you want to do it with: 친구하고 같이 살고 싶어요.',
      ],
      textbookRef: { volume: 1, page: 202 },
    },
    {
      conceptId: 'grammar.jiman-contrast',
      pattern: '-지만',
      meaningEn: 'but, although',
      explanationEn:
        'Attach to a verb or adjective to join two facts that contrast. The second part goes against what you would expect from the first.',
      rules: [
        { when: 'Verb or adjective', form: '-지만', example: '싸다 → 싸지만' },
        { when: 'Noun', form: '(이)지만', example: '주말 → 주말이지만' },
        { when: 'Past', form: '-았/었지만', example: '먹다 → 먹었지만' },
      ],
      examples: [
        { ko: '이 집은 오래됐지만 깨끗해요.', en: 'This place is old, but it’s clean.', highlight: '오래됐지만' },
        { ko: '전망은 좋지만 교통이 불편해요.', en: 'The view is good, but it’s hard to get around.', highlight: '좋지만' },
        { ko: '휴가지만 집에서 쉴 거예요.', en: 'It’s a holiday, but I’ll rest at home.', highlight: '휴가지만' },
      ],
      notes: [
        'Both halves must contrast. If they don’t, use -고 (and): 방이 넓고 깨끗해요.',
        '은/는 often marks the two things being compared: 방은 좁지만 부엌은 넓어요.',
      ],
      textbookRef: { volume: 1, page: 205 },
    },
  ],

  culture: {
    conceptId: 'culture.housing-in-korea',
    titleKo: '한국의 주거 형태',
    titleEn: 'How people live in Korea',
    paragraphs: [
      'Apartment blocks are everywhere in Korea. A 2022 government survey found that just over half of all households live in an apartment (아파트). People like them for security and convenience: supermarkets, gyms, and schools are often right inside or next to the complex.',
      'Fewer than 30% of households live in a detached house (주택). Some older people are building homes in the countryside near cities. About 10% live in low-rise blocks of flats, usually called 빌라.',
      'More people now live alone, and many young people rent a 원룸 or 오피스텔 near their school or work. Bed, kitchen, and bathroom are all in one space, and basics like a fridge and washing machine often come with the room.',
      'When you rent, you usually pay a deposit (보증금) that you get back at the end, plus monthly rent (월세). Read the contract carefully, ask the estate agent (부동산) what is included, and keep your receipts.',
    ],
    textbookRef: { volume: 1, page: 207 },
  },
}
