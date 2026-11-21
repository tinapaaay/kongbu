import { createContext, useContext } from 'react'
import type { ActiveSession, Attempt, CompletedSession, LearnerData } from '../domain/learnerData'
import type { LoadProblem, SaveError } from './LearnerRepository'

export interface LearnerDataContextValue {
  data: LearnerData
  /** Set when saved progress couldn't be loaded normally. */
  loadProblem: LoadProblem | null
  /** Set when the latest change couldn't be saved. Cleared by the next successful save. */
  saveProblem: SaveError['kind'] | null
  recordChapterVisit(chapterId: string): Promise<void>
  saveActiveSession(session: ActiveSession | null): Promise<void>
  submitSession(session: CompletedSession, attempts: Attempt[]): Promise<void>
  /** Marks the backup time and returns the backup file's name and contents. */
  exportBackup(): Promise<{ fileName: string; text: string }>
  mergeRecords(data: LearnerData): Promise<boolean>
}

export const LearnerDataContext = createContext<LearnerDataContextValue | null>(null)

/** Read learner data and its actions from any screen inside <LearnerDataProvider>. */
export function useLearnerData(): LearnerDataContextValue {
  const value = useContext(LearnerDataContext)
  if (!value) throw new Error('useLearnerData must be used inside <LearnerDataProvider>')
  return value
}
