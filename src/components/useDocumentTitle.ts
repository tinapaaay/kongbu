import { useEffect } from 'react'

/** Sets the browser tab title, e.g. "Learn · Gongbu". Screen readers announce it too. */
export function useDocumentTitle(pageTitle: string) {
  useEffect(() => {
    document.title = pageTitle ? `${pageTitle} · Gongbu` : 'Gongbu · EPS-TOPIK Review'
  }, [pageTitle])
}
