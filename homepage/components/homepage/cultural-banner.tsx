"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface CulturalBannerProps {
  className?: string
}

export function CulturalBanner({ className }: CulturalBannerProps) {
  const phrases = [
    { text: "Nou La!", translation: "We're Here!" },
    { text: "Ansanm Nou Fò", translation: "Together We're Strong" },
    { text: "Ayiti Cheri", translation: "Dear Haiti" },
    { text: "L'Union Fait La Force", translation: "Unity Makes Strength" },
  ]

  return (
    <div className={cn("relative overflow-hidden", className)}>
      {/* Haitian Flag Colors Gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-white to-red-600 opacity-10" />
      
      <div className="container mx-auto px-4 py-16 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto"
        >
          {/* Flag Emoji */}
          <div className="text-6xl mb-6">🇭🇹</div>
          
          {/* Main Message */}
          <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-red-600 bg-clip-text text-transparent">
            Celebrating Haitian Excellence Worldwide
          </h2>
          
          {/* Cultural Phrases */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {phrases.map((phrase, index) => (
              <motion.div
                key={phrase.text}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white/50 backdrop-blur rounded-lg p-4"
              >
                <p className="text-lg font-bold text-gray-900">{phrase.text}</p>
                <p className="text-sm text-gray-600">{phrase.translation}</p>
              </motion.div>
            ))}
          </div>
          
          {/* Description */}
          <p className="text-lg text-gray-700 max-w-3xl mx-auto">
            From the mountains of Haiti to every corner of the world, Ann Pale connects the Haitian diaspora 
            with the voices, faces, and talents that make our culture vibrant and unique.
          </p>
          
          {/* Cultural Icons */}
          <div className="flex justify-center gap-4 mt-8 text-4xl">
            <motion.span
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ repeat: Infinity, duration: 4 }}
            >
              🎵
            </motion.span>
            <motion.span
              animate={{ rotate: [0, -10, 10, 0] }}
              transition={{ repeat: Infinity, duration: 4, delay: 0.5 }}
            >
              🎨
            </motion.span>
            <motion.span
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ repeat: Infinity, duration: 4, delay: 1 }}
            >
              🎭
            </motion.span>
            <motion.span
              animate={{ rotate: [0, -10, 10, 0] }}
              transition={{ repeat: Infinity, duration: 4, delay: 1.5 }}
            >
              🥁
            </motion.span>
          </div>
        </motion.div>
      </div>
    </div>
  )
}