import type { Lesson } from '../schemas'

/**
 * Chapter 11 · 집안일 (Household Chores) · Book 1, pages 150–159.
 * Word lists follow the textbook so the app matches what you study.
 * Explanations and example sentences are original and are not copied from the book.
 */
export const chapter11Lesson: Lesson = {
  chapterId: 'ch11',
  objectives: [
    { ko: '쓰레기 버리는 방법을 묻고 대답할 수 있다.', en: 'Ask and answer how to throw away trash.' },
    { ko: '해야 하는 일에 대해 말할 수 있다.', en: 'Say what you have to do.' },
    { ko: '집안일에 대해 이야기할 수 있다.', en: 'Talk about household chores.' },
  ],

  vocabulary: [
    {
      titleKo: '쓰레기 분리배출',
      titleEn: 'Waste separation',
      conceptId: 'vocabulary.waste-disposal',
      textbookRef: { volume: 1, page: 151 },
      items: [
        { ko: '일반 쓰레기', en: 'general waste' },
        { ko: '음식물 쓰레기', en: 'food waste' },
        { ko: '재활용품', en: 'recyclables' },
        { ko: '헌 옷', en: 'old clothes' },
        { ko: '유리', en: 'glass' },
        { ko: '종이', en: 'paper' },
        { ko: '캔', en: 'can' },
        { ko: '플라스틱', en: 'plastic' },
        { ko: '쓰레기를 버리다', en: 'to throw away trash' },
        { ko: '쓰레기봉투에 넣다', en: 'to put in a trash bag' },
        { ko: '음식물 쓰레기통에 버리다', en: 'to throw away in the food waste bin' },
        { ko: '음식물 쓰레기봉투에 넣다', en: 'to put in a food waste bag' },
        { ko: '따로 버리다', en: 'to throw away separately' },
        { ko: '수거함에 버리다', en: 'to throw in a collection bin' },
        { ko: '같이', en: 'together' },
        { ko: '일', en: 'work' },
        { ko: '시작하다', en: 'to start' },
        { ko: '그래서', en: 'so, therefore' },
      ],
    },
    {
      titleKo: '빨래',
      titleEn: 'Laundry',
      conceptId: 'vocabulary.household-chores',
      textbookRef: { volume: 1, page: 154 },
      items: [
        { ko: '세탁기를 돌리다', en: 'to run the washing machine' },
        { ko: '빨래를 널다', en: 'to hang laundry to dry' },
        { ko: '빨래를 걷다', en: 'to take in dry laundry' },
        { ko: '옷을 다리다', en: 'to iron clothes' },
        { ko: '옷을 개다', en: 'to fold clothes' },
        { ko: '다리미', en: 'iron' },
        { ko: '세탁 세제', en: 'laundry detergent' },
      ],
    },
    {
      titleKo: '청소',
      titleEn: 'Cleaning',
      conceptId: 'vocabulary.household-chores',
      textbookRef: { volume: 1, page: 154 },
      items: [
        { ko: '청소기를 돌리다', en: 'to vacuum' },
        { ko: '쓸다', en: 'to sweep' },
        { ko: '닦다', en: 'to wipe' },
        { ko: '먼지를 털다', en: 'to dust' },
        { ko: '정리하다', en: 'to tidy up' },
        { ko: '빗자루', en: 'broom' },
        { ko: '걸레', en: 'cleaning cloth' },
        { ko: '바닥', en: 'floor' },
        { ko: '창문', en: 'window' },
      ],
    },
    {
      titleKo: '요리',
      titleEn: 'Cooking',
      conceptId: 'vocabulary.household-chores',
      textbookRef: { volume: 1, page: 154 },
      items: [
        { ko: '밥을 하다 / 짓다', en: 'to cook rice' },
        { ko: '음식을 만들다', en: 'to make food' },
        { ko: '설거지를 하다', en: 'to wash the dishes' },
        { ko: '밥솥 / 전기밥솥', en: 'rice cooker / electric rice cooker' },
        { ko: '냄비', en: 'pot' },
        { ko: '프라이팬', en: 'frying pan' },
        { ko: '주방 세제', en: 'dish soap' },
      ],
    },
    {
      titleKo: '더 알아봐요',
      titleEn: 'More words',
      conceptId: 'vocabulary.household-chores',
      textbookRef: { volume: 1, page: 154 },
      items: [
        { ko: '갑자기', en: 'suddenly' },
        { ko: '왜', en: 'why' },
        { ko: '도와주다', en: 'to help' },
        { ko: '그러면', en: 'then, in that case' },
        { ko: '천천히', en: 'slowly' },
      ],
    },
  ],

  grammar: [
    {
      conceptId: 'grammar.a-eo-ya-doeda',
      pattern: '-아야/어야 되다',
      meaningEn: 'must, have to, need to',
      explanationEn:
        'Attach to a verb or adjective to say something is necessary or required. In speech it is usually 돼요, the short form of 되어요.',
      rules: [
        { when: 'Last vowel ㅏ or ㅗ', form: '-아야 되다', example: '자다 → 자야 돼요' },
        { when: 'Any other vowel', form: '-어야 되다', example: '먹다 → 먹어야 돼요' },
        { when: '-하다 verbs', form: '-해야 되다', example: '청소하다 → 청소해야 돼요' },
      ],
      examples: [
        { ko: '오늘 빨래를 해야 돼요.', en: 'I have to do the laundry today.', highlight: '해야 돼요' },
        { ko: '플라스틱은 따로 버려야 돼요.', en: 'Plastic has to be thrown away separately.', highlight: '버려야 돼요' },
        { ko: '내일 일찍 일어나야 돼요.', en: 'I need to get up early tomorrow.', highlight: '일어나야 돼요' },
      ],
      notes: [
        '-아야/어야 하다 means the same thing. It is more common in writing and formal speech: 회사에 가야 합니다.',
      ],
      textbookRef: { volume: 1, page: 152 },
    },
    {
      conceptId: 'grammar.eul-geyo',
      pattern: '-(으)ㄹ게요',
      meaningEn: "I'll (promise or offer)",
      explanationEn:
        "Attach to a verb to promise or offer to do something. It is often a reply to someone's request.",
      rules: [
        { when: 'Stem ends in a consonant', form: '-을게요', example: '닦다 → 닦을게요' },
        { when: 'Stem ends in a vowel', form: '-ㄹ게요', example: '버리다 → 버릴게요' },
        { when: 'Stem ends in ㄹ', form: '-ㄹ게요 (no extra 을)', example: '만들다 → 만들게요' },
      ],
      examples: [
        { ko: '제가 설거지를 할게요.', en: "I'll wash the dishes.", highlight: '할게요' },
        { ko: '쓰레기는 제가 버릴게요.', en: "I'll throw out the trash.", highlight: '버릴게요' },
        { ko: '내일 일찍 올게요.', en: "I'll come early tomorrow.", highlight: '올게요' },
      ],
      notes: [
        'Use it only when the speaker is the one doing the action. "제 친구가 창문을 닦을게요" is wrong.',
        'Do not use it in questions. To offer something as a question, use a different ending.',
      ],
      textbookRef: { volume: 1, page: 155 },
    },
    {
      conceptId: 'grammar.s-irregular',
      pattern: "'ㅅ' 불규칙",
      meaningEn: 'ㅅ irregular verbs',
      explanationEn:
        'For some verbs whose stem ends in ㅅ, the ㅅ drops before an ending that starts with a vowel. 짓다 (to cook rice, to build) is one of them.',
      rules: [
        { when: '+ -어요', form: 'ㅅ drops', example: '짓다 → 지어요' },
        { when: '+ -을게요', form: 'ㅅ drops', example: '짓다 → 지을게요' },
        { when: '+ -어야 돼요', form: 'ㅅ drops', example: '짓다 → 지어야 돼요' },
      ],
      examples: [{ ko: '제가 밥을 지을게요.', en: "I'll cook the rice.", highlight: '지을게요' }],
      notes: ['Some common ㅅ verbs are regular and keep the ㅅ: 씻다 → 씻어요, 벗다 → 벗어요, 웃다 → 웃어요.'],
      textbookRef: { volume: 1, page: 155 },
    },
  ],

  culture: {
    conceptId: 'culture.waste-separation',
    titleKo: '쓰레기 분리배출',
    titleEn: 'Waste separation in Korea',
    paragraphs: [
      'In Korea, trash is sorted by type before it is thrown away. Each area sets its own days and places for collection, so check the rules where you live.',
      'General waste goes into official pay-per-bag trash bags (종량제 봉투), sold at supermarkets and convenience stores in several sizes.',
      'Food waste goes into food waste bins or food waste bags, after draining as much liquid as possible. Things animals cannot eat, such as bones and eggshells, count as general waste.',
      'Recyclables such as plastic, vinyl, paper, cans, and bottles are separated by type. Old clothes, shoes, and bags go into clothing collection bins.',
      'Large items such as furniture or appliances need a disposal sticker, bought at the local community center (행정복지센터), before they are put out.',
    ],
    textbookRef: { volume: 1, page: 157 },
  },
}
