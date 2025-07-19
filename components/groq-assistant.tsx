"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Sparkles, X, Bot } from "lucide-react"
import { useChat } from "ai/react"

type GroqAssistantProps = {
  currentQuestion: {
    id: string
    title: string
    subtitle?: string
  }
}

export function GroqAssistant({ currentQuestion }: GroqAssistantProps) {
  const [isOpen, setIsOpen] = useState(false)

  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: "/api/chat",
    initialMessages: [
      {
        id: "0",
        role: "assistant",
        content: `Hello! I'm your AI assistant. How can I help you with the question: "${currentQuestion.title}"?`,
      },
    ],
    body: {
      currentQuestion: `Title: ${currentQuestion.title}\nSubtitle: ${currentQuestion.subtitle}`,
    },
  })

  return (
    <>
      <motion.div
        className="fixed bottom-8 right-8 z-50"
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 20, delay: 1 }}
      >
        <Button
          size="icon"
          className="rounded-full w-16 h-16 bg-purple-600 hover:bg-purple-500 shadow-lg shadow-purple-500/30"
          onClick={() => setIsOpen(true)}
        >
          <Sparkles className="w-8 h-8" />
        </Button>
      </motion.div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ y: "100vh" }}
              animate={{ y: 0 }}
              exit={{ y: "100vh" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="bg-[#1c1c2e] border border-white/10 rounded-2xl w-full max-w-md h-[70vh] flex flex-col shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-4 border-b border-white/10 flex justify-between items-center">
                <h3 className="font-bold text-white flex items-center">
                  <Bot className="mr-2" /> AI Assistant
                </h3>
                <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex-grow p-4 overflow-y-auto space-y-4">
                {messages.map((m) => (
                  <div key={m.id} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${m.role === "user" ? "bg-blue-600 text-white rounded-br-none" : "bg-white/10 text-gray-300 rounded-bl-none"}`}
                    >
                      <p className="text-sm">{m.content}</p>
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="max-w-xs lg:max-w-md px-4 py-2 rounded-2xl bg-white/10 text-gray-300 rounded-bl-none">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-white rounded-full animate-pulse [animation-delay:-0.3s]"></div>
                        <div className="w-2 h-2 bg-white rounded-full animate-pulse [animation-delay:-0.15s]"></div>
                        <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <form onSubmit={handleSubmit} className="p-4 border-t border-white/10">
                <div className="relative">
                  <Textarea
                    value={input}
                    onChange={handleInputChange}
                    placeholder="Ask about the current question..."
                    className="bg-white/5 border-white/20 pr-20"
                    rows={1}
                  />
                  <Button
                    type="submit"
                    size="sm"
                    className="absolute right-2 top-1/2 -translate-y-1/2"
                    disabled={isLoading}
                  >
                    Send
                  </Button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
