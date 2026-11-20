import buttons from '../components/buttons.module.css'
import { getConcept } from '../content'
import { useStartConceptReview } from './useStartPractice'

interface PracticeConceptButtonProps {
  conceptId: string
  /** Visible text. The concept's name is always added for screen readers, so repeated buttons stay distinct. */
  label?: string
  variant?: 'primary' | 'secondary'
}

/**
 * Starts a short review quiz on one concept. Renders nothing while another quiz is unfinished;
 * the screen shows one notice about that instead of a disabled button on every row.
 */
export function PracticeConceptButton({ conceptId, label = 'Practice', variant = 'secondary' }: PracticeConceptButtonProps) {
  const review = useStartConceptReview()
  if (review.hasUnfinishedQuiz) return null
  const name = getConcept(conceptId)?.labelEn ?? conceptId
  return (
    <>
      <button
      type="button"
      className={buttons[variant]}
      disabled={review.starting !== null}
      onClick={() => void review.start(conceptId)}
      // Starts with the visible text, so voice control ("click Practice") still works.
      aria-label={label.includes(name) ? undefined : `${label}: ${name}`}
    >
      {label}
      </button>
      {review.problem && <span role="alert">{review.problem}</span>}
    </>
  )
}
