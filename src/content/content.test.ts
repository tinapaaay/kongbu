import { describe, expect, it } from 'vitest'
import {
  chapters,
  concepts,
  getChapterByNumber,
  getConcept,
  getQuestionsForChapter,
  lessons,
  questions,
  type Question,
} from './index'
import { validateContent, type ContentBundle } from './validate'

const real: ContentBundle = { chapters, concepts, questions, lessons }

/** A deep copy, so a test can break one thing without touching the real content. */
function copy(): ContentBundle {
  return structuredClone(real)
}

function firstQuestion(bundle: ContentBundle): Question {
  return bundle.questions[0]
}

describe('real content', () => {
  it('passes every validation rule', () => {
    expect(validateContent(real)).toEqual([])
  })

  it('has all 60 chapters across both books', () => {
    expect(chapters).toHaveLength(60)
    expect(chapters.filter((c) => c.textbookRef.volume === 1)).toHaveLength(30)
    expect(getChapterByNumber(11)?.titleKo).toBe('집안일')
    expect(getChapterByNumber(60)?.titleEn).toBe('Employment Insurance')
  })

  it('makes only Chapter 11 available for now', () => {
    expect(chapters.filter((c) => c.contentStatus === 'available').map((c) => c.number)).toEqual([11])
  })

  it('has at least 20 Chapter 11 questions, so a 10-question quiz can vary', () => {
    expect(getQuestionsForChapter('ch11').length).toBeGreaterThanOrEqual(20)
  })

  it('tests every Chapter 11 concept at least once', () => {
    const tested = new Set(getQuestionsForChapter('ch11').map((q) => q.conceptId))
    for (const concept of concepts.filter((c) => c.chapterId === 'ch11')) {
      expect(tested, `${concept.id} has no questions`).toContain(concept.id)
    }
  })

  it('spreads correct answers across all four positions', () => {
    const counts = { a: 0, b: 0, c: 0, d: 0 }
    for (const question of questions) counts[question.correctChoiceId]++
    for (const count of Object.values(counts)) expect(count).toBeGreaterThanOrEqual(questions.length / 6)
  })

  it('marks every question as original and keeps unreviewed ones as drafts', () => {
    for (const question of questions) {
      expect(question.source).toBe('original')
      expect(['draft', 'approved']).toContain(question.reviewStatus)
    }
  })

  it('filters questions by chapter without mixing in others', () => {
    expect(getQuestionsForChapter('ch12')).toEqual([])
    expect(getQuestionsForChapter('ch11').every((q) => q.chapterId === 'ch11')).toBe(true)
  })

  it('finds concepts by id', () => {
    expect(getConcept('grammar.eul-geyo')?.label).toBe('-(으)ㄹ게요')
    expect(getConcept('grammar.not-real')).toBeUndefined()
  })
})

describe('validation catches broken content', () => {
  it('rejects a question with three choices', () => {
    const bundle = copy()
    firstQuestion(bundle).choices.pop()
    expect(validateContent(bundle).join('\n')).toMatch(/exactly four choices/)
  })

  it('rejects an answer key that is not a choice', () => {
    const bundle = copy()
    const question = firstQuestion(bundle)
    question.choices[3] = { ...question.choices[3], id: 'a' }
    expect(validateContent(bundle).join('\n')).toMatch(/choice ids a, b, c, d once each/)
  })

  it('rejects two identical choices', () => {
    const bundle = copy()
    const question = firstQuestion(bundle)
    question.choices[1].text = question.choices[0].text
    expect(validateContent(bundle).join('\n')).toMatch(/two identical choices/)
  })

  it('rejects explanations that mention ①–④', () => {
    const bundle = copy()
    firstQuestion(bundle).explanation = 'The answer is ③ because a broom is used for cleaning.'
    expect(validateContent(bundle).join('\n')).toMatch(/mentions ①–④/)
  })

  it('rejects unknown concepts', () => {
    const bundle = copy()
    firstQuestion(bundle).conceptId = 'grammar.not-real'
    expect(validateContent(bundle).join('\n')).toMatch(/unknown concept "grammar.not-real"/)
  })

  it('rejects duplicate question ids', () => {
    const bundle = copy()
    bundle.questions[1].id = bundle.questions[0].id
    expect(validateContent(bundle).join('\n')).toMatch(/duplicate question id/)
  })

  it('rejects questions for chapters that are not available', () => {
    const bundle = copy()
    const question = firstQuestion(bundle)
    question.chapterId = 'ch12'
    question.id = 'ch12-q001'
    expect(validateContent(bundle).join('\n')).toMatch(/chapter 12, which is not available/)
  })

  it('rejects an available chapter with too few questions', () => {
    const bundle = copy()
    bundle.questions = bundle.questions.slice(0, 5)
    expect(validateContent(bundle).join('\n')).toMatch(/only 5 questions/)
  })

  it('rejects a missing chapter', () => {
    const bundle = copy()
    bundle.chapters.splice(10, 1)
    expect(validateContent(bundle).join('\n')).toMatch(/expected 60 chapters/)
  })

  it('rejects a highlight that is not in its example sentence', () => {
    const bundle = copy()
    bundle.lessons[0].grammar[0].examples[0].highlight = '없는 말'
    expect(validateContent(bundle).join('\n')).toMatch(/highlight "없는 말"/)
  })
})
