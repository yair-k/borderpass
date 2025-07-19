"use client"

import { useRef, useEffect } from "react"
import { motion } from "framer-motion"
import { gsap } from "gsap"
import { ArrowRight, ArrowLeft, Sparkles, Play } from "lucide-react"
import { QuestionInput } from "./question-input"
import type { Question } from "@/lib/types"

type AnimatedQuestionProps = {
  question: Question
  value: any
  onResponseChange: (id: string, value: any) => void
  onNext: () => void
  onBack: () => void
  isAnimating: boolean
  isFirst: boolean
  isLast: boolean
  direction: "forward" | "backward"
}

export default function AnimatedQuestion({
  question,
  value,
  onResponseChange,
  onNext,
  onBack,
  isAnimating,
  isFirst,
  isLast,
  direction,
}: AnimatedQuestionProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    const elements = containerRef.current.querySelectorAll(".animate-in")

    // Reset and animate in
    gsap.set(elements, {
      y: 80,
      opacity: 0,
      scale: 0.9,
    })

    gsap.to(elements, {
      y: 0,
      opacity: 1,
      scale: 1,
      duration: 0.8,
      stagger: 0.15,
      ease: "power3.out",
      delay: 0.2,
    })

    // Floating animation for the question badge
    gsap.to(".question-badge", {
      y: -10,
      duration: 2,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    })
  }, [question.id])

  const isAnswered = () => {
    if (question.type === "welcome") return true
    if (!question.required) return true
    if (Array.isArray(value)) return value.length > 0
    return value !== undefined && value !== "" && value !== null
  }

  const variants = {
    enter: (direction: string) => ({
      x: direction === "forward" ? 1200 : -1200,
      opacity: 0,
      scale: 0.8,
      rotateY: direction === "forward" ? 45 : -45,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      rotateY: 0,
    },
    exit: (direction: string) => ({
      x: direction === "forward" ? -1200 : 1200,
      opacity: 0,
      scale: 0.8,
      rotateY: direction === "forward" ? -45 : 45,
    }),
  }

  return (
    <motion.div
      ref={containerRef}
      custom={direction}
      variants={variants}
      initial="enter"
      animate="center"
      exit="exit"
      transition={{
        duration: 0.8,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      className="question-container w-full max-w-4xl mx-auto text-center px-4"
    >
      {/* Question Badge */}
      {question.type !== "welcome" && (
        <div className="animate-in mb-8">
          <div className="question-badge inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 backdrop-blur-sm">
            <Sparkles className="w-4 h-4 mr-2 text-cyan-400" />
            <span className="text-sm font-medium text-cyan-300">Question</span>
          </div>
        </div>
      )}

      {/* Title */}
      <h1 className="animate-in text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-8 leading-tight tracking-tight">
        {question.title}
      </h1>

      {/* Subtitle */}
      {question.subtitle && (
        <p className="animate-in text-lg md:text-xl text-gray-400 mb-16 max-w-3xl mx-auto leading-relaxed">
          {question.subtitle}
        </p>
      )}

      {/* Input */}
      {question.type !== "welcome" && (
        <div className="animate-in mb-20">
          <QuestionInput question={question} value={value} onChange={onResponseChange} />
        </div>
      )}

      {/* Navigation */}
      <div className="animate-in flex items-center justify-center gap-8">
        {!isFirst && question.type !== "welcome" && (
          <motion.button
            onClick={onBack}
            disabled={isAnimating}
            className="flex items-center gap-3 px-6 py-3 text-gray-400 hover:text-white transition-all duration-300 disabled:opacity-50 group"
            whileHover={{ scale: 1.05, x: -5 }}
            whileTap={{ scale: 0.95 }}
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium">Back</span>
          </motion.button>
        )}

        <motion.button
          onClick={onNext}
          disabled={!isAnswered() || isAnimating}
          className="relative flex items-center gap-4 px-10 py-5 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-full disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden group shadow-lg shadow-cyan-500/25"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <span className="relative z-10 text-lg">
            {question.type === "welcome" ? "Start Journey" : isLast ? "Complete Survey" : "Continue"}
          </span>
          {question.type === "welcome" ? (
            <Play className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" />
          ) : (
            <ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" />
          )}

          {/* Animated background */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600"
            initial={{ x: "-100%" }}
            whileHover={{ x: 0 }}
            transition={{ duration: 0.3 }}
          />

          {/* Shimmer effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000" />
        </motion.button>
      </div>
    </motion.div>
  )
}
