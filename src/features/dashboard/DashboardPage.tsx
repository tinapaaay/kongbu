import { Link } from 'react-router'
import { PageHeader } from '../../components/PageHeader'
import { Notice } from '../../components/Notice'

export function DashboardPage() {
  return (
    <>
      <PageHeader title="오늘의 공부" lang="ko" eyebrow="Dashboard" gloss="Today's study" />
      <Notice>
        <p>No study history yet. Your next step and weak concepts will appear here in Milestone 6.</p>
        <p>
          <Link to="/learn/11">Open Chapter 11</Link>
        </p>
      </Notice>
    </>
  )
}
