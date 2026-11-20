import { getConcept } from '../content'
import type { SessionType } from '../domain/learnerData'

/** "Practice exam", or "Review: <concept>" for a short quiz on one concept. */
export function quizKindLabel(session: { type: SessionType; conceptId?: string }): string {
  if (session.type === 'concept-review') {
    const concept = session.conceptId ? getConcept(session.conceptId) : undefined
    return concept ? `Review: ${concept.labelEn}` : 'Concept review'
  }
  return 'Practice exam'
}
