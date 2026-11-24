import type { Lesson } from '../schemas'

/**
 * Chapter 14 · 길 찾기 (Getting Directions) · Book 1, pages 180–189.
 * The Korean word lists follow the textbook so the app matches what you study (cited by page).
 * Objectives, English glosses, explanations, and example sentences are original, not copied from the book.
 */
export const chapter14Lesson: Lesson = {
  chapterId: 'ch14',
  objectives: [
    { ko: '어떤 곳이 어디에 있는지 묻고 답할 수 있다.', en: 'Ask and say where a place is.' },
    { ko: '길을 안내하고 할 일을 부탁할 수 있다.', en: 'Give directions and tell someone what to do.' },
  ],

  vocabulary: [
    {
      titleKo: '위치와 방향',
      titleEn: 'Location and direction words',
      conceptId: 'vocabulary.location-directions',
      textbookRef: { volume: 1, page: 181 },
      items: [
        { ko: '위', en: 'on top of, above' },
        { ko: '아래 / 밑', en: 'under, below (밑 is right underneath)' },
        { ko: '앞 / 뒤', en: 'in front of / behind' },
        { ko: '안 / 밖', en: 'inside / outside' },
        { ko: '옆', en: 'beside, next to' },
        { ko: '사이', en: 'between (은행하고 약국 사이)' },
        { ko: '왼쪽 / 오른쪽', en: 'the left side / the right side' },
        { ko: '건너편 / 맞은편', en: 'on the other side, facing (across the street or room)' },
        { ko: '이쪽 / 그쪽 / 저쪽', en: 'this way / that way (near you) / that way over there' },
        { ko: '어느 쪽', en: 'which way?' },
        { ko: '층', en: 'a floor of a building (3층: the third floor)' },
      ],
    },
    {
      titleKo: '이동 동사',
      titleEn: 'Going up, down, in, and out',
      conceptId: 'vocabulary.movement-verbs',
      textbookRef: { volume: 1, page: 184 },
      items: [
        { ko: '올라가다 / 올라오다', en: 'to go up / come up (오다 means toward the speaker)' },
        { ko: '내려가다 / 내려오다', en: 'to go down / come down' },
        { ko: '들어가다 / 들어오다', en: 'to go in / come in' },
        { ko: '나가다 / 나오다', en: 'to go out / come out' },
        { ko: '건너가다', en: 'to go across (a road or a bridge)' },
      ],
    },
    {
      titleKo: '길과 건물',
      titleEn: 'Streets and buildings',
      conceptId: 'vocabulary.streets',
      textbookRef: { volume: 1, page: 184 },
      items: [
        { ko: '횡단보도', en: 'a zebra crossing painted on the road' },
        { ko: '육교', en: 'a footbridge over the road' },
        { ko: '사거리', en: 'a crossroads where four roads meet' },
        { ko: '근처', en: 'the area close by (회사 근처: near the company)' },
        { ko: '옥상', en: 'the flat roof on top of a building' },
        { ko: '지하', en: 'below ground (지하 1층: the first basement floor, B1)' },
        { ko: '마트', en: 'a large supermarket' },
      ],
    },
  ],

  grammar: [
    {
      conceptId: 'grammar.euro-direction',
      pattern: '(으)로 (방향)',
      meaningEn: 'toward, to (a direction or destination)',
      explanationEn:
        'Attach to a place or a direction word to show which way someone moves. It goes with verbs of movement like 가다, 오다, 올라가다, and 나가다.',
      rules: [
        { when: 'Noun ends in a consonant', form: '으로', example: '오른쪽 → 오른쪽으로' },
        { when: 'Noun ends in a vowel', form: '로', example: '위 → 위로' },
        { when: 'Noun ends in ㄹ', form: '로 (no extra 으)', example: '휴게실 → 휴게실로' },
      ],
      examples: [
        { ko: '사거리에서 왼쪽으로 가세요.', en: 'Turn left at the crossroads.', highlight: '왼쪽으로' },
        { ko: '엘리베이터를 타고 5층으로 올라가세요.', en: 'Take the elevator up to the 5th floor.', highlight: '5층으로' },
        { ko: '점심 먹고 식당으로 오세요.', en: 'Come to the cafeteria for lunch.', highlight: '식당으로' },
      ],
      notes: [
        'It is the same particle as in Chapter 12 (버스로, by bus). After a place or direction it means “toward”; after a vehicle or tool it means “by, with.”',
        'With 가다 and 오다, 에 also works for a destination: 회사에 가요 = 회사로 가요. With a direction like 왼쪽, use (으)로.',
        '층 ends in a consonant, so it is 2층으로, never 2층로.',
      ],
      textbookRef: { volume: 1, page: 182 },
    },
    {
      conceptId: 'grammar.eu-seyo-imperative',
      pattern: '-(으)세요',
      meaningEn: 'please do… (polite instructions)',
      explanationEn:
        'Attach to a verb to tell or ask the listener politely to do something. You hear it in directions, at work, and in shops.',
      rules: [
        { when: 'Stem ends in a consonant', form: '-으세요', example: '앉다 → 앉으세요' },
        { when: 'Stem ends in a vowel', form: '-세요', example: '오다 → 오세요' },
        { when: 'Stem ends in ㄹ (ㄹ drops)', form: '-세요', example: '열다 → 여세요' },
      ],
      examples: [
        { ko: '횡단보도를 건너가세요.', en: 'Cross at the crosswalk.', highlight: '건너가세요' },
        { ko: '이 종이에 주소를 쓰세요.', en: 'Write your address on this paper.', highlight: '쓰세요' },
        { ko: '손을 깨끗이 씻으세요.', en: 'Wash your hands well.', highlight: '씻으세요' },
      ],
      notes: [
        'ㄷ words change to ㄹ: 걷다 → 걸으세요, 듣다 → 들으세요.',
        'A few verbs have their own polite forms: 먹다 → 드세요, 자다 → 주무세요, 있다 → 계세요.',
        'To ask a favor more softly, use -아/어 주세요 (문 좀 열어 주세요). -(으)세요 sounds more like an instruction.',
        'To stop someone politely before asking the way, say 말씀 좀 여쭙겠습니다 (may I ask you something?).',
      ],
      textbookRef: { volume: 1, page: 185 },
    },
  ],

  culture: {
    conceptId: 'culture.road-name-address',
    titleKo: '도로명 주소',
    titleEn: 'Korean street addresses',
    paragraphs: [
      'Korean addresses use the name of the road (도로명 주소). Every road has a name, and every building has a number on that road, so you can find a place from its address alone.',
      'In Korean, an address starts with the biggest area and ends with the smallest: the city or province (시/도), then the city, county, or district (시/군/구), then the road name, then the building number. English addresses are written the other way around.',
      'The end of the road name tells you how wide it is. 대로 is a big road with eight or more lanes, 로 has two to seven lanes, and 길 is a smaller street.',
      'Building numbers go up as you move along the road. Odd numbers are on the left side and even numbers on the right.',
      'When you fill in a form or order something online, write the address in the Korean order. Maps and delivery apps can find a building from the road name and number.',
    ],
    textbookRef: { volume: 1, page: 187 },
  },
}
