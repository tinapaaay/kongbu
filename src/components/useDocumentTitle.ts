import { useEffect } from 'react'

/** Sets the browser tab title, e.g. "Learn · Kongbu". Screen readers announce it too. */
export function useDocumentTitle(pageTitle: string) {
  useEffect(() => {
    document.title = pageTitle ? `${pageTitle} · Kongbu` : 'Kongbu · EPS-TOPIK Review'
  }, [pageTitle])
}
