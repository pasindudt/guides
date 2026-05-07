export type MaterialType = 'slides' | 'article'

export interface MaterialFrontmatter {
  title: string
  description: string
  type: MaterialType
  date: string
  tags?: string[]
  cover?: string
}

export interface Material {
  slug: string
  category: string
  frontmatter: MaterialFrontmatter
  content: string
}

export interface Category {
  name: string
  materials: Material[]
}
