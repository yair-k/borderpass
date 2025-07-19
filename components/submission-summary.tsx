"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { AnimatePresence } from "framer-motion"
import { CheckCircle, Download, Sparkles, User, Mail, Star, MapPin } from "lucide-react"
import type { Responses, Question } from "@/lib/types"

type SubmissionSummaryProps = {
  responses: Responses
  questions: Question[]
}

export default function SubmissionSummary({ responses, questions }: SubmissionSummaryProps) {
  const [displayedText, setDisplayedText] = useState("")
  const [isTyping, setIsTyping] = useState(true)
  const [showDetails, setShowDetails] = useState(false)

  const summaryData = questions
    .filter((q) => responses[q.id] && q.type !== "welcome" && q.type !== "submission")
    .map((q) => ({
      question: q.title,
      answer: Array.isArray(responses[q.id]) ? (responses[q.id] as string[]).join(", ") : responses[q.id],
      icon: getQuestionIcon(q.id),
    }))

  function getQuestionIcon(questionId: string) {
    switch (questionId) {
      case "full_name":
        return User
      case "email":
        return Mail
      case "travel_experience_rating":
        return Star
      case "destinations":
        return MapPin
      default:
        return Sparkles
    }
  }

  const aiSummary = `🎯 BorderPass Profile Generated

✨ Welcome ${responses.full_name || "Traveler"}!

Based on your responses, here's your personalized travel profile:

🌍 Travel Pattern: ${responses.travel_frequency || "Not specified"}
🎯 Primary Purpose: ${responses.primary_purpose || "Not specified"}
⭐ Experience Rating: ${responses.travel_experience_rating ? `${responses.travel_experience_rating}/5 stars` : "Not rated"}
📍 Regions Visited: ${Array.isArray(responses.destinations) ? responses.destinations.join(", ") : "Not specified"}

Your profile suggests you're ${responses.travel_frequency === "Multiple times a year" ? "a seasoned globetrotter" : "an thoughtful explorer"} who values ${responses.primary_purpose === "Business" ? "efficiency and seamless experiences" : "meaningful connections and memorable journeys"}.

🚀 Your BorderPass is being customized to enhance your travel experience with personalized recommendations and streamlined processes.`

  useEffect(() => {
    let index = 0
    const timer = setInterval(() => {
      if (index < aiSummary.length) {
        setDisplayedText(aiSummary.slice(0, index + 1))
        index++
      } else {
        setIsTyping(false)
        clearInterval(timer)
      }
    }, 25)

    return () => clearInterval(timer)
  }, [aiSummary])

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="w-full max-w-5xl mx-auto text-center px-4"
    >
      {/* Success Animation */}
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 15 }}
        className="mb-12"
      >
        <div className="relative w-32 h-32 mx-auto">
          <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full animate-pulse" />
          <div className="absolute inset-2 bg-black rounded-full flex items-center justify-center">
            <CheckCircle className="w-16 h-16 text-green-400" />
          </div>
        </div>
      </motion.div>

      {/* Title */}
      <motion.h1
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight"
      >
        Journey Complete!
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="text-xl text-gray-400 mb-16 max-w-2xl mx-auto"
      >
        Your BorderPass profile has been successfully created. Here's your personalized travel summary.
      </motion.p>

      {/* AI Summary Card */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-xl border border-gray-700/50 rounded-3xl p-8 mb-12 text-left max-w-3xl mx-auto shadow-2xl"
      >
        <div className="flex items-center gap-4 mb-8">
          <div className="w-14 h-14 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg">
            <Sparkles className="w-7 h-7 text-white" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-white">AI-Generated Summary</h3>
            <p className="text-gray-400">Powered by BorderPass Intelligence</p>
          </div>
        </div>

        <div className="bg-black/40 rounded-2xl p-6 border border-gray-700/30">
          <div className="text-gray-300 leading-relaxed whitespace-pre-line font-mono text-sm">
            {displayedText}
            {isTyping && <span className="animate-pulse text-cyan-400">|</span>}
          </div>
        </div>
      </motion.div>

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="flex flex-col sm:flex-row gap-6 justify-center mb-12"
      >
        <motion.button
          onClick={() => {
            // Create and download the summary
            const summaryContent = `BorderPass Survey Summary\n\n${aiSummary}\n\nDetailed Responses:\n${summaryData.map((item) => `${item.question}: ${item.answer}`).join("\n")}`
            const blob = new Blob([summaryContent], { type: "text/plain" })
            const url = URL.createObjectURL(blob)
            const a = document.createElement("a")
            a.href = url
            a.download = "borderpass-summary.txt"
            document.body.appendChild(a)
            a.click()
            document.body.removeChild(a)
            URL.revokeObjectURL(url)
          }}
          className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-2xl shadow-lg shadow-cyan-500/25 group"
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
        >
          <Download className="w-5 h-5 group-hover:animate-bounce" />
          Download Summary
        </motion.button>
      </motion.div>

      {/* Detailed Responses */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="max-w-4xl mx-auto"
      >
        <motion.button
          onClick={() => setShowDetails(!showDetails)}
          className="mb-8 text-gray-400 hover:text-white transition-colors flex items-center gap-2 mx-auto"
          whileHover={{ scale: 1.05 }}
        >
          <span className="text-lg font-medium">View Detailed Responses</span>
          <motion.div animate={{ rotate: showDetails ? 180 : 0 }} transition={{ duration: 0.3 }}>
            <Sparkles className="w-5 h-5" />
          </motion.div>
        </motion.button>

        <AnimatePresence>
          {showDetails && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8 text-left"
            >
              <div className="grid gap-6">
                {summaryData.map((item, index) => {
                  const IconComponent = item.icon
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-start gap-4 p-4 bg-black/30 rounded-xl border border-gray-700/30"
                    >
                      <div className="w-10 h-10 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                        <IconComponent className="w-5 h-5 text-cyan-400" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-white mb-2">{item.question}</h4>
                        <p className="text-gray-400 leading-relaxed">{item.answer}</p>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  )
}
