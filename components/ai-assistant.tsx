"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Bot, X, Sparkles, Send } from "lucide-react"
import { useChat } from "ai/react"
import type { Question, Responses } from "@/lib/types"

type AIAssistantProps = {
  currentQuestion: Question
  responses: Responses
  isComplete: boolean
}

export default function AIAssistant({ currentQuestion, responses, isComplete }: AIAssistantProps) {
  const [isOpen, setIsOpen] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const { messages, input, handleInputChange, handleSubmit, isLoading, setMessages } = useChat({
    api: "/api/chat",
    body: {
      currentQuestion,
      responses,
    },
    initialMessages: [
      {
        id: "welcome",
        role: "assistant",
        content: getInitialMessage(currentQuestion),
      },
    ],
  })

  // Update initial message when question changes
  useEffect(() => {
    setMessages([
      {
        id: "welcome",
        role: "assistant",
        content: getInitialMessage(currentQuestion),
      },
    ])
  }, [currentQuestion, setMessages])

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  function getInitialMessage(question: Question): string {
    switch (question.id) {
      case "welcome":
        return "Welcome to BorderPass! I'm here to help you through this questionnaire. Feel free to ask me anything about the process or any specific questions you encounter."

      case "full_name":
        return "I'm here to help with your name entry. Ask me about formatting, special characters, or why we need your legal name."

      case "email":
        return "Need help with the email section? I can explain why we collect this information and how it's used."

      case "travel_frequency":
        return "I can help you determine your travel frequency. Ask me about what counts as international travel or which option fits your situation best."

      case "primary_purpose":
        return "Wondering about your primary travel purpose? I can help you choose the right category or explain how this affects your profile."

      case "destinations":
        return "Need help with regions and destinations? I can clarify geographic boundaries or what timeframe to consider."

      case "travel_experience_rating":
        return "I can help you think through your airport experience rating. Ask me what factors to consider or how to average different experiences."

      case "feedback":
        return "Ready to share feedback? I can suggest areas to comment on or help you organize your thoughts about travel improvements."

      default:
        return "I'm here to help with any questions about this section of the BorderPass questionnaire."
    }
  }

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (input.trim()) {
      handleSubmit(e)
    }
  }

  return (
    <>
      {/* Floating AI Button */}
      <motion.div
        className="fixed bottom-8 right-8 z-50"
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{
          type: "spring",
          stiffness: 260,
          damping: 20,
          delay: 1,
        }}
      >
        <motion.button
          onClick={() => setIsOpen(true)}
          className="relative w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full shadow-lg shadow-purple-500/25 flex items-center justify-center group"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <Bot className="w-8 h-8 text-white" />

          {/* Pulse effect */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 animate-ping opacity-20" />

          {/* Notification dot */}
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-cyan-400 rounded-full flex items-center justify-center">
            <Sparkles className="w-2 h-2 text-black" />
          </div>
        </motion.button>
      </motion.div>

      {/* AI Chat Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 50 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-md h-[600px] flex flex-col shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="p-6 border-b border-gray-700 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                    <Bot className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">BorderPass AI Assistant</h3>
                    <p className="text-xs text-gray-400">
                      {currentQuestion.type === "welcome" ? "Ready to help" : `Helping with: ${currentQuestion.title}`}
                    </p>
                  </div>
                </div>
                <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>

              {/* Messages */}
              <div className="flex-1 p-6 overflow-y-auto">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[85%] p-4 rounded-2xl ${
                          message.role === "user"
                            ? "bg-cyan-500 text-white rounded-br-none"
                            : "bg-gray-800 text-gray-100 rounded-bl-none"
                        }`}
                      >
                        <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                      </div>
                    </motion.div>
                  ))}

                  {isLoading && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex justify-start"
                    >
                      <div className="max-w-[85%] p-4 rounded-2xl bg-gray-800 text-gray-100 rounded-bl-none">
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse [animation-delay:-0.3s]"></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse [animation-delay:-0.15s]"></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </div>

              {/* Quick Suggestions */}
              <div className="px-6 pb-4">
                <div className="flex flex-wrap gap-2">
                  {getQuickSuggestions(currentQuestion).map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        const syntheticEvent = {
                          preventDefault: () => {},
                          target: { value: suggestion },
                        } as any
                        handleInputChange(syntheticEvent)
                        setTimeout(() => handleFormSubmit(syntheticEvent), 100)
                      }}
                      className="px-3 py-1 text-xs bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-full transition-colors"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>

              {/* Chat Input */}
              <form onSubmit={handleFormSubmit} className="p-6 border-t border-gray-700">
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={input}
                    onChange={handleInputChange}
                    placeholder="Ask me anything about this question..."
                    className="flex-1 p-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
                    disabled={isLoading}
                  />
                  <button
                    type="submit"
                    disabled={!input.trim() || isLoading}
                    className="px-4 py-3 bg-cyan-500 hover:bg-cyan-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors flex items-center justify-center"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

function getQuickSuggestions(question: Question): string[] {
  switch (question.id) {
    case "welcome":
      return ["How long does this take?", "Is my data secure?", "What is BorderPass?"]

    case "full_name":
      return ["What if my name has hyphens?", "Should I include middle names?", "Why do you need my legal name?"]

    case "email":
      return ["Why is my email needed?", "Will you send me spam?", "Can I change this later?"]

    case "travel_frequency":
      return ["What counts as international?", "What if I'm between categories?", "Does business travel count?"]

    case "primary_purpose":
      return ["What if I travel for multiple reasons?", "How does this affect my profile?", "Can I change this later?"]

    case "destinations":
      return ["Which countries are in which continent?", "Do layovers count?", "What timeframe should I consider?"]

    case "travel_experience_rating":
      return [
        "What factors should I consider?",
        "How do I average different experiences?",
        "What does each rating mean?",
      ]

    case "feedback":
      return ["What kind of feedback is helpful?", "Should I mention specific airports?", "Can I suggest improvements?"]

    default:
      return ["How does this help?", "Can I skip this?", "What happens next?"]
  }
}
