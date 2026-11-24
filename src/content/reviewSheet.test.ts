import { describe, expect, it } from 'vitest'
import { concepts, getChapter, getQuestionsForChapter, type Chapter, type Question } from './allContent'
import { reviewSheetCsv, reviewSheetFileName, reviewSheetHtml, TEACHER_CHECKS, type ReviewSheetInput } from './reviewSheet'

const chapter = getChapter('ch11') as Chapter
const questions = getQuestionsForChapter('ch11')
const input: ReviewSheetInput = { chapter, questions, concepts, generatedOn: '2026-11-24' }

/** Splits CSV text into rows of fields, following the quoting rules the exporter uses. */
function parseCsv(text: string): string[][] {
  const rows: string[][] = [[]]
  let field = ''
  let quoted = false
  const endField = () => {
    rows.at(-1)!.push(field)
    field = ''
  }
  for (let i = 0; i < text.length; i++) {
    const ch = text[i]
    if (quoted && ch === '"' && text[i + 1] === '"') {
      field += '"'
      i++
    } else if (ch === '"') {
      quoted = !quoted
    } else if (!quoted && ch === ',') {
      endField()
    } else if (!quoted && ch === '\r' && text[i + 1] === '\n') {
      endField()
      rows.push([])
      i++
    } else {
      field += ch
    }
  }
  rows.pop() // the empty row after the final line break
  return rows
}

describe('teacher review sheet', () => {
  it('names files by zero-padded chapter number', () => {
    expect(reviewSheetFileName(chapter, 'html')).toBe('chapter-11-review-sheet.html')
    expect(reviewSheetFileName({ ...chapter, number: 1 }, 'csv')).toBe('chapter-01-review-sheet.csv')
  })

  it('HTML has one block per question with its concept, answer, status and the teacher checklist', () => {
    const html = reviewSheetHtml(input)
    expect(html.match(/<section class="question"/g)).toHaveLength(questions.length)
    expect(html).toContain('size: A4')
    expect(html).toContain('break-inside: avoid')
    // Self-contained: nothing to download, nothing to run.
    expect(html).not.toMatch(/<script|<link|src="http/)

    const first = html.slice(html.indexOf('id="ch11-q001"'), html.indexOf('id="ch11-q002"'))
    expect(first).toContain('청소 어휘')
    expect(first).toContain('Cleaning words')
    expect(first).toMatch(/class="choice correct"><span class="choice-id">c<\/span> <span lang="ko">빗자루<\/span> <strong class="answer-tag">✓ Correct answer/)
    expect(first.match(/✓ Correct answer/g)).toHaveLength(1)
    expect(first).toContain('<code>ai-reviewed</code>')
    for (const check of TEACHER_CHECKS) expect(first).toContain(check.label.replace('&', '&amp;'))
    expect(first).toContain('Notes')
    expect(first).toContain('Approve')
  })

  it('HTML escapes question text instead of running it as markup', () => {
    const base = questions[0]
    const tricky: Question = { ...base, prompt: '<b>A & B</b>', context: { kind: 'dialogue', text: '가: 안녕?\n나: "네"' } }
    const html = reviewSheetHtml({ ...input, questions: [tricky] })
    expect(html).toContain('&lt;b&gt;A &amp; B&lt;/b&gt;')
    expect(html).toContain('가: 안녕?<br>나: &quot;네&quot;')
    expect(html).not.toContain('<b>A & B</b>')
  })

  it('CSV has a header, one row per question, the answer key, and empty teacher columns', () => {
    const csv = reviewSheetCsv(input)
    expect(csv.startsWith('﻿')).toBe(true)
    const [header, ...rows] = parseCsv(csv.slice(1))
    expect(header).toEqual(expect.arrayContaining(['id', 'concept_ko', 'correct', 'explanation', 'review_status', 'notes', 'approve']))
    expect(rows).toHaveLength(questions.length)
    for (const row of rows) expect(row).toHaveLength(header.length)

    const column = (name: string) => header.indexOf(name)
    rows.forEach((row, i) => {
      const q = questions[i]
      expect(row[column('id')]).toBe(q.id)
      expect(row[column('explanation')]).toBe(q.explanation)
      expect(row[column('correct')]).toBe(`${q.correctChoiceId}: ${q.choices.find((c) => c.id === q.correctChoiceId)?.text}`)
      expect(row[column('review_status')]).toBe(q.reviewStatus)
      for (const key of [...TEACHER_CHECKS.map((c) => c.key), 'notes', 'approve']) expect(row[column(key)]).toBe('')
    })
  })

  it('CSV keeps commas, quotes and line breaks inside one field', () => {
    const tricky: Question = { ...questions[0], explanation: 'Say "yes", then\nleave — it is fine, really.' }
    const [, row] = parseCsv(reviewSheetCsv({ ...input, questions: [tricky] }).slice(1))
    expect(row).toContain('Say "yes", then\nleave — it is fine, really.')
  })
})
