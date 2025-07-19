"use client"

import { motion } from "framer-motion"

type CustomRadioGroupProps = {
  options: string[]
  value: string
  onValueChange: (value: string) => void
}

export function CustomRadioGroup({ options, value, onValueChange }: CustomRadioGroupProps) {
  return (
    <div className="flex flex-wrap justify-center gap-4">
      {options.map((option) => (
        <div
          key={option}
          onClick={() => onValueChange(option)}
          className="relative cursor-pointer px-6 py-3 border-2 border-brand-subtle rounded-full text-brand-gray hover:border-brand-accent hover:text-brand-light transition-colors"
        >
          {option}
          {value === option && (
            <motion.div
              layoutId="radio-highlighter"
              className="absolute inset-0 bg-brand-accent rounded-full -z-10"
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            />
          )}
          <span className={`relative z-20 transition-colors ${value === option ? "text-black" : ""}`}>{option}</span>
        </div>
      ))}
    </div>
  )
}
