"use client"

import type React from "react"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

type CustomButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  children: React.ReactNode
}

export default function CustomButton({ children, className, ...props }: CustomButtonProps) {
  return (
    <motion.button
      whileHover="hover"
      className={cn(
        "relative px-8 py-3 rounded-full bg-brand-accent text-black font-bold text-lg overflow-hidden flex items-center gap-2",
        "disabled:bg-brand-subtle disabled:text-brand-gray disabled:cursor-not-allowed",
        className,
      )}
      {...props}
    >
      <motion.span
        className="absolute inset-0 bg-white"
        variants={{
          hover: {
            scaleX: [0, 1],
            transformOrigin: "left",
            transition: { duration: 0.3, ease: "easeInOut" },
          },
        }}
      />
      <span className="relative z-10">{children}</span>
    </motion.button>
  )
}
