import type { Lesson } from '../schemas'

/**
 * Chapter 12 · 대중교통 (Public Transportation) · Book 1, pages 160–169.
 * The Korean word lists follow the textbook so the app matches what you study (cited by page).
 * Objectives, English glosses, explanations, and example sentences are original, not copied from the book.
 */
export const chapter12Lesson: Lesson = {
  chapterId: 'ch12',
  // Objectives and English glosses are written for Kongbu in our own words. The Korean words are the
  // chapter's vocabulary (cited by page) so the app matches what you study, regrouped with things before actions.
  objectives: [
    { ko: '어디에 어떻게 가는지 묻고 답할 수 있다.', en: 'Ask and answer how to get somewhere.' },
    { ko: '어떤 일을 한 이유를 말할 수 있다.', en: 'Give the reason why you did something.' },
  ],

  vocabulary: [
    {
      titleKo: '교통수단',
      titleEn: 'Ways to travel',
      conceptId: 'vocabulary.transportation',
      textbookRef: { volume: 1, page: 161 },
      items: [
        { ko: '마을버스', en: 'a small bus that loops around one neighborhood' },
        { ko: '시내버스', en: 'an ordinary bus inside a city' },
        { ko: '시외버스 / 고속버스', en: 'a bus to a nearby town / a long-distance highway bus' },
        { ko: '택시', en: 'a cab' },
        { ko: '기차', en: 'a train between cities' },
        { ko: 'KTX (고속 열차)', en: 'Korea’s bullet train' },
        { ko: '지하철', en: 'the metro (underground railway)' },
        { ko: '비행기', en: 'a plane' },
        { ko: '배', en: 'a boat or ferry' },
        { ko: '자전거', en: 'a bike (pedal bicycle)' },
        { ko: '오토바이', en: 'a motorbike or scooter' },
        { ko: '트럭', en: 'a vehicle for carrying goods' },
        { ko: '타다', en: 'to get on and travel in (a bus, train, bike…)' },
      ],
    },
    {
      titleKo: '타는 곳',
      titleEn: 'Stops and stations',
      conceptId: 'vocabulary.stations',
      textbookRef: { volume: 1, page: 161 },
      items: [
        { ko: '버스 정류장', en: 'the place on the street where a bus stops' },
        { ko: '버스 터미널', en: 'the depot where long-distance buses leave from' },
        { ko: '기차역', en: 'where you catch a train' },
        { ko: '지하철역', en: 'where you catch the metro' },
        { ko: '공항', en: 'where planes take off and land' },
      ],
    },
    {
      titleKo: '이동',
      titleEn: 'Getting around',
      conceptId: 'vocabulary.getting-around',
      textbookRef: { volume: 1, page: 164 },
      items: [
        { ko: '타고 가다 / 타고 오다', en: 'to go / come there on a bus, train, bike…' },
        { ko: '걷다', en: 'to move on foot' },
        { ko: '걸어가다 / 걸어오다', en: 'to go / come somewhere on foot' },
        { ko: '내리다', en: 'to step off (a bus, train…)' },
        { ko: '갈아타다 / 환승하다', en: 'to change to another bus or line (both mean the same)' },
        { ko: '지나다', en: 'to go past a place' },
      ],
    },
    {
      titleKo: '시간과 교통 상황',
      titleEn: 'Travel time and traffic',
      conceptId: 'vocabulary.travel-time',
      textbookRef: { volume: 1, page: 164 },
      items: [
        { ko: '출근 시간 / 퇴근 시간', en: 'when the work day starts / ends' },
        { ko: '출퇴근 시간', en: 'the busy hours when everyone travels to or from work' },
        { ko: '차가 막히다', en: 'the roads are jammed' },
        { ko: '가깝다 / 멀다', en: 'to be a short / long way away' },
        { ko: '늦다', en: 'to arrive after the agreed time' },
        { ko: '미안하다', en: 'to apologize; to feel bad about something' },
        { ko: '어떻게', en: 'in what way? by what means?' },
        { ko: '얼마나 걸리다', en: 'how long something takes' },
        { ko: '쯤', en: 'roughly (after a number: 10분쯤)' },
        { ko: '번', en: 'number (a bus route: 100번 버스)' },
      ],
    },
  ],

  grammar: [
    {
      conceptId: 'grammar.euro-means',
      pattern: '(으)로 (수단)',
      meaningEn: 'by, with (how you do something)',
      explanationEn:
        'Attach to a noun to say what you use to get somewhere or to do something: a vehicle, a tool, or a material.',
      rules: [
        { when: 'Noun ends in a consonant', form: '으로', example: '젓가락 → 젓가락으로' },
        { when: 'Noun ends in a vowel', form: '로', example: '택시 → 택시로' },
        { when: 'Noun ends in ㄹ', form: '로 (no extra 으)', example: '지하철 → 지하철로' },
      ],
      examples: [
        { ko: '저는 매일 지하철로 출근해요.', en: 'I take the metro to work every day.', highlight: '지하철로' },
        { ko: '고향에 비행기로 갔어요.', en: 'I flew to my hometown.', highlight: '비행기로' },
        { ko: '숟가락으로 국을 먹어요.', en: 'I eat soup with a spoon.', highlight: '숟가락으로' },
      ],
      notes: [
        '버스로 가요 and 버스를 타고 가요 mean the same thing.',
        'On foot is 걸어서 (가요), not 발로.',
      ],
      textbookRef: { volume: 1, page: 162 },
    },
    {
      conceptId: 'grammar.eseo-kkaji',
      pattern: '~에서 ~까지',
      meaningEn: 'from … to …',
      explanationEn:
        'Put 에서 after the place where a trip starts and 까지 after the place where it ends. It is often used with 얼마나 걸려요?',
      rules: [
        { when: 'Starting place', form: '에서', example: '집 → 집에서' },
        { when: 'Ending place', form: '까지', example: '회사 → 회사까지' },
      ],
      examples: [
        { ko: '집에서 회사까지 30분쯤 걸려요.', en: 'It takes about 30 minutes from home to work.', highlight: '집에서 회사까지' },
        { ko: '기숙사에서 지하철역까지 걸어가요.', en: 'I walk from the dormitory to the metro station.', highlight: '기숙사에서 지하철역까지' },
      ],
      notes: ['For times, use 부터 instead of 에서: 9시부터 6시까지 일해요.'],
      textbookRef: { volume: 1, page: 162 },
    },
    {
      conceptId: 'grammar.a-eoseo-reason',
      pattern: '-아서/어서 (이유)',
      meaningEn: 'because, so',
      explanationEn:
        'Attach to a verb or adjective to give the reason first. What comes after it is the result.',
      rules: [
        { when: 'Last vowel ㅏ or ㅗ', form: '-아서', example: '좋다 → 좋아서' },
        { when: 'Any other vowel', form: '-어서', example: '멀다 → 멀어서' },
        { when: '-하다 words', form: '-해서', example: '피곤하다 → 피곤해서' },
      ],
      examples: [
        { ko: '길이 막혀서 회사에 늦었어요.', en: 'The roads were jammed, so I was late for work.', highlight: '막혀서' },
        { ko: '집이 가까워서 걸어와요.', en: 'My home is close, so I come on foot.', highlight: '가까워서' },
        { ko: '오늘은 피곤해서 택시를 탔어요.', en: 'I was tired today, so I took a taxi.', highlight: '피곤해서' },
      ],
      notes: [
        'Never put past tense before -아서/어서. Say 늦어서 미안해요, not 늦었어서.',
        'Do not end the sentence with a request or suggestion (-(으)세요, -(으)ㅂ시다). "비가 와서 우산을 가져가세요" is wrong.',
        'After a noun, use (이)라서: 퇴근 시간이라서 차가 막혀요.',
        'Some words change: 가깝다 → 가까워서, 바쁘다 → 바빠서.',
      ],
      textbookRef: { volume: 1, page: 165 },
    },
  ],

  culture: {
    conceptId: 'culture.public-transport',
    titleKo: '한국의 대중교통',
    titleEn: 'Public transport in Korea',
    paragraphs: [
      'Getting around Korea without a car is easy. Buses, trains, and the metro reach both nearby towns and faraway cities.',
      'Between cities, most people take the express bus (고속버스). Busy routes keep running late at night. For short trips to a nearby town, take an intercity bus (시외버스). Inside a city, city buses go almost everywhere.',
      'Large cities such as Seoul, Busan, Daegu, Daejeon, and Gwangju have a metro, which is usually the fastest way across town.',
      'Trains link the main cities. Bullet trains (KTX, SRT) cost more but are quick: Seoul to Busan takes about two and a half hours. Regular trains (새마을호, 무궁화호) are slower and cheaper. For long trips by train or express bus, buy your ticket ahead of time online or in an app.',
      'Taxis run day and night. You can wave one down on the street or call one with an app.',
    ],
    textbookRef: { volume: 1, page: 167 },
  },
}
