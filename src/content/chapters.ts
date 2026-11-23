import type { Chapter } from './schemas'

/**
 * All 60 chapters of the NEW EPS-TOPIK Standard Korean Textbook.
 * Titles and start pages come from each book's contents page (목차, pages 8–9).
 * Only chapters with contentStatus "available" have lessons and questions in the app.
 *
 * Fields: [number, Korean title, English title, start page]
 */
const book1: Array<[number, string, string, number]> = [
  [1, '자기소개', 'Self Introduction', 50],
  [2, '생활용품', 'Daily Necessities', 60],
  [3, '위치와 장소', 'Locations and Places', 70],
  [4, '동작과 사물', 'Actions and Objects', 80],
  [5, '날짜와 요일', 'Dates and Days of the Week', 90],
  [6, '하루 일과', 'Daily Routine', 100],
  [7, '계절과 날씨', 'Seasons and the Weather', 110],
  [8, '가족과 친구', 'Family and Friends', 120],
  [9, '음식 주문', 'Ordering Food', 130],
  [10, '물건 구입', 'Shopping', 140],
  [11, '집안일', 'Household Chores', 150],
  [12, '대중교통', 'Public Transportation', 160],
  [13, '주말 활동', 'Weekend Activities', 170],
  [14, '길 찾기', 'Getting Directions', 180],
  [15, '옷차림', 'Clothing', 190],
  [16, '집 구하기', 'Finding a House', 200],
  [17, '휴가', 'Vacation', 210],
  [18, '취미', 'Hobbies', 220],
  [19, '요리', 'Cooking', 230],
  [20, '인터넷과 스마트폰', 'The Internet and Smartphones', 240],
  [21, '병원', 'Hospital', 250],
  [22, '약국', 'Pharmacy', 260],
  [23, '우체국', 'Post Office', 270],
  [24, '은행', 'Bank', 280],
  [25, '외국인 근로자 지원 기관', 'Foreign Workers Support Center', 290],
  [26, '한국의 주거 문화와 음식 문화', 'Korean Housing Culture and Food Culture', 300],
  [27, '한국의 기념일', 'Korean Commemorative Days', 310],
  [28, '한국의 명절', 'Korean Traditional Holidays', 320],
  [29, '한국의 예절', 'Korean Etiquette', 330],
  [30, '한국의 대중문화', 'Korean Popular Culture', 340],
]

const book2: Array<[number, string, string, number]> = [
  [31, '복장과 근무 태도', 'Attire and Work Attitude', 16],
  [32, '회사 시설 이용', 'Use of Company Facilities', 26],
  [33, '동료와의 관계', 'Colleague Relationships', 36],
  [34, '성희롱 및 성추행 예방', 'Sexual Harassment and Assault Prevention', 46],
  [35, '작업장 관리', 'Workplace Management', 56],
  [36, '출하 관리', 'Shipment Management', 66],
  [37, '기계 가공', 'Machine Processing', 76],
  [38, '기계 조립', 'Machine Assembly', 86],
  [39, '금속 가공', 'Metal Processing', 96],
  [40, '플라스틱 고무 성형', 'Plastic and Rubber Molding', 106],
  [41, '섬유 제조', 'Textile Manufacturing', 116],
  [42, '가구 제작', 'Furniture Making', 126],
  [43, '건축 시공', 'Building Construction', 136],
  [44, '토목 시공', 'Civil Engineering', 146],
  [45, '농작물 재배', 'Crop Cultivation', 156],
  [46, '사육 관리', 'Livestock Management', 166],
  [47, '연안 어업과 양식', 'Coastal Fishing and Aquaculture', 176],
  [48, '선체 건조', 'Ship Hull Construction', 186],
  [49, '광물 자원 개발 생산', 'Mineral Resource Development and Production', 196],
  [50, '산림 자원 조성', 'Forest Resource Management', 206],
  [51, '숙박 서비스', 'Accommodation Services', 216],
  [52, '음식 조리', 'Food Preparation', 226],
  [53, '산업 안전 및 보건 표지', 'Industrial Safety and Health Signs', 236],
  [54, '산업 안전 및 보건 수칙', 'Industrial Safety and Health Regulations', 246],
  [55, '산업 안전 및 위생 장비', 'Industrial Safety and Hygiene Equipment', 256],
  [56, '산업 재해 및 응급 처치', 'Industrial Accidents and First Aid', 266],
  [57, '고용허가제', 'Employment Permit System', 276],
  [58, '근로기준법', 'Labor Standards Act', 286],
  [59, '출입국관리법', 'Immigration Act', 296],
  [60, '근로자 보험', 'Employment Insurance', 306],
]

/** Chapters that have lessons and questions in the app. */
const AVAILABLE = new Set([11, 12])

function toChapter(volume: 1 | 2) {
  return ([number, titleKo, titleEn, page]: [number, string, string, number]): Chapter => ({
    id: `ch${number}`,
    number,
    titleKo,
    titleEn,
    contentStatus: AVAILABLE.has(number) ? 'available' : 'planned',
    textbookRef: { volume, page },
    verification: 'verified',
  })
}

export const chapters: Chapter[] = [...book1.map(toChapter(1)), ...book2.map(toChapter(2))]
