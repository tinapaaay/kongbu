import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { createBackup } from '../../data/backup'
import { STORAGE_KEY } from '../../data/localStorageRepository'
import { MemoryStorage } from '../../data/storage'
import { emptyLearnerData } from '../../domain/learnerData'
import { makeAttempt, makeSession } from '../../domain/testFixtures'
import { renderApp } from '../../test/renderApp'
import { SettingsPage } from './SettingsPage'

const NOW = new Date('2026-11-20T09:00:00.000Z')

async function renderSettings(storage = new MemoryStorage()) {
  const download = vi.fn()
  renderApp('/settings', { storage, now: () => NOW, children: <SettingsPage download={download} now={() => NOW} /> })
  await screen.findByRole('heading', { level: 1, name: 'Settings' })
  return { download, storage }
}

function savedData(storage: MemoryStorage) {
  return JSON.parse(storage.getItem(STORAGE_KEY) ?? 'null')
}

function backupFile(text: string, name = 'gongbu-backup-2026-11-19.json') {
  return new File([text], name, { type: 'application/json' })
}

const backupWithProgress = createBackup(
  {
    ...emptyLearnerData(),
    sessions: [makeSession({ correctCount: 7, totalCount: 10 })],
    attempts: [makeAttempt({ questionId: 'ch11-q001', isCorrect: true }), makeAttempt({ questionId: 'ch11-q002', isCorrect: false })],
  },
  new Date('2026-11-19T09:00:00.000Z'),
)

describe('Settings: backup', () => {
  it('explains that progress lives in this browser only', async () => {
    await renderSettings()
    expect(screen.getByText(/saved in this browser only/)).toBeInTheDocument()
    expect(screen.getByText('Last backup: never')).toBeInTheDocument()
  })

  it('says plainly when no backup was ever made, or how old the last one is', async () => {
    const progress = { sessions: [makeSession({ correctCount: 1, totalCount: 1 })], attempts: [makeAttempt({ questionId: 'ch11-q001', isCorrect: true })] }
    const never = new MemoryStorage()
    never.setItem(STORAGE_KEY, JSON.stringify({ ...emptyLearnerData(), ...progress }))
    await renderSettings(never)
    expect(screen.getByText("You haven't downloaded a backup yet. Download one to keep your progress safe.")).toBeInTheDocument()
    document.body.innerHTML = ''

    const old = new MemoryStorage()
    old.setItem(STORAGE_KEY, JSON.stringify({ ...emptyLearnerData(), ...progress, lastBackupAt: '2026-11-10T09:00:00.000Z' }))
    await renderSettings(old)
    expect(screen.getByText('Your last backup was 10 days ago. Download a new one.')).toBeInTheDocument()
  })

  it('downloads a valid backup file and records the backup time', async () => {
    const { download, storage } = await renderSettings()
    await userEvent.click(screen.getByRole('button', { name: 'Download backup' }))

    expect(download).toHaveBeenCalledTimes(1)
    const [fileName, text] = download.mock.calls[0]
    expect(fileName).toMatch(/^gongbu-backup-\d{4}-\d{2}-\d{2}\.json$/)
    expect(JSON.parse(text)).toMatchObject({ app: 'gongbu', kind: 'backup' })
    expect(savedData(storage).lastBackupAt).toBe(NOW.toISOString())
    expect(await screen.findByRole('status')).toHaveTextContent('Backup downloaded')
  })
})

describe('Settings: restore', () => {
  it('shows what a backup contains and asks before replacing anything', async () => {
    const { storage } = await renderSettings()
    await userEvent.upload(screen.getByLabelText('Backup file'), backupFile(backupWithProgress))

    expect(await screen.findByText('Replace progress in this browser?')).toBeInTheDocument()
    expect(screen.getByText(/contains 1 quiz, 2 answers/)).toBeInTheDocument()
    expect(storage.getItem(STORAGE_KEY)).toBeNull()
  })

  it('replaces progress after confirmation', async () => {
    const { storage } = await renderSettings()
    await userEvent.upload(screen.getByLabelText('Backup file'), backupFile(backupWithProgress))
    await userEvent.click(await screen.findByRole('button', { name: 'Replace progress' }))

    expect(await screen.findByRole('status')).toHaveTextContent('Progress restored: 1 quiz and 2 answers')
    expect(savedData(storage).attempts).toHaveLength(2)
  })

  it('changes nothing when cancelled', async () => {
    const { storage } = await renderSettings()
    await userEvent.upload(screen.getByLabelText('Backup file'), backupFile(backupWithProgress))
    await userEvent.click(await screen.findByRole('button', { name: 'Cancel' }))

    expect(screen.getByLabelText('Backup file')).toBeInTheDocument()
    expect(storage.getItem(STORAGE_KEY)).toBeNull()
  })

  it('rejects a file that is not a backup and leaves progress untouched', async () => {
    const storage = new MemoryStorage()
    const existing = JSON.stringify({ ...emptyLearnerData(), attempts: [makeAttempt({ questionId: 'ch11-q005', isCorrect: true })] })
    storage.setItem(STORAGE_KEY, existing)
    await renderSettings(storage)

    await userEvent.upload(screen.getByLabelText('Backup file'), backupFile('{"name":"shopping list"}', 'list.json'))

    expect(await screen.findByRole('alert')).toHaveTextContent(/isn't a Gongbu backup.*not changed/)
    expect(screen.getByLabelText('Backup file')).toHaveAttribute('aria-invalid', 'true')
    expect(storage.getItem(STORAGE_KEY)).toBe(existing)
  })
})

describe('storage warnings', () => {
  it('warns on every page when saved progress is damaged', async () => {
    const storage = new MemoryStorage()
    storage.setItem(STORAGE_KEY, 'not json at all')
    renderApp('/', { storage })
    expect(await screen.findByRole('alert')).toHaveTextContent(/couldn't be read.*copy of it was kept/)
    expect(screen.getByRole('link', { name: 'Restore from a backup' })).toHaveAttribute('href', '/settings')
  })

  it('warns when the browser blocks storage', async () => {
    renderApp('/', { storage: null })
    expect(await screen.findByRole('alert')).toHaveTextContent(/blocking saved progress/)
  })

  it('shows no warning normally', async () => {
    renderApp('/')
    await screen.findByRole('heading', { level: 1 })
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })
})

describe('chapter visits', () => {
  it('records a visit when a chapter page opens, and it survives a reload', async () => {
    const storage = new MemoryStorage()
    const first = renderApp('/learn/11', { storage })
    await screen.findByRole('heading', { level: 1, name: '집안일' })
    await vi.waitFor(() => expect(savedData(storage)?.chapterVisits?.ch11).toBeDefined())
    first.unmount()

    const { repository } = renderApp('/', { storage })
    expect((await repository.load()).data.chapterVisits.ch11).toBeDefined()
  })
})
