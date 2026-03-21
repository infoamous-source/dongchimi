import { GoogleGenerativeAI } from '@google/generative-ai'

const STORAGE_KEY = 'dongchimi_gemini_key'

export function getStoredApiKey(): string | null {
  try {
    const encoded = localStorage.getItem(STORAGE_KEY)
    if (!encoded) return null
    return atob(encoded)
  } catch {
    return null
  }
}

export function setStoredApiKey(key: string): void {
  localStorage.setItem(STORAGE_KEY, btoa(key))
}

export function clearStoredApiKey(): void {
  localStorage.removeItem(STORAGE_KEY)
}

export function isGeminiEnabled(): boolean {
  return !!getStoredApiKey()
}

export function getGeminiClient(): GoogleGenerativeAI | null {
  const key = getStoredApiKey()
  if (!key) return null
  return new GoogleGenerativeAI(key)
}

export function getGeminiModel(modelName = 'gemini-2.5-flash') {
  const client = getGeminiClient()
  if (!client) return null
  return client.getGenerativeModel({ model: modelName })
}

export async function generateText(prompt: string): Promise<string | null> {
  try {
    const model = getGeminiModel()
    if (!model) return null
    const result = await model.generateContent(prompt)
    return result.response.text()
  } catch (error) {
    console.error('[동치미] Gemini 오류:', error)
    return null
  }
}
