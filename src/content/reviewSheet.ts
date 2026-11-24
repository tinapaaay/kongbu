import type { Chapter, Concept, Question } from './schemas'

/*
  Turns one chapter's questions into a sheet a Korean teacher can check (issue #11):
  a printable HTML page and a CSV for spreadsheets. `npm run export:review` writes them to exports/.
  Plain functions with no file access, so tests can call them directly.
*/

export interface ReviewSheetInput {
  chapter: Chapter
  questions: Question[]
  concepts: Concept[]
  /** The date printed on the sheet, e.g. "2026-11-24". */
  generatedOn: string
}

/** What the teacher answers for every question. Shared by the HTML checklist and the CSV columns. */
export const TEACHER_CHECKS = [
  { key: 'korean_ok', label: 'Korean natural & correct?', hint: 'Spelling, spacing, particles' },
  { key: 'one_answer', label: 'One answer only?', hint: 'Wrong choices plausible but clearly wrong' },
  { key: 'explanation_ok', label: 'Explanation clear?', hint: 'Accurate and easy to follow' },
  { key: 'level_ok', label: 'Level fits?', hint: 'EPS-TOPIK Book 1, this chapter' },
] as const

const FORMAT_LABELS: Record<Question['format'], string> = {
  vocabulary: 'Vocabulary',
  'sentence-completion': 'Sentence completion',
  grammar: 'Grammar',
  'dialogue-completion': 'Dialogue completion',
  reading: 'Reading',
}

const DIFFICULTY_LABELS: Record<Question['difficulty'], string> = { 1: '1 (easy)', 2: '2 (medium)', 3: '3 (hard)' }

export function reviewSheetFileName(chapter: Chapter, extension: 'html' | 'csv'): string {
  return `chapter-${String(chapter.number).padStart(2, '0')}-review-sheet.${extension}`
}

function conceptLabel(concepts: Concept[], conceptId: string): { ko: string; en: string } {
  const concept = concepts.find((c) => c.id === conceptId)
  return concept ? { ko: concept.label, en: concept.labelEn } : { ko: conceptId, en: '(unknown concept)' }
}

function correctChoice(q: Question) {
  const choice = q.choices.find((c) => c.id === q.correctChoiceId)
  if (!choice) throw new Error(`${q.id}: correct choice "${q.correctChoiceId}" is not one of its choices`)
  return choice
}

/* ---------- CSV ---------- */

/** One CSV field. Quoted when it holds a comma, quote, or line break; quotes inside are doubled (RFC 4180). */
function csvField(value: string | number): string {
  const text = String(value)
  return /[",\r\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text
}

/**
 * One row per question, with empty columns for the teacher to fill in.
 * Starts with a byte order mark so Excel reads the Korean as UTF-8 instead of garbled characters.
 */
export function reviewSheetCsv({ questions, concepts }: ReviewSheetInput): string {
  const header = [
    'id',
    'concept_ko',
    'concept_en',
    'format',
    'difficulty',
    'prompt',
    'context',
    'choice_a',
    'choice_b',
    'choice_c',
    'choice_d',
    'correct',
    'explanation',
    'review_status',
    ...TEACHER_CHECKS.map((c) => c.key),
    'notes',
    'approve',
  ]
  const rows = questions.map((q) => {
    const concept = conceptLabel(concepts, q.conceptId)
    const answer = correctChoice(q)
    return [
      q.id,
      concept.ko,
      concept.en,
      FORMAT_LABELS[q.format],
      q.difficulty,
      q.prompt,
      q.context?.text ?? '',
      ...q.choices.map((c) => c.text),
      `${answer.id}: ${answer.text}`,
      q.explanation,
      q.reviewStatus,
      ...TEACHER_CHECKS.map(() => ''),
      '',
      '',
    ]
  })
  return '﻿' + [header, ...rows].map((row) => row.map(csvField).join(',')).join('\r\n') + '\r\n'
}

/* ---------- HTML ---------- */

function escapeHtml(text: string): string {
  return text
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')
}

/** Escapes text and keeps its line breaks (dialogues put each speaker on a new line). */
function escapeLines(text: string): string {
  return escapeHtml(text).replaceAll('\n', '<br>')
}

const box = '<span class="box" aria-hidden="true"></span>'

function questionBlock(q: Question, concepts: Concept[]): string {
  const concept = conceptLabel(concepts, q.conceptId)
  const choices = q.choices
    .map((c) => {
      const correct = c.id === q.correctChoiceId
      return `<li class="${correct ? 'choice correct' : 'choice'}"><span class="choice-id">${c.id}</span> <span lang="ko">${escapeHtml(c.text)}</span>${correct ? ' <strong class="answer-tag">✓ Correct answer</strong>' : ''}</li>`
    })
    .join('\n          ')
  const checks = TEACHER_CHECKS.map(
    (c) =>
      `<tr><th scope="row">${escapeHtml(c.label)}<span class="hint">${escapeHtml(c.hint)}</span></th><td>${box} Yes</td><td>${box} No</td></tr>`,
  ).join('\n            ')

  return `
    <section class="question" id="${q.id}">
      <header class="question-head">
        <h2>${q.id}</h2>
        <dl class="meta">
          <div><dt>Concept</dt><dd><span lang="ko">${escapeHtml(concept.ko)}</span> · ${escapeHtml(concept.en)}</dd></div>
          <div><dt>Format</dt><dd>${FORMAT_LABELS[q.format]}</dd></div>
          <div><dt>Difficulty</dt><dd>${DIFFICULTY_LABELS[q.difficulty]}</dd></div>
          <div><dt>Status</dt><dd><code>${q.reviewStatus}</code></dd></div>
        </dl>
      </header>
      <p class="prompt" lang="ko">${escapeHtml(q.prompt)}</p>
      ${q.context ? `<div class="context" lang="ko">${escapeLines(q.context.text)}</div>` : ''}
      <ol class="choices">
          ${choices}
      </ol>
      <div class="explanation"><span class="label">Explanation shown to learners</span>${escapeLines(q.explanation)}</div>
      <div class="teacher">
        <table class="checks">
          <caption>Teacher check</caption>
          <tbody>
            ${checks}
          </tbody>
        </table>
        <div class="notes"><span class="label">Notes / suggested fix</span></div>
        <p class="approve">${box} <strong>Approve</strong> as written &nbsp;&nbsp; ${box} Approve after the fix in my notes &nbsp;&nbsp; ${box} Do not approve</p>
      </div>
    </section>`
}

/**
 * A self-contained A4 page: no scripts, no external files, so it can be emailed or printed as is.
 * Colors and font sizes come from DESIGN.md tokens; fonts fall back to whatever Korean font the device has.
 */
export function reviewSheetHtml(input: ReviewSheetInput): string {
  const { chapter, questions, concepts, generatedOn } = input
  const counts = questions.reduce<Record<string, number>>((acc, q) => {
    acc[q.reviewStatus] = (acc[q.reviewStatus] ?? 0) + 1
    return acc
  }, {})
  const countText = Object.entries(counts)
    .map(([status, n]) => `${n} <code>${status}</code>`)
    .join(', ')

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Chapter ${chapter.number} review sheet</title>
<style>
  /* Values from DESIGN.md. This is a print document, so it keeps to plain text, thin rules and white paper. */
  :root {
    --color-primary: #3F71A8;
    --color-on-surface: #232121;
    --color-secondary: #5E5A55;
    --color-surface: #FEFEFE;
    --color-neutral: #F2EFEB;
    --color-border: #C9C5BF;
    --color-outline: #8C8780;
    --color-success: #19675F;
    --color-success-subtle: #E1EFEA;
    --font-korean: "Apple SD Gothic Neo", "Noto Sans KR", "Malgun Gothic", "Nanum Gothic", sans-serif;
    --rounded-sm: 4px;
    --spacing-xs: 4px;
    --spacing-sm: 8px;
    --spacing-md: 16px;
    --spacing-lg: 24px;
  }
  @page { size: A4; margin: 15mm 14mm; }
  * { box-sizing: border-box; }
  body {
    margin: 0 auto;
    max-width: 182mm;
    padding: var(--spacing-md);
    background: var(--color-surface);
    color: var(--color-on-surface);
    font-family: var(--font-korean);
    font-size: 14px;
    line-height: 1.5;
    /* Korean line breaks between words, not in the middle of one. */
    word-break: keep-all;
    overflow-wrap: break-word;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
  h1 { font-size: 32px; line-height: 1.25; margin: 0 0 var(--spacing-xs); }
  h2 { font-size: 20px; line-height: 1.4; margin: 0; color: var(--color-primary); }
  code { font-family: ui-monospace, Menlo, Consolas, monospace; font-size: 14px; }
  .intro { border-bottom: 2px solid var(--color-primary); padding-bottom: var(--spacing-md); margin-bottom: var(--spacing-lg); }
  .intro p { margin: var(--spacing-sm) 0; }
  .intro ul { margin: var(--spacing-sm) 0; padding-left: var(--spacing-lg); }
  .signature { display: flex; gap: var(--spacing-lg); margin-top: var(--spacing-md); }
  .signature span { flex: 1; border-bottom: 1px solid var(--color-outline); padding-bottom: var(--spacing-lg); }
  .question {
    border: 1px solid var(--color-border);
    border-radius: var(--rounded-sm);
    padding: var(--spacing-md);
    margin-bottom: var(--spacing-md);
    /* Keep each question on one page when printing. */
    break-inside: avoid;
    page-break-inside: avoid;
  }
  .question-head { display: flex; flex-wrap: wrap; align-items: baseline; gap: var(--spacing-sm) var(--spacing-md); margin-bottom: var(--spacing-sm); }
  .meta { display: flex; flex-wrap: wrap; gap: var(--spacing-xs) var(--spacing-md); margin: 0; color: var(--color-secondary); }
  .meta div { display: flex; gap: var(--spacing-xs); }
  .meta dt { font-weight: 700; }
  .meta dt::after { content: ":"; }
  .meta dd { margin: 0; }
  .prompt { font-size: 18px; font-weight: 700; line-height: 1.6; margin: var(--spacing-sm) 0; }
  .context { background: var(--color-neutral); border-radius: var(--rounded-sm); padding: var(--spacing-sm) var(--spacing-md); font-size: 18px; line-height: 1.7; margin-bottom: var(--spacing-sm); }
  .choices { list-style: none; margin: 0 0 var(--spacing-sm); padding: 0; font-size: 16px; line-height: 1.7; }
  .choice { padding: 2px var(--spacing-sm); border-radius: var(--rounded-sm); }
  .choice-id { display: inline-block; width: 1.5em; font-weight: 700; color: var(--color-secondary); }
  /* The answer is marked with words and a tick, not only color, so it survives black-and-white printing. */
  .correct { background: var(--color-success-subtle); }
  .answer-tag { color: var(--color-success); font-size: 14px; }
  .label { display: block; font-weight: 700; color: var(--color-secondary); }
  .explanation { margin-bottom: var(--spacing-sm); }
  .teacher { border-top: 1px dashed var(--color-outline); padding-top: var(--spacing-sm); }
  .checks { width: 100%; border-collapse: collapse; }
  .checks caption { text-align: left; font-weight: 700; margin-bottom: var(--spacing-xs); }
  .checks th, .checks td { border: 1px solid var(--color-border); padding: var(--spacing-xs) var(--spacing-sm); text-align: left; vertical-align: middle; }
  .checks th { font-weight: 700; width: 64%; }
  .checks td { white-space: nowrap; }
  .hint { display: block; font-weight: 400; color: var(--color-secondary); }
  .box { display: inline-block; width: 14px; height: 14px; border: 1.5px solid var(--color-on-surface); vertical-align: -2px; }
  .notes { border: 1px solid var(--color-border); min-height: 72px; padding: var(--spacing-xs) var(--spacing-sm); margin: var(--spacing-sm) 0; }
  .approve { margin: 0; }
</style>
</head>
<body>
  <header class="intro">
    <h1>Chapter ${chapter.number} · <span lang="ko">${escapeHtml(chapter.titleKo)}</span></h1>
    <p><strong>${escapeHtml(chapter.titleEn)}</strong> · Kongbu practice questions for teacher review · ${questions.length} questions (${countText}) · exported ${escapeHtml(generatedOn)}</p>
    <p>These are original EPS-TOPIK-style practice questions written for the Kongbu study app, not textbook or real exam questions. AI has checked them; a teacher has not. For each question, please check:</p>
    <ul>
      <li>The Korean is natural and correct, including spelling, spacing and particles.</li>
      <li>Exactly one choice is right, and the wrong ones are believable but clearly wrong.</li>
      <li>The explanation (in English) is accurate and easy to understand.</li>
      <li>The level fits EPS-TOPIK Book 1, Chapter ${chapter.number}.</li>
      <li>The question does not copy a textbook or real exam question you recognize.</li>
    </ul>
    <p>Choice letters a–d are labels only: the app shuffles the choices, so explanations never say ①–④.</p>
    <div class="signature"><span>Reviewer name:</span><span>Date:</span></div>
  </header>
  <main>${questions.map((q) => questionBlock(q, concepts)).join('\n')}
  </main>
</body>
</html>
`
}
