import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import type { LearnerData } from '../domain/learnerData'
import { backupFileName, createBackup } from './backup'
import { LearnerDataContext, type LearnerDataContextValue } from './learnerDataContext'
import { SaveError, type LearnerRepository, type LoadProblem } from './LearnerRepository'

const systemNow = () => new Date()

interface LearnerDataProviderProps {
  repository: LearnerRepository
  /** The current time. Tests pass a fixed clock. */
  now?: () => Date
  children: ReactNode
}

/**
 * Loads saved progress once, then shares it with every screen.
 * All changes go through here, so a failed save always becomes a visible warning.
 */
export function LearnerDataProvider({ repository, now = systemNow, children }: LearnerDataProviderProps) {
  const [data, setData] = useState<LearnerData | null>(null)
  const [loadProblem, setLoadProblem] = useState<LoadProblem | null>(null)
  const [saveProblem, setSaveProblem] = useState<SaveError['kind'] | null>(null)

  useEffect(() => {
    let cancelled = false
    repository.load().then((result) => {
      if (cancelled) return
      setData(result.data)
      setLoadProblem(result.problem)
    })
    return () => {
      cancelled = true
    }
  }, [repository])

  /** Runs one change, keeps the result on screen, and records whether it was saved. */
  const run = useCallback(async (change: () => Promise<LearnerData>): Promise<LearnerData> => {
    try {
      const next = await change()
      setData(next)
      setSaveProblem(null)
      return next
    } catch (error) {
      if (error instanceof SaveError) {
        setData(error.data)
        setSaveProblem(error.kind)
        return error.data
      }
      throw error
    }
  }, [])

  // The actions never change, so screens can safely list them in effect dependencies.
  const actions = useMemo(
    () => ({
      recordChapterVisit: async (chapterId: string) => {
        await run(() => repository.recordChapterVisit(chapterId, now()))
      },
      saveActiveSession: async (session: Parameters<LearnerRepository['saveActiveSession']>[0]) => {
        await run(() => repository.saveActiveSession(session))
      },
      submitSession: async (...args: Parameters<LearnerRepository['submitSession']>) => {
        await run(() => repository.submitSession(...args))
      },
      exportBackup: async () => {
        const at = now()
        const updated = await run(() => repository.markBackedUp(at))
        return { fileName: backupFileName(at), text: createBackup(updated, at) }
      },
      replaceAll: async (next: LearnerData) => {
        await run(() => repository.replaceAll(next))
        setLoadProblem(null)
      },
    }),
    [repository, now, run],
  )

  const value = useMemo<LearnerDataContextValue | null>(
    () => (data ? { data, loadProblem, saveProblem, ...actions } : null),
    [data, loadProblem, saveProblem, actions],
  )

  if (!value) {
    return (
      <p role="status" style={{ padding: 'var(--spacing-lg)' }}>
        Loading your progress…
      </p>
    )
  }

  return <LearnerDataContext.Provider value={value}>{children}</LearnerDataContext.Provider>
}
