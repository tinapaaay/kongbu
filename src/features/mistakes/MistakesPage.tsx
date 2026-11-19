import { PageHeader } from '../../components/PageHeader'
import { Notice } from '../../components/Notice'

export function MistakesPage() {
  return (
    <>
      <PageHeader title="Mistakes" eyebrow="Practice" />
      <Notice>
        <p>No mistakes yet. Wrong answers from your quizzes will appear here in Milestone 9.</p>
      </Notice>
    </>
  )
}
