import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react'
import type { MoodId } from '@/data/moods'

interface MoodState {
  moodId: MoodId | null
  hasMoodToday: boolean
  setMood: (id: MoodId) => void
  clearMood: () => void
}

const STORAGE_KEY = 'dongchimi_mood'

function getTodayString() {
  return new Date().toISOString().split('T')[0]
}

function loadMood(): MoodId | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const { moodId, date } = JSON.parse(raw)
    if (date === getTodayString()) return moodId as MoodId
    return null
  } catch {
    return null
  }
}

function saveMood(moodId: MoodId) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ moodId, date: getTodayString() }))
}

const MoodContext = createContext<MoodState | null>(null)

export function MoodProvider({ children }: { children: ReactNode }) {
  const [moodId, setMoodId] = useState<MoodId | null>(loadMood)

  useEffect(() => {
    // 날짜 바뀌면 리셋
    const stored = loadMood()
    if (stored !== moodId) setMoodId(stored)
  }, [])

  const setMood = useCallback((id: MoodId) => {
    saveMood(id)
    setMoodId(id)
  }, [])

  const clearMood = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY)
    setMoodId(null)
  }, [])

  return (
    <MoodContext.Provider value={{ moodId, hasMoodToday: moodId !== null, setMood, clearMood }}>
      {children}
    </MoodContext.Provider>
  )
}

export function useMood() {
  const ctx = useContext(MoodContext)
  if (!ctx) throw new Error('useMood must be used within MoodProvider')
  return ctx
}
