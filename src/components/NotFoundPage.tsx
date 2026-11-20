import { Link } from 'react-router'
import { PageHeader } from './PageHeader'
import { Notice } from './Notice'

export function NotFoundPage() {
  return (
    <>
      <PageHeader title="Page not found" />
      <Notice>
        <p>This address doesn't match any page in Hangul Lab.</p>
        <p>
          <Link to="/">Go to the dashboard</Link>
        </p>
      </Notice>
    </>
  )
}
