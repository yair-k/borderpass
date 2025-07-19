"use client"

import { useState, useCallback, useEffect } from "react"
import { AnimatePresence } from "framer-motion"
import { gsap } from "gsap"
import AnimatedQuestion from "./animated-question"
import SubmissionSummary from "./submission-summary"
import ProgressIndicator from "./progress-indicator"
import AIAssistant from "./ai-assistant"
import type { Question, Responses } from "@/lib/types"

type SurveyContainerProps = {
  questions: Question[]
}

export default function SurveyContainer({ questions }: SurveyContainerProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [responses, setResponses] = useState<Responses>({})
  const [isAnimating, setIsAnimating] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  const [direction, setDirection] = useState<"forward" | "backward">("forward")

  const currentQuestion = questions[currentQuestionIndex]
  const totalQuestions = questions.filter((q) => q.type !== "welcome" && q.type !== "submission").length
  const currentStep = Math.max(0, currentQuestionIndex)
  const progress = currentQuestionIndex === 0 ? 0 : (currentStep / (questions.length - 1)) * 100

  useEffect(() => {
    // Initialize GSAP timeline for page transitions
    gsap.set(".question-container", { opacity: 1 })
  }, [])

  const handleResponseChange = useCallback((id: string, value: any) => {
    setResponses((prev) => ({ ...prev, [id]: value }))
  }, [])

  const handleNext = useCallback(() => {
    if (isAnimating) return

    setDirection("forward")
    setIsAnimating(true)

    // GSAP exit animation
    const tl = gsap.timeline({
      onComplete: () => {
        if (currentQuestionIndex === questions.length - 1) {
          setIsComplete(true)
        } else {
          setCurrentQuestionIndex((prev) => prev + 1)
        }
        setIsAnimating(false)
      },
    })

    tl.to(".question-container", {
      x: -100,
      opacity: 0,
      duration: 0.4,
      ease: "power2.in",
    })
  }, [currentQuestionIndex, questions.length, isAnimating])

  const handleBack = useCallback(() => {
    if (isAnimating || currentQuestionIndex === 0) return

    setDirection("backward")
    setIsAnimating(true)

    // GSAP exit animation
    const tl = gsap.timeline({
      onComplete: () => {
        setCurrentQuestionIndex((prev) => prev - 1)
        setIsAnimating(false)
      },
    })

    tl.to(".question-container", {
      x: 100,
      opacity: 0,
      duration: 0.4,
      ease: "power2.in",
    })
  }, [currentQuestionIndex, isAnimating])

  return (
    <div className="w-full max-w-5xl mx-auto relative">
      {currentQuestionIndex > 0 && !isComplete && (
        <ProgressIndicator progress={progress} currentStep={currentStep} totalSteps={questions.length - 1} />
      )}

      <div className="min-h-[70vh] flex items-center justify-center">
        <AnimatePresence mode="wait">
          {!isComplete ? (
            <AnimatedQuestion
              key={currentQuestion.id}
              question={currentQuestion}
              value={responses[currentQuestion.id]}
              onResponseChange={handleResponseChange}
              onNext={handleNext}
              onBack={handleBack}
              isAnimating={isAnimating}
              isFirst={currentQuestionIndex === 0}
              isLast={currentQuestionIndex === questions.length - 1}
              direction={direction}
            />
          ) : (
            <SubmissionSummary responses={responses} questions={questions} />
          )}
        </AnimatePresence>
      </div>

      <AIAssistant currentQuestion={currentQuestion} responses={responses} isComplete={isComplete} />
    </div>
  )
}
