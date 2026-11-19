import { PageHeader } from '../../components/PageHeader'
import { Notice } from '../../components/Notice'

export function SettingsPage() {
  return (
    <>
      <PageHeader title="Settings" />
      <Notice>
        <p>Backup download and restore arrive in Milestone 5.</p>
      </Notice>
    </>
  )
}
