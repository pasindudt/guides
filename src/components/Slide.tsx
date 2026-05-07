import React from 'react'

interface SlideProps {
  layout?: 'cover' | 'default' | 'two-col' | 'code'
  children: React.ReactNode
  className?: string
}

/**
 * Optional wrapper component for slides that need a non-default layout.
 * Use inside MDX with <Slide layout="cover"> ... </Slide>
 * When no layout is specified, the slide renders in `default` mode automatically.
 */
export function Slide({ layout = 'default', children, className = '' }: SlideProps) {
  switch (layout) {
    case 'cover':
      return (
        <div className={`flex flex-col items-center justify-center min-h-full text-center px-8 ${className}`}>
          {children}
        </div>
      )
    case 'two-col':
      return (
        <div className={`grid grid-cols-2 gap-8 w-full ${className}`}>
          {children}
        </div>
      )
    case 'code':
      return (
        <div className={`flex flex-col w-full gap-4 ${className}`}>
          {children}
        </div>
      )
    default:
      return (
        <div className={`flex flex-col w-full ${className}`}>
          {children}
        </div>
      )
  }
}
