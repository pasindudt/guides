'use client'

import React, { useContext, useEffect, useRef } from 'react'
import { SlideContext } from './SlideContext'

interface ExpandableProps {
  children: React.ReactNode
  className?: string
}

export function Expandable({ children, className = '' }: ExpandableProps) {
  return (
    <div
      className={`not-prose flex flex-col gap-2 my-4 ${className}`}
    >
      {children}
    </div>
  )
}

interface ExpandableItemProps {
  title: React.ReactNode
  children: React.ReactNode
  className?: string
}

export function ExpandableItem({ title, children, className = '' }: ExpandableItemProps) {
  const detailsRef = useRef<HTMLDetailsElement>(null)
  const { isActive } = useContext(SlideContext)

  useEffect(() => {
    if (!isActive && detailsRef.current) {
      detailsRef.current.open = false
    }
  }, [isActive])

  return (
    <details
      ref={detailsRef}
      className={`not-prose group rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 overflow-hidden ${className}`}
    >
      <summary className="flex items-center justify-between gap-3 cursor-pointer select-none px-4 py-3 text-base font-medium text-gray-800 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-800/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-900 transition-colors">
        <span className="flex-1">{title}</span>
        <span
          aria-hidden="true"
          className="inline-block transition-transform duration-200 text-gray-400 group-open:rotate-90"
        >
          ▶
        </span>
      </summary>
      <div className="px-4 pb-4 pt-1 text-gray-700 dark:text-gray-300">
        {children}
      </div>
    </details>
  )
}
