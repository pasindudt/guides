'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'

interface Heading {
  id: string
  text: string
  level: number
}

interface NavItem {
  title: string
  href: string
}

interface ArticleViewerProps {
  children: React.ReactNode
  prevMaterial?: NavItem
  nextMaterial?: NavItem
}

export function ArticleViewer({ children, prevMaterial, nextMaterial }: ArticleViewerProps) {
  const [headings, setHeadings] = useState<Heading[]>([])
  const [activeId, setActiveId] = useState<string>('')

  // Extract headings from rendered article
  useEffect(() => {
    const article = document.querySelector('article[data-article]')
    if (!article) return

    const els = article.querySelectorAll('h2[id], h3[id]')
    setHeadings(
      Array.from(els).map((el) => ({
        id: el.id,
        text: el.textContent?.replace(/#$/, '').trim() ?? '',
        level: parseInt(el.tagName[1], 10),
      }))
    )
  }, [])

  // Highlight active heading in TOC
  useEffect(() => {
    if (headings.length === 0) return
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.find((e) => e.isIntersecting)
        if (visible) setActiveId(visible.target.id)
      },
      { rootMargin: '0px 0px -60% 0px' }
    )
    headings.forEach(({ id }) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [headings])

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="flex gap-14">
        {/* Article content */}
        <article
          data-article
          className="flex-1 min-w-0 prose dark:prose-invert prose-lg max-w-none"
        >
          {children}
        </article>

        {/* TOC sidebar */}
        {headings.length > 0 && (
          <aside className="hidden xl:block w-52 shrink-0">
            <div className="sticky top-20">
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-3">
                On this page
              </p>
              <nav className="space-y-1">
                {headings.map((h) => (
                  <a
                    key={h.id}
                    href={`#${h.id}`}
                    className={`block text-sm no-underline transition-colors ${
                      h.level === 3 ? 'pl-3' : ''
                    } ${
                      activeId === h.id
                        ? 'text-blue-500 font-medium'
                        : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
                    }`}
                  >
                    {h.text}
                  </a>
                ))}
              </nav>
            </div>
          </aside>
        )}
      </div>

      {/* Prev / Next navigation */}
      {(prevMaterial || nextMaterial) && (
        <nav className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800 flex justify-between gap-4">
          {prevMaterial ? (
            <Link href={prevMaterial.href} className="group flex flex-col no-underline text-left max-w-xs">
              <span className="text-xs text-gray-400 mb-1">← Previous</span>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-blue-500 transition-colors">
                {prevMaterial.title}
              </span>
            </Link>
          ) : (
            <div />
          )}
          {nextMaterial && (
            <Link href={nextMaterial.href} className="group flex flex-col no-underline text-right max-w-xs ml-auto">
              <span className="text-xs text-gray-400 mb-1">Next →</span>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-blue-500 transition-colors">
                {nextMaterial.title}
              </span>
            </Link>
          )}
        </nav>
      )}
    </div>
  )
}
