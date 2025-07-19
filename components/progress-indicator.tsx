"use client"

import { motion } from "framer-motion"

type ProgressIndicatorProps = {
  progress: number
  currentStep: number
  totalSteps: number
}

export default function ProgressIndicator({ progress, currentStep, totalSteps }: ProgressIndicatorProps) {
  return (
    <div className="mb-12">
      <div className="flex justify-between items-center mb-4">
        <span className="text-sm text-gray-400">
          Question {currentStep} of {totalSteps}
        </span>
        <span className="text-sm text-gray-400">{Math.round(progress)}% Complete</span>
      </div>

      <div className="relative w-full h-1 bg-gray-800 rounded-full overflow-hidden">
        <motion.div
          className="absolute left-0 top-0 h-full bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
        />

        {/* Glow effect */}
        <motion.div
          className="absolute left-0 top-0 h-full bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full blur-sm opacity-50"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
        />
      </div>
    </div>
  )
}
