import { useEffect } from 'react'

/** Sets the browser tab title, e.g. "Learn · Hangul Lab". Screen readers announce it too. */
export function useDocumentTitle(pageTitle: string) {
  useEffect(() => {
    document.title = pageTitle ? `${pageTitle} · Hangul Lab` : 'Hangul Lab'
  }, [pageTitle])
}
