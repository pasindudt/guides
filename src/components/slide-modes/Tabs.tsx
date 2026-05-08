'use client'

import React, { useContext, useEffect, useId, useState } from 'react'
import { SlideContext } from './SlideContext'

interface TabsProps {
  children: React.ReactNode
  className?: string
}

interface TabProps {
  label: string
  children: React.ReactNode
}

export function Tab(_props: TabProps): React.ReactElement | null {
  // Data-only marker; rendering is driven by <Tabs>.
  return null
}

interface TabData {
  label: string
  content: React.ReactNode
}

function isTabElement(child: React.ReactNode): child is React.ReactElement<TabProps> {
  return React.isValidElement(child) && child.type === Tab
}

export function Tabs({ children, className = '' }: TabsProps) {
  const tabs: TabData[] = React.Children.toArray(children)
    .filter(isTabElement)
    .map((child) => ({
      label: child.props.label,
      content: child.props.children,
    }))

  const [active, setActive] = useState(0)
  const { isActive } = useContext(SlideContext)
  const groupId = useId()

  useEffect(() => {
    if (!isActive) setActive(0)
  }, [isActive])

  if (tabs.length === 0) return null

  const safeActive = Math.min(active, tabs.length - 1)

  return (
    <div className={`not-prose my-6 ${className}`}>
      <div
        role="tablist"
        aria-label="Tabs"
        className="flex flex-wrap gap-1 border-b border-gray-200 dark:border-gray-700"
      >
        {tabs.map((tab, i) => {
          const selected = i === safeActive
          const tabId = `${groupId}-tab-${i}`
          const panelId = `${groupId}-panel-${i}`
          return (
            <button
              key={i}
              id={tabId}
              role="tab"
              type="button"
              aria-selected={selected}
              aria-controls={panelId}
              tabIndex={selected ? 0 : -1}
              onClick={() => setActive(i)}
              className={`px-4 py-2 -mb-px text-sm font-medium border-b-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-900 ${
                selected
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
              }`}
            >
              {tab.label}
            </button>
          )
        })}
      </div>
      {tabs.map((tab, i) => {
        const tabId = `${groupId}-tab-${i}`
        const panelId = `${groupId}-panel-${i}`
        const selected = i === safeActive
        return (
          <div
            key={i}
            id={panelId}
            role="tabpanel"
            aria-labelledby={tabId}
            hidden={!selected}
            className="pt-4"
          >
            {selected && tab.content}
          </div>
        )
      })}
    </div>
  )
}
