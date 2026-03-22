import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getPracticeById } from '@/data/practices'
import { ArrowLeft, ArrowRight, Check, RotateCcw } from 'lucide-react'
import confetti from 'canvas-confetti'

export default function PracticeDetailPage() {
  const { practiceId } = useParams<{ practiceId: string }>()
  const practice = getPracticeById(practiceId || '')

  const [currentStep, setCurrentStep] = useState(0)
  const [selectedOption, setSelectedOption] = useState<number | null>(null)
  const [showFeedback, setShowFeedback] = useState(false)
  const [isComplete, setIsComplete] = useState(false)

  if (!practice) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 text-center">
        <p className="text-xl text-dc-text-secondary">연습을 찾을 수 없어요</p>
        <Link to="/senior/learn/practice" className="btn-primary mt-6 inline-flex">뒤로가기</Link>
      </div>
    )
  }

  const step = practice.steps[currentStep]
  const isLastStep = currentStep === practice.steps.length - 1

  const handleSelectOption = (index: number) => {
    setSelectedOption(index)
    setShowFeedback(true)
  }

  const handleNext = () => {
    if (isLastStep) {
      setIsComplete(true)
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } })
      return
    }
    setCurrentStep(prev => prev + 1)
    setSelectedOption(null)
    setShowFeedback(false)
  }

  const handleRestart = () => {
    setCurrentStep(0)
    setSelectedOption(null)
    setShowFeedback(false)
    setIsComplete(false)
  }

  if (isComplete) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 text-center animate-fade-in">
        <div className="text-6xl mb-6">🎉</div>
        <h1 className="text-3xl font-extrabold text-dc-green mb-4">잘 하셨어요!</h1>
        <p className="text-xl text-dc-text-secondary mb-8">
          "{practice.title}" 연습을 완료했습니다
        </p>
        <div className="flex flex-col gap-4 max-w-sm mx-auto">
          <button onClick={handleRestart} className="btn-secondary w-full text-xl">
            <RotateCcw size={24} />
            다시 해보기
          </button>
          <Link to="/senior/learn/practice" className="btn-primary w-full text-xl">
            다른 연습 해보기
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 animate-fade-in">
      <Link to="/senior/learn/practice" className="inline-flex items-center gap-2 text-dc-text-secondary mb-5 text-lg font-bold">
        <ArrowLeft size={24} />
        <span>뒤로가기</span>
      </Link>

      <h1 className="text-2xl font-extrabold text-dc-text mb-3">{practice.title}</h1>

      <div className="flex items-center gap-4 mb-8">
        <div className="flex-1 h-4 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-dc-green rounded-full transition-all duration-300"
            style={{ width: `${((currentStep + 1) / practice.steps.length) * 100}%` }}
          />
        </div>
        <span className="text-lg font-extrabold text-dc-text-muted">
          {currentStep + 1}/{practice.steps.length}
        </span>
      </div>

      <div className="card-highlight mb-6">
        <p className="text-xl font-extrabold text-dc-text leading-relaxed">
          {step.instruction}
        </p>
      </div>

      {step.type === 'choice' && step.options && (
        <div className="flex flex-col gap-3 mb-6">
          {step.options.map((option, i) => {
            const isSelected = selectedOption === i
            const showResult = showFeedback && isSelected
            return (
              <button
                key={i}
                onClick={() => !showFeedback && handleSelectOption(i)}
                disabled={showFeedback && !isSelected}
                className={`card text-left transition-all text-xl font-bold ${
                  showResult && option.correct ? 'border-dc-green bg-dc-green-bg border-2'
                    : showResult && !option.correct ? 'border-dc-error bg-red-50 border-2'
                    : isSelected ? 'border-dc-green border-2'
                    : showFeedback ? 'opacity-40'
                    : 'hover:shadow-lg'
                }`}
              >
                <span>{option.label}</span>
                {showResult && (
                  <p className={`mt-3 text-lg font-semibold ${option.correct ? 'text-dc-green' : 'text-dc-error'}`}>
                    {option.feedback}
                  </p>
                )}
              </button>
            )
          })}
        </div>
      )}

      {(step.type !== 'choice' || showFeedback) && (
        <button onClick={handleNext} className="btn-primary w-full text-xl">
          {isLastStep ? (
            <><Check size={26} /> 완료하기</>
          ) : (
            <>다음 <ArrowRight size={26} /></>
          )}
        </button>
      )}
    </div>
  )
}
