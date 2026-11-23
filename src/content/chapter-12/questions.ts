import { PROMPTS, questionMaker } from '../questionBuilder'
import type { Question } from '../schemas'

/**
 * Original EPS-TOPIK-style practice questions for Chapter 12.
 * They are written for this app and are NOT real or leaked exam questions,
 * and none copies the textbook's exercises.
 * Review statuses record the AI-assisted textbook review authorized by the product owner.
 * See docs/content/chapter-12-review.md; new questions default to draft.
 */

const q = questionMaker('ch12')
const BLANK = PROMPTS.blank
const CORRECT_SENTENCE = PROMPTS.correctSentence
const READ_MATCH = PROMPTS.readMatch

export const chapter12Questions: Question[] = [
  // ---------- Ways to travel ----------
  q({
    id: 'ch12-q001',
    reviewStatus: 'ai-reviewed',
    conceptId: 'vocabulary.transportation',
    format: 'vocabulary',
    difficulty: 1,
    prompt: '다음 중 공항에서 타는 것을 고르십시오.',
    choices: ['배', '비행기', '지하철', '자전거'],
    correctChoiceId: 'b',
    explanation:
      'You board a 비행기 (plane) at an airport. A 배 (boat) leaves from a port, the 지하철 (metro) from a metro station, and a 자전거 (bike) needs no station at all.',
  }),
  q({
    id: 'ch12-q002',
    reviewStatus: 'ai-reviewed',
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
    reviewStatus: 'ai-reviewed',
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
    reviewStatus: 'ai-reviewed',
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
    reviewStatus: 'ai-reviewed',
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
    reviewStatus: 'ai-reviewed',
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
    reviewStatus: 'ai-reviewed',
    conceptId: 'vocabulary.stations',
    format: 'reading',
    difficulty: 2,
    prompt: READ_MATCH,
    context: {
      kind: 'passage',
      text: '저는 기숙사 앞 버스 정류장에서 마을버스를 타요. 지하철역에서 내려요. 그리고 지하철로 갈아타요. 지하철역까지는 5분쯤 걸려요.',
    },
    choices: ['기숙사 앞에 지하철역이 있어요.', '마을버스를 타고 지하철역까지 가요.', '지하철역에서 마을버스로 갈아타요.', '버스 정류장까지 5분쯤 걸려요.'],
    correctChoiceId: 'b',
    explanation:
      'The writer takes the neighborhood bus from the stop in front of the dorm to the metro station, then changes to the metro. The 5 minutes is the bus ride to the station, and the stop in front of the dorm is a bus stop, not a station.',
  }),

  // ---------- (으)로: by ----------
  q({
    id: 'ch12-q008',
    reviewStatus: 'ai-reviewed',
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
    reviewStatus: 'ai-reviewed',
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
    reviewStatus: 'ai-reviewed',
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
    reviewStatus: 'ai-reviewed',
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
    reviewStatus: 'ai-reviewed',
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
    reviewStatus: 'ai-reviewed',
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
    reviewStatus: 'ai-reviewed',
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
    reviewStatus: 'ai-reviewed',
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
    reviewStatus: 'ai-reviewed',
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
    reviewStatus: 'ai-reviewed',
    conceptId: 'vocabulary.getting-around',
    format: 'dialogue-completion',
    difficulty: 2,
    prompt: BLANK,
    context: { kind: 'dialogue', text: '가: 이 버스가 서울역에 가요?\n나: 네, 서울역 앞을 (          ). 거기에서 내리세요.' },
    choices: ['갈아타요', '지나요', '걸어가요', '막혀요'],
    correctChoiceId: 'b',
    explanation:
      '지나다 means going past a place: the bus passes in front of Seoul Station, so you can get off there. 갈아타요 (change buses) and 걸어가요 (go on foot) describe the passenger, not the bus, and 막혀요 is for jammed roads.',
  }),

  // ---------- Travel time and traffic ----------
  q({
    id: 'ch12-q018',
    reviewStatus: 'ai-reviewed',
    conceptId: 'vocabulary.travel-time',
    format: 'sentence-completion',
    difficulty: 1,
    prompt: BLANK,
    context: { kind: 'sentence', text: '아침 8시는 출근 시간이에요. 그래서 길에 차가 많이 (          ).' },
    choices: ['막혀요', '멀어요', '걸려요', '늦어요'],
    correctChoiceId: 'a',
    explanation: '차가 막히다 means the roads are jammed. When everyone drives to work at the same time, traffic slows down.',
  }),
  q({
    id: 'ch12-q019',
    reviewStatus: 'ai-reviewed',
    conceptId: 'vocabulary.travel-time',
    format: 'dialogue-completion',
    difficulty: 1,
    prompt: BLANK,
    context: { kind: 'dialogue', text: '가: 집에서 회사까지 얼마나 걸려요?\n나: 버스로 20분(          ) 걸려요.' },
    choices: ['쯤', '번', '까지', '에서'],
    correctChoiceId: 'a',
    explanation:
      '쯤 after a number means roughly: 20분쯤, about 20 minutes. 번 numbers a bus route (100번 버스), and 까지 and 에서 mark places, not an amount of time.',
  }),
  q({
    id: 'ch12-q020',
    reviewStatus: 'ai-reviewed',
    conceptId: 'vocabulary.travel-time',
    format: 'reading',
    difficulty: 2,
    prompt: READ_MATCH,
    context: {
      kind: 'passage',
      text: '출근 시간에는 길이 많이 막혀요. 그래서 저는 버스를 안 타요. 지하철을 타요. 기숙사에서 회사까지 지하철로 30분쯤 걸려요.',
    },
    choices: ['출근 시간에는 길이 안 막혀요.', '저는 버스를 타고 출근해요.', '회사까지 지하철로 30분쯤 걸려요.', '회사까지 걸어서 30분쯤 걸려요.'],
    correctChoiceId: 'c',
    explanation:
      'The roads are jammed at rush hour, so the writer skips the bus and takes the metro, which takes about 30 minutes. They do not walk, and the roads are jammed, not clear.',
  }),

  // ---------- -아서/어서: because, so ----------
  q({
    id: 'ch12-q021',
    reviewStatus: 'ai-reviewed',
    conceptId: 'grammar.a-eoseo-reason',
    format: 'grammar',
    difficulty: 1,
    prompt: CORRECT_SENTENCE,
    choices: ['길이 막혔어서 늦었어요.', '운동하어서 피곤해요.', '오늘은 바빠서 점심을 늦게 먹었어요.', '표가 싸어서 기차를 탔어요.'],
    correctChoiceId: 'c',
    explanation:
      '바쁘다 drops its ㅡ, and the vowel before it is ㅏ, so it becomes 바빠서. The others should be 막혀서 (no past tense before -아서/어서), 운동해서 (-하다 becomes -해서), and 싸서 (싸 + 아 merge into one ㅏ).',
  }),
  q({
    id: 'ch12-q022',
    reviewStatus: 'ai-reviewed',
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
    reviewStatus: 'ai-reviewed',
    conceptId: 'grammar.a-eoseo-reason',
    format: 'dialogue-completion',
    difficulty: 2,
    prompt: BLANK,
    context: { kind: 'dialogue', text: '가: 왜 KTX를 안 탔어요?\n나: (          ) 고속버스를 탔어요.' },
    choices: ['KTX가 빨라서', '시간이 없어서', 'KTX 표가 비싸서', '고속버스가 느려서'],
    correctChoiceId: 'c',
    explanation:
      'Only an expensive KTX ticket explains choosing the bus over the KTX. A fast KTX or having no time are reasons to take the KTX, and a slow bus is a reason not to take the bus.',
  }),
  q({
    id: 'ch12-q024',
    reviewStatus: 'ai-reviewed',
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
    reviewStatus: 'ai-reviewed',
    conceptId: 'culture.public-transport',
    format: 'reading',
    difficulty: 2,
    prompt: READ_MATCH,
    context: {
      kind: 'passage',
      text: '서울에는 지하철과 시내버스가 있어요. 출퇴근 시간에는 길이 많이 막혀요. 그래서 많은 사람들이 지하철로 출근해요. 택시는 밤에도 다녀요.',
    },
    choices: ['서울에는 지하철이 없어요.', '출퇴근 시간에는 사람들이 지하철을 많이 타요.', '출퇴근 시간에는 길이 안 막혀요.', '택시는 밤에 안 다녀요.'],
    correctChoiceId: 'b',
    explanation:
      'Roads are jammed at rush hour, so many people go to work by metro: 지하철로 출근해요 means the same as taking the metro. Seoul does have a metro, the roads are jammed, and taxis also run at night.',
  }),
  q({
    id: 'ch12-q026',
    reviewStatus: 'ai-reviewed',
    conceptId: 'culture.public-transport',
    format: 'reading',
    difficulty: 2,
    prompt: '한국의 대중교통에 대한 설명으로 맞는 것을 고르십시오.',
    choices: ['택시는 앱으로도 불러요.', '고속버스는 밤에는 안 다녀요.', '지하철은 작은 도시에도 다 있어요.', '마을버스는 도시와 도시 사이를 다녀요.'],
    correctChoiceId: 'a',
    explanation:
      'You can wave a taxi down on the street or call one with an app. Busy express-bus routes run late at night, only big cities have a metro, and a 마을버스 stays inside one neighborhood.',
  }),
]
