import type { Lesson } from '../schemas'

/**
 * Chapter 17 · 휴가 (Vacation) · Book 1, pages 210–219.
 * The Korean word lists follow the textbook so the app matches what you study (cited by page).
 * Objectives, English glosses, explanations, and example sentences are original, not copied from the book.
 */
export const chapter17Lesson: Lesson = {
  chapterId: 'ch17',
  objectives: [
    { ko: '휴가 계획을 묻고 답할 수 있다.', en: 'Ask and answer about vacation plans.' },
    { ko: '여행한 곳에 대해 이야기할 수 있다.', en: 'Talk about places you have traveled to.' },
  ],

  vocabulary: [
    {
      titleKo: '여행 준비',
      titleEn: 'Planning a trip',
      conceptId: 'vocabulary.travel-planning',
      textbookRef: { volume: 1, page: 211 },
      items: [
        { ko: '휴가', en: 'time off work (여름휴가: summer holiday)' },
        { ko: '이번', en: 'this (coming) one (이번 휴가, 이번 주말)' },
        { ko: '여행을 계획하다', en: 'to plan a trip' },
        { ko: '표를 사다', en: 'to buy a ticket' },
        { ko: '숙소를 예약하다', en: 'to book a place to stay' },
        { ko: '짐을 싸다 ↔ 짐을 풀다', en: 'to pack your bags ↔ to unpack' },
        { ko: '출발하다 ↔ 도착하다', en: 'to set off ↔ to get there' },
        { ko: '묵다', en: 'to stay the night somewhere (호텔에서 묵다)' },
        { ko: '그래요?', en: 'Really? Is that so?' },
      ],
    },
    {
      titleKo: '숙소',
      titleEn: 'Places to stay',
      conceptId: 'vocabulary.lodging',
      textbookRef: { volume: 1, page: 211 },
      items: [
        { ko: '숙소', en: 'anywhere you sleep while traveling' },
        { ko: '호텔', en: 'a hotel' },
        { ko: '콘도', en: 'a resort flat with a kitchen, often for families' },
        { ko: '펜션', en: 'a holiday cottage or guesthouse, often by the sea or mountains' },
        { ko: '민박', en: 'a room in a local family’s home' },
        { ko: '유스 호스텔', en: 'a cheap hostel, often with shared rooms' },
      ],
    },
    {
      titleKo: '여행지',
      titleEn: 'Places to visit',
      conceptId: 'vocabulary.travel-destinations',
      textbookRef: { volume: 1, page: 214 },
      items: [
        { ko: '산 / 등산', en: 'a mountain / hiking' },
        { ko: '바다 / 해수욕장', en: 'the sea / a beach for swimming' },
        { ko: '강 / 호수', en: 'a river / a lake' },
        { ko: '섬', en: 'an island' },
        { ko: '온천', en: 'a hot spring' },
        { ko: '유적지', en: 'a historic site, ruins' },
        { ko: '민속촌', en: 'a village showing how people lived long ago' },
        { ko: '놀이공원', en: 'a theme park with rides' },
        { ko: '경치가 좋다', en: 'to have beautiful scenery' },
        { ko: '아름답다', en: 'to be beautiful (아름다워요)' },
        { ko: '유명하다', en: 'to be well known' },
        { ko: '구경하다 / 관람하다', en: 'to look around, sightsee / to watch or view (a show, a museum)' },
        { ko: '꼭', en: 'be sure to, without fail (꼭 가세요)' },
        { ko: '다음', en: 'next (다음 휴가)' },
      ],
    },
  ],

  grammar: [
    {
      conceptId: 'grammar.eul-ttae',
      pattern: '-(으)ㄹ 때',
      meaningEn: 'when, while',
      explanationEn:
        'Attach to a verb or adjective to say when something happens: at that moment, or during that time. The main sentence comes after it.',
      rules: [
        { when: 'Stem ends in a consonant', form: '-을 때', example: '읽다 → 읽을 때' },
        { when: 'Stem ends in a vowel', form: '-ㄹ 때', example: '자다 → 잘 때' },
        { when: 'Stem ends in ㄹ', form: '때 (no extra ㄹ)', example: '놀다 → 놀 때' },
        { when: 'Time nouns', form: '때', example: '추석 → 추석 때' },
      ],
      examples: [
        { ko: '여행할 때 사진을 많이 찍어요.', en: 'I take lots of photos when I travel.', highlight: '여행할 때' },
        { ko: '날씨가 추울 때 온천에 가요.', en: 'When it’s cold, I go to a hot spring.', highlight: '추울 때' },
        { ko: '명절 때 가족이 모두 모여요.', en: 'At holidays the whole family gets together.', highlight: '명절 때' },
      ],
      notes: [
        'ㅂ words change: 덥다 → 더울 때, 춥다 → 추울 때.',
        'For something already finished, use the past: 한국에 처음 왔을 때 (when I first came to Korea).',
        'Not with 주말, 오전, 오후, or days of the week. Say 주말에, not 주말 때.',
      ],
      textbookRef: { volume: 1, page: 212 },
    },
    {
      conceptId: 'grammar.euryeogo-hada',
      pattern: '-(으)려고 하다',
      meaningEn: 'intend to, be planning to',
      explanationEn:
        'Attach to a verb to say what you mean to do. It sounds a little less certain than -(으)ㄹ 거예요: it is your intention, not a fixed plan.',
      rules: [
        { when: 'Stem ends in a consonant', form: '-으려고 해요', example: '찾다 → 찾으려고 해요' },
        { when: 'Stem ends in a vowel', form: '-려고 해요', example: '쉬다 → 쉬려고 해요' },
        { when: 'Stem ends in ㄹ (ㄹ stays)', form: '-려고 해요', example: '놀다 → 놀려고 해요' },
      ],
      examples: [
        { ko: '이번 휴가 때 온천에 가려고 해요.', en: 'I’m planning to go to a hot spring this vacation.', highlight: '가려고 해요' },
        { ko: '바닷가 펜션에서 묵으려고 해요.', en: 'I intend to stay at a guesthouse by the sea.', highlight: '묵으려고 해요' },
        { ko: '주말에 뭐 하려고 해요?', en: 'What are you planning to do on the weekend?', highlight: '하려고 해요' },
      ],
      notes: [
        'Verbs only. It doesn’t go with adjectives (좋으려고 해요 ✗).',
        'In the past, -(으)려고 했어요 often means you meant to but didn’t: 가려고 했지만 못 갔어요.',
        'You will hear 갈려고 and 먹을려고 in speech, but the correct spelling is 가려고 and 먹으려고.',
      ],
      textbookRef: { volume: 1, page: 215 },
    },
  ],

  culture: {
    conceptId: 'culture.cultural-heritage',
    titleKo: '한국의 문화유산',
    titleEn: 'Korea’s historic places',
    paragraphs: [
      'Korea has a long history, and many old places are carefully kept for visitors.',
      'In Seoul, the palaces of the Joseon dynasty stand among modern buildings. Gyeongbokgung (경복궁) is the largest. Changdeokgung (창덕궁) is known for its quiet rear garden. Entry is often free if you wear hanbok.',
      'Gyeongju (경주) was the capital of the ancient kingdom of Silla. Bulguksa temple (불국사) and the stone Buddha of Seokguram grotto (석굴암) show the skill of Silla’s Buddhist artists, and the city is full of royal tombs and old sites.',
      'Andong (안동) keeps the Confucian culture of the Joseon period. In Hahoe Village (하회마을), families still live in traditional houses, and Dosan Seowon (도산서원) was a Joseon-era school.',
      'Many of these sites are UNESCO World Heritage sites. They are easy to reach by KTX or express bus, which makes them good trips for a long weekend.',
    ],
    textbookRef: { volume: 1, page: 217 },
  },
}
