"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Check, Star } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import type { Question } from "@/lib/types"

type QuestionInputProps = {
  question: Question
  value: any
  onChange: (id: string, value: any) => void
  error?: string
}

export function QuestionInput({ question, value, onChange, error }: QuestionInputProps) {
  const [focusedOption, setFocusedOption] = useState<string | null>(null)

  const handleChange = (val: any) => {
    onChange(question.id, val)
  }

  switch (question.type) {
    case "short_text":
      return (
        <div className="max-w-2xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative">
            <Input
              type={question.input_type || "text"}
              placeholder="Type your answer..."
              value={value || ""}
              onChange={(e) => handleChange(e.target.value)}
              className={`text-center text-xl py-6 bg-gray-900/50 border-2 ${error ? "border-red-400" : "border-gray-700"} focus:border-cyan-400 rounded-2xl focus:ring-0 placeholder:text-gray-500 transition-all duration-300`}
            />
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-cyan-500/20 to-blue-500/20 opacity-0 group-focus-within:opacity-100 transition-opacity pointer-events-none" />
          </motion.div>
          {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
        </div>
      )

    case "long_text":
      return (
        <div className="max-w-3xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Textarea
              placeholder="Share your thoughts..."
              value={value || ""}
              onChange={(e) => handleChange(e.target.value)}
              className={`min-h-[150px] text-lg bg-gray-900/50 border-2 ${error ? "border-red-400" : "border-gray-700"} focus:border-cyan-400 focus:ring-0 rounded-2xl resize-none transition-all duration-300`}
            />
          </motion.div>
          {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
        </div>
      )

    case "radio":
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {question.options?.map((option, index) => (
            <motion.div
              key={option}
              className={`relative p-8 rounded-2xl border-2 cursor-pointer transition-all duration-300 group ${
                value === option
                  ? "border-cyan-400 bg-cyan-400/10 shadow-lg shadow-cyan-400/20"
                  : `border-gray-700 bg-gray-900/30 hover:border-gray-600 hover:bg-gray-900/50 ${error ? "border-red-400" : ""}`
              }`}
              onClick={() => handleChange(option)}
              onHoverStart={() => setFocusedOption(option)}
              onHoverEnd={() => setFocusedOption(null)}
              whileHover={{ scale: 1.02, y: -5 }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="flex items-center justify-between">
                <span className="text-lg font-medium text-white group-hover:text-cyan-300 transition-colors">
                  {option}
                </span>
                <div
                  className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                    value === option
                      ? "border-cyan-400 bg-cyan-400 shadow-lg shadow-cyan-400/50"
                      : "border-gray-600 group-hover:border-gray-500"
                  }`}
                >
                  <AnimatePresence>
                    {value === option && (
                      <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        exit={{ scale: 0, rotate: 180 }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                      >
                        <Check className="w-4 h-4 text-black" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Glow effect */}
              <AnimatePresence>
                {(value === option || focusedOption === option) && (
                  <motion.div
                    className="absolute inset-0 rounded-2xl bg-gradient-to-r from-cyan-400/10 to-blue-400/10 border border-cyan-400/30"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                  />
                )}
              </AnimatePresence>
            </motion.div>
          ))}
          {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
        </div>
      )

    case "rating":
      return (
        <div className="flex justify-center items-center gap-4">
          {[...Array(question.max || 5)].map((_, index) => (
            <motion.button
              key={index}
              onClick={() => handleChange(index + 1)}
              className={`p-3 transition-all duration-300 ${
                (value || 0) > index ? "text-yellow-400 drop-shadow-lg" : "text-gray-600 hover:text-gray-400"
              }`}
              whileHover={{ scale: 1.3, rotate: 5 }}
              whileTap={{ scale: 0.9 }}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              <Star
                className="w-12 h-12"
                fill={(value || 0) > index ? "currentColor" : "none"}
                stroke="currentColor"
                strokeWidth={1.5}
              />
            </motion.button>
          ))}
          {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
        </div>
      )

    case "checkbox":
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
          {question.options?.map((option, index) => {
            const isSelected = (value || []).includes(option)
            return (
              <motion.div
                key={option}
                className={`relative p-6 rounded-2xl border-2 cursor-pointer transition-all duration-300 group ${
                  isSelected
                    ? "border-cyan-400 bg-cyan-400/10 shadow-lg shadow-cyan-400/20"
                    : `border-gray-700 bg-gray-900/30 hover:border-gray-600 ${error ? "border-red-400" : ""}`
                }`}
                onClick={() => {
                  const currentSelection = value || []
                  const newSelection = isSelected
                    ? currentSelection.filter((item: string) => item !== option)
                    : [...currentSelection, option]
                  handleChange(newSelection)
                }}
                whileHover={{ scale: 1.02, y: -3 }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="flex items-center justify-between">
                  <span className="text-base font-medium text-white group-hover:text-cyan-300 transition-colors">
                    {option}
                  </span>
                  <div
                    className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-all duration-300 ${
                      isSelected ? "border-cyan-400 bg-cyan-400" : "border-gray-600 group-hover:border-gray-500"
                    }`}
                  >
                    <AnimatePresence>
                      {isSelected && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          exit={{ scale: 0 }}
                          transition={{ type: "spring", stiffness: 400, damping: 20 }}
                        >
                          <Check className="w-3 h-3 text-black" />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </motion.div>
            )
          })}
          {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
        </div>
      )

    default:
      return null
  }
}
