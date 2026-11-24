import type { Lesson } from '../schemas'

/**
 * Chapter 15 · 옷차림 (Clothing) · Book 1, pages 190–199.
 * The Korean word lists follow the textbook so the app matches what you study (cited by page).
 * Objectives, English glosses, explanations, and example sentences are original, not copied from the book.
 */
export const chapter15Lesson: Lesson = {
  chapterId: 'ch15',
  objectives: [
    { ko: '무슨 옷을 입고 있는지 묻고 답할 수 있다.', en: 'Ask and say what someone is wearing.' },
    { ko: '색깔과 모양으로 물건을 설명할 수 있다.', en: 'Describe things by their color and look.' },
  ],

  vocabulary: [
    {
      titleKo: '옷과 액세서리',
      titleEn: 'Clothes and accessories',
      conceptId: 'vocabulary.clothing',
      textbookRef: { volume: 1, page: 191 },
      items: [
        { ko: '티셔츠', en: 'a T-shirt' },
        { ko: '잠바 (점퍼)', en: 'a casual jacket' },
        { ko: '청바지', en: 'jeans' },
        { ko: '원피스', en: 'a one-piece dress' },
        { ko: '치마', en: 'a skirt' },
        { ko: '반바지', en: 'shorts (half-length trousers)' },
        { ko: '운동화', en: 'sneakers, trainers' },
        { ko: '슬리퍼', en: 'slip-on slippers or sandals' },
        { ko: '구두', en: 'dress shoes, leather shoes' },
        { ko: '장화', en: 'rubber boots for rain or mud' },
        { ko: '양말', en: 'socks' },
        { ko: '모자', en: 'a cap or hat' },
        { ko: '안경 / 선글라스', en: 'glasses / sunglasses' },
        { ko: '쇼핑몰', en: 'a shopping mall (인터넷 쇼핑몰: an online store)' },
        { ko: '결혼식', en: 'a wedding' },
      ],
    },
    {
      titleKo: '입다, 신다, 쓰다',
      titleEn: 'Verbs for wearing',
      conceptId: 'vocabulary.wearing-verbs',
      textbookRef: { volume: 1, page: 191 },
      items: [
        { ko: '입다', en: 'to wear clothes on your body (티셔츠, 바지, 치마, 잠바)' },
        { ko: '신다', en: 'to wear on your feet (양말, 운동화, 구두, 장화)' },
        { ko: '쓰다', en: 'to wear on your head or face (모자, 안경, 선글라스)' },
        { ko: '들다', en: 'to carry in your hand (가방)' },
        { ko: '벗다', en: 'to take off (clothes, shoes, a hat)' },
      ],
    },
    {
      titleKo: '색깔',
      titleEn: 'Colors',
      conceptId: 'vocabulary.colors',
      textbookRef: { volume: 1, page: 194 },
      items: [
        { ko: '빨간색', en: 'red' },
        { ko: '주황색', en: 'orange' },
        { ko: '노란색', en: 'yellow' },
        { ko: '초록색', en: 'green' },
        { ko: '하늘색', en: 'light blue (the color of the sky, 하늘)' },
        { ko: '파란색', en: 'blue' },
        { ko: '보라색', en: 'purple' },
        { ko: '분홍색', en: 'pink' },
        { ko: '갈색', en: 'brown' },
        { ko: '회색', en: 'gray' },
        { ko: '까만색 (검은색)', en: 'black' },
        { ko: '하얀색 (흰색)', en: 'white' },
        { ko: '밝다 / 어둡다', en: 'to be light, bright / to be dark (어두워요)' },
      ],
    },
  ],

  grammar: [
    {
      conceptId: 'grammar.go-itda-state',
      pattern: '-고 있다 (상태)',
      meaningEn: 'is wearing, has on (a state that continues)',
      explanationEn:
        'With verbs like 입다, 신다, 쓰다, and 들다, -고 있다 describes what someone has on or is holding right now. You put it on earlier, and it is still on.',
      rules: [
        { when: 'Any verb stem', form: '-고 있어요', example: '신다 → 신고 있어요' },
        { when: 'The subject is someone you respect', form: '-고 계세요', example: '쓰다 → 쓰고 계세요' },
      ],
      examples: [
        { ko: '오늘 하늘색 셔츠를 입고 있어요.', en: 'I’m wearing a light-blue shirt today.', highlight: '입고 있어요' },
        { ko: '카림 씨는 까만색 운동화를 신고 있어요.', en: 'Karim has black sneakers on.', highlight: '신고 있어요' },
        { ko: '할아버지께서 모자를 쓰고 계세요.', en: 'Grandfather is wearing a hat.', highlight: '쓰고 계세요' },
      ],
      notes: [
        '입었어요 (past) and 입고 있어요 can both describe what someone has on now. -고 있어요 makes it clear the clothes are still on.',
        'The same -고 있다 also means “in the middle of doing” with other verbs (밥을 먹고 있어요). With clothing verbs it usually means the state.',
        'Don’t say 입어 있어요. Clothing verbs use -고 있다.',
      ],
      textbookRef: { volume: 1, page: 192 },
    },
    {
      conceptId: 'grammar.eun-adjective',
      pattern: '-(으)ㄴ',
      meaningEn: 'describing a noun (a warm jacket, a small bag)',
      explanationEn:
        'Attach to an adjective and put it right before a noun to describe that noun. 크다 (to be big) becomes 큰 가방 (a big bag).',
      rules: [
        { when: 'Stem ends in a consonant', form: '-은', example: '작다 → 작은 가방' },
        { when: 'Stem ends in a vowel', form: '-ㄴ', example: '예쁘다 → 예쁜 치마' },
        { when: 'Stem ends in ㄹ (ㄹ drops)', form: '-ㄴ', example: '길다 → 긴 바지' },
        { when: 'Ends in 있다 / 없다', form: '-는', example: '맛있다 → 맛있는 빵' },
      ],
      examples: [
        { ko: '추워서 따뜻한 잠바를 샀어요.', en: 'It was cold, so I bought a warm jacket.', highlight: '따뜻한' },
        { ko: '창문이 큰 방이 좋아요.', en: 'I like a room with big windows.', highlight: '큰' },
        { ko: '재미있는 영화를 봤어요.', en: 'I watched a fun movie.', highlight: '재미있는' },
      ],
      notes: [
        'ㅂ words change to 우: 춥다 → 추운, 어둡다 → 어두운, 가깝다 → 가까운.',
        'Some color words come from adjectives like this: 빨갛다 → 빨간 (색), 하얗다 → 하얀 (색).',
      ],
      textbookRef: { volume: 1, page: 195 },
    },
  ],

  culture: {
    conceptId: 'culture.hanbok',
    titleKo: '한국의 전통 의상',
    titleEn: 'Hanbok, Korea’s traditional clothing',
    paragraphs: [
      'Hanbok (한복) is Korea’s traditional clothing, known for bright colors and graceful, flowing lines.',
      'A woman’s hanbok is a long, full skirt (치마) with a short jacket (저고리). A man’s hanbok is loose trousers (바지) with a jacket, often with a vest (조끼) on top.',
      'Today people wear hanbok mostly on special days, such as Lunar New Year (설날), Chuseok, and weddings. At a wedding, the two mothers often wear hanbok in soft colors, the groom’s mother in blue tones and the bride’s mother in pink tones.',
      'Traditional hanbok isn’t practical for every day, so simpler “everyday hanbok” (생활한복) has become popular. You may also see visitors renting hanbok near palaces, where entry is often free for people wearing it.',
    ],
    textbookRef: { volume: 1, page: 197 },
  },
}
