export default function DineScreen({ onSelect }: { onSelect: (dineIn: boolean) => void }) {
  return (
    <div className="flex flex-col items-center justify-center h-full px-6 py-8">
      <h2 className="text-2xl font-extrabold text-amber-900 mb-8">어디서 드시겠어요?</h2>
      <div className="flex flex-col gap-5 w-full max-w-xs">
        <button
          onClick={() => onSelect(true)}
          className="py-8 bg-white border-3 border-amber-300 rounded-2xl text-center shadow-md active:scale-95 transition-transform"
        >
          <div className="text-4xl mb-2">🍽️</div>
          <div className="text-2xl font-extrabold text-amber-900">매장에서 먹기</div>
        </button>
        <button
          onClick={() => onSelect(false)}
          className="py-8 bg-white border-3 border-amber-300 rounded-2xl text-center shadow-md active:scale-95 transition-transform"
        >
          <div className="text-4xl mb-2">🥤</div>
          <div className="text-2xl font-extrabold text-amber-900">가져가기</div>
        </button>
      </div>
    </div>
  )
}
