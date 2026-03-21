import { useEffect } from 'react'

export default function ProcessingScreen({ onDone }: { onDone: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onDone, 2000)
    return () => clearTimeout(timer)
  }, [onDone])

  return (
    <div className="flex flex-col items-center justify-center h-full px-6">
      <div className="w-16 h-16 border-4 border-amber-200 border-t-amber-800 rounded-full animate-spin mb-6" />
      <h2 className="text-2xl font-extrabold text-amber-900 mb-2">결제하고 있어요</h2>
      <p className="text-xl text-amber-700">잠시만 기다려주세요...</p>
    </div>
  )
}
