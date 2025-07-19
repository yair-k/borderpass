"use client"

import { useEffect, useRef } from "react"
import { gsap } from "gsap"

export default function BackgroundEffects() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    const orbs = containerRef.current.querySelectorAll(".orb")

    orbs.forEach((orb, index) => {
      gsap.to(orb, {
        x: `random(-100, 100)`,
        y: `random(-100, 100)`,
        duration: `random(8, 15)`,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: index * 0.5,
      })
    })
  }, [])

  return (
    <div ref={containerRef} className="fixed inset-0 overflow-hidden pointer-events-none">
      <div className="absolute inset-0 bg-black" />

      {/* Animated orbs */}
      <div className="orb absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-full blur-3xl" />
      <div className="orb absolute top-3/4 right-1/4 w-80 h-80 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-3xl" />
      <div className="orb absolute bottom-1/4 left-1/3 w-64 h-64 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-full blur-3xl" />

      {/* Grid overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]" />
    </div>
  )
}
