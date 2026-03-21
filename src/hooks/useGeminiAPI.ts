import { useState, useCallback } from 'react'

interface UseGeminiAPIResult<T> {
  data: T | null
  loading: boolean
  error: string | null
  execute: (...args: unknown[]) => Promise<T | null>
  reset: () => void
}

export function useGeminiAPI<T>(
  apiFn: (...args: unknown[]) => Promise<T>
): UseGeminiAPIResult<T> {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const execute = useCallback(
    async (...args: unknown[]): Promise<T | null> => {
      setLoading(true)
      setError(null)
      try {
        const result = await apiFn(...args)
        setData(result)
        return result
      } catch (err) {
        const message = err instanceof Error ? err.message : 'AI 요청 중 오류가 발생했습니다'
        setError(message)
        return null
      } finally {
        setLoading(false)
      }
    },
    [apiFn]
  )

  const reset = useCallback(() => {
    setData(null)
    setLoading(false)
    setError(null)
  }, [])

  return { data, loading, error, execute, reset }
}
