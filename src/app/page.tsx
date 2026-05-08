import { getAllCategoriesWithMaterials } from '@/lib/content'
import { MaterialCard } from '@/components/MaterialCard'

export default function HomePage() {
  const categories = getAllCategoriesWithMaterials()

  if (categories.length === 0) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold mb-4">Welcome to Guides</h1>
        <p className="text-gray-500 dark:text-gray-400">
          No learning materials yet. Add <code className="text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded">.mdx</code> files
          inside <code className="text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded">content/[category]/</code> to get started.
        </p>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="mb-10">
        <h1 className="text-4xl font-bold mb-3">Learning Materials</h1>
        <p className="text-gray-500 dark:text-gray-400 text-lg">
          Browse slides and articles organized by category.
        </p>
      </div>

      <div className="space-y-12">
        {categories.map(({ name, materials }) => (
          <section key={name}>
            <h2 className="text-xl font-semibold capitalize mb-5 pb-2 border-b border-gray-200 dark:border-gray-800">
              {name.replace(/-/g, ' ')}
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {materials.map((material) => (
                <MaterialCard key={material.slug} material={material} />
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  )
}
