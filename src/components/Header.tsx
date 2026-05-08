import Link from 'next/link'
import { ThemeToggle } from './ThemeToggle'

export function Header() {
  return (
    <header className="sticky top-0 z-40 h-14 border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-950/80 backdrop-blur-sm">
      <div className="max-w-6xl mx-auto px-4 h-full flex items-center justify-between">
        <Link
          href="/"
          className="font-bold text-gray-900 dark:text-gray-100 hover:text-blue-500 transition-colors"
        >
          Guides
        </Link>
        <ThemeToggle />
      </div>
    </header>
  )
}
