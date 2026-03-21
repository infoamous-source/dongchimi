export default function WelcomeScreen({ onStart }: { onStart: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center px-6 py-8">
      <div className="text-6xl mb-6">☕</div>
      <h1 className="text-3xl font-extrabold text-amber-900 mb-4">동치미 카페</h1>
      <p className="text-xl text-amber-700 mb-10 leading-relaxed">
        화면을 터치해서<br />주문을 시작하세요
      </p>
      <button
        onClick={onStart}
        className="w-full max-w-xs py-6 bg-amber-800 text-white text-2xl font-extrabold rounded-2xl shadow-lg active:scale-95 transition-transform"
      >
        주문하기
      </button>
    </div>
  )
}
