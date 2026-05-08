'use client'

import { createContext } from 'react'

export interface RevealHandle {
  /** Number of additional steps still pending (0 = fully revealed). */
  pending: number
  advance: () => void
  reset: () => void
}

export interface SlideContextValue {
  isActive: boolean
  registerReveal: (id: string, handle: RevealHandle) => void
  unregisterReveal: (id: string) => void
  advanceReveal: () => boolean
  hasPendingReveal: () => boolean
}

export const SlideContext = createContext<SlideContextValue>({
  isActive: false,
  registerReveal: () => {},
  unregisterReveal: () => {},
  advanceReveal: () => false,
  hasPendingReveal: () => false,
})
