import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { chapters, getQuestionsForChapter, studyAnchorId } from '../../content/allContent'
import { MemoryStorage } from '../../data/storage'
import { makeSession } from '../../domain/testFixtures'
import { renderApp } from '../../test/renderApp'
import { readSaved, storageWith } from '../../test/seed'

async function renderChapter(path = '/learn/11', storage = new MemoryStorage()) {
  renderApp(path, { storage })
  await screen.findByRole('heading', { level: 1 })
  return storage
}

describe('Chapter 11 page', () => {
  it('opens like the textbook: title, book page, topics, and objectives', async () => {
    await renderChapter()
    expect(screen.getByRole('heading', { level: 1, name: '집안일' })).toBeInTheDocument()
    expect(screen.getByText('Household Chores')).toBeInTheDocument()
    expect(screen.getByText(/Book 1 · p.150/)).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /학습 목표/ })).toBeInTheDocument()
    expect(screen.getByText('쓰레기를 어떻게 나눠서 버리는지 묻고 설명할 수 있다.')).toBeInTheDocument()
  })

  it('shows every lesson section, in book order', async () => {
    await renderChapter()
    const sectionHeadings = screen.getAllByRole('heading', { level: 2 }).map((h) => h.textContent)
    expect(sectionHeadings).toEqual([
      '학습 목표LEARNING OBJECTIVES',
      '어휘 Vocabulary',
      '문법 Grammar1',
      '문법 Grammar2',
      '문법 Grammar3',
      '문화와 정보 Culture & Information',
      '연습 시험 Practice exam',
    ])
  })

  it('lists vocabulary with English glosses', async () => {
    await renderChapter()
    expect(screen.getByText('빨래를 걷다')).toBeInTheDocument()
    expect(screen.getByText('to bring dry clothes back in')).toBeInTheDocument()
  })

  it('highlights the target grammar inside examples', async () => {
    await renderChapter()
    const highlight = screen.getByText('버릴게요', { selector: 'strong' })
    expect(highlight.closest('li')).toHaveTextContent('쓰레기는 제가 버릴게요.')
  })

  it('opens at the section a "Study this" link points to', async () => {
    renderApp('/learn/11#study-grammar-s-irregular')
    await screen.findByRole('heading', { level: 1 })
    const section = document.getElementById('study-grammar-s-irregular')!
    expect(section).toHaveFocus()
    expect(section).toHaveTextContent("'ㅅ' 불규칙")
  })

  it('has a landing spot for every concept with questions', async () => {
    renderApp('/learn/11')
    await screen.findByRole('heading', { level: 1 })
    for (const conceptId of new Set(getQuestionsForChapter('ch11').map((q) => q.conceptId))) {
      expect(document.getElementById(studyAnchorId(conceptId)), conceptId).not.toBeNull()
    }
  })

  it('marks the chapter as visited', async () => {
    const storage = await renderChapter()
    await vi.waitFor(() => expect(readSaved(storage).chapterVisits.ch11).toBeDefined())
    expect(await screen.findByText('Visited')).toBeInTheDocument()
  })

  it('says the questions are original practice, not real exam questions', async () => {
    await renderChapter()
    expect(screen.getByText(/not real exam questions/)).toBeInTheDocument()
  })
})

describe('Starting the practice exam', () => {
  it('offers the practice exam at the top of the chapter, not only at the end', async () => {
    await renderChapter()
    const header = screen.getByRole('heading', { level: 1 }).closest('header')!
    expect(within(header).getByRole('button', { name: 'Start practice exam' })).toBeInTheDocument()
    expect(screen.getAllByRole('button', { name: 'Start practice exam' })).toHaveLength(2)
  })

  it('saves a new 10-question quiz and opens it', async () => {
    const storage = await renderChapter()
    await userEvent.click(screen.getAllByRole('button', { name: 'Start practice exam' })[0])

    expect(await screen.findByRole('heading', { level: 1, name: 'Practice exam' })).toBeInTheDocument()
    const active = readSaved(storage).activeSession
    expect(active?.questionIds).toHaveLength(10)
    expect(active?.chapterId).toBe('ch11')
  })

  it('offers to resume instead of starting over', async () => {
    const storage = await renderChapter()
    await userEvent.click(screen.getAllByRole('button', { name: 'Start practice exam' })[0])
    await screen.findByRole('heading', { level: 1, name: 'Practice exam' })
    const firstQuizId = readSaved(storage).activeSession?.id

    // Come back to the chapter in a new visit.
    renderApp('/learn/11', { storage })
    const [resume] = await screen.findAllByRole('button', { name: /Resume practice exam \(0\/10 answered\)/ })
    await userEvent.click(resume)
    expect(readSaved(storage).activeSession?.id).toBe(firstQuizId)
  })

  it('shows the last score after an exam', async () => {
    await renderChapter('/learn/11', storageWith({ sessions: [makeSession({ correctCount: 7, totalCount: 10 })] }))
    const card = screen.getByRole('region', { name: /Practice exam/ })
    expect(within(card).getByText('7/10')).toBeInTheDocument()
    expect(within(card).getByRole('button', { name: 'Take another practice exam' })).toBeInTheDocument()
  })
})

describe('Chapters without content', () => {
  it('shows the real title and says content is coming later', async () => {
    const empty = chapters.find((c) => c.contentStatus === 'planned')!
    await renderChapter(`/learn/${empty.number}`)
    expect(screen.getByRole('heading', { level: 1, name: empty.titleKo })).toBeInTheDocument()
    expect(screen.getByText(/coming later/)).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /practice exam/ })).not.toBeInTheDocument()
  })
})
