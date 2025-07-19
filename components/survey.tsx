"use client"

import { useState, useMemo } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Star, CheckCircle, ArrowRight, ArrowLeft } from "lucide-react"
import { GroqAssistant } from "./groq-assistant"

type Question = {
  id: string
  type: string
  title: string
  subtitle?: string
  required?: boolean
  options?: string[]
  input_type?: string
  max?: number
}

type SurveyProps = {
  questions: Question[]
}

const Survey = ({ questions }: SurveyProps) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [responses, setResponses] = useState<Record<string, any>>({})
  const [direction, setDirection] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})

  const currentQuestion = questions[currentQuestionIndex]
  const isWelcomeStep = currentQuestion.type === "welcome"
  const isSubmissionStep = currentQuestion.type === "submission"

  const progress = useMemo(() => {
    const welcomeIndex = questions.findIndex((q) => q.type === "welcome")
    const submissionIndex = questions.findIndex((q) => q.type === "submission")

    if (welcomeIndex !== -1 && currentQuestionIndex <= welcomeIndex) return 0
    if (submissionIndex !== -1 && currentQuestionIndex >= submissionIndex) return 100

    const questionSteps = questions.filter((q) => q.type !== "welcome" && q.type !== "submission")
    const currentStep = questions
      .slice(0, currentQuestionIndex)
      .filter((q) => q.type !== "welcome" && q.type !== "submission").length

    return (currentStep / questionSteps.length) * 100
  }, [currentQuestionIndex, questions])

  const handleResponseChange = (id: string, value: any) => {
    setResponses((prev) => ({ ...prev, [id]: value }))

    // Clear validation error when user starts typing
    if (validationErrors[id]) {
      setValidationErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[id]
        return newErrors
      })
    }
  }

  const validateCurrentQuestion = (): boolean => {
    const errors: Record<string, string> = {}
    const value = responses[currentQuestion.id]

    if (currentQuestion.required) {
      if (!value || (typeof value === "string" && value.trim() === "")) {
        errors[currentQuestion.id] = "This field is required"
      } else if (currentQuestion.type === "email" && value) {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
        if (!emailRegex.test(value)) {
          errors[currentQuestion.id] = "Please enter a valid email address"
        }
      } else if (currentQuestion.type === "checkbox" && Array.isArray(value) && value.length === 0) {
        errors[currentQuestion.id] = "Please select at least one option"
      }
    }

    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleNext = () => {
    // Clear previous errors
    setValidationErrors({})

    if (!validateCurrentQuestion()) return
    if (currentQuestionIndex < questions.length - 1) {
      setDirection(1)
      setCurrentQuestionIndex((prev) => prev + 1)
    }
  }

  const handleBack = () => {
    if (currentQuestionIndex > 0) {
      setDirection(-1)
      setCurrentQuestionIndex((prev) => prev - 1)
    }
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    // Mock API call
    await new Promise((resolve) => setTimeout(resolve, 2000))
    console.log("Submitting responses:", responses)
    setIsSubmitting(false)
    setIsSubmitted(true)
    handleNext()
  }

  const isCurrentQuestionAnswered = () => {
    if (!currentQuestion.required) return true
    const response = responses[currentQuestion.id]

    // Check if there's a value first
    if (!response || (typeof response === "string" && response.trim() === "")) {
      return false
    }

    // For arrays (checkboxes), check if at least one item is selected
    if (Array.isArray(response)) {
      return response.length > 0
    }

    // For email, validate format
    if (currentQuestion.type === "email") {
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
      return emailRegex.test(response)
    }

    // For other types, just check if there's a value
    return response !== undefined && response !== "" && response !== null
  }

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? "100%" : "-100%",
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? "100%" : "-100%",
      opacity: 0,
    }),
  }

  const renderQuestion = () => {
    const value = responses[currentQuestion.id]

    switch (currentQuestion.type) {
      case "short_text":
        return (
          <div>
            <Input
              type={currentQuestion.input_type || "text"}
              placeholder="Type your answer here..."
              value={value || ""}
              onChange={(e) => handleResponseChange(currentQuestion.id, e.target.value)}
              className="bg-transparent border-white/20 focus:border-white/50 focus:ring-offset-0 focus:ring-white/20"
            />
            {validationErrors[currentQuestion.id] && (
              <p className="text-red-500 text-sm mt-1">{validationErrors[currentQuestion.id]}</p>
            )}
          </div>
        )
      case "long_text":
        return (
          <div>
            <Textarea
              placeholder="Share your thoughts..."
              value={value || ""}
              onChange={(e) => handleResponseChange(currentQuestion.id, e.target.value)}
              className="bg-transparent border-white/20 focus:border-white/50 focus:ring-offset-0 focus:ring-white/20 min-h-[150px]"
            />
            {validationErrors[currentQuestion.id] && (
              <p className="text-red-500 text-sm mt-1">{validationErrors[currentQuestion.id]}</p>
            )}
          </div>
        )
      case "radio":
        return (
          <div>
            <RadioGroup
              value={value}
              onValueChange={(val) => handleResponseChange(currentQuestion.id, val)}
              className="space-y-3"
            >
              {currentQuestion.options?.map((option) => (
                <div
                  key={option}
                  className="flex items-center space-x-3 p-4 border border-white/20 rounded-md hover:bg-white/5 transition-colors"
                >
                  <RadioGroupItem value={option} id={option} />
                  <Label htmlFor={option} className="text-base font-light">
                    {option}
                  </Label>
                </div>
              ))}
            </RadioGroup>
            {validationErrors[currentQuestion.id] && (
              <p className="text-red-500 text-sm mt-1">{validationErrors[currentQuestion.id]}</p>
            )}
          </div>
        )
      case "checkbox":
        return (
          <div>
            <div className="space-y-3">
              {currentQuestion.options?.map((option) => (
                <div
                  key={option}
                  className="flex items-center space-x-3 p-4 border border-white/20 rounded-md hover:bg-white/5 transition-colors"
                >
                  <Checkbox
                    id={option}
                    checked={(value || []).includes(option)}
                    onCheckedChange={(checked) => {
                      const currentSelection = value || []
                      const newSelection = checked
                        ? [...currentSelection, option]
                        : currentSelection.filter((item: string) => item !== option)
                      handleResponseChange(currentQuestion.id, newSelection)
                    }}
                  />
                  <Label htmlFor={option} className="text-base font-light">
                    {option}
                  </Label>
                </div>
              ))}
            </div>
            {validationErrors[currentQuestion.id] && (
              <p className="text-red-500 text-sm mt-1">{validationErrors[currentQuestion.id]}</p>
            )}
          </div>
        )
      case "dropdown":
        return (
          <div>
            <Select value={value} onValueChange={(val) => handleResponseChange(currentQuestion.id, val)}>
              <SelectTrigger className="w-full bg-transparent border-white/20 focus:ring-offset-0 focus:ring-white/20">
                <SelectValue placeholder="Select an option" />
              </SelectTrigger>
              <SelectContent>
                {currentQuestion.options?.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {validationErrors[currentQuestion.id] && (
              <p className="text-red-500 text-sm mt-1">{validationErrors[currentQuestion.id]}</p>
            )}
          </div>
        )
      case "rating":
        return (
          <div>
            <div className="flex items-center justify-center space-x-2">
              {[...Array(currentQuestion.max || 5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-10 h-10 cursor-pointer transition-colors ${
                    (value || 0) > i ? "text-blue-500 fill-blue-500" : "text-gray-600"
                  }`}
                  onClick={() => handleResponseChange(currentQuestion.id, i + 1)}
                />
              ))}
            </div>
            {validationErrors[currentQuestion.id] && (
              <p className="text-red-500 text-sm mt-1">{validationErrors[currentQuestion.id]}</p>
            )}
          </div>
        )
      case "submission":
        return (
          <div className="text-center">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1, transition: { delay: 0.2, type: "spring" } }}>
              <CheckCircle className="w-24 h-24 text-green-500 mx-auto" />
            </motion.div>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col h-[600px]">
      <div className="w-full bg-white/10 h-1 rounded-full mb-8">
        <motion.div
          className="bg-blue-500 h-1 rounded-full"
          animate={{ width: `${progress}%` }}
          transition={{ type: "spring", stiffness: 100, damping: 20 }}
        />
      </div>
      <div className="flex-grow flex items-center justify-center">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentQuestionIndex}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 },
            }}
            className="w-full"
          >
            <div className="text-center px-4">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-4xl md:text-5xl font-bold text-white mb-4"
              >
                {currentQuestion.title}
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-lg text-gray-400 mb-8"
              >
                {currentQuestion.subtitle}
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="w-full max-w-md mx-auto"
              >
                {renderQuestion()}
              </motion.div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="flex items-center justify-between mt-8"
      >
        {!isWelcomeStep && !isSubmissionStep && (
          <Button variant="ghost" onClick={handleBack} className="text-gray-400 hover:text-white">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        )}
        <div className="flex-grow" />
        {!isSubmissionStep && (
          <Button
            onClick={currentQuestionIndex === questions.length - 2 ? handleSubmit : handleNext}
            disabled={!isCurrentQuestionAnswered() || isSubmitting}
            className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-6 text-lg rounded-full transition-all duration-300 transform hover:scale-105"
          >
            {isSubmitting
              ? "Submitting..."
              : isWelcomeStep
                ? "Let's start"
                : currentQuestionIndex === questions.length - 2
                  ? "Submit"
                  : "Next"}
            {!isWelcomeStep && <ArrowRight className="w-4 h-4 ml-2" />}
          </Button>
        )}
      </motion.div>
      <GroqAssistant currentQuestion={currentQuestion} />
    </div>
  )
}

export default Survey
