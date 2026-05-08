'use client'

import React, {
  createContext,
  useContext,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from 'react'
import { SlideContext } from './SlideContext'

interface RevealItemContextValue {
  index: number
}

const RevealItemIndexContext = createContext<RevealItemContextValue | null>(null)

interface RevealStateContextValue {
  step: number
}

const RevealStateContext = createContext<RevealStateContextValue>({ step: 0 })

interface RevealProps {
  children: React.ReactNode
  className?: string
}

export function Reveal({ children, className = '' }: RevealProps) {
  const items = React.Children.toArray(children)
  const total = items.length
  const [step, setStep] = useState(0)
  const stepRef = useRef(0)
  const id = useId()
  const { isActive, registerReveal, unregisterReveal } = useContext(SlideContext)

  useEffect(() => {
    stepRef.current = step
  }, [step])

  useEffect(() => {
    if (!isActive) {
      setStep(0)
      stepRef.current = 0
    }
  }, [isActive])

  useEffect(() => {
    registerReveal(id, {
      get pending() {
        return Math.max(0, total - 1 - stepRef.current)
      },
      advance: () => {
        setStep((prev) => Math.min(prev + 1, total - 1))
      },
      reset: () => {
        setStep(0)
        stepRef.current = 0
      },
    })
    return () => unregisterReveal(id)
  }, [id, total, registerReveal, unregisterReveal])

  const stateValue = useMemo(() => ({ step }), [step])

  return (
    <RevealStateContext.Provider value={stateValue}>
      <div className={`flex flex-col gap-3 ${className}`}>
        {items.map((child, i) => (
          <RevealItemIndexContext.Provider key={i} value={{ index: i }}>
            {child}
          </RevealItemIndexContext.Provider>
        ))}
      </div>
    </RevealStateContext.Provider>
  )
}

interface RevealItemProps {
  children: React.ReactNode
  className?: string
}

export function RevealItem({ children, className = '' }: RevealItemProps) {
  const itemCtx = useContext(RevealItemIndexContext)
  const { step } = useContext(RevealStateContext)
  const index = itemCtx?.index ?? 0
  const visible = index <= step

  return (
    <div
      className={`transition-all duration-300 ease-out ${
        visible
          ? 'opacity-100 translate-y-0'
          : 'opacity-0 translate-y-2 pointer-events-none'
      } ${className}`}
      aria-hidden={!visible}
    >
      {children}
    </div>
  )
}
