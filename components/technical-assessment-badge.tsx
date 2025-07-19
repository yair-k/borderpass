"use client"

import { motion } from "framer-motion"
import { Code } from "lucide-react"

export default function TechnicalAssessmentBadge() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="fixed bottom-6 left-6 z-40"
    >
      <div className="flex items-center gap-2 px-4 py-2 bg-gray-900/80 backdrop-blur-sm border border-gray-700/50 rounded-full text-sm text-gray-300">
        <Code className="w-4 h-4" />
        <span>Technical Assessment Project by</span>
        <a
          href="https://yair.ca"
          target="_blank"
          rel="noopener noreferrer"
          className="text-cyan-400 hover:text-cyan-300 transition-colors font-medium"
        >
          Yair
        </a>
      </div>
    </motion.div>
  )
}
