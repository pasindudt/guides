import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import type { Material, Category, MaterialFrontmatter } from './types'

const CONTENT_DIR = path.join(process.cwd(), 'content')

export function getAllCategories(): string[] {
  if (!fs.existsSync(CONTENT_DIR)) return []
  return fs
    .readdirSync(CONTENT_DIR)
    .filter((item) => fs.statSync(path.join(CONTENT_DIR, item)).isDirectory())
}

export function getMaterialsByCategory(category: string): Material[] {
  const categoryDir = path.join(CONTENT_DIR, category)
  if (!fs.existsSync(categoryDir)) return []

  const files = fs.readdirSync(categoryDir).filter((f) => f.endsWith('.mdx'))

  return files
    .map((file) => {
      const slug = file.replace(/\.mdx$/, '')
      const filePath = path.join(categoryDir, file)
      const raw = fs.readFileSync(filePath, 'utf-8')
      const { data, content } = matter(raw)

      const frontmatter = {
        ...data,
        date:
          data.date instanceof Date
            ? data.date.toISOString().split('T')[0]
            : String(data.date),
      } as MaterialFrontmatter

      return { slug, category, frontmatter, content }
    })
    .sort(
      (a, b) =>
        new Date(b.frontmatter.date).getTime() -
        new Date(a.frontmatter.date).getTime()
    )
}

export function getMaterial(category: string, slug: string): Material | null {
  const filePath = path.join(CONTENT_DIR, category, `${slug}.mdx`)
  if (!fs.existsSync(filePath)) return null

  const raw = fs.readFileSync(filePath, 'utf-8')
  const { data, content } = matter(raw)

  const frontmatter = {
    ...data,
    date:
      data.date instanceof Date
        ? data.date.toISOString().split('T')[0]
        : String(data.date),
  } as MaterialFrontmatter

  return { slug, category, frontmatter, content }
}

export function getAllCategoriesWithMaterials(): Category[] {
  return getAllCategories().map((name) => ({
    name,
    materials: getMaterialsByCategory(name),
  }))
}

export function getStaticParamsForMaterials(): {
  category: string
  slug: string
}[] {
  const params: { category: string; slug: string }[] = []
  for (const category of getAllCategories()) {
    for (const material of getMaterialsByCategory(category)) {
      params.push({ category, slug: material.slug })
    }
  }
  return params
}

/**
 * Split MDX content string into individual slide strings using `---` as
 * delimiter. Respects fenced code blocks so `---` inside ``` is not treated
 * as a slide separator.
 */
export function parseSlides(content: string): string[] {
  const lines = content.split('\n')
  const slides: string[] = []
  let current: string[] = []
  let inCodeBlock = false

  for (const line of lines) {
    if (line.trimEnd().startsWith('```')) {
      inCodeBlock = !inCodeBlock
    }

    if (!inCodeBlock && line.trim() === '---') {
      const slide = current.join('\n').trim()
      if (slide) slides.push(slide)
      current = []
    } else {
      current.push(line)
    }
  }

  const last = current.join('\n').trim()
  if (last) slides.push(last)

  return slides
}
