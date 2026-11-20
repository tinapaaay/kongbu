import type { ChoiceId, Question } from '../schemas'

/**
 * Original EPS-TOPIK-style practice questions for Chapter 11.
 * They are written for this app and are NOT real or leaked exam questions.
 * Every question stays "draft" until a person checks it against the textbook.
 */

type Draft = Omit<Question, 'choices' | 'source' | 'reviewStatus' | 'chapterId'> & {
  choices: [string, string, string, string]
}

const ids: ChoiceId[] = ['a', 'b', 'c', 'd']

/** Fills in the fields every Chapter 11 question shares, and turns four strings into choices a–d. */
function q(draft: Draft): Question {
  return {
    ...draft,
    chapterId: 'ch11',
    choices: draft.choices.map((text, i) => ({ id: ids[i], text })),
    source: 'original',
    reviewStatus: 'draft',
  }
}

const BLANK = '빈칸에 들어갈 가장 알맞은 것을 고르십시오.'
const CORRECT_SENTENCE = '다음 중 맞는 문장을 고르십시오.'
const READ_MATCH = '다음 글을 읽고 내용과 같은 것을 고르십시오.'

export const chapter11Questions: Question[] = [
  q({
    id: 'ch11-q001',
    conceptId: 'vocabulary.household-chores',
    format: 'vocabulary',
    difficulty: 1,
    prompt: '다음 중 청소할 때 쓰는 물건을 고르십시오.',
    choices: ['냄비', '다리미', '빗자루', '밥솥'],
    correctChoiceId: 'c',
    explanation:
      '빗자루 (broom) is used for cleaning. 냄비 (pot) and 밥솥 (rice cooker) are for cooking, and 다리미 (iron) is for clothes.',
  }),
  q({
    id: 'ch11-q002',
    conceptId: 'vocabulary.household-chores',
    format: 'sentence-completion',
    difficulty: 1,
    prompt: BLANK,
    context: { kind: 'sentence', text: '비가 와요. 밖에 있는 빨래를 빨리 (          ).' },
    choices: ['걷어야 돼요', '널어야 돼요', '돌려야 돼요', '닦아야 돼요'],
    correctChoiceId: 'a',
    explanation:
      'When it rains, you take dry laundry in: 빨래를 걷다. 빨래를 널다 means hanging it out, which is the opposite of what the rain requires.',
  }),
  q({
    id: 'ch11-q003',
    conceptId: 'grammar.a-eo-ya-doeda',
    format: 'grammar',
    difficulty: 1,
    prompt: CORRECT_SENTENCE,
    choices: ['책을 읽아야 돼요.', '방을 청소하야 돼요.', '밥을 먹야 돼요.', '내일은 회사에 가야 돼요.'],
    correctChoiceId: 'd',
    explanation:
      '가다 has ㅏ, so it takes -아야 and contracts to 가야 돼요. The others should be 읽어야 돼요, 청소해야 돼요, and 먹어야 돼요.',
  }),
  q({
    id: 'ch11-q004',
    conceptId: 'grammar.eul-geyo',
    format: 'grammar',
    difficulty: 1,
    prompt: CORRECT_SENTENCE,
    choices: ['제가 음식을 만들을게요.', '제가 창문을 닦을게요.', '제가 설거지를 하을게요.', '제가 쓰레기를 버리을게요.'],
    correctChoiceId: 'b',
    explanation:
      '닦다 ends in a consonant, so it takes -을게요: 닦을게요. The others should be 만들게요 (ㄹ stem), 할게요, and 버릴게요 (vowel stems).',
  }),
  q({
    id: 'ch11-q005',
    conceptId: 'grammar.eul-geyo',
    format: 'grammar',
    difficulty: 2,
    prompt: CORRECT_SENTENCE,
    choices: [
      '제 친구가 창문을 닦을게요.',
      '내일 같이 청소할게요?',
      '가: 쓰레기 좀 버려 주세요. 나: 네, 제가 버릴게요.',
      '어제 제가 설거지를 할게요.',
    ],
    correctChoiceId: 'c',
    explanation:
      '-(으)ㄹ게요 is a promise by the speaker, often answering a request. It cannot describe someone else, be a question, or talk about the past (어제).',
  }),
  q({
    id: 'ch11-q006',
    conceptId: 'grammar.eul-geyo',
    format: 'dialogue-completion',
    difficulty: 1,
    prompt: '다음 대화의 빈칸에 들어갈 가장 알맞은 것을 고르십시오.',
    context: { kind: 'dialogue', text: '가: 음식을 다 먹었어요. 이제 설거지를 해야 돼요.\n나: (          )' },
    choices: ['냄비가 아주 커요.', '네, 음식을 만들었어요.', '아니요, 음식이 없어요.', '그럼 제가 설거지를 할게요.'],
    correctChoiceId: 'd',
    explanation:
      'The first speaker says the dishes need washing, so the natural reply is an offer: 그럼 제가 설거지를 할게요 (Then I will wash the dishes).',
  }),
  q({
    id: 'ch11-q007',
    conceptId: 'vocabulary.waste-disposal',
    format: 'dialogue-completion',
    difficulty: 1,
    prompt: '다음 대화의 빈칸에 들어갈 가장 알맞은 것을 고르십시오.',
    context: { kind: 'dialogue', text: '가: 안 입는 헌 옷하고 신발이 많아요. 어디에 버려요?\n나: (          )' },
    choices: ['의류 수거함에 버려야 돼요.', '음식물 쓰레기통에 버려야 돼요.', '어제 버렸어요.', '세탁기를 돌려야 돼요.'],
    correctChoiceId: 'a',
    explanation:
      'Old clothes (헌 옷) and shoes go into a clothing collection bin: 의류 수거함에 버리다. The question asks where, so an answer about when or about laundry does not fit.',
  }),
  q({
    id: 'ch11-q008',
    conceptId: 'vocabulary.waste-disposal',
    format: 'dialogue-completion',
    difficulty: 1,
    prompt: '다음 대화의 빈칸에 들어갈 가장 알맞은 것을 고르십시오.',
    context: { kind: 'dialogue', text: '가: 플라스틱하고 종이를 같이 버려요?\n나: (          )' },
    choices: ['네, 음식물 쓰레기통에 버려요.', '아니요, 따로 버려야 돼요.', '네, 세탁기를 돌려요.', '아니요, 빨래를 널어요.'],
    correctChoiceId: 'b',
    explanation:
      'Recyclables are sorted by type, so plastic and paper are thrown away separately: 따로 버려야 돼요.',
  }),
  q({
    id: 'ch11-q009',
    conceptId: 'vocabulary.waste-disposal',
    format: 'vocabulary',
    difficulty: 1,
    prompt: '다음 중 재활용품이 아닌 것을 고르십시오.',
    choices: ['캔', '유리병', '음식물 쓰레기', '종이'],
    correctChoiceId: 'c',
    explanation:
      'Cans, glass bottles, and paper are recyclables (재활용품). Food waste (음식물 쓰레기) is collected separately and is not a recyclable.',
  }),
  q({
    id: 'ch11-q010',
    conceptId: 'vocabulary.household-chores',
    format: 'vocabulary',
    difficulty: 1,
    prompt: "'설거지를 하다'와 관계있는 것을 고르십시오.",
    choices: ['세탁 세제', '빗자루', '다리미', '주방 세제'],
    correctChoiceId: 'd',
    explanation:
      '설거지 is washing the dishes, which uses dish soap: 주방 세제. 세탁 세제 is laundry detergent, a common mix-up.',
  }),
  q({
    id: 'ch11-q011',
    conceptId: 'vocabulary.household-chores',
    format: 'vocabulary',
    difficulty: 2,
    prompt: '다음 중 맞는 표현을 고르십시오.',
    choices: ['바닥을 쓸다', '창문을 널다', '빨래를 닦다', '밥을 돌리다'],
    correctChoiceId: 'a',
    explanation:
      'You sweep a floor: 바닥을 쓸다. The natural pairs for the others are 창문을 닦다, 빨래를 널다, and 밥을 하다 or 짓다.',
  }),
  q({
    id: 'ch11-q012',
    conceptId: 'grammar.s-irregular',
    format: 'dialogue-completion',
    difficulty: 2,
    prompt: '다음 대화의 빈칸에 들어갈 가장 알맞은 것을 고르십시오.',
    context: { kind: 'dialogue', text: '가: 밥이 없어요.\n나: 그럼 제가 밥을 (          ).' },
    choices: ['짓을게요', '지을게요', '짓게요', '지게요'],
    correctChoiceId: 'b',
    explanation:
      '짓다 is ㅅ irregular. Before an ending starting with a vowel, the ㅅ drops: 짓 + 을게요 becomes 지을게요.',
  }),
  q({
    id: 'ch11-q013',
    conceptId: 'grammar.s-irregular',
    format: 'grammar',
    difficulty: 3,
    prompt: CORRECT_SENTENCE,
    choices: ['손을 씨어요.', '옷을 버어요.', '밥을 지어요.', '밥을 짓어요.'],
    correctChoiceId: 'c',
    explanation:
      '짓다 drops its ㅅ: 지어요. But 씻다 and 벗다 are regular and keep it: 씻어요, 벗어요.',
  }),
  q({
    id: 'ch11-q014',
    conceptId: 'culture.waste-separation',
    format: 'reading',
    difficulty: 2,
    prompt: READ_MATCH,
    context: {
      kind: 'passage',
      text: '저는 지난주에 새 기숙사로 이사했습니다. 이 기숙사에서는 월요일과 목요일에 일반 쓰레기를 버립니다. 음식물 쓰레기는 물기를 빼고 음식물 쓰레기통에 버립니다. 캔과 플라스틱은 1층 수거장에 따로 버립니다. 쓰레기봉투는 기숙사 앞 편의점에서 삽니다.',
    },
    choices: [
      '일반 쓰레기는 매일 버립니다.',
      '음식물 쓰레기는 물기를 빼지 않고 버립니다.',
      '캔과 플라스틱은 같이 버립니다.',
      '쓰레기봉투는 기숙사 앞에서 살 수 있습니다.',
    ],
    correctChoiceId: 'd',
    explanation:
      'The writer buys trash bags at the convenience store in front of the dorm. General waste goes out only on Monday and Thursday, food waste is drained first (물기를 빼다), and cans and plastic are thrown away separately (따로).',
  }),
  q({
    id: 'ch11-q015',
    conceptId: 'vocabulary.household-chores',
    format: 'reading',
    difficulty: 2,
    prompt: READ_MATCH,
    context: {
      kind: 'passage',
      text: '저는 기숙사에서 친구와 같이 삽니다. 월요일에는 제가 청소기를 돌리고 친구는 빨래를 합니다. 토요일에는 같이 음식을 만들고 설거지는 제가 합니다.',
    },
    choices: [
      '친구는 월요일에 청소기를 돌립니다.',
      '저는 집에서 가족과 삽니다.',
      '저는 토요일에 설거지를 합니다.',
      '친구는 월요일에 음식을 만듭니다.',
    ],
    correctChoiceId: 'c',
    explanation:
      'On Saturday they cook together and the writer washes the dishes. On Monday the writer vacuums and the friend does laundry, and they live in a dormitory.',
  }),
  q({
    id: 'ch11-q016',
    conceptId: 'vocabulary.household-chores',
    format: 'sentence-completion',
    difficulty: 1,
    prompt: BLANK,
    context: { kind: 'sentence', text: '오늘 손님이 와요. 그래서 집을 (          ).' },
    choices: ['버려야 돼요', '청소해야 돼요', '널어야 돼요', '걷어야 돼요'],
    correctChoiceId: 'b',
    explanation:
      'Guests are coming, so the house needs cleaning: 집을 청소하다. You do not 버리다 (throw away), 널다 (hang), or 걷다 (take in) a house.',
  }),
  q({
    id: 'ch11-q017',
    conceptId: 'grammar.eul-geyo',
    format: 'dialogue-completion',
    difficulty: 2,
    prompt: '다음 대화의 빈칸에 들어갈 가장 알맞은 것을 고르십시오.',
    context: { kind: 'dialogue', text: '가: 진수 씨, 거실 청소기 좀 돌려 주세요.\n나: (          )' },
    choices: ['네, 제가 옷을 갤게요.', '네, 거실이 넓어요.', '네, 청소기를 돌릴게요?', '네, 제가 돌릴게요.'],
    correctChoiceId: 'd',
    explanation:
      'The request is to vacuum the living room, so the answer promises exactly that: 제가 돌릴게요. -(으)ㄹ게요 cannot be a question, and folding clothes (옷을 개다) is the wrong chore.',
  }),
  q({
    id: 'ch11-q018',
    conceptId: 'vocabulary.household-chores',
    format: 'vocabulary',
    difficulty: 1,
    prompt: "다음 중 '빨래'와 관계없는 것을 고르십시오.",
    choices: ['프라이팬', '세탁기', '세탁 세제', '빨래를 널다'],
    correctChoiceId: 'a',
    explanation:
      'A frying pan (프라이팬) is for cooking. The washing machine, laundry detergent, and hanging laundry are all part of doing laundry.',
  }),
  q({
    id: 'ch11-q019',
    conceptId: 'vocabulary.waste-disposal',
    format: 'sentence-completion',
    difficulty: 1,
    prompt: BLANK,
    context: { kind: 'sentence', text: '음식물 쓰레기는 (          )에 버려야 돼요.' },
    choices: ['의류 수거함', '음식물 쓰레기통', '세탁기', '냄비'],
    correctChoiceId: 'b',
    explanation: 'Food waste goes into the food waste bin: 음식물 쓰레기통. The clothing bin is for old clothes.',
  }),
  q({
    id: 'ch11-q020',
    conceptId: 'grammar.a-eo-ya-doeda',
    format: 'sentence-completion',
    difficulty: 1,
    prompt: BLANK,
    context: { kind: 'sentence', text: '이번 주말에도 일을 (          ).' },
    choices: ['해야 돼요', '하야 돼요', '해어야 돼요', '하어야 돼요'],
    correctChoiceId: 'a',
    explanation: '하다 always becomes 해야 되다, so 일을 하다 becomes 일을 해야 돼요. The other forms do not exist.',
  }),
  q({
    id: 'ch11-q021',
    conceptId: 'grammar.a-eo-ya-doeda',
    format: 'dialogue-completion',
    difficulty: 2,
    prompt: '다음 대화의 빈칸에 들어갈 가장 알맞은 것을 고르십시오.',
    context: { kind: 'dialogue', text: '가: 이 캔도 플라스틱하고 같이 버려요?\n나: 아니요, 플라스틱하고 따로 (          ).' },
    choices: ['버리야 돼요', '버려어야 돼요', '버려야 돼요', '버릴야 돼요'],
    correctChoiceId: 'c',
    explanation:
      '버리다 ends in ㅣ, so it takes -어야. ㅣ and 어 combine into 여: 버리 + 어야 becomes 버려야 돼요.',
  }),
  q({
    id: 'ch11-q022',
    conceptId: 'culture.waste-separation',
    format: 'vocabulary',
    difficulty: 3,
    prompt: '다음 중 일반 쓰레기로 버려야 하는 것을 고르십시오.',
    choices: ['캔', '달걀 껍데기', '헌 옷', '종이'],
    correctChoiceId: 'b',
    explanation:
      'Eggshells (달걀 껍데기) look like food waste, but animals cannot eat them, so in Korea they go out as general waste. Cans and paper are recyclables, and old clothes go in a clothing bin.',
  }),
]
