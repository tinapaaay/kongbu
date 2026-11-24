import { PROMPTS, questionMaker } from '../questionBuilder'
import type { Question } from '../schemas'

/**
 * Original EPS-TOPIK-style practice questions for Chapter 13.
 * They are written for this app and are NOT real or leaked exam questions,
 * and none copies the textbook's exercises.
 * Review statuses record the AI-assisted textbook review authorized by the product owner.
 * See docs/content/chapter-13-review.md; new questions default to draft.
 */

const q = questionMaker('ch13')
const BLANK = PROMPTS.blank
const CORRECT_SENTENCE = PROMPTS.correctSentence
const READ_MATCH = PROMPTS.readMatch

export const chapter13Questions: Question[] = [
  // ---------- Weekend activities ----------
  q({
    id: 'ch13-q001',
    reviewStatus: 'ai-reviewed',
    conceptId: 'vocabulary.weekend-activities',
    format: 'vocabulary',
    difficulty: 1,
    prompt: '다음 중 운동이 아닌 것을 고르십시오.',
    choices: ['축구하다', '헬스를 하다', '낮잠을 자다', '탁구를 치다'],
    correctChoiceId: 'c',
    explanation: '낮잠을 자다 means taking a nap, which is resting, not exercise. Soccer, working out, and table tennis are all sports.',
  }),
  q({
    id: 'ch13-q002',
    reviewStatus: 'ai-reviewed',
    conceptId: 'vocabulary.weekend-activities',
    format: 'dialogue-completion',
    difficulty: 1,
    prompt: BLANK,
    context: { kind: 'dialogue', text: '가: 오늘 오후에 뭐 해요?\n나: 오전에 공장에서 일을 해서 피곤해요. 집에서 (          ).' },
    choices: ['낮잠을 자요', '탁구를 쳐요', '축구를 해요', '헬스를 해요'],
    correctChoiceId: 'a',
    explanation:
      'The speaker is tired and staying home, so a nap (낮잠을 자요) fits. Table tennis, soccer, and working out need a hall, a field, or a gym, and none of them is rest.',
  }),
  q({
    id: 'ch13-q003',
    reviewStatus: 'ai-reviewed',
    conceptId: 'vocabulary.weekend-activities',
    format: 'sentence-completion',
    difficulty: 1,
    prompt: BLANK,
    context: { kind: 'sentence', text: '일요일마다 고향 사람들을 만나요. 같이 우리 나라 식당에 가서 (          ) 먹어요.' },
    choices: ['노래를', '기도를', '게임을', '고향 음식을'],
    correctChoiceId: 'd',
    explanation: 'The verb is 먹어요 (eat), and the place is a restaurant from home, so the thing eaten is 고향 음식 (food from home). You sing a song, pray a prayer, and play a game, but you don’t eat them.',
  }),
  q({
    id: 'ch13-q004',
    reviewStatus: 'ai-reviewed',
    conceptId: 'vocabulary.weekend-activities',
    format: 'dialogue-completion',
    difficulty: 2,
    prompt: BLANK,
    context: { kind: 'dialogue', text: '가: 토요일에 수닐 씨 집에 가요?\n나: 네, 친구들하고 수닐 씨 집을 (          ) 거예요.' },
    choices: ['부를', '방문할', '칠', '드릴'],
    correctChoiceId: 'b',
    explanation:
      '집을 방문하다 means visiting someone’s home. 부르다 goes with a song (노래를 부르다), 치다 with table tennis (탁구를 치다), and 드리다 with a Buddhist service (예불을 드리다).',
  }),
  q({
    id: 'ch13-q005',
    reviewStatus: 'ai-reviewed',
    conceptId: 'vocabulary.weekend-activities',
    format: 'vocabulary',
    difficulty: 2,
    prompt: '다음 중 절에 가서 하는 것을 고르십시오.',
    choices: ['노래를 부르다', '헬스를 하다', '예불을 드리다', '게임을 하다'],
    correctChoiceId: 'c',
    explanation: '예불 is a Buddhist service, held at a 절 (temple). Singing happens at a karaoke room, working out at a gym, and games at a PC room.',
  }),

  // ---------- Places ----------
  q({
    id: 'ch13-q006',
    reviewStatus: 'ai-reviewed',
    conceptId: 'vocabulary.weekend-places',
    format: 'dialogue-completion',
    difficulty: 1,
    prompt: BLANK,
    context: { kind: 'dialogue', text: '가: 친구들하고 어디에서 노래를 불러요?\n나: 회사 앞에 있는 (          )에서 불러요.' },
    choices: ['헬스장', '탁구장', '노래방', '운동장'],
    correctChoiceId: 'c',
    explanation: 'A 노래방 is a karaoke room, the place for singing. A 헬스장 is a gym, a 탁구장 is for table tennis, and a 운동장 is a sports field.',
  }),
  q({
    id: 'ch13-q007',
    reviewStatus: 'ai-reviewed',
    conceptId: 'vocabulary.weekend-places',
    format: 'sentence-completion',
    difficulty: 1,
    prompt: BLANK,
    context: { kind: 'sentence', text: '기숙사 근처에 (          )이 있어요. 퇴근하고 거기에서 운동을 해요.' },
    choices: ['헬스장', '노래방', '피시방', '식당'],
    correctChoiceId: 'a',
    explanation: 'The speaker exercises there after work, so it is a 헬스장 (gym). People sing at a 노래방, play computer games at a 피시방, and eat at a 식당.',
  }),
  q({
    id: 'ch13-q008',
    reviewStatus: 'ai-reviewed',
    conceptId: 'vocabulary.weekend-places',
    format: 'vocabulary',
    difficulty: 2,
    prompt: '다음 중 종류가 다른 하나를 고르십시오.',
    choices: ['교회', '절', '사원', '탁구장'],
    correctChoiceId: 'd',
    explanation: '교회, 절, and 사원 are all places of worship: a church, a Buddhist temple, and a mosque. A 탁구장 is a table-tennis hall.',
  }),
  q({
    id: 'ch13-q009',
    reviewStatus: 'ai-reviewed',
    conceptId: 'vocabulary.weekend-places',
    format: 'dialogue-completion',
    difficulty: 2,
    prompt: BLANK,
    context: {
      kind: 'dialogue',
      text: '가: 오늘 운동장에서 축구해요?\n나: 아니요, 비가 와서 밖에서 운동을 못 해요. 그래서 (          )에 가서 탁구를 칠 거예요.',
    },
    choices: ['노래방', '절', '피시방', '탁구장'],
    correctChoiceId: 'd',
    explanation: 'Table tennis is played indoors at a 탁구장, so the rain doesn’t matter there. A 노래방 is for singing, a 절 is a temple, and a 피시방 is for computer games.',
  }),

  // ---------- Feelings and moods ----------
  q({
    id: 'ch13-q010',
    reviewStatus: 'ai-reviewed',
    conceptId: 'vocabulary.feelings-moods',
    format: 'vocabulary',
    difficulty: 1,
    prompt: '다음 중 ‘바쁘다’와 반대되는 말을 고르십시오.',
    choices: ['피곤하다', '한가하다', '슬프다', '즐겁다'],
    correctChoiceId: 'b',
    explanation: '바쁘다 means busy and 한가하다 means having nothing you must do, so they are opposites. 피곤하다 is tired, 슬프다 is sad, and 즐겁다 is fun.',
  }),
  q({
    id: 'ch13-q011',
    reviewStatus: 'ai-reviewed',
    conceptId: 'vocabulary.feelings-moods',
    format: 'dialogue-completion',
    difficulty: 1,
    prompt: BLANK,
    context: { kind: 'dialogue', text: '가: 오늘 저녁에 약속이 있어요?\n나: 아니요, (          ). 그래서 기숙사에 있을 거예요.' },
    choices: ['약속이 없어요', '일이 많아요', '시간이 없어요', '기분이 좋아요'],
    correctChoiceId: 'a',
    explanation:
      'After 아니요 to “do you have plans?”, the answer is 약속이 없어요 (I have no plans), which is why the speaker stays in the dorm. 시간이 없어요 (no time) would not explain staying home with nothing planned.',
  }),
  q({
    id: 'ch13-q012',
    reviewStatus: 'ai-reviewed',
    conceptId: 'vocabulary.feelings-moods',
    format: 'sentence-completion',
    difficulty: 2,
    prompt: BLANK,
    context: { kind: 'sentence', text: '주말에 할 일이 없어요. 친구들도 모두 약속이 있어요. 그래서 너무 (          ).' },
    choices: ['기뻐요', '바빠요', '심심해요', '피곤해요'],
    correctChoiceId: 'c',
    explanation:
      'Nothing to do and no friends free means being bored: 심심해요. 바빠요 (busy) and 피곤해요 (tired) come from having too much to do, and 기뻐요 (glad) doesn’t fit an empty weekend.',
  }),
  q({
    id: 'ch13-q013',
    reviewStatus: 'ai-reviewed',
    conceptId: 'vocabulary.feelings-moods',
    format: 'dialogue-completion',
    difficulty: 2,
    prompt: BLANK,
    context: { kind: 'dialogue', text: '가: 린 씨, 무슨 일이 있어요?\n나: 고향에 있는 동생이 많이 아파요. 그래서 (          ).' },
    choices: ['즐거워요', '슬퍼요', '한가해요', '재미없어요'],
    correctChoiceId: 'b',
    explanation:
      'Bad news about family makes you sad: 슬퍼요. 즐거워요 (having fun) is the opposite feeling, 한가해요 is about free time, and 재미없어요 describes something dull, not a feeling about bad news.',
  }),
  q({
    id: 'ch13-q014',
    reviewStatus: 'ai-reviewed',
    conceptId: 'vocabulary.feelings-moods',
    format: 'reading',
    difficulty: 2,
    prompt: READ_MATCH,
    context: {
      kind: 'passage',
      text: '저는 토요일에 회사 친구들하고 노래방에 갔어요. 같이 노래를 많이 불러서 정말 즐거웠어요. 일요일에는 약속도 없고 할 일도 적었어요. 그래서 집에서 낮잠을 잤어요.',
    },
    choices: ['토요일에 기분이 좋았어요.', '토요일에 심심했어요.', '일요일에 일이 많았어요.', '일요일에 시간이 없었어요.'],
    correctChoiceId: 'a',
    explanation:
      'Saturday was 즐거웠어요 (fun), so the writer was in a good mood (기분이 좋았어요). Saturday was not boring, and Sunday had little to do and no plans, so it was neither busy nor short on time.',
  }),

  // ---------- -(으)ㄹ 거예요 ----------
  q({
    id: 'ch13-q015',
    reviewStatus: 'ai-reviewed',
    conceptId: 'grammar.eul-geoyeyo-plan',
    format: 'grammar',
    difficulty: 1,
    prompt: BLANK,
    context: { kind: 'sentence', text: '내일 친구하고 극장에서 영화를 (          ).' },
    choices: ['봤어요', '보을 거예요', '보는 거예요', '볼 거예요'],
    correctChoiceId: 'd',
    explanation:
      '내일 (tomorrow) asks for a plan. 보다 ends in a vowel, so it takes -ㄹ 거예요: 볼 거예요. 봤어요 is past tense, and 보을 adds 으 where it isn’t needed.',
  }),
  q({
    id: 'ch13-q016',
    reviewStatus: 'ai-reviewed',
    conceptId: 'grammar.eul-geoyeyo-plan',
    format: 'grammar',
    difficulty: 2,
    prompt: CORRECT_SENTENCE,
    choices: ['주말에 고향 음식을 만들을 거예요.', '저녁에 기숙사에서 쉴을 거예요.', '다음 주에 고향 친구를 만날 거예요.', '토요일에 책을 읽 거예요.'],
    correctChoiceId: 'c',
    explanation:
      '만나다 ends in a vowel, so 만날 거예요 is right. 만들다 already ends in ㄹ, so it is 만들 거예요. 쉬다 ends in a vowel, so it is 쉴 거예요. 읽다 ends in a consonant, so it needs 을: 읽을 거예요.',
  }),
  q({
    id: 'ch13-q017',
    reviewStatus: 'ai-reviewed',
    conceptId: 'grammar.eul-geoyeyo-plan',
    format: 'dialogue-completion',
    difficulty: 1,
    prompt: BLANK,
    context: { kind: 'dialogue', text: '가: 이번 일요일에 뭐 할 거예요?\n나: 아침에 교회에 (          ).' },
    choices: ['갔어요', '가 거예요', '갈 거예요', '가을 거예요'],
    correctChoiceId: 'c',
    explanation:
      'The question asks about this coming Sunday, so the answer is a plan: 갈 거예요. 갔어요 is past tense. 가 거예요 is missing the ㄹ, and 가을 adds an extra 으 after a vowel.',
  }),
  q({
    id: 'ch13-q018',
    reviewStatus: 'ai-reviewed',
    conceptId: 'grammar.eul-geoyeyo-plan',
    format: 'grammar',
    difficulty: 3,
    prompt: BLANK,
    context: { kind: 'sentence', text: '날씨가 좋아서 주말에 공원에서 많이 (          ).' },
    choices: ['걷을 거예요', '걸을 거예요', '걸 거예요', '걷 거예요'],
    correctChoiceId: 'b',
    explanation:
      '걷다 (to walk) changes its ㄷ to ㄹ before a vowel, so -을 거예요 makes 걸을 거예요. The ㄷ never stays before 을 (걷을 is wrong), and the 을 can’t be dropped because the stem ends in a consonant.',
  }),
  q({
    id: 'ch13-q019',
    reviewStatus: 'ai-reviewed',
    conceptId: 'grammar.eul-geoyeyo-plan',
    format: 'dialogue-completion',
    difficulty: 2,
    prompt: BLANK,
    context: { kind: 'dialogue', text: '가: 다음 달에 휴가가 있어요.\n나: 그래요? 휴가 때 뭐 (          )?' },
    choices: ['할 거예요', '했어요', '해서요', '할게요'],
    correctChoiceId: 'a',
    explanation:
      'The speaker is asking about someone’s plans for next month: 뭐 할 거예요? 했어요 asks about the past. -(으)ㄹ게요 is a promise from the speaker, so it is not used to ask about other people’s plans.',
  }),

  // ---------- 못 ----------
  q({
    id: 'ch13-q020',
    reviewStatus: 'ai-reviewed',
    conceptId: 'grammar.mot-cannot',
    format: 'grammar',
    difficulty: 2,
    prompt: CORRECT_SENTENCE,
    choices: ['일이 많아서 주말에 못 쉬어요.', '시간이 없어서 못 공부해요.', '저는 오늘 못 바빠요.', '어제 친구를 만나 못 했어요.'],
    correctChoiceId: 'a',
    explanation:
      '못 goes right before the verb: 못 쉬어요. With a noun + 하다 verb, 못 goes in the middle: 공부를 못 해요. 못 can’t be used with an adjective like 바쁘다. The long form is 만나지 못했어요.',
  }),
  q({
    id: 'ch13-q021',
    reviewStatus: 'ai-reviewed',
    conceptId: 'grammar.mot-cannot',
    format: 'dialogue-completion',
    difficulty: 1,
    prompt: BLANK,
    context: { kind: 'dialogue', text: '가: 어제 노래방에 갔어요?\n나: 아니요, 머리가 아파서 (          ).' },
    choices: ['갔어요', '갈 거예요', '못 갔어요', '못 갈게요'],
    correctChoiceId: 'c',
    explanation:
      'The answer is 아니요, and a headache stopped the speaker, so: 못 갔어요 (couldn’t go). 갔어요 says they went. 갈 거예요 and 못 갈게요 talk about the future, but the question is about 어제 (yesterday).',
  }),
  q({
    id: 'ch13-q022',
    reviewStatus: 'ai-reviewed',
    conceptId: 'grammar.mot-cannot',
    format: 'grammar',
    difficulty: 3,
    prompt: BLANK,
    context: { kind: 'sentence', text: '늦게 일어나서 아침을 (          ).' },
    choices: ['먹지 못 먹었어요', '못 먹지 않았어요', '먹어 못했어요', '먹지 못했어요'],
    correctChoiceId: 'd',
    explanation:
      'The long form of 못 is -지 못하다 after the verb stem: 먹지 못했어요, meaning the same as 못 먹었어요. Using the verb twice, mixing in 않다, or joining with -어 are not correct forms.',
  }),
  q({
    id: 'ch13-q023',
    reviewStatus: 'ai-reviewed',
    conceptId: 'grammar.mot-cannot',
    format: 'sentence-completion',
    difficulty: 2,
    prompt: BLANK,
    context: { kind: 'sentence', text: '토요일에도 회사에 가야 돼요. 그래서 헬스장에서 (          ).' },
    choices: ['못 운동해요', '운동을 못 해요', '운동 못을 해요', '못 운동을 해요'],
    correctChoiceId: 'b',
    explanation:
      '운동하다 is made of a noun (운동) plus 하다, so 못 goes between them: 운동을 못 해요. Putting 못 before the whole word or before the noun is wrong.',
  }),

  // ---------- Religion in Korea ----------
  q({
    id: 'ch13-q024',
    reviewStatus: 'ai-reviewed',
    conceptId: 'culture.religion-in-korea',
    format: 'dialogue-completion',
    difficulty: 2,
    prompt: BLANK,
    context: { kind: 'dialogue', text: '가: 천주교 신자들은 일요일에 어디에 가요?\n나: (          )에 가서 미사를 드려요.' },
    choices: ['절', '성당', '사원', '노래방'],
    correctChoiceId: 'b',
    explanation:
      'Catholics (천주교 신자) go to Mass (미사) at a 성당. A 절 is a Buddhist temple, a 사원 is a mosque here, and a 노래방 is a karaoke room.',
  }),
  q({
    id: 'ch13-q025',
    reviewStatus: 'ai-reviewed',
    conceptId: 'culture.religion-in-korea',
    format: 'reading',
    difficulty: 3,
    prompt: READ_MATCH,
    context: {
      kind: 'passage',
      text: '저는 불교 신자예요. 회사 근처에 작은 절이 있어요. 그래서 주말마다 거기에 가서 예불을 드려요. 올해 부처님 오신 날은 공휴일이라서 회사에 안 가요. 아침에 회사 친구들하고 절에 갈 거예요.',
    },
    choices: ['저는 주말마다 교회에 가요.', '회사 근처에 절이 없어요.', '부처님 오신 날에 회사에서 일할 거예요.', '부처님 오신 날에 절에 갈 거예요.'],
    correctChoiceId: 'd',
    explanation:
      'The writer will go to the temple with friends from work on Buddha’s Birthday, which is a public holiday. The writer goes to a temple, not a church, the temple is near the company, and there is no work that day.',
  }),
  q({
    id: 'ch13-q026',
    reviewStatus: 'ai-reviewed',
    conceptId: 'culture.religion-in-korea',
    format: 'reading',
    difficulty: 2,
    prompt: '다음 중 한국에 대해 맞는 것을 고르십시오.',
    choices: ['한국에는 종교가 하나만 있어요.', '크리스마스에는 모두 일을 해요.', '불교 신자들은 교회에서 예불을 드려요.', '크리스마스는 공휴일이에요.'],
    correctChoiceId: 'd',
    explanation:
      'Christmas (25 December) is a public holiday in Korea, and so is Buddha’s Birthday. Korea has many religions, most people have the day off on Christmas, and Buddhists hold their services at a 절, not a 교회.',
  }),
]
