import type { Lesson } from '../schemas'

/**
 * Chapter 13 · 주말 활동 (Weekend Activities) · Book 1, pages 170–179.
 * The Korean word lists follow the textbook so the app matches what you study (cited by page).
 * Objectives, English glosses, explanations, and example sentences are original, not copied from the book.
 */
export const chapter13Lesson: Lesson = {
  chapterId: 'ch13',
  objectives: [
    { ko: '주말 계획을 묻고 답할 수 있다.', en: 'Ask and answer what you will do on the weekend.' },
    { ko: '기분과 할 수 없는 일을 말할 수 있다.', en: 'Say how you feel, and what you can’t do and why.' },
  ],

  vocabulary: [
    {
      titleKo: '주말 활동',
      titleEn: 'Weekend activities',
      conceptId: 'vocabulary.weekend-activities',
      textbookRef: { volume: 1, page: 171 },
      items: [
        { ko: '축구하다', en: 'to play soccer' },
        { ko: '헬스를 하다', en: 'to work out at a gym' },
        { ko: '탁구를 치다', en: 'to play table tennis (games hit with a racket or bat use 치다)' },
        { ko: '교회/절/사원에 가다', en: 'to go to a church / a Buddhist temple / a mosque' },
        { ko: '기도를 하다', en: 'to pray' },
        { ko: '예불을 드리다', en: 'to take part in a Buddhist service' },
        { ko: '고향 사람을 만나다', en: 'to get together with people from your home country' },
        { ko: '고향 음식을 먹다', en: 'to eat food from home' },
        { ko: '친구 집을 방문하다', en: 'to visit a friend at home' },
        { ko: '낮잠을 자다', en: 'to sleep during the day' },
        { ko: '피시방에서 게임을 하다', en: 'to play computer games at a PC room' },
        { ko: '노래방에서 노래를 부르다', en: 'to sing at a karaoke room' },
      ],
    },
    {
      titleKo: '주말에 가는 곳',
      titleEn: 'Places to spend the weekend',
      conceptId: 'vocabulary.weekend-places',
      textbookRef: { volume: 1, page: 171 },
      items: [
        { ko: '운동장', en: 'an outdoor sports field' },
        { ko: '헬스장', en: 'a gym with exercise machines' },
        { ko: '탁구장', en: 'a hall with table-tennis tables' },
        { ko: '피시방', en: 'a PC room, where you pay by the hour to use a computer' },
        { ko: '노래방', en: 'a karaoke room, rented by the hour' },
        { ko: '교회', en: 'a (Protestant) church' },
        { ko: '절', en: 'a Buddhist temple' },
        { ko: '사원', en: 'a house of worship; in this chapter, a mosque' },
      ],
    },
    {
      titleKo: '상태와 기분',
      titleEn: 'Feelings and moods',
      conceptId: 'vocabulary.feelings-moods',
      textbookRef: { volume: 1, page: 174 },
      items: [
        { ko: '시간이 있다 / 없다', en: 'to be free / to have no free time' },
        { ko: '일이 많다 / 적다', en: 'to have lots of / not much work' },
        { ko: '약속이 있다 / 없다', en: 'to have plans with someone / to have no plans' },
        { ko: '바쁘다 ↔ 한가하다', en: 'to be busy ↔ to have nothing you must do' },
        { ko: '기분이 좋다', en: 'to be in a good mood' },
        { ko: '기쁘다', en: 'to feel glad (바쁘다, 기쁘다, 슬프다 drop ㅡ: 바빠요, 기뻐요, 슬퍼요)' },
        { ko: '슬프다', en: 'to feel sad, close to tears' },
        { ko: '피곤하다', en: 'to be worn out' },
        { ko: '즐겁다', en: 'to be fun, to have a good time (즐거워요)' },
        { ko: '재미없다', en: 'to be dull, not fun' },
        { ko: '심심하다', en: 'to be bored because there is nothing to do' },
      ],
    },
  ],

  grammar: [
    {
      conceptId: 'grammar.eul-geoyeyo-plan',
      pattern: '-(으)ㄹ 거예요',
      meaningEn: 'will, going to (plans)',
      explanationEn:
        'Attach to a verb to say what you plan or intend to do. Use it with time words like 내일, 주말에, and 다음 주에. To ask about someone’s plans, say it with a rising tone: 뭐 할 거예요?',
      rules: [
        { when: 'Stem ends in a consonant', form: '-을 거예요', example: '읽다 → 읽을 거예요' },
        { when: 'Stem ends in a vowel', form: '-ㄹ 거예요', example: '보다 → 볼 거예요' },
        { when: 'Stem ends in ㄹ', form: '거예요 (no extra ㄹ)', example: '놀다 → 놀 거예요' },
      ],
      examples: [
        { ko: '토요일에 친구 집을 방문할 거예요.', en: 'I’m going to visit a friend’s place on Saturday.', highlight: '방문할 거예요' },
        { ko: '오늘 저녁에는 기숙사에서 쉴 거예요.', en: 'I’m going to rest in the dorm this evening.', highlight: '쉴 거예요' },
        { ko: '일요일에 뭐 할 거예요?', en: 'What are you going to do on Sunday?', highlight: '할 거예요' },
      ],
      notes: [
        'Some ㄷ words change ㄷ to ㄹ: 걷다 → 걸을 거예요, 듣다 → 들을 거예요.',
        '-(으)ㄹ게요 (Chapter 11) is a promise to the listener. -(으)ㄹ 거예요 just states a plan, and you can also ask with it.',
        'About someone else it can also be a guess: 지금 회사에 있을 거예요 (they’re probably at work now).',
      ],
      textbookRef: { volume: 1, page: 172 },
    },
    {
      conceptId: 'grammar.mot-cannot',
      pattern: '못',
      meaningEn: 'can’t (not able to)',
      explanationEn:
        'Put 못 right before a verb to say you can’t do it, because of no time, no skill, or some other reason. It often follows a reason with -아서/어서.',
      rules: [
        { when: 'Before a verb', form: '못 + verb', example: '가다 → 못 가요' },
        { when: 'Noun + 하다 verbs', form: 'noun을/를 못 해요', example: '운동하다 → 운동을 못 해요' },
        { when: 'Longer form, after the stem', form: '-지 못하다', example: '먹다 → 먹지 못해요' },
      ],
      examples: [
        { ko: '일이 많아서 주말에 못 쉬어요.', en: 'I have lots of work, so I can’t rest on the weekend.', highlight: '못 쉬어요' },
        { ko: '비가 와서 축구를 못 했어요.', en: 'It rained, so we couldn’t play soccer.', highlight: '못 했어요' },
        { ko: '바빠서 고향 친구를 만나지 못했어요.', en: 'I was busy, so I couldn’t see my friend from home.', highlight: '만나지 못했어요' },
      ],
      notes: [
        '못 goes between the noun and 하다: 공부를 못 해요, never 못 공부해요.',
        '못 is for actions only. It never goes before adjectives like 바쁘다: say 안 바빠요.',
        '안 means you don’t or won’t (your choice). 못 means you can’t, even if you want to.',
        'It is said [몯], so 못 먹어요 sounds like [몬 머거요].',
      ],
      textbookRef: { volume: 1, page: 175 },
    },
  ],

  culture: {
    conceptId: 'culture.religion-in-korea',
    titleKo: '한국인의 종교',
    titleEn: 'Religion in Korea',
    paragraphs: [
      'Korea has no state religion, and people are free to follow any faith or none. In fact, more Koreans have no religion than have one.',
      'Among believers, a 2023 survey found Protestant Christianity the largest group (about 20%), then Buddhism (about 17%) and Catholicism (about 11%). Other religions, including Islam, are much smaller. Older people and women are more likely to be religious.',
      'Protestants worship at a 교회 (church), Catholics go to Mass (미사) at a 성당 (cathedral or Catholic church), and Buddhists hold services (예불) at a 절 (temple). Mosques (사원) are fewer, but large cities have them, such as the Seoul Central Mosque in Itaewon.',
      'Two religious days are public holidays: Christmas on 25 December and Buddha’s Birthday (부처님 오신 날) on the 8th day of the 4th lunar month, which falls in April or May. Churches and temples are especially busy on those days.',
    ],
    textbookRef: { volume: 1, page: 177 },
  },
}
