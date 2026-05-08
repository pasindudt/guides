'use client'

import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react'
import { SlideContext, type RevealHandle } from './slide-modes/SlideContext'

interface SlideViewerProps {
  children: React.ReactNode
  totalSlides: number
  title: string
}

export function SlideViewer({ children, totalSlides, title }: SlideViewerProps) {
  const [current, setCurrent] = useState(0)
  const [isFullscreen, setIsFullscreen] = useState(false)

  // Per-slide registry of Reveal handles: slideIndex -> Map<id, RevealHandle>.
  const revealsRef = useRef<Map<number, Map<string, RevealHandle>>>(new Map())
  const currentRef = useRef(current)
  useEffect(() => {
    currentRef.current = current
  }, [current])

  // Refs to each slide's scroll container (for scroll-to-top on slide change).
  const scrollRefs = useRef<Array<HTMLDivElement | null>>([])

  // Restore slide from URL hash on mount
  useEffect(() => {
    const hash = window.location.hash.replace('#', '')
    if (hash) {
      const index = parseInt(hash, 10) - 1
      if (!isNaN(index) && index >= 0 && index < totalSlides) {
        setCurrent(index)
      }
    }
  }, [totalSlides])

  const goTo = useCallback(
    (index: number) => {
      const clamped = Math.max(0, Math.min(index, totalSlides - 1))
      setCurrent(clamped)
      window.history.replaceState(null, '', `#${clamped + 1}`)
    },
    [totalSlides]
  )

  // Reset scroll position to top on every slide change.
  useEffect(() => {
    const el = scrollRefs.current[current]
    if (el) el.scrollTop = 0
  }, [current])

  // Stable per-slide context factories.
  const slideContextValues = useMemo(() => {
    const makeRegister = (slideIndex: number) => (id: string, handle: RevealHandle) => {
      let bucket = revealsRef.current.get(slideIndex)
      if (!bucket) {
        bucket = new Map()
        revealsRef.current.set(slideIndex, bucket)
      }
      bucket.set(id, handle)
    }
    const makeUnregister = (slideIndex: number) => (id: string) => {
      const bucket = revealsRef.current.get(slideIndex)
      if (bucket) {
        bucket.delete(id)
        if (bucket.size === 0) revealsRef.current.delete(slideIndex)
      }
    }
    const advanceReveal = (): boolean => {
      const bucket = revealsRef.current.get(currentRef.current)
      if (!bucket) return false
      for (const handle of bucket.values()) {
        if (handle.pending > 0) {
          handle.advance()
          return true
        }
      }
      return false
    }
    const hasPendingReveal = (): boolean => {
      const bucket = revealsRef.current.get(currentRef.current)
      if (!bucket) return false
      for (const handle of bucket.values()) {
        if (handle.pending > 0) return true
      }
      return false
    }
    return { makeRegister, makeUnregister, advanceReveal, hasPendingReveal }
  }, [])

  // Keyboard navigation
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        goTo(current + 1)
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        goTo(current - 1)
      } else if (e.key === ' ' || e.code === 'Space') {
        // Don't hijack Space when the user is typing in a form control or
        // pressing Space on a focusable element (e.g. a Flashcard button).
        const target = e.target as HTMLElement | null
        if (target) {
          const tag = target.tagName
          if (
            tag === 'BUTTON' ||
            tag === 'INPUT' ||
            tag === 'TEXTAREA' ||
            tag === 'SELECT' ||
            target.isContentEditable
          ) {
            return
          }
        }
        if (slideContextValues.advanceReveal()) {
          e.preventDefault()
        } else {
          e.preventDefault()
          goTo(current + 1)
        }
      } else if (e.key === 'f') {
        setIsFullscreen((prev) => !prev)
      } else if (e.key === 'Escape') {
        setIsFullscreen(false)
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [current, goTo, slideContextValues])

  const slideArray = React.Children.toArray(children)
  const slideCount = slideArray.length

  // Stable per-slide context values — only `isActive` flips on `current` change.
  const perSlideContexts = useMemo(
    () =>
      Array.from({ length: slideCount }, (_, i) => ({
        isActive: i === current,
        registerReveal: slideContextValues.makeRegister(i),
        unregisterReveal: slideContextValues.makeUnregister(i),
        advanceReveal: slideContextValues.advanceReveal,
        hasPendingReveal: slideContextValues.hasPendingReveal,
      })),
    [slideCount, current, slideContextValues]
  )

  const outerClass = isFullscreen
    ? 'fixed inset-0 z-50 bg-gray-950 text-white flex flex-col'
    : 'flex flex-col bg-white dark:bg-gray-950 h-[calc(100vh-3.5rem)]'

  return (
    <div className={outerClass}>
      {/* Slide header — hidden in fullscreen */}
      {!isFullscreen && (
        <div className="shrink-0 border-b border-gray-200 dark:border-gray-800 px-6 py-2 flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate">
            {title}
          </span>
          <span className="text-sm text-gray-400 shrink-0 ml-4">
            {current + 1} / {totalSlides}
          </span>
        </div>
      )}

      {/* Slide content */}
      <div className="flex-1 relative overflow-hidden">
        {slideArray.map((slide, i) => {
          const isActive = i === current
          return (
            <div
              key={i}
              className={`absolute inset-0 transition-opacity duration-200 ${
                isActive
                  ? 'opacity-100 pointer-events-auto'
                  : 'opacity-0 pointer-events-none'
              }`}
              aria-hidden={!isActive}
            >
              <div
                ref={(el) => {
                  scrollRefs.current[i] = el
                }}
                className="w-full h-full flex justify-center overflow-y-auto"
              >
                <div className="my-auto px-8 py-8 w-full max-w-4xl prose dark:prose-invert prose-lg">
                  <SlideContext.Provider value={perSlideContexts[i]}>
                    {slide}
                  </SlideContext.Provider>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Navigation bar */}
      <div
        className={`shrink-0 flex items-center justify-center gap-4 px-4 py-3 ${
          isFullscreen
            ? 'text-white'
            : 'border-t border-gray-200 dark:border-gray-800'
        }`}
      >
        <button
          onClick={() => goTo(current - 1)}
          disabled={current === 0}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-lg"
          aria-label="Previous slide"
        >
          ←
        </button>

        {/* Dot indicators (max 20 visible) */}
        <div className="flex gap-1.5 items-center">
          {Array.from({ length: Math.min(totalSlides, 20) }).map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className={`rounded-full transition-all ${
                i === current
                  ? 'w-3 h-3 bg-blue-500'
                  : 'w-2 h-2 bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500'
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
          {totalSlides > 20 && (
            <span className="text-xs text-gray-400 ml-1">
              {current + 1}/{totalSlides}
            </span>
          )}
        </div>

        <button
          onClick={() => goTo(current + 1)}
          disabled={current === totalSlides - 1}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-lg"
          aria-label="Next slide"
        >
          →
        </button>

        <button
          onClick={() => setIsFullscreen((prev) => !prev)}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors ml-2 text-sm"
          aria-label={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}
          title="Toggle fullscreen (f)"
        >
          {isFullscreen ? '⊡' : '⛶'}
        </button>
      </div>

      {/* Fullscreen hint */}
      {isFullscreen && (
        <div className="absolute top-4 right-4 text-white/40 text-xs pointer-events-none">
          {current + 1} / {totalSlides} · ← → navigate · f fullscreen · esc exit
        </div>
      )}
    </div>
  )
}
