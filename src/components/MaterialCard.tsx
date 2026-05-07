import Link from 'next/link'
import type { Material } from '@/lib/types'

interface MaterialCardProps {
  material: Material
}

export function MaterialCard({ material }: MaterialCardProps) {
  const { frontmatter, category, slug } = material

  return (
    <Link
      href={`/${category}/${slug}`}
      className="group block p-5 rounded-xl border border-gray-200 dark:border-gray-800 hover:border-blue-400 dark:hover:border-blue-500 hover:shadow-md dark:hover:shadow-blue-900/20 transition-all"
    >
      <div className="flex items-start justify-between gap-3 mb-2">
        <h3 className="font-semibold text-gray-900 dark:text-gray-100 group-hover:text-blue-500 transition-colors leading-snug">
          {frontmatter.title}
        </h3>
        <span
          className={`shrink-0 text-xs font-medium px-2 py-0.5 rounded-full ${
            frontmatter.type === 'slides'
              ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400'
              : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
          }`}
        >
          {frontmatter.type === 'slides' ? '▶ Slides' : '📄 Article'}
        </span>
      </div>

      <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
        {frontmatter.description}
      </p>

      <div className="mt-3 flex items-center gap-3 flex-wrap">
        <time className="text-xs text-gray-400 dark:text-gray-500">
          {new Date(frontmatter.date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          })}
        </time>
        {frontmatter.tags?.map((tag) => (
          <span
            key={tag}
            className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 px-2 py-0.5 rounded"
          >
            {tag}
          </span>
        ))}
      </div>
    </Link>
  )
}
