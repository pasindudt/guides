import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-16 text-center">
      <h1 className="text-3xl font-bold mb-4">404 — Not Found</h1>
      <p className="text-gray-500 dark:text-gray-400 mb-8">
        The page you&apos;re looking for doesn&apos;t exist.
      </p>
      <Link href="/" className="text-blue-500 hover:underline">
        ← Back to home
      </Link>
    </div>
  )
}
