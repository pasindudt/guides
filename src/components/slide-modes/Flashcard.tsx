'use client'

import React, { useContext, useEffect, useState } from 'react'
import { SlideContext } from './SlideContext'

interface FlashcardProps {
  front: React.ReactNode
  back: React.ReactNode
  className?: string
}

export function Flashcard({ front, back, className = '' }: FlashcardProps) {
  const [flipped, setFlipped] = useState(false)
  const { isActive } = useContext(SlideContext)

  useEffect(() => {
    if (!isActive) setFlipped(false)
  }, [isActive])

  return (
    <div className={`not-prose my-6 flex justify-center ${className}`}>
      <button
        type="button"
        onClick={() => setFlipped((f) => !f)}
        aria-pressed={flipped}
        className="group relative block w-full max-w-md min-h-48 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-900"
        style={{ perspective: '1200px' }}
      >
        <span
          className="relative block w-full h-full min-h-48 transition-transform duration-500"
          style={{
            transformStyle: 'preserve-3d',
            transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
          }}
        >
          <span
            className="absolute inset-0 flex items-center justify-center rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-6 py-8 text-center text-gray-800 dark:text-gray-100 shadow-sm"
            style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}
          >
            <span className="block w-full">{front}</span>
          </span>
          <span
            className="absolute inset-0 flex items-center justify-center rounded-xl border border-blue-300 dark:border-blue-700 bg-blue-50 dark:bg-blue-950/40 px-6 py-8 text-center text-gray-800 dark:text-gray-100 shadow-sm"
            style={{
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)',
            }}
          >
            <span className="block w-full">{back}</span>
          </span>
        </span>
        <span className="absolute -bottom-6 left-0 right-0 text-center text-xs text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">
          Click or press Enter to flip
        </span>
      </button>
    </div>
  )
}
