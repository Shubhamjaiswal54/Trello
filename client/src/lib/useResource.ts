import { useCallback, useEffect, useState } from 'react'
import { api, getErrorMessage } from './api'

interface State<T> {
  url: string | null
  data: T | null
  error: string | null
}

// Fetches `url` and refetches whenever it changes. `loading` is derived from
// whether the stored result belongs to the current url, so stale data from a
// previous route is never shown.
export function useResource<T>(url: string | null, errorFallback = 'Could not load data.') {
  const [state, setState] = useState<State<T>>({ url: null, data: null, error: null })
  const [version, setVersion] = useState(0)

  useEffect(() => {
    if (!url) return
    let cancelled = false
    api
      .get<T>(url)
      .then((res) => {
        if (!cancelled) setState({ url, data: res.data, error: null })
      })
      .catch((err) => {
        if (!cancelled) setState({ url, data: null, error: getErrorMessage(err, errorFallback) })
      })
    return () => {
      cancelled = true
    }
  }, [url, version, errorFallback])

  const isCurrent = state.url === url
  const setData = useCallback((updater: (prev: T) => T) => {
    setState((s) => (s.data ? { ...s, data: updater(s.data) } : s))
  }, [])
  const reload = useCallback(() => setVersion((v) => v + 1), [])

  return {
    data: isCurrent ? state.data : null,
    error: isCurrent ? state.error : null,
    loading: !isCurrent,
    setData,
    reload,
  }
}
