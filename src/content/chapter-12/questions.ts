import type { ChoiceId, Question } from '../schemas'

/**
 * Original EPS-TOPIK-style practice questions for Chapter 12.
 * They are written for this app and are NOT real or leaked exam questions,
 * and none copies the textbook's exercises. All start as drafts until reviewed.
 */

type QuestionInput = Omit<Question, 'choices' | 'source' | 'reviewStatus' | 'chapterId'> & {
  reviewStatus?: Question['reviewStatus']
  choices: [string, string, string, string]
}

const ids: ChoiceId[] = ['a', 'b', 'c', 'd']

/** Fills in the fields every Chapter 12 question shares, and turns four strings into choices a–d. */
function q(input: QuestionInput): Question {
  return {
    ...input,
    chapterId: 'ch12',
    choices: input.choices.map((text, i) => ({ id: ids[i], text })),
    source: 'original',
    reviewStatus: input.reviewStatus ?? 'draft',
  }
}

const BLANK = '빈칸에 들어갈 가장 알맞은 것을 고르십시오.'
const CORRECT_SENTENCE = '다음 중 맞는 문장을 고르십시오.'
const READ_MATCH = '다음 글을 읽고 내용과 같은 것을 고르십시오.'

export const chapter12Questions: Question[] = [
  // ---------- Ways to travel ----------
  q({
    id: 'ch12-q001',
    conceptId: 'vocabulary.transportation',
    format: 'vocabulary',
    difficulty: 1,
    prompt: '다음 중 하늘로 다니는 교통수단을 고르십시오.',
    choices: ['배', '비행기', '지하철', '자전거'],
    correctChoiceId: 'b',
    explanation:
      '비행기 (plane) travels through the sky. 배 (boat) goes on water, 지하철 (metro) runs on rails, and 자전거 (bike) is pedaled along the road.',
  }),
  q({
    id: 'ch12-q002',
    conceptId: 'vocabulary.transportation',
    format: 'sentence-completion',
    difficulty: 1,
    prompt: BLANK,
    context: { kind: 'sentence', text: '제주도는 섬이에요. 부산에서 제주도까지 비행기나 (          )를 타고 가요.' },
    choices: ['배', '택시', '마을버스', '오토바이'],
    correctChoiceId: 'a',
    explanation:
      'Jeju is an island, so apart from flying you have to cross the sea: by 배 (boat or ferry). A taxi, a neighborhood bus, or a motorbike cannot cross the sea.',
  }),
  q({
    id: 'ch12-q003',
    conceptId: 'vocabulary.transportation',
    format: 'dialogue-completion',
    difficulty: 2,
    prompt: BLANK,
    context: { kind: 'dialogue', text: '가: 회사까지 뭘 타고 와요?\n나: 집 앞에서 (          )를 타요. 우리 동네만 다니는 작은 버스예요.' },
    choices: ['마을버스', '고속버스', '시외버스', 'KTX'],
    correctChoiceId: 'a',
    explanation:
      '마을버스 is the small bus that only goes around one neighborhood (동네). 고속버스 and 시외버스 travel between cities, and KTX is a train.',
  }),
  q({
    id: 'ch12-q004',
    conceptId: 'vocabulary.transportation',
    format: 'vocabulary',
    difficulty: 2,
    prompt: '다음 중 종류가 다른 하나를 고르십시오.',
    choices: ['기차', '지하철', 'KTX', '택시'],
    correctChoiceId: 'd',
    explanation: '기차, 지하철, and KTX all run on rails. 택시 (taxi) is a car that drives on the road.',
  }),

  // ---------- Stops and stations ----------
  q({
    id: 'ch12-q005',
    conceptId: 'vocabulary.stations',
    format: 'dialogue-completion',
    difficulty: 1,
    prompt: BLANK,
    context: { kind: 'dialogue', text: '가: 내일 비행기로 고향에 가요.\n나: 그래요? 몇 시에 (          )에 가요?' },
    choices: ['공항', '기차역', '지하철역', '버스 정류장'],
    correctChoiceId: 'a',
    explanation: 'Planes leave from a 공항 (airport). Trains leave from a 기차역, the metro from a 지하철역, and city buses from a 버스 정류장.',
  }),
  q({
    id: 'ch12-q006',
    conceptId: 'vocabulary.stations',
    format: 'sentence-completion',
    difficulty: 1,
    prompt: BLANK,
    context: { kind: 'sentence', text: '서울에서 부산까지 고속버스로 가요. 그래서 지금 (          )에 가요.' },
    choices: ['공항', '버스 터미널', '지하철역', '버스 정류장'],
    correctChoiceId: 'b',
    explanation:
      'Long-distance buses such as the 고속버스 leave from a 버스 터미널. A 버스 정류장 is a stop on the street for city buses.',
  }),
  q({
    id: 'ch12-q007',
    conceptId: 'vocabulary.stations',
    format: 'reading',
    difficulty: 2,
    prompt: READ_MATCH,
    context: {
      kind: 'passage',
      text: '저는 회사 앞 버스 정류장에서 마을버스를 타요. 지하철역에서 내려요. 그리고 지하철로 갈아타요. 지하철역까지는 5분쯤 걸려요.',
    },
    choices: ['회사 앞에 지하철역이 있어요.', '마을버스를 타고 지하철역까지 가요.', '지하철역에서 마을버스로 갈아타요.', '버스 정류장까지 5분쯤 걸려요.'],
    correctChoiceId: 'b',
    explanation:
      'The writer takes the neighborhood bus from the stop in front of the office to the metro station, then changes to the metro. The 5 minutes is the bus ride to the station, and the stop in front of the office is a bus stop, not a station.',
  }),

  // ---------- (으)로: by ----------
  q({
    id: 'ch12-q008',
    conceptId: 'grammar.euro-means',
    format: 'grammar',
    difficulty: 1,
    prompt: CORRECT_SENTENCE,
    choices: ['택시으로 왔어요.', '지하철으로 가요.', '젓가락로 먹어요.', '자전거로 학교에 가요.'],
    correctChoiceId: 'd',
    explanation:
      '자전거 ends in a vowel, so it takes 로. The others should be 택시로 (vowel), 지하철로 (a noun ending in ㄹ takes 로, not 으로), and 젓가락으로 (consonant).',
  }),
  q({
    id: 'ch12-q009',
    conceptId: 'grammar.euro-means',
    format: 'dialogue-completion',
    difficulty: 1,
    prompt: BLANK,
    context: { kind: 'dialogue', text: '가: 고향에 어떻게 가요?\n나: (          ) 가요.' },
    choices: ['비행기에', '비행기를', '비행기로', '비행기에서'],
    correctChoiceId: 'c',
    explanation:
      '어떻게 asks how, so the answer names the means with (으)로: 비행기로 가요. 비행기를 would need 타고 after it: 비행기를 타고 가요.',
  }),
  q({
    id: 'ch12-q010',
    conceptId: 'grammar.euro-means',
    format: 'sentence-completion',
    difficulty: 2,
    prompt: BLANK,
    context: { kind: 'sentence', text: '한국 사람들은 보통 (          ) 밥을 먹어요.' },
    choices: ['숟가락로', '숟가락으로', '숟가락에', '숟가락을'],
    correctChoiceId: 'b',
    explanation:
      '숟가락 (spoon) ends in a consonant, so it takes 으로: 숟가락으로 먹어요. (으)로 marks the tool you use, not only the vehicle you travel in.',
  }),
  q({
    id: 'ch12-q011',
    conceptId: 'grammar.euro-means',
    format: 'dialogue-completion',
    difficulty: 2,
    prompt: BLANK,
    context: { kind: 'dialogue', text: '가: 회사에 걸어와요?\n나: 아니요, 집이 멀어요. 그래서 (          ) 와요.' },
    choices: ['걸어서', '오토바이에서', '오토바이를', '오토바이로'],
    correctChoiceId: 'd',
    explanation:
      'Home is far, so not on foot: 오토바이로 와요, by motorbike. 오토바이를 would need 타고 after it, and 걸어서 means on foot, which the answer has just ruled out.',
  }),

  // ---------- ~에서 ~까지: from … to … ----------
  q({
    id: 'ch12-q012',
    conceptId: 'grammar.eseo-kkaji',
    format: 'sentence-completion',
    difficulty: 1,
    prompt: BLANK,
    context: { kind: 'sentence', text: '기숙사(          ) 공장까지 10분쯤 걸려요.' },
    choices: ['까지', '으로', '에서', '를'],
    correctChoiceId: 'c',
    explanation: 'The trip starts at the dormitory, so the starting place takes 에서: 기숙사에서 공장까지, from the dorm to the factory.',
  }),
  q({
    id: 'ch12-q013',
    conceptId: 'grammar.eseo-kkaji',
    format: 'grammar',
    difficulty: 1,
    prompt: CORRECT_SENTENCE,
    choices: ['서울에서 부산에서 KTX로 가요.', '9시에서 6시까지 일해요.', '집에서 시장까지 걸어가요.', '회사까지 공항까지 버스로 가요.'],
    correctChoiceId: 'c',
    explanation:
      '집에서 시장까지 marks the start with 에서 and the end with 까지. The others use one marker twice, or use 에서 with a time, which needs 부터: 9시부터 6시까지.',
  }),
  q({
    id: 'ch12-q014',
    conceptId: 'grammar.eseo-kkaji',
    format: 'dialogue-completion',
    difficulty: 2,
    prompt: BLANK,
    context: { kind: 'dialogue', text: '가: (          ) 얼마나 걸려요?\n나: 지하철로 40분쯤 걸려요.' },
    choices: ['여기에 시청을', '여기에서 시청까지', '여기를 시청으로', '여기까지 시청에'],
    correctChoiceId: 'b',
    explanation: '얼마나 걸려요? asks how long a trip takes, so name the start with 에서 and the end with 까지: 여기에서 시청까지 (from here to city hall).',
  }),

  // ---------- Getting around ----------
  q({
    id: 'ch12-q015',
    conceptId: 'vocabulary.getting-around',
    format: 'sentence-completion',
    difficulty: 1,
    prompt: BLANK,
    context: { kind: 'sentence', text: '시청에 가요? 그럼 다음 정류장에서 (          ).' },
    choices: ['내려야 돼요', '지나야 돼요', '막혀야 돼요', '늦어야 돼요'],
    correctChoiceId: 'a',
    explanation: '내리다 means getting off the bus. 지나다 means going past a place, the opposite of getting off there.',
  }),
  q({
    id: 'ch12-q016',
    conceptId: 'vocabulary.getting-around',
    format: 'sentence-completion',
    difficulty: 2,
    prompt: BLANK,
    context: { kind: 'sentence', text: '이 버스는 시청에 안 가요. 다음 정류장에서 300번 버스로 (          ).' },
    choices: ['내리세요', '지나세요', '갈아타세요', '걸어가세요'],
    correctChoiceId: 'c',
    explanation:
      '버스로 갈아타다 means changing to another bus. This bus does not go to city hall, so you switch to bus 300. 환승하세요 would mean the same.',
  }),
  q({
    id: 'ch12-q017',
    conceptId: 'vocabulary.getting-around',
    format: 'dialogue-completion',
    difficulty: 1,
    prompt: BLANK,
    context: { kind: 'dialogue', text: '가: 집에서 공원까지 가까워요?\n나: 네, 아주 가까워요. 그래서 매일 (          ).' },
    choices: ['갈아타요', '내려요', '지나요', '걸어가요'],
    correctChoiceId: 'd',
    explanation: 'The park is very close, so you go on foot: 걸어가요. 갈아타요 (change buses) and 내려요 (get off) only make sense on a bus or train.',
  }),

  // ---------- Travel time and traffic ----------
  q({
    id: 'ch12-q018',
    conceptId: 'vocabulary.travel-time',
    format: 'sentence-completion',
    difficulty: 1,
    prompt: BLANK,
    context: { kind: 'sentence', text: '아침 8시에는 출근하는 사람이 많아요. 그래서 길에 차가 (          ).' },
    choices: ['막혀요', '멀어요', '걸려요', '늦어요'],
    correctChoiceId: 'a',
    explanation: '차가 막히다 means the roads are jammed. When many people drive to work at once, traffic slows down.',
  }),
  q({
    id: 'ch12-q019',
    conceptId: 'vocabulary.travel-time',
    format: 'dialogue-completion',
    difficulty: 1,
    prompt: BLANK,
    context: { kind: 'dialogue', text: '가: 집에서 회사까지 얼마나 (          )?\n나: 버스로 20분쯤 걸려요.' },
    choices: ['막혀요', '걸려요', '멀어요', '가까워요'],
    correctChoiceId: 'b',
    explanation:
      '얼마나 걸려요? asks how long it takes, and the answer repeats 걸려요. 막혀요, 멀어요, and 가까워요 describe traffic or distance, not time.',
  }),
  q({
    id: 'ch12-q020',
    conceptId: 'vocabulary.travel-time',
    format: 'reading',
    difficulty: 2,
    prompt: READ_MATCH,
    context: {
      kind: 'passage',
      text: '저는 회사 기숙사에 살아요. 기숙사에서 회사까지 아주 가까워요. 걸어서 5분쯤 걸려요. 그래서 출근 시간에 안 늦어요.',
    },
    choices: ['기숙사가 회사에서 멀어요.', '회사까지 버스를 타고 가요.', '출근 시간에 자주 늦어요.', '회사까지 걸어서 5분쯤 걸려요.'],
    correctChoiceId: 'd',
    explanation:
      'The dorm is very close to the office: a 5-minute walk, so the writer is never late. They walk rather than take a bus, and the dorm is close, not far.',
  }),

  // ---------- -아서/어서: because, so ----------
  q({
    id: 'ch12-q021',
    conceptId: 'grammar.a-eoseo-reason',
    format: 'grammar',
    difficulty: 1,
    prompt: CORRECT_SENTENCE,
    choices: ['길이 막혔어서 늦었어요.', '피곤하어서 일찍 잤어요.', '날씨가 좋아서 공원에 걸어갔어요.', '배가 고프어서 밥을 먹었어요.'],
    correctChoiceId: 'c',
    explanation:
      '좋다 has ㅗ, so it takes -아서: 좋아서. The others should be 막혀서 (no past tense before -아서/어서), 피곤해서, and 고파서 (the ㅡ drops).',
  }),
  q({
    id: 'ch12-q022',
    conceptId: 'grammar.a-eoseo-reason',
    format: 'sentence-completion',
    difficulty: 2,
    prompt: BLANK,
    context: { kind: 'sentence', text: '오늘은 비가 많이 (          ) 택시를 탔어요.' },
    choices: ['오아서', '와서', '왔어서', '오세요'],
    correctChoiceId: 'b',
    explanation:
      '오다 + -아서 shortens to 와서. Past tense never goes before -아서/어서, so 왔어서 is wrong even though the rain was in the past.',
  }),
  q({
    id: 'ch12-q023',
    conceptId: 'grammar.a-eoseo-reason',
    format: 'dialogue-completion',
    difficulty: 2,
    prompt: BLANK,
    context: { kind: 'dialogue', text: '가: 왜 늦었어요?\n나: (          ) 늦었어요. 미안해요.' },
    choices: ['집이 가까워서', '날씨가 좋아서', '지하철이 빨라서', '차가 많이 막혀서'],
    correctChoiceId: 'd',
    explanation:
      'Only a traffic jam explains being late. A close home, good weather, or a fast metro would help you arrive on time, not late.',
  }),
  q({
    id: 'ch12-q024',
    conceptId: 'grammar.a-eoseo-reason',
    format: 'grammar',
    difficulty: 3,
    prompt: CORRECT_SENTENCE,
    choices: ['버스가 안 와서 걸어왔어요.', '시간이 없어서 택시를 타세요.', '길이 막혀서 지하철을 탑시다.', '늦어서 빨리 가세요.'],
    correctChoiceId: 'a',
    explanation:
      'A sentence with -아서/어서 cannot end in a request or suggestion such as -(으)세요 or -(으)ㅂ시다. Only the sentence ending in 걸어왔어요 states a fact, so it is the correct one.',
  }),

  // ---------- Public transport in Korea ----------
  q({
    id: 'ch12-q025',
    conceptId: 'culture.public-transport',
    format: 'reading',
    difficulty: 2,
    prompt: READ_MATCH,
    context: {
      kind: 'passage',
      text: '한국에서 도시와 도시 사이를 갈 때 사람들은 고속버스를 많이 타요. 기차도 있어요. KTX는 조금 비싸요. 하지만 아주 빨라요.',
    },
    choices: ['KTX는 아주 느려요.', '고속버스는 도시 안에서만 다녀요.', 'KTX는 비싸고 빨라요.', '도시와 도시 사이에는 기차가 없어요.'],
    correctChoiceId: 'c',
    explanation:
      'The passage says the KTX costs a little more but is very fast. Express buses go between cities, not only inside one, and there are trains between cities too.',
  }),
  q({
    id: 'ch12-q026',
    conceptId: 'culture.public-transport',
    format: 'reading',
    difficulty: 2,
    prompt: '한국의 대중교통에 대한 설명으로 맞는 것을 고르십시오.',
    choices: ['고속버스 표는 인터넷으로도 사요.', '택시는 밤에 안 다녀요.', '지하철은 작은 도시에도 다 있어요.', '서울에서 부산까지 KTX로 10시간쯤 걸려요.'],
    correctChoiceId: 'a',
    explanation:
      'Express bus and train tickets can be bought ahead of time online or in an app. Taxis run day and night, only big cities have a metro, and the KTX takes about two and a half hours from Seoul to Busan.',
  }),
]
