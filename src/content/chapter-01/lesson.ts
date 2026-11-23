import type { Lesson } from '../schemas'

/**
 * Chapter 1 · 자기소개 (Self Introduction) · Book 1, pages 50–59.
 * The Korean word lists follow the textbook so the app matches what you study (cited by page).
 * Objectives, English glosses, explanations, and example sentences are original, not copied from the book.
 */
export const chapter1Lesson: Lesson = {
  chapterId: 'ch1',
  objectives: [
    { ko: '자기 이름과 나라를 소개할 수 있다.', en: 'Introduce yourself: your name and your country.' },
    { ko: '다른 사람의 직업을 묻고 답할 수 있다.', en: 'Ask and answer what someone does for work.' },
  ],

  vocabulary: [
    {
      titleKo: '나라 이름',
      titleEn: 'Countries',
      conceptId: 'vocabulary.countries',
      textbookRef: { volume: 1, page: 51 },
      items: [
        { ko: '한국', en: 'Korea (the Republic of Korea)' },
        { ko: '네팔', en: 'Nepal' },
        { ko: '동티모르', en: 'Timor-Leste (East Timor)' },
        { ko: '라오스', en: 'Laos' },
        { ko: '몽골', en: 'Mongolia' },
        { ko: '미얀마', en: 'Myanmar' },
        { ko: '방글라데시', en: 'Bangladesh' },
        { ko: '베트남', en: 'Vietnam' },
        { ko: '스리랑카', en: 'Sri Lanka' },
        { ko: '우즈베키스탄', en: 'Uzbekistan' },
        { ko: '인도네시아', en: 'Indonesia' },
        { ko: '중국', en: 'China' },
        { ko: '캄보디아', en: 'Cambodia' },
        { ko: '키르기스스탄', en: 'Kyrgyzstan' },
        { ko: '타지키스탄', en: 'Tajikistan' },
        { ko: '태국', en: 'Thailand (the name sounds nothing like it, so learn this one well)' },
        { ko: '파키스탄', en: 'Pakistan' },
        { ko: '필리핀', en: 'the Philippines' },
      ],
    },
    {
      titleKo: '자기소개 말',
      titleEn: 'Words for introductions',
      conceptId: 'vocabulary.introductions',
      textbookRef: { volume: 1, page: 51 },
      items: [
        { ko: '저', en: 'I, me (the polite word for yourself)' },
        { ko: '사람', en: 'a person; after a country, someone from there (몽골 사람)' },
        { ko: '이름', en: 'what someone is called' },
        { ko: '국적', en: 'the country you are a citizen of (seen on forms)' },
        { ko: '어느', en: 'which? (어느 나라: which country?)' },
        { ko: '누구', en: 'who?' },
        { ko: '씨', en: 'a polite word after someone else’s name (마리아 씨)' },
        { ko: '네 / 아니요', en: 'yes / no' },
        { ko: '안녕하세요?', en: 'hello (polite, any time of day)' },
        { ko: '처음 뵙겠습니다', en: 'a polite “nice to meet you” when you meet someone for the first time' },
        { ko: '잘 부탁드립니다', en: 'said after introducing yourself: roughly “I look forward to working with you”' },
      ],
    },
    {
      titleKo: '직업',
      titleEn: 'Jobs',
      conceptId: 'vocabulary.occupations',
      textbookRef: { volume: 1, page: 54 },
      items: [
        { ko: '학생', en: 'someone who studies at a school' },
        { ko: '선생님', en: 'a teacher (also a respectful way to address one)' },
        { ko: '회사원', en: 'an office worker at a company' },
        { ko: '근로자', en: 'a worker, someone employed to do a job' },
        { ko: '경찰관', en: 'a police officer' },
        { ko: '소방관', en: 'someone who puts out fires' },
        { ko: '공무원', en: 'someone who works for the government' },
        { ko: '점원', en: 'someone who serves customers in a shop' },
        { ko: '의사', en: 'a doctor' },
        { ko: '간호사', en: 'a nurse' },
        { ko: '요리사', en: 'someone who cooks for a living' },
        { ko: '운전기사', en: 'someone who drives for a living (bus, truck, taxi)' },
        { ko: '기술자', en: 'a skilled technician or engineer' },
        { ko: '목수', en: 'someone who builds with wood' },
        { ko: '농부', en: 'someone who grows crops' },
        { ko: '어부', en: 'someone who catches fish for a living' },
      ],
    },
  ],

  grammar: [
    {
      conceptId: 'grammar.imnida',
      pattern: '입니다, 입니까?',
      meaningEn: 'am, is, are (formal and polite)',
      explanationEn:
        'Put 입니다 right after a noun to say what someone or something is. To ask, change it to 입니까? This is the formal, polite style used when you introduce yourself, at work, and on the EPS-TOPIK.',
      rules: [
        { when: 'Telling', form: '입니다', example: '학생 → 학생입니다' },
        { when: 'Asking', form: '입니까?', example: '회사원 → 회사원입니까?' },
      ],
      examples: [
        { ko: '저는 바야르입니다.', en: 'I am Bayar.', highlight: '입니다' },
        { ko: '몽골 사람입니까?', en: 'Are you from Mongolia?', highlight: '입니까?' },
        { ko: '라흐만 씨는 요리사입니다.', en: 'Rahman is a cook.', highlight: '입니다' },
      ],
      notes: [
        'It is spelled 입니다 but said [임니다]. Write it with ㅂ.',
        'No space before it: 학생입니다, not 학생 입니다.',
        'Answer a 입니까? question with 네 (yes) or 아니요 (no) first.',
        'You can leave out 저는 when it is clear you mean yourself.',
      ],
      textbookRef: { volume: 1, page: 52 },
    },
    {
      conceptId: 'grammar.eun-neun',
      pattern: '은/는',
      meaningEn: 'as for (marks the topic)',
      explanationEn:
        'Attach to a noun to show who or what the sentence is about. In an introduction it marks the person being introduced, like 저는 (as for me).',
      rules: [
        { when: 'Noun ends in a consonant', form: '은', example: '툰툰 → 툰툰은' },
        { when: 'Noun ends in a vowel', form: '는', example: '마리아 → 마리아는' },
      ],
      examples: [
        { ko: '저는 근로자입니다.', en: 'I am a worker.', highlight: '저는' },
        { ko: '툰툰은 미얀마 사람입니다.', en: 'Tun Tun is from Myanmar.', highlight: '툰툰은' },
        { ko: '응우옌 씨는 기술자입니다.', en: 'Nguyen is a technician.', highlight: '씨는' },
      ],
      notes: [
        'Look only at the sound right before 은/는. After 씨 it is always 는, even when the name ends in a consonant: 응우옌 씨는.',
        'Use 씨 after other adults’ names. Never put it after your own name.',
      ],
      textbookRef: { volume: 1, page: 55 },
    },
  ],

  culture: {
    conceptId: 'culture.greetings',
    titleKo: '한국의 인사 예절',
    titleEn: 'Greeting etiquette in Korea',
    paragraphs: [
      'How you greet someone in Korea depends on who they are.',
      'To someone older or more senior than you, say 안녕하세요? or the more formal 안녕하십니까? and bow: a nod of the head, or a deeper bow from the waist. The bow shows respect.',
      'To a close friend or someone younger, a casual 안녕? with a small wave is enough.',
      'None of these greetings depends on the time of day. You can use them in the morning, afternoon, or evening.',
      'In formal settings people often shake hands. When the other person is much older or more senior, support your right arm with your left hand as you shake.',
    ],
    textbookRef: { volume: 1, page: 57 },
  },
}
