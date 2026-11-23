import type { ChoiceId, Question } from '../schemas'

/**
 * Original EPS-TOPIK-style practice questions for Chapter 1.
 * They are written for this app and are NOT real or leaked exam questions,
 * and none copies the textbook's exercises. They use only the grammar taught so far
 * (입니다/입니까?, 은/는) and the chapter's words.
 * Review statuses record the AI-assisted textbook review authorized by the product owner.
 * See docs/content/chapter-01-review.md; new questions default to draft.
 */

type QuestionInput = Omit<Question, 'choices' | 'source' | 'reviewStatus' | 'chapterId'> & {
  reviewStatus?: Question['reviewStatus']
  choices: [string, string, string, string]
}

const ids: ChoiceId[] = ['a', 'b', 'c', 'd']

/** Fills in the fields every Chapter 1 question shares, and turns four strings into choices a–d. */
function q(input: QuestionInput): Question {
  return {
    ...input,
    chapterId: 'ch1',
    choices: input.choices.map((text, i) => ({ id: ids[i], text })),
    source: 'original',
    reviewStatus: input.reviewStatus ?? 'draft',
  }
}

const BLANK = '빈칸에 들어갈 가장 알맞은 것을 고르십시오.'
const CORRECT_SENTENCE = '다음 중 맞는 문장을 고르십시오.'
const READ_MATCH = '다음 글을 읽고 내용과 같은 것을 고르십시오.'

export const chapter1Questions: Question[] = [
  // ---------- Countries ----------
  q({
    id: 'ch1-q001',
    reviewStatus: 'ai-reviewed',
    conceptId: 'vocabulary.countries',
    format: 'vocabulary',
    difficulty: 1,
    prompt: '다음 중 ‘Thailand’를 고르십시오.',
    choices: ['중국', '라오스', '태국', '캄보디아'],
    correctChoiceId: 'c',
    explanation:
      'Thailand is 태국 in Korean. It sounds nothing like the English name, so it is easy to mix up. 중국 is China, 라오스 is Laos, and 캄보디아 is Cambodia.',
  }),
  q({
    id: 'ch1-q002',
    reviewStatus: 'ai-reviewed',
    conceptId: 'vocabulary.countries',
    format: 'dialogue-completion',
    difficulty: 1,
    prompt: BLANK,
    context: { kind: 'dialogue', text: '가: 어느 나라 사람입니까?\n나: (          ) 사람입니다.' },
    choices: ['학생', '인도네시아', '이름', '누구'],
    correctChoiceId: 'b',
    explanation:
      '어느 나라 사람입니까? asks which country someone is from, so the answer is a country + 사람: 인도네시아 사람입니다. 학생 is a job, 이름 means name, and 누구 means who.',
  }),
  q({
    id: 'ch1-q003',
    reviewStatus: 'ai-reviewed',
    conceptId: 'vocabulary.countries',
    format: 'vocabulary',
    difficulty: 1,
    prompt: '다음 중 종류가 다른 하나를 고르십시오.',
    choices: ['라오스', '캄보디아', '스리랑카', '기술자'],
    correctChoiceId: 'd',
    explanation: '라오스, 캄보디아, and 스리랑카 are countries. 기술자 (technician) is a job.',
  }),
  q({
    id: 'ch1-q004',
    reviewStatus: 'ai-reviewed',
    conceptId: 'vocabulary.countries',
    format: 'reading',
    difficulty: 2,
    prompt: READ_MATCH,
    context: { kind: 'passage', text: '안녕하세요? 저는 아잠입니다. 우즈베키스탄 사람입니다. 저는 근로자입니다.' },
    choices: ['아잠 씨는 우즈베키스탄 사람입니다.', '아잠 씨는 키르기스스탄 사람입니다.', '아잠 씨는 학생입니다.', '아잠 씨는 한국 사람입니다.'],
    correctChoiceId: 'a',
    explanation:
      'Azam is from Uzbekistan (우즈베키스탄) and works as a 근로자 (worker). 키르기스스탄 is Kyrgyzstan, a different country that also ends in -스탄.',
  }),
  q({
    id: 'ch1-q005',
    reviewStatus: 'ai-reviewed',
    conceptId: 'vocabulary.countries',
    format: 'vocabulary',
    difficulty: 2,
    prompt: '다음 중 나라 이름을 맞게 쓴 것을 고르십시오.',
    choices: ['방글라대시', '방굴라데시', '방글라데시', '방글라데씨'],
    correctChoiceId: 'c',
    explanation:
      'Bangladesh is spelled 방글라데시. The others swap 데 for 대, 글 for 굴, or 시 for 씨, which sound alike but are wrong.',
  }),

  // ---------- 입니다, 입니까? ----------
  q({
    id: 'ch1-q006',
    reviewStatus: 'ai-reviewed',
    conceptId: 'grammar.imnida',
    format: 'grammar',
    difficulty: 1,
    prompt: CORRECT_SENTENCE,
    choices: ['저는 학생임니다.', '저는 학생이니다.', '저는 학생입나다.', '저는 학생입니다.'],
    correctChoiceId: 'd',
    explanation:
      'It is spelled 입니다, even though it is said [임니다]. 임니다 writes it the way it sounds, and 이니다 and 입나다 are not words.',
  }),
  q({
    id: 'ch1-q007',
    reviewStatus: 'ai-reviewed',
    conceptId: 'grammar.imnida',
    format: 'dialogue-completion',
    difficulty: 1,
    prompt: BLANK,
    context: { kind: 'dialogue', text: '가: 어느 나라 사람(          )?\n나: 네팔 사람입니다.' },
    choices: ['입니다', '는', '입니까', '은'],
    correctChoiceId: 'c',
    explanation:
      'The first speaker is asking a question, so the noun takes 입니까?: 어느 나라 사람입니까? 입니다 tells rather than asks, and 은/는 mark a topic, which cannot end a sentence.',
  }),
  q({
    id: 'ch1-q008',
    reviewStatus: 'ai-reviewed',
    conceptId: 'grammar.imnida',
    format: 'sentence-completion',
    difficulty: 1,
    prompt: BLANK,
    context: { kind: 'sentence', text: '안녕하세요? 저는 비샬(          ). 네팔 사람입니다.' },
    choices: ['입니까', '입니다', '은', '는'],
    correctChoiceId: 'b',
    explanation:
      'Bishal is giving a name, not asking one, so it is 비샬입니다 (I am Bishal). 입니까 would turn it into a question, and 은/는 cannot end the sentence.',
  }),
  q({
    id: 'ch1-q009',
    reviewStatus: 'ai-reviewed',
    conceptId: 'grammar.imnida',
    format: 'dialogue-completion',
    difficulty: 2,
    prompt: BLANK,
    context: { kind: 'dialogue', text: '가: 소라 씨는 간호사입니까?\n나: 아니요, 저는 (          ).' },
    choices: ['의사입니다', '간호사입니다', '간호사입니까', '의사입니까'],
    correctChoiceId: 'a',
    explanation:
      '아니요 means no, so Sora is not a nurse. The answer gives the real job with 입니다: 의사입니다 (I am a doctor). 간호사입니다 contradicts 아니요, and 입니까 would ask instead of answer.',
  }),
  q({
    id: 'ch1-q010',
    reviewStatus: 'ai-reviewed',
    conceptId: 'grammar.imnida',
    format: 'dialogue-completion',
    difficulty: 1,
    prompt: BLANK,
    context: { kind: 'dialogue', text: '가: 아잠 씨는 우즈베키스탄 사람입니까?\n나: 네, 우즈베키스탄 (          ).' },
    choices: ['사람입니까', '사람은', '사람입니다', '사람는'],
    correctChoiceId: 'c',
    explanation:
      '네 means yes, and an answer tells rather than asks, so it ends in 입니다: 우즈베키스탄 사람입니다. 사람는 is also the wrong form: 사람 ends in a consonant.',
  }),

  // ---------- 은/는 ----------
  q({
    id: 'ch1-q011',
    reviewStatus: 'ai-reviewed',
    conceptId: 'grammar.eun-neun',
    format: 'grammar',
    difficulty: 1,
    prompt: CORRECT_SENTENCE,
    choices: ['툰툰는 미얀마 사람입니다.', '쏨차이는 태국 사람입니다.', '마리아은 필리핀 사람입니다.', '라흐만는 방글라데시 사람입니다.'],
    correctChoiceId: 'b',
    explanation:
      '쏨차이 ends in a vowel, so it takes 는. The others should be 툰툰은 and 라흐만은 (consonant ㄴ) and 마리아는 (vowel).',
  }),
  q({
    id: 'ch1-q012',
    reviewStatus: 'ai-reviewed',
    conceptId: 'grammar.eun-neun',
    format: 'sentence-completion',
    difficulty: 1,
    prompt: BLANK,
    context: { kind: 'sentence', text: '저(          ) 바야르입니다. 몽골 사람입니다.' },
    choices: ['는', '은', '입니다', '씨'],
    correctChoiceId: 'a',
    explanation:
      '저 ends in a vowel, so it takes 는: 저는 (as for me). Never put 씨 after yourself; it is only for other people.',
  }),
  q({
    id: 'ch1-q013',
    reviewStatus: 'ai-reviewed',
    conceptId: 'grammar.eun-neun',
    format: 'sentence-completion',
    difficulty: 1,
    prompt: BLANK,
    context: { kind: 'sentence', text: '라흐만(          ) 운전기사입니다.' },
    choices: ['는', '씨', '입니까', '은'],
    correctChoiceId: 'd',
    explanation:
      '라흐만 ends in the consonant ㄴ, so it takes 은: 라흐만은 운전기사입니다 (Rahman is a driver). 씨 alone does not mark the topic; it would need 는 as well: 라흐만 씨는.',
  }),
  q({
    id: 'ch1-q014',
    reviewStatus: 'ai-reviewed',
    conceptId: 'grammar.eun-neun',
    format: 'sentence-completion',
    difficulty: 2,
    prompt: BLANK,
    context: { kind: 'sentence', text: '응우옌 씨(          ) 기술자입니다.' },
    choices: ['은', '입니까', '는', '을'],
    correctChoiceId: 'c',
    explanation:
      'Look only at the sound right before the blank. That is 씨, which ends in a vowel, so it is 씨는, even though the name 응우옌 ends in a consonant.',
  }),

  // ---------- Jobs ----------
  q({
    id: 'ch1-q015',
    reviewStatus: 'ai-reviewed',
    conceptId: 'vocabulary.occupations',
    format: 'vocabulary',
    difficulty: 1,
    prompt: '다음 중 ‘firefighter’를 고르십시오.',
    choices: ['경찰관', '소방관', '공무원', '회사원'],
    correctChoiceId: 'b',
    explanation:
      'A firefighter is a 소방관. 경찰관 also ends in -관 but is a police officer. 공무원 (government worker) and 회사원 (office worker) end in -원.',
  }),
  q({
    id: 'ch1-q016',
    reviewStatus: 'ai-reviewed',
    conceptId: 'vocabulary.occupations',
    format: 'vocabulary',
    difficulty: 1,
    prompt: '다음 중 ‘carpenter’를 고르십시오.',
    choices: ['요리사', '점원', '운전기사', '목수'],
    correctChoiceId: 'd',
    explanation: 'A carpenter, who builds with wood, is a 목수. 요리사 is a cook, 점원 a shop clerk, and 운전기사 a driver.',
  }),
  q({
    id: 'ch1-q017',
    reviewStatus: 'ai-reviewed',
    conceptId: 'vocabulary.occupations',
    format: 'vocabulary',
    difficulty: 1,
    prompt: '다음 중 직업이 아닌 것을 고르십시오.',
    choices: ['국적', '의사', '점원', '요리사'],
    correctChoiceId: 'a',
    explanation: '국적 means nationality, the country you belong to. 의사 (doctor), 점원 (clerk), and 요리사 (cook) are all jobs.',
  }),
  q({
    id: 'ch1-q018',
    reviewStatus: 'ai-reviewed',
    conceptId: 'vocabulary.occupations',
    format: 'reading',
    difficulty: 2,
    prompt: READ_MATCH,
    context: { kind: 'passage', text: '민수는 한국 사람입니다. 민수는 선생님입니다. 사리는 인도네시아 사람입니다. 사리는 학생입니다.' },
    choices: ['민수는 학생입니다.', '사리는 선생님입니다.', '사리는 인도네시아 사람입니다.', '민수는 인도네시아 사람입니다.'],
    correctChoiceId: 'c',
    explanation:
      'Minsu is Korean and a teacher. Sari is Indonesian and a student. The wrong choices swap the two people’s jobs or countries.',
  }),
  q({
    id: 'ch1-q019',
    reviewStatus: 'ai-reviewed',
    conceptId: 'vocabulary.occupations',
    format: 'dialogue-completion',
    difficulty: 2,
    prompt: BLANK,
    context: { kind: 'dialogue', text: '가: 쏨차이 씨는 요리사입니까?\n나: 아니요, 저는 (          )입니다.' },
    choices: ['운전기사', '태국', '이름', '어느'],
    correctChoiceId: 'a',
    explanation:
      'The question is about a job, so the answer names another job: 운전기사 (driver). 태국입니다 would mean “I am Thailand,” and 이름 (name) and 어느 (which) do not fit.',
  }),

  // ---------- Words for introductions ----------
  q({
    id: 'ch1-q020',
    reviewStatus: 'ai-reviewed',
    conceptId: 'vocabulary.introductions',
    format: 'dialogue-completion',
    difficulty: 1,
    prompt: BLANK,
    context: { kind: 'dialogue', text: '가: (          ) 나라 사람입니까?\n나: 몽골 사람입니다.' },
    choices: ['누구', '어느', '이름', '저'],
    correctChoiceId: 'b',
    explanation: '어느 means which: 어느 나라 사람입니까? asks which country someone is from. 누구 means who, and 이름 and 저 cannot go before 나라 here.',
  }),
  q({
    id: 'ch1-q021',
    reviewStatus: 'ai-reviewed',
    conceptId: 'vocabulary.introductions',
    format: 'dialogue-completion',
    difficulty: 2,
    prompt: BLANK,
    context: { kind: 'dialogue', text: '가: 처음 뵙겠습니다. 저는 아잠입니다.\n나: 안녕하세요? 저는 소라입니다. (          )' },
    choices: ['누구입니까?', '아니요, 학생입니다.', '네팔입니까?', '잘 부탁드립니다.'],
    correctChoiceId: 'd',
    explanation:
      'After giving your name to someone new, Koreans often add 잘 부탁드립니다, roughly “I look forward to working with you.” Asking “who are you?” makes no sense right after Azam has given a name.',
  }),
  q({
    id: 'ch1-q022',
    reviewStatus: 'ai-reviewed',
    conceptId: 'vocabulary.introductions',
    format: 'dialogue-completion',
    difficulty: 1,
    prompt: BLANK,
    context: { kind: 'dialogue', text: '가: 마리아 씨는 학생입니까?\n나: (          ), 저는 학생입니다.' },
    choices: ['아니요', '누구', '어느', '네'],
    correctChoiceId: 'd',
    explanation: 'The answer goes on to say 저는 학생입니다, so it starts with 네 (yes). 아니요 (no) would contradict the rest of the sentence.',
  }),

  // ---------- Greeting etiquette ----------
  q({
    id: 'ch1-q023',
    reviewStatus: 'ai-reviewed',
    conceptId: 'culture.greetings',
    format: 'vocabulary',
    difficulty: 2,
    prompt: '친한 친구에게 하는 인사를 고르십시오.',
    choices: ['안녕?', '안녕하십니까?', '처음 뵙겠습니다.', '잘 부탁드립니다.'],
    correctChoiceId: 'a',
    explanation:
      'With a close friend (친한 친구), a casual 안녕? is natural. 안녕하십니까? is very formal, and 처음 뵙겠습니다 and 잘 부탁드립니다 are for meeting someone for the first time.',
  }),
  q({
    id: 'ch1-q024',
    reviewStatus: 'ai-reviewed',
    conceptId: 'culture.greetings',
    format: 'reading',
    difficulty: 3,
    prompt: '한국의 인사에 대한 설명으로 맞는 것을 고르십시오.',
    choices: ['“안녕?”은 선생님에게 하는 인사입니다.', '“안녕하세요?”는 저녁에도 씁니다.', '나이가 많은 사람에게는 손을 흔들어 인사합니다.', '“안녕하십니까?”는 아침에만 씁니다.'],
    correctChoiceId: 'b',
    explanation:
      '안녕하세요? works at any time of day, evening included. 안녕? is for friends, not teachers. To an older person you bow rather than wave, and 안녕하십니까? is not limited to the morning.',
  }),
]
